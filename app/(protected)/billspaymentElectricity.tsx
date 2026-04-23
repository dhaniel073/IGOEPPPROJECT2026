import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import LogoSpinner from '@/components/LoadingScreen'
import PinInput from '@/components/PinInput'
import ReceiptView from '@/components/ReceiptView'
import { StatusModal } from '@/components/StatusModal'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { validateElectricity } from '@/components/validateElectricity'
import { Colors, decryptData, encryptData, extractInsideParentheses } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { customerbillercommission, discopayment, validatedisco, validatepin, YOUR_API_BASE_URL } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import axios from '@/api/axiosClient';
import dayjs from 'dayjs'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Animated, Dimensions, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TextProps, TouchableOpacity, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { SafeAreaView } from 'react-native-safe-area-context'
const numbers = [
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


export default function billspaymentElectricity({
  lightColor,
  darkColor,
  headerBackgroundColor,
}: Props) {

  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const router = useRouter()
  const { user, token, logout } = useAuth()
  const [isloading, setIsLoading] = useState(false)
  const [visible, setVisible] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [electricityPlatform, setElectricityPlatform] = useState<any>([])
  const { billid } = useLocalSearchParams()

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen
  const [formattedamount, setFormattedAmount] = useState<any>('')
  const [amount, setAmount] = useState<any>()
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [formData, setFormData] = useState({
    platform: "",
    platformName: "",
    meternumber: "",
    amount: "",
    address: "",
    customername: "",
    commission: "",
    reference: "",
    token: "",
    receipt_number: "",
    bonus: "",
    reference_id: "",
    unit_purchased: "",
    meter_type: "",
    imagepath: ""
  });

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
          flag: item.imagePath
        }));
        setElectricityPlatform(countryArray);
      } catch (error: any) {
        Alert.alert('Error', 'An error occurred. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    };
    fetchBillers();
  }, []);

  const handleValidation = () => {
    const validationErrors = validateElectricity(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // stop signup — show all errors

      // Join all error messages together
      const allErrors = Object.values(validationErrors).join("\n");

      Alert.alert("❌ Validation Errors", allErrors);
      return;
    }
    // proceed to API call, etc.
    return validatehandler();
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

  const validatehandler = async () => {
    try {
      setIsLoading(true)
      const response = await validatedisco(user?.customer_id, formData.platform, formData.meternumber, formData.meter_type, formData.imagepath, decryptData(token));
      // setFormData({...formData, reference: response.data.requestID})
      setFormData(prev => ({
        ...prev,
        reference: response.data.requestID,
        customername: response.data.customerName,
        address: response.data.customerAddress
      }));
      Alert.alert("Confirm Payment", "You are about to recharge your meter number", [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Proceed",
          onPress: () => openPopup()
        }
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.response?.data.message || "Failed to validate meter number.");
    } finally {
      setIsLoading(false)
    }
  }

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

      const response = await discopayment(
        formData.reference,
        encryptData(formData.amount),
        decryptData(token),
        formData.commission
      );

      setFormData(prev => ({
        ...prev,
        token: response.token,
        receipt_number: response.receipt_number,
        unit_purchased: response.purchased_unit,
        bonus: response.bonus,
        reference_id: response.referenceId,
      }));
      setVisible(true);

    } catch (error: any) {
      Alert.alert("Error", error.response?.data.message || "Payment failed");
    } finally {
      setIsPaymentLoading(false);
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
          <ThemedText type="titleMedium">Buy Electricity</ThemedText>
          <ThemedText style={{ color: Colors.gray9 }}>Select disco and enter meter number</ThemedText>
          <View style={{ margin: 10 }} />

          <ThemedText>Select Disco</ThemedText>
          <View style={{ margin: 2 }} />
          <View style={{ flex: 1, margin: 1 }}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={{ color: Colors.gray9 }}
              selectedTextStyle={{ color: "#000" }}
              data={electricityPlatform}
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

                setFormData(prev => ({
                  ...prev,
                  platform: String(item.value),
                  platformName: item.label,
                  meter_type: extractInsideParentheses(item.label),
                  imagepath: item.flag
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
                const selected = electricityPlatform.find(
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

          <ThemedText>Meter Number</ThemedText>

          <View style={{ flex: 1 }}>
            <Input
              placeholder="Please enter"
              keyboardType="number-pad"
              value={formData.meternumber}
              onUpdateValue={(text) => setFormData({ ...formData, meternumber: text })}
            />
          </View>

          <View style={{ margin: 5 }} />

          <ThemedText>Enter Amount</ThemedText>
          <View style={{ margin: 5 }} />
          <ThemedView style={[styles.container, { marginBottom: 5, backgroundColor: Colors.offwhite1 }]}>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialCommunityIcons name="currency-ngn" size={15} color={Colors.gray9} />
              <TextInput placeholder={'Amount'}
                style={[styles.input, { color: Colors.gray9, }]}
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

          <View style={{ margin: 15 }} />

          <ThemedButton style={{ backgroundColor: Colors.green, padding: 15, borderRadius: 30, alignItems: 'center' }} onPress={() => { handleValidation() }}>
            <ThemedText style={{ color: '#fff' }}>Continue</ThemedText>
          </ThemedButton>

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
                <ThemedText style={{ color: Colors.green8, textAlign: 'center' }} type='subtitle'>NGN {Number(formData.amount).toLocaleString()}</ThemedText>
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
                  <ThemedText style={{ color: '#000' }}>Meter Number</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }}>{formData.meternumber}</ThemedText>
                </View>
                <View style={{ margin: 7 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }}>Name</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }}>{formData.customername}</ThemedText>
                </View>
                <View style={{ margin: 7 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }}>Address</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }}>{formData.address}</ThemedText>
                </View>
                <View style={{ margin: 7 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }}>Disco</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }}>{formData.platform}</ThemedText>
                </View>
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

          <ReceiptView visible={visible} onClose={() => setVisible(false)} watermarkText="IGOEPP" imageuri={formData.imagepath}>
            <ThemedView style={{ backgroundColor: Colors.gray6, marginHorizontal: 10, paddingHorizontal: 20, paddingVertical: 20 }}>
              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }} type='small'>From</ThemedText>
                <ThemedText style={{ color: Colors.wallet }} type='small'>Wallet</ThemedText>
              </View>
              <View style={{ margin: 2 }} />

              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }} type='small'>Meter Number</ThemedText>
                <ThemedText style={{ color: Colors.wallet }} type='small'>{formData.meternumber}</ThemedText>
              </View>
              <View style={{ margin: 2 }} />

              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }} type='small'>Meter Type</ThemedText>
                <ThemedText style={{ color: Colors.wallet }} type='small'>{formData.meter_type}</ThemedText>
              </View>
              <View style={{ margin: 2 }} />

              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }} type='small'>Customer Name</ThemedText>
                <ThemedText style={{ color: Colors.wallet }} type='small'>{formData.customername}</ThemedText>
              </View>
              <View style={{ margin: 2 }} />

              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }} type='small'>Disco</ThemedText>
                <ThemedText style={{ color: Colors.wallet }} type='small'>{formData.platform}</ThemedText>
              </View>

              <View style={{ margin: 2 }} />

              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }} type='small'>Amount</ThemedText>
                <ThemedText style={{ color: Colors.wallet }} type='small'>{formData.amount}</ThemedText>
              </View>
              <View style={{ margin: 2 }} />

              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }} type='small'>Units Purchased</ThemedText>
                <ThemedText style={{ color: Colors.wallet }} type='small'>{formData.unit_purchased}</ThemedText>
              </View>
              <View style={{ margin: 2 }} />

              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }} type='small'>Receipt Number</ThemedText>
                <ThemedText style={{ color: Colors.wallet }} type='small'>{formData.receipt_number}</ThemedText>
              </View>
              <View style={{ margin: 2 }} />

              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }} type='small'>Bonus</ThemedText>
                <ThemedText style={{ color: Colors.wallet }} type='small'>{formData.bonus}</ThemedText>
              </View>
              <View style={{ margin: 2 }} />

              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }} type='small'>Token</ThemedText>
                <ThemedText style={{ color: Colors.wallet, maxWidth: '50%' }} type='small'>{formData.token}</ThemedText>
              </View>
              <View style={{ margin: 2 }} />

              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }} type='small'>Reference Id</ThemedText>
                <ThemedText style={{ color: Colors.wallet, maxWidth: '50%' }} type='small'>{formData.reference_id}</ThemedText>
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
              <View style={{ margin: 2 }} />
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
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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
  input: {
    fontSize: 15,
    paddingLeft: 6,
    padding: 12,
    borderRadius: 10,
    backgroundColor: Colors.offwhite1,
    flex: 1
  },
  dropdown: {
    height: 60,
    borderColor: Colors.gray8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: Colors.offwhite
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
})