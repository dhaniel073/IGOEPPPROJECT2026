import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import LogoSpinner from '@/components/LoadingScreen'
import PinInput from '@/components/PinInput'
import ReceiptView from '@/components/ReceiptView'
import { StatusModal } from '@/components/StatusModal'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { validateAirtime } from '@/components/validateAirtime'
import { validateData } from '@/components/validateData'
import { Colors, decryptData, DIMENSION, encryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { customerbillercommission, validatecustomerself, validatecustomerthirdparty, validatepin, vtupayairtime, vtupaydata, YOUR_API_BASE_URL } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import axios from '@/api/axiosClient';
import dayjs from "dayjs"
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Animated, Dimensions, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TextProps, TouchableOpacity, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { SafeAreaView } from 'react-native-safe-area-context'

const numbers = [
  {
    amount: `500`
  },
  {
    amount: "1000"
  },
  {
    amount: "2000"
  },
  {
    amount: "3000"
  },
  {
    amount: "4000"
  },
  {
    amount: "5000"
  },
  {
    amount: "6000"
  },
  {
    amount: "7000"
  }
]

const { height } = Dimensions.get('window');

export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor: { dark: string; light: string };
};


export default function billspaymentAirtime({
  lightColor,
  darkColor,
  headerBackgroundColor,
}: Props) {

  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const router = useRouter()
  const [isloading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'self' | 'thirdparty'>('self');
  const [isInvalid, setIsInvalid] = useState(false)
  const { billid } = useLocalSearchParams()
  const { user, token, logout } = useAuth()
  const [modalVisible2, setModalVisible2] = useState(false);
  const [tvPlatform, setTvPlatform] = useState<any>([])
  const [bouquets, setBouquets] = useState<any>([])
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [formData, setFormData] = useState({
    platform: "",
    platformName: "",
    phone: user?.phone,
    amount: "",
    bosquetsamount: "",
    commission: "",
    reference: "",
    imagepath: "",
    bouquets: "",
    thirdparty: "",
    mode: "self"
  });


  const [formattedamount, setFormattedAmount] = useState<any>('')
  const [amount, setAmount] = useState<any>()
  const formatNumber = (text: any) => {
    // Remove any non-numeric characters
    let cleanText = text.replace(/[^0-9]/g, '');
    // Format the number with commas
    return cleanText.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatNumber2 = (text: any) => {
    // Remove any non-numeric characters
    let cleanText = text.replace(/[^0-9]/g, '');
    // Format the number with commas
    return cleanText
  };

  const handleChange = (text: any) => {
    // Format the text as the user types
    const formattedValue = formatNumber(text);

    // Convert to raw number
    const newNumber = Number(formatNumber2(text));

    // Make sure it's a valid number (not NaN)
    setAmount(isNaN(newNumber) ? 0 : newNumber);
    setFormData({ ...formData, amount: text, })

    setFormattedAmount(formattedValue);
  };

  const openPopup = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0, // Slide to the screen
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closePopup = () => {
    Animated.timing(slideAnim, {
      toValue: height, // Slide back down
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false)); // Close after animation
  };

  const openPopup1 = () => {
    setModalVisible1(true);
    Animated.timing(slideAnim, {
      toValue: 0, // Slide to the screen
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closePopup1 = () => {
    Animated.timing(slideAnim, {
      toValue: height, // Slide back down
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible1(false)); // Close after animation
  };

  useFocusEffect(
    useCallback(() => {
      if (user?.transaction_pin_setup === "N") {
        setModalVisible2(true);
      }
    }, [user?.transaction_pin_setup])
  );

  useEffect(() => {
    const fetchBillers = async () => {
      try {
        setIsLoading(true)
        const config = {
          method: 'get',
          url: `${YOUR_API_BASE_URL}auth/billpayment/getAllBillersByCategory/${billid}`,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${decryptData(token)}`,
          },
        };
        const response = await axios(config);
        const data = response.data;
        const countryArray = data.map((item: any) => ({
          label: item.name,
          value: String(item.id),
          flag: item.imagePath,
          service: item.isBouquetService
        }));
        setTvPlatform(countryArray);
      } catch (error: any) {
        Alert.alert('Error', 'An error occurred. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    };
    fetchBillers();
  }, []);

  const getBouquets = async (value: string, service: any) => {
    const isAirtime = (v: string) => v?.toLowerCase().includes("airtime");
    // check the selected value
    if (isAirtime(value) && service.toLowerCase() === 'no') {
      setBouquets([]); // optional: clear dropdown
      return;
    }

    try {
      const response = await axios.get(
        `${YOUR_API_BASE_URL}auth/billpayment/getAllBouquetByBillerID/${billid}/${value}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${decryptData(token)}`,
          },
        }
      );

      const data = response.data.data.bouquets;

      const cityArray = data.map((item: any) => ({
        label: item.name,
        value: item.code,
        price: item.price,
      }));

      setBouquets(cityArray);

    } catch (error: any) {
      Alert.alert("Error", "No bouquet fetched for current option selected");
      setBouquets([]);
    }
  };

  const handleValidation = () => {
    let validationErrors = {};

    // Correct condition
    if (formData.platform?.toLowerCase().includes("airtime")) {
      validationErrors = validateAirtime(formData);
    } else {
      validationErrors = validateData(formData);
    }

    setErrors(validationErrors);

    // Handle errors
    if (Object.keys(validationErrors).length > 0) {

      const allErrors = Object.values(validationErrors).join("\n");
      Alert.alert("❌ Validation Errors", allErrors);

      return; // stop
    }

    // Proceed if no error
    return validatehandler();
  };

  const validatehandler = async () => {

    let response: any; // <-- use let instead of const

    try {
      setIsLoading(true);

      if (formData.mode.toLowerCase() === "self") {
        response = await validatecustomerself(
          user?.customer_id,
          formData.imagepath,
          decryptData(token)
        );
      } else {
        response = await validatecustomerthirdparty(
          user?.customer_id,
          formData.imagepath,
          formData.thirdparty,
          decryptData(token)
        );
      }

      setFormData(prev => ({
        ...prev,
        reference: response.requestID,
        customername: response.customerName,
        address: response.customerAddress
      }));

      Alert.alert(
        "Confirm Payment",
        "You are about to make payment for virtual topup",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Proceed", onPress: () => openPopup() }
        ]
      );

    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data.message || "Failed to validate phone number."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const pinvalidation = async (pin: any) => {
    try {
      setIsPinLoading(true);

      const response = await validatepin(
        user?.customer_id,
        encryptData(pin),
        decryptData(token)
      );

      closePopup1();        // close the PIN modal
      makepayment();        // start payment loading immediately

    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "PIN validation failed");
    } finally {
      setIsPinLoading(false);
    }
  };

  const makepayment = async () => {
    try {
      setIsPaymentLoading(true);

      let response;

      if (formData.platform.toLowerCase().includes("airtime")) {
        // Call endpoint A
        response = await vtupayairtime(
          formData.reference,
          formData.platform,
          encryptData(formData.amount),
          decryptData(token),
          formData.commission
        );
      } else {
        // Call endpoint B
        response = await vtupaydata(
          formData.reference,
          formData.platform,
          encryptData(formData.bosquetsamount),
          formData.bouquets,
          decryptData(token),
          formData.commission
        );
      }
      // Update your formData with the response
      setFormData(prev => ({
        ...prev,
        // reference_id: response.referenceId,
      }));

      setVisible(true);

    } catch (error: any) {
      Alert.alert("Error", error.response?.data.message || "Payment failed");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const commissionget = async (id: any) => {
    try {
      const response = await customerbillercommission(id, decryptData(token));

      setFormData(prev => ({
        ...prev,
        commission: response
      }));
    } catch (error: any) {
      return;
    }
  };

  if (isloading || isPinLoading || isPaymentLoading) {
    return <LogoSpinner lightColor='' darkColor='' />
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust for header height if needed
      >
        <Animated.ScrollView showsVerticalScrollIndicator={false}>
          <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
            <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
          </GoBack>
          <View style={{ margin: 6 }} />
          <ThemedText type="titleMedium">Buy Airtime</ThemedText>
          <ThemedText style={{ color: Colors.gray9 }}>Select network and enter phone number</ThemedText>
          <ThemedText style={{ color: Colors.gray9 }}>to purchase airtime</ThemedText>
          <View style={{ margin: 10 }} />

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'self' && styles.activeTab]}
              onPress={() => [setActiveTab('self'),
              setFormData(prev => ({
                ...prev,
                platform: "",
                platformName: "",
                amount: "",
                bosquetsamount: "",
                commission: "",
                reference: "",
                imagepath: "",
                bouquets: "",
                thirdparty: "",
                mode: "self"
              })), setAmount(null), setFormattedAmount(null)]
              }
            >
              <Text style={[styles.tabText, activeTab === 'self' && styles.activeTabText]}>
                For Self
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'thirdparty' && styles.activeTab]}
              onPress={() => [setActiveTab('thirdparty'),
              setFormData(prev => ({
                ...prev,
                platform: "",
                platformName: "",
                amount: "",
                bosquetsamount: "",
                commission: "",
                reference: "",
                imagepath: "",
                bouquets: "",
                thirdparty: "",
                mode: "thirdparty"
              })),
              setAmount(null), setFormattedAmount(null)
              ]}
            >
              <Text style={[styles.tabText, activeTab === 'thirdparty' && styles.activeTabText]}>
                For Third Party
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ margin: 10 }} />

          <View>
            {activeTab === 'self' ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedText>Phone Number</ThemedText>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* Country Code Box */}
                  <ThemedView
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 14,
                      borderRadius: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: Colors.gray9,
                      marginRight: 10, // space between code box and input
                    }}
                  >
                    <Image
                      source={require("@/assets/images/flag.png")}
                      style={{ width: 20, height: 15, resizeMode: "contain" }}
                    />
                    <ThemedText style={{ marginLeft: 6, fontSize: 16 }}>+234</ThemedText>
                  </ThemedView>

                  {/* Phone Number Input */}
                  <View style={{ flex: 1 }}>
                    <Input
                      placeholder="Enter phone number"
                      keyboardType="phone-pad"
                      value={user?.phone}
                      editable={false}
                      onUpdateValue={(text) => setFormData({ ...formData, phone: text })}
                    />
                  </View>
                </View>

                <View style={{ margin: 5 }} />

                <ThemedText>Choose Network</ThemedText>
                <View style={{ flex: 1, margin: 1 }}>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={{ color: Colors.gray9 }}
                    selectedTextStyle={{ color: "#000" }}
                    data={tvPlatform}
                    labelField="label"
                    valueField="value"
                    placeholder="Please Select"
                    maxHeight={300}
                    value={formData.platform}
                    search
                    searchPlaceholder="Search..."
                    inputSearchStyle={{ color: Colors.gray9 }}

                    // When selecting a country
                    onChange={(item) => {
                      commissionget(item.value);
                      getBouquets(item.value, item.service)
                      setFormData(prev => ({
                        ...prev,
                        platform: String(item.value),
                        platformName: item.label,
                        imagepath: item.flag,
                      }));
                    }}


                    // ▼▼ IMAGE + TEXT INSIDE DROPDOWN ITEMS ▼▼
                    renderItem={(item: any) => (
                      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                        <Image
                          source={{ uri: item.flag }}  // your API flag field
                          style={{ width: 24, height: 24, marginRight: 10, borderRadius: 4 }}
                          resizeMode="contain"
                        />
                        <Text style={{ color: "#000" }}>{item.label}</Text>
                      </View>
                    )}

                    // ▼▼ IMAGE + TEXT WHEN SELECTED ▼▼
                    renderLeftIcon={() => {
                      const selected = tvPlatform.find(
                        (c: any) => c.value === formData.platform
                      );

                      return selected ? (
                        <Image
                          source={{ uri: selected.flag }}
                          style={{ width: 20, height: 20, marginRight: 8, borderRadius: 4 }}
                          resizeMode="contain"
                        />
                      ) : null;
                    }}

                    // ▼▼ ICON ▼▼
                    renderRightIcon={() => (
                      <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.gray9} />
                    )}
                  />
                </View>
                <View style={{ margin: 5 }} />

                {
                  formData.platform?.toLowerCase().includes("airtime") ? null : <>
                    <ThemedText>Select Plan</ThemedText>

                    <View style={{ flex: 1, margin: 1 }}>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={{ color: Colors.gray9 }}
                        selectedTextStyle={{ color: "#000" }}
                        data={bouquets}
                        labelField="label"
                        valueField="value"
                        placeholder="Please Select"
                        maxHeight={300}
                        value={formData.bouquets}
                        search
                        searchPlaceholder="Search..."
                        inputSearchStyle={{ color: Colors.gray9 }}

                        // When selecting a country
                        onChange={(item) => {
                          setFormData(prev => ({
                            ...prev,
                            bouquets: item.value,
                            bosquetsamount: item.price
                          }));
                        }}
                      />
                    </View>

                    <View style={{ margin: 5 }} />
                  </>
                }

                {
                  formData.platform?.toLowerCase().includes("airtime") ?
                    <>
                      <ThemedText>Enter Amount</ThemedText>
                      <View style={{ margin: 5 }} />
                      <ThemedView style={[styles.container, { marginBottom: 5, backgroundColor: Colors.offwhite1 }]}>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <MaterialCommunityIcons name="currency-ngn" size={15} color={Colors.gray9} />
                          <TextInput placeholder={'Amount'}
                            style={[styles.input, isInvalid && styles.invalid, { color: Colors.gray9, }]}
                            onFocus={() => setIsInvalid(false)}
                            value={formattedamount}
                            onChangeText={handleChange}
                            placeholderTextColor={Colors.gray9}
                            keyboardType='number-pad'
                            maxLength={9}
                          />
                        </View>
                        <TouchableOpacity onPress={() => [setFormattedAmount(null), setAmount(null)]} style={{ padding: 10 }}>
                          <AntDesign name="close-circle" size={20} color={Colors.gray9} />
                        </TouchableOpacity>
                      </ThemedView>

                      <View style={{ margin: 5 }} />
                      <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          {numbers.map((item, key) => (
                            <TouchableOpacity key={key} style={{ backgroundColor: Colors.offwhite, paddingLeft: 5, margin: 5, paddingRight: 5, borderRadius: 15, padding: 5 }} onPress={() => handleChange(item.amount)}>
                              <ThemedText style={{ color: Colors.green8 }} type='smallBold'><MaterialCommunityIcons name="currency-ngn" size={15} color={Colors.green8} /> {item.amount.toLocaleString() + "." + "00"}</ThemedText>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </ThemedView>
                    </>
                    :
                    <>
                      <ThemedText>Amount</ThemedText>
                      <View style={{ flex: 1 }}>
                        <Input
                          placeholder="NGN 0.00"
                          keyboardType="number-pad"
                          value={formData.bosquetsamount && Number(formData.bosquetsamount).toLocaleString()}
                          editable={false}
                          onUpdateValue={(text) => setFormData({ ...formData, bosquetsamount: text })}
                        />
                      </View>
                    </>
                }


                <View style={{ margin: 15 }} />

                <ThemedButton style={{ backgroundColor: Colors.green, padding: 15, borderRadius: 30, alignItems: 'center' }} onPress={() => { handleValidation() }} disabled={isloading}>
                  <ThemedText style={{ color: '#fff' }}>Continue</ThemedText>
                </ThemedButton>
              </ScrollView>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedText>Phone Number</ThemedText>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* Country Code Box */}
                  <ThemedView
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 14,
                      borderRadius: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: Colors.gray9,
                      marginRight: 10, // space between code box and input
                    }}
                  >
                    <Image
                      source={require("@/assets/images/flag.png")}
                      style={{ width: 20, height: 15, resizeMode: "contain" }}
                    />
                    <ThemedText style={{ marginLeft: 6, fontSize: 16 }}>+234</ThemedText>
                  </ThemedView>

                  {/* Phone Number Input */}
                  <View style={{ flex: 1 }}>
                    <Input
                      placeholder="Enter phone number"
                      keyboardType="phone-pad"
                      value={formData.thirdparty}
                      onUpdateValue={(text) => setFormData({ ...formData, thirdparty: text })}
                    />
                  </View>
                </View>

                <View style={{ margin: 5 }} />

                <ThemedText>Choose Network</ThemedText>
                <View style={{ flex: 1, margin: 1 }}>
                  <Dropdown
                    style={styles.dropdown}
                    placeholderStyle={{ color: Colors.gray9 }}
                    selectedTextStyle={{ color: "#000" }}
                    data={tvPlatform}
                    labelField="label"
                    valueField="value"
                    placeholder="Please Select"
                    maxHeight={300}
                    value={formData.platform}
                    search
                    searchPlaceholder="Search..."
                    inputSearchStyle={{ color: Colors.gray9 }}

                    // When selecting a country
                    onChange={(item) => {
                      commissionget(item.value);
                      getBouquets(item.value, item.service)
                      setFormData(prev => ({
                        ...prev,
                        platform: String(item.value),
                        platformName: item.label,
                        imagepath: item.flag,
                      }));
                    }}


                    // ▼▼ IMAGE + TEXT INSIDE DROPDOWN ITEMS ▼▼
                    renderItem={(item: any) => (
                      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                        <Image
                          source={{ uri: item.flag }}  // your API flag field
                          style={{ width: 24, height: 24, marginRight: 10, borderRadius: 4 }}
                          resizeMode="contain"
                        />
                        <Text style={{ color: "#000" }}>{item.label}</Text>
                      </View>
                    )}

                    // ▼▼ IMAGE + TEXT WHEN SELECTED ▼▼
                    renderLeftIcon={() => {
                      const selected = tvPlatform.find(
                        (c: any) => c.value === formData.platform
                      );

                      return selected ? (
                        <Image
                          source={{ uri: selected.flag }}
                          style={{ width: 20, height: 20, marginRight: 8, borderRadius: 4 }}
                          resizeMode="contain"
                        />
                      ) : null;
                    }}

                    // ▼▼ ICON ▼▼
                    renderRightIcon={() => (
                      <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.gray9} />
                    )}
                  />
                </View>
                <View style={{ margin: 5 }} />

                {
                  formData.platform?.toLowerCase().includes("airtime") ? null : <>
                    <ThemedText>Select Plan</ThemedText>

                    <View style={{ flex: 1, margin: 1 }}>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={{ color: Colors.gray9 }}
                        selectedTextStyle={{ color: "#000" }}
                        data={bouquets}
                        labelField="label"
                        valueField="value"
                        placeholder="Please Select"
                        maxHeight={300}
                        value={formData.bouquets}
                        search
                        searchPlaceholder="Search..."
                        inputSearchStyle={{ color: Colors.gray9 }}

                        // When selecting a country
                        onChange={(item) => {
                          setFormData(prev => ({
                            ...prev,
                            bouquets: item.value,
                            amount: item.price,
                          }));
                        }}
                      />
                    </View>

                    <View style={{ margin: 5 }} />
                  </>
                }

                {
                  formData.platform?.toLowerCase().includes("airtime") ?
                    <>
                      <ThemedText>Enter Amount</ThemedText>
                      <View style={{ margin: 5 }} />
                      <ThemedView style={[styles.container, { marginBottom: 5, backgroundColor: Colors.offwhite1 }]}>
                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <MaterialCommunityIcons name="currency-ngn" size={15} color={Colors.gray9} />
                          <TextInput placeholder={'Amount'}
                            style={[styles.input, isInvalid && styles.invalid, { color: Colors.gray9, }]}
                            onFocus={() => setIsInvalid(false)}
                            value={formattedamount}
                            onChangeText={handleChange}
                            placeholderTextColor={Colors.gray9}
                            keyboardType='number-pad'
                            maxLength={9}
                          />
                        </View>
                        <TouchableOpacity onPress={() => [setFormattedAmount(null), setAmount(null)]} style={{ padding: 10 }}>
                          <AntDesign name="close-circle" size={20} color={Colors.gray9} />
                        </TouchableOpacity>
                      </ThemedView>
                      <View style={{ margin: 5 }} />

                      <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          {numbers.map((item, key) => (
                            <TouchableOpacity key={key} style={{ backgroundColor: Colors.offwhite, paddingLeft: 5, margin: 5, paddingRight: 5, borderRadius: 15, padding: 5 }} onPress={() => [handleChange(item.amount)]}>
                              <ThemedText style={{ color: Colors.green8 }} type='smallBold'><MaterialCommunityIcons name="currency-ngn" size={15} color={Colors.green8} /> {item.amount.toLocaleString() + "." + "00"}</ThemedText>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </ThemedView>
                    </>
                    :
                    <>
                      <ThemedText>Amount</ThemedText>
                      <View style={{ flex: 1 }}>
                        <Input
                          placeholder="NGN 0.00"
                          keyboardType="number-pad"
                          value={formData.bosquetsamount && Number(formData.bosquetsamount).toLocaleString()}
                          editable={false}
                          onUpdateValue={(text) => setFormData({ ...formData, bosquetsamount: text })}
                        />
                      </View>
                    </>
                }


                <View style={{ margin: 15 }} />

                <ThemedButton style={{ backgroundColor: Colors.green, padding: 15, borderRadius: 30, alignItems: 'center' }} onPress={() => { handleValidation() }} disabled={isloading}>
                  <ThemedText style={{ color: '#fff' }}>Continue</ThemedText>
                </ThemedButton>
              </ScrollView>
            )
            }
          </View>


        </Animated.ScrollView>
        <Modal
          transparent
          visible={modalVisible}
          animationType="slide"
          onRequestClose={closePopup}
        >
          <TouchableOpacity style={styles.overlay} onPress={() => [closePopup()]} />

          <Animated.View
            style={[
              styles.popup,
              { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: "15%" },
            ]}
          >
            <View style={{ margin: 10 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <ThemedText type='subtitle' style={{ textAlign: 'center', flex: 1 }}>Transaction Review</ThemedText>
              <TouchableOpacity onPress={closePopup} style={{ alignSelf: 'flex-end' }}>
                <MaterialIcons name="cancel" size={24} color={Colors.green} />
              </TouchableOpacity>
            </View>

            <View style={{ margin: 10 }} />
            <ThemedView style={{ backgroundColor: Colors.gray7, marginHorizontal: 10 }}>
              <View style={{ margin: 10 }} />
              <ThemedText style={{ color: Colors.blacktext, textAlign: 'center' }}>Amount</ThemedText>
              <ThemedText style={{ color: Colors.green8, textAlign: 'center' }} type='subtitle'>NGN {formData.platform.toLowerCase().includes('airtime') ? Number(formData.amount).toLocaleString() : Number(formData.bosquetsamount).toLocaleString()}</ThemedText>
              <View style={{ margin: 10 }} />
            </ThemedView>

            <View style={{ margin: 10 }} />

            <ThemedView style={{ backgroundColor: Colors.gray7, marginHorizontal: 10, paddingHorizontal: 20, paddingVertical: 20 }}>
              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }}>From</ThemedText>
                <ThemedText style={{ color: Colors.wallet }}>Wallet</ThemedText>
              </View>
              <View style={{ margin: 7 }} />

              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }}>Phone Number</ThemedText>
                <ThemedText style={{ color: Colors.wallet }}>{formData.mode.toLowerCase() === "self" ? formData.phone : formData.thirdparty}</ThemedText>
              </View>
              <View style={{ margin: 7 }} />

              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }}>Network</ThemedText>
                <ThemedText style={{ color: Colors.wallet }}>{formData.platform}</ThemedText>
              </View>

              <View style={{ margin: 7 }} />

              {
                formData.platform.toLowerCase().includes('airtime') ? null :
                  <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                    <ThemedText style={{ color: '#000' }}>Bosquet</ThemedText>
                    <ThemedText style={{ color: Colors.wallet }}>{formData.bouquets}</ThemedText>
                  </View>
              }
            </ThemedView>

            <View style={{ margin: 15 }} />

            <ThemedButton style={{ backgroundColor: Colors.green, padding: 15, borderRadius: 30, marginHorizontal: 10, alignItems: 'center' }} onPress={() => [closePopup(), openPopup1()]}>
              <ThemedText style={{ color: '#fff' }}>Proceed</ThemedText>
            </ThemedButton>
          </Animated.View>
        </Modal>

        <Modal
          transparent
          visible={modalVisible1}
          animationType="slide"
          onRequestClose={closePopup1}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust for header height if needed
          >
            <TouchableOpacity style={styles.overlay} onPress={() => [closePopup1()]} />

            <Animated.View
              style={[
                styles.popup,
                { transform: [{ translateY: slideAnim }], backgroundColor: color1 },
              ]}
            >
              <ThemedText type='titleMedium' style={{ textAlign: 'center' }}>Enter Pin</ThemedText>
              <View style={{ margin: 8 }} />

              <ThemedText style={{ textAlign: 'center', color: Colors.gray9 }}>Enter Transaction PIN</ThemedText>
              <View style={{ margin: 10 }} />
              <View style={{ margin: 5 }} />


              <PinInput length={4} secure={true} onSubmit={(pin) => { closePopup1(), pinvalidation(pin) }} />
              <View style={{ margin: 10 }} />
            </Animated.View>
          </KeyboardAvoidingView>
        </Modal>

        <ReceiptView
          visible={visible}
          onClose={() => setVisible(false)}
          watermarkText="IGOEPP"
          showIcon={true}
          imageuri={formData.imagepath}
        >
          <ThemedView style={{ backgroundColor: Colors.gray6, marginHorizontal: 10, paddingHorizontal: 20, paddingVertical: 20 }}>
            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <ThemedText style={{ color: '#000' }} type='small'>From</ThemedText>
              <ThemedText style={{ color: Colors.wallet }} type='small'>Wallet</ThemedText>
            </View>
            <View style={{ margin: 2 }} />

            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <ThemedText style={{ color: '#000' }} type='small'>Network</ThemedText>
              <ThemedText style={{ color: Colors.wallet }} type='small'>{formData.platform.split("-")[0]}</ThemedText>
            </View>
            <View style={{ margin: 2 }} />

            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <ThemedText style={{ color: '#000' }} type='small' >Phone number</ThemedText>
              <ThemedText style={{ color: Colors.wallet }} type='small' >{formData.mode.toLowerCase() === 'self' ? formData.phone : formData.thirdparty}</ThemedText>
            </View>
            <View style={{ margin: 2 }} />

            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <ThemedText style={{ color: '#000' }} type='small'>Topup amount</ThemedText>
              <ThemedText style={{ color: Colors.wallet }} type='small'>{formData.platform.toLowerCase().includes("airtime") ? formData.amount : formData.bosquetsamount}</ThemedText>
            </View>
            <View style={{ margin: 2 }} />

            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <ThemedText style={{ color: '#000' }} type='small'>Type</ThemedText>
              <ThemedText style={{ color: Colors.wallet }} type='small'>{formData.platform.toLowerCase().includes("airtime") ? "Airtime" : "Data"}</ThemedText>
            </View>
            <View style={{ margin: 2 }} />

            {
              formData.platform.toLowerCase().includes('data') &&
              <>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Bouquet</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{formData.bouquets}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />
              </>
            }

            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <ThemedText style={{ color: '#000' }} type='small'>Reference</ThemedText>
              <ThemedText style={{ color: Colors.wallet }} type='small'>{formData.reference}</ThemedText>
            </View>
            <View style={{ margin: 2 }} />

            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <ThemedText style={{ color: '#000' }} type='small'>Date</ThemedText>
              <ThemedText style={{ color: Colors.wallet }} type='small'>{dayjs().format("MMMM D, YYYY")}</ThemedText>
            </View>
            <View style={{ margin: 2 }} />

            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
              <ThemedText style={{ color: '#000' }} type='small'>Time</ThemedText>
              <ThemedText style={{ color: Colors.wallet }} type='small'>{dayjs().format("h:mm A")}</ThemedText>
            </View>
          </ThemedView>
        </ReceiptView>

        <StatusModal
          visible={modalVisible2}
          onClose={() => setModalVisible2(false)}
          title="No Transaction PIn"
          message="Please create your transaction PIN to secure your account and enable transactions."
          navigateTo="/transactionpin"
          close={true}
        />

      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  dropdown: {
    height: 60,
    borderColor: Colors.gray8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: Colors.offwhite
  },
  contentContainer: {
    flex: 1,
    // backgroundColor: '#3E6B34',
    backgroundColor: Colors.green,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: -2,
    paddingVertical: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 5,
    borderRadius: 100,
    width: DIMENSION.WIDTH * 0.8,
    alignSelf: 'center',
    backgroundColor: Colors.gray11,
    paddingHorizontal: 5,
  },
  tab: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: Colors.wallet,
  },
  tabText: {
    color: Colors.blacktext,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  input: {
    fontSize: 15,
    paddingLeft: 6,
    padding: 12,
    borderRadius: 10,
    backgroundColor: Colors.offwhite1,
    flex: 1
  },
  inputInvalid: {
    backgroundColor: Colors.error100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  invalid: {
    backgroundColor: Colors.error100,
  },
  popup: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // boxShadow: '0px 4px 6px rgba(0,0,0,0.35)', 
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})