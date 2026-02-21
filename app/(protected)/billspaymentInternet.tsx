import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import LogoSpinner from '@/components/LoadingScreen'
import PinInput from '@/components/PinInput'
import ReceiptView from '@/components/ReceiptView'
import { StatusModal } from '@/components/StatusModal'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { validateInternet } from '@/components/validateInternet'
import { Colors, decryptData, encryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { customerbillercommission, internetPayment, validateinternets, validatepin, YOUR_API_BASE_URL } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { MaterialIcons } from '@expo/vector-icons'
import axios from 'axios'
import dayjs from "dayjs"
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Animated, Dimensions, Image, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextProps, TouchableOpacity, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { SafeAreaView } from 'react-native-safe-area-context'

const { height } = Dimensions.get('window');
export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor: { dark: string; light: string };
};


export default function billspaymentInternet({
  lightColor,
  darkColor,
  headerBackgroundColor,
}: Props) {

  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const router = useRouter()
  const [isloading, setIsLoading] = useState(false)
  const { billid } = useLocalSearchParams<any>()
  const { user, token, logout } = useAuth()

  const [isPinLoading, setIsPinLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [internetPlatform, setInternetPlatform] = useState<any>([])
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bouquets, setBouquets] = useState<any>([])
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    platform: "",
    platformName: "",
    bouquets: "",
    amount: "",
    commission: "",
    reference: "",
    smartcard: "",
    customername: "",
    imagepath: ""
  });

  const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen

  const [visible, setVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

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
          flag: item.imagePath
        }));
        setInternetPlatform(countryArray);
      } catch (error: any) {
        if (error.response?.status === 401) {
          Alert.alert("Session expired", "Please log in again.");
          await logout(); // from your AuthContext
          router.replace("/login"); // navigate to login screen
        } else {
          Alert.alert('Error', 'An error occurred. Please try again later.')
        }
      } finally {
        setIsLoading(false)
      }
    };
    fetchBillers();
  }, []);

  const getBouquets = async (value: string) => {
    try {
      const response = await axios.get(
        `${YOUR_API_BASE_URL}auth/billpayment/getAllBouquetByBillerID/${billid}/${value}`,
        {
          headers: {
            Accept: 'application/json',
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
      Alert.alert("Error", `No bouquet fetched for current option selected`)
      setBouquets([])
    }
  };



  const handleValidation = () => {
    const validationErrors = validateInternet(formData);
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

  const validatehandler = async () => {
    try {
      setIsLoading(true)
      const response = await validateinternets(user?.customer_id, formData.platform, formData.smartcard, formData.imagepath, decryptData(token));
      setFormData(prev => ({
        ...prev,
        reference: response.data.requestID
      }));
      Alert.alert("Confirm Payment", "You are about to make payment for selected option", [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Proceed",
          onPress: () => openPopup1()
        }
      ]);
    } catch (error: any) {
      Alert.alert("Error", "Failed to validate smartcard details.");
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

      const response = await internetPayment(
        formData.reference,
        encryptData(formData.amount),
        formData.bouquets,
        decryptData(token),
        formData.commission
      );
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
          <ThemedText type="titleMedium">Internet and Subscription</ThemedText>
          <ThemedText style={{ color: Colors.gray9 }}>Buy internet subscription</ThemedText>
          <View style={{ margin: 10 }} />

          <ThemedText>Select Internet Platform</ThemedText>
          <View style={{ margin: 2 }} />
          <View style={{ flex: 1, margin: 1 }}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={{ color: Colors.gray9 }}
              selectedTextStyle={{ color: "#000" }}
              data={internetPlatform}
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
                getBouquets(item.value)
                setFormData(prev => ({
                  ...prev,
                  platform: String(item.value),
                  platformName: item.label,
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
                const selected = internetPlatform.find(
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
          <View style={{ margin: 2 }} />
          <ThemedText>Select Network Plan</ThemedText>
          <View style={{ flex: 1 }}>
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

          <ThemedText>Amount</ThemedText>

          <View style={{ flex: 1 }}>
            <Input
              placeholder="NGN 0.00"
              keyboardType="number-pad"
              value={formData.amount && Number(formData.amount).toLocaleString()}
              editable={false}
            />
          </View>
          <View style={{ margin: 5 }} />

          <ThemedText>Smart Card Id / Number</ThemedText>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="123456......."
              keyboardType="number-pad"
              value={formData.smartcard}
              onUpdateValue={(text) => setFormData({ ...formData, smartcard: text })}
            />
          </View>
          <View style={{ margin: 15 }} />

          <ThemedButton style={{ backgroundColor: Colors.green, padding: 15, borderRadius: 30, alignItems: 'center' }} onPress={() => { handleValidation() }} disabled={isloading}>
            <ThemedText style={{ color: '#fff' }}>Continue</ThemedText>
          </ThemedButton>

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

          <ReceiptView visible={visible} onClose={() => setVisible(false)} watermarkText="IGOEPP">
            <ThemedView style={{ backgroundColor: Colors.gray6, marginHorizontal: 10, paddingHorizontal: 20, paddingVertical: 20 }}>
              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }} type='small'>From</ThemedText>
                <ThemedText style={{ color: Colors.wallet }} type='small'>Wallet</ThemedText>
              </View>
              <View style={{ margin: 2 }} />

              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }} type='small'>Network</ThemedText>
                <ThemedText style={{ color: Colors.wallet }} type='small'>{billid.split("-")[0]}</ThemedText>
              </View>
              <View style={{ margin: 2 }} />

              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }} type='small'>Phone number</ThemedText>
                <ThemedText style={{ color: Colors.wallet }} type='small'>{formData.smartcard}</ThemedText>
              </View>
              <View style={{ margin: 2 }} />

              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }} type='small'>Customer Name</ThemedText>
                <ThemedText style={{ color: Colors.wallet }} type='small'>{formData.customername}</ThemedText>
              </View>
              <View style={{ margin: 2 }} />

              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <ThemedText style={{ color: '#000' }} type='small'>Topup amount</ThemedText>
                <ThemedText style={{ color: Colors.wallet }} type='small'>{formData.amount}</ThemedText>
              </View>
              <View style={{ margin: 2 }} />

              {/* <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                <ThemedText style={{color: '#000'}} type='small'>Type</ThemedText>
                <ThemedText style={{color:Colors.wallet }} type='small'>{item.vtu_type}</ThemedText>
              </View>
              <View style={{margin:2}}/> */}

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
  dropdown: {
    height: 60,
    borderColor: Colors.gray8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: Colors.offwhite
  },
})