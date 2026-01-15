import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import LogoSpinner from '@/components/LoadingScreen'
import PinInput from '@/components/PinInput'
import ReceiptView from '@/components/ReceiptView'
import { StatusModal } from '@/components/StatusModal'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { validateBet } from '@/components/validateBet'
import { Colors, decryptData, encryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { betpay, customerbillercommission, validatebetting, validatepin } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import axios from 'axios'
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
    amount:"6000"
  },
  {
    amount: "7000"
  }
]
const { height } = Dimensions.get('window');
export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};


export default function billspaymentBetting({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const router = useRouter()
  const [isloading, setIsLoading] = useState(false)
  const [betPlatform, setBetPlatform] = useState<any>([])
  const {user, token} = useAuth()
  const {billid} = useLocalSearchParams()

  const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen

  const [formattedamount, setFormattedAmount] = useState<any>('')
  const [isInvalid, setIsInvalid] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [amount, setAmount] = useState<any>()
  const [pin, setPin] = useState<any>()
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const [formData, setFormData] = useState({
    platform: "",
    platformName:"",
    betid: "",
    amount: "",
    commission: "",
    reference: "",
    imagepath: "",
  });


  const formatNumber = (text:any) => {
    // Remove any non-numeric characters
    let cleanText = text.replace(/[^0-9]/g, '');
    // Format the number with commas
    return cleanText.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatNumber2 = (text:any) => {
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
    setFormData({ ...formData, amount: text,})

    setFormattedAmount(formattedValue);
  };

  useFocusEffect(
    useCallback(() => {
      if (user?.transaction_pin_setup === "N") {
        setModalVisible2(true);
      }
    }, [user?.transaction_pin_setup])
  );
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

  useEffect(() => {
    const fetchBillers = async () => {
      try {
        setIsLoading(true)
        const config = {
          method: 'get',
          url: `https://igoeppms.com/igoepp/public/api/auth/billpayment/getAllBillersByCategory/${billid}`,
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${decryptData(token)}`,
          },
        };
        const response = await axios(config);
        // console.log(response)
        const data = response.data;
        const countryArray = data.map((item: any) => ({
          label: item.name,
          value: String(item.id),
          flag: item.imagePath
        }));
        setBetPlatform(countryArray);
      } catch (error) {
        console.error("Country fetch error:", error);
      }finally{
        setIsLoading(false)
      }
    };
    fetchBillers();
  }, []);
    
  useEffect(() => {
    const interval = () => {
      // Only show modal if status is true
      if (user?.transaction_pin_setup === "N") {
        setModalVisible2(true);
      }
    };

    interval();
  }, [user?.transaction_pin_setup])

  const handleValidation = () => {
    const validationErrors = validateBet(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // stop signup — show all errors
      console.log("Validation Errors:", validationErrors);

      // Join all error messages together
      const allErrors = Object.values(validationErrors).join("\n");

      Alert.alert("❌ Validation Errors", allErrors);
      return;
    }
    // proceed to API call, etc.
    return validatehandler();
  };

  const validatehandler = async() => { 
    console.log(formData)
    try {
      setIsLoading(true)
      const response = await validatebetting(user?.customer_id, formData.platform, formData.betid, formData.imagepath, decryptData(token) );
      // setFormData({...formData, reference: response.data.requestID})
      setFormData(prev => ({
        ...prev,
        reference: response.data.requestID
      }));
      Alert.alert("Confirm Payment", "You are about to fund your betting account", [
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
      console.log("Failed to validate betting details:", error.response?.data || error);
      Alert.alert("Error", "Failed to validate betting details.");
    }finally{
      setIsLoading(false)
    }
  }

  const pinvalidation = async (pin: any) => {
    console.log(pin);

    try {
      setIsPinLoading(true);

      const response = await validatepin(
        user?.customer_id,
        encryptData(pin),
        decryptData(token)
      );

      console.log(response);

      closePopup1();        // close the PIN modal
      makepayment();        // start payment loading immediately

    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "PIN validation failed");
      console.log(error.response?.data?.message);

    } finally {
      setIsPinLoading(false);
    }
  };


  const makepayment = async () => {
    try {
      setIsPaymentLoading(true);

      const response = await betpay(
        formData.reference,
        encryptData(formData.amount),
        decryptData(token),
        formData.commission
      );

      console.log(response);
      setVisible(true);

    } catch (error: any) {
      Alert.alert("Error", error.response?.data.message || "Payment failed");
      console.log(error.response);

    } finally {
      setIsPaymentLoading(false);
    }
  };


  const commissionget = async (id: any) => {
    try {
      const response = await customerbillercommission(id, decryptData(token));
      console.log(response);

      setFormData(prev => ({
        ...prev,
        commission: response
      }));
    } catch (error: any) {
      console.log(error.response);
    }
  };



  if(isloading || isPinLoading || isPaymentLoading){
    return <LogoSpinner lightColor='' darkColor=''/>
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust for header height if needed
      >
        <Animated.ScrollView showsVerticalScrollIndicator={false}>  
          <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
            <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
          </GoBack>
          <View style={{margin:6}}/> 
          <ThemedText type="titleMedium">Betting and Lottery</ThemedText>
          <ThemedText style={{color: Colors.gray9}}>Fund your betting account</ThemedText>
          <View style={{margin:10}}/> 

          <ThemedText>Select Betting Platform</ThemedText>
          <View style={{margin:2}}/> 

          <View style={{ flex: 1}}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={{ color: Colors.gray9 }}
              selectedTextStyle={{ color: "#000" }}
              data={betPlatform}
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
                  imagepath: item.flag
                }));
              }}


              // ▼▼ IMAGE + TEXT INSIDE DROPDOWN ITEMS ▼▼
              renderItem={(item: any) => (
                <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
                  <Image
                    source={{ uri: item.flag }}  // your API flag field
                    style={{ width: 24, height: 24, marginRight: 10, borderRadius:4 }}
                    resizeMode="contain"
                  />
                  <Text style={{ color: "#000" }}>{item.label}</Text>
                </View>
              )}

              // ▼▼ IMAGE + TEXT WHEN SELECTED ▼▼
              renderLeftIcon={() => {
                const selected = betPlatform.find(
                  (c: any) => c.value === formData.platform
                );

                return selected ? (
                  <Image
                    source={{ uri: selected.flag }}
                    style={{ width: 20, height: 20, marginRight: 8, borderRadius:4 }}
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
          <View style={{margin:5}}/>

          <ThemedText>Bet ID</ThemedText>

          <View style={{ flex: 1 }}>
            <Input
              placeholder="Please enter"
              keyboardType="default"
              value={formData.betid}
              onUpdateValue={(text) => setFormData({...formData, betid: text})}
            />
          </View>
          <View style={{margin:5}}/>

        <ThemedText>Enter Amount</ThemedText>
          <View style={{margin:5}}/> 
          <ThemedView style={[styles.container, {marginBottom:5, backgroundColor: Colors.offwhite1}]}>
            <View style={{flexDirection:'row', flex:1, justifyContent:'center', alignItems:'center'}}>
              <MaterialCommunityIcons name="currency-ngn" size={15} color={Colors.gray9} />
              <TextInput placeholder={'Amount'} 
                style={[styles.input, isInvalid && styles.invalid, {color:Colors.gray9, }]} 
                onFocus={() => setIsInvalid(false)}
                value={formattedamount}
                onChangeText={handleChange}
                placeholderTextColor={Colors.gray9}
                keyboardType='number-pad'
                maxLength={9}
              />
            </View>
            <TouchableOpacity onPress={() => [setFormattedAmount(null), setAmount(null)]} style={{padding:10}}>
              <AntDesign name="close-circle" size={20} color={Colors.gray9} />
            </TouchableOpacity>
          </ThemedView>

          <View style={{margin:5}}/>

            <ThemedView style={{flexDirection:'row', justifyContent:'space-evenly'}}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {numbers.map((item, key) => (
                  <TouchableOpacity key={key} style={{backgroundColor:Colors.offwhite,paddingLeft: 5, margin: 5,paddingRight:5, borderRadius:15, padding:5}} onPress={() => handleChange(item.amount)}>
                    <ThemedText style={{color: Colors.green8}} type='smallBold'><MaterialCommunityIcons name="currency-ngn" size={15} color={Colors.green8} /> {item.amount.toLocaleString()+"."+"00"}</ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ThemedView>

          <View style={{margin:15}}/>
          
          <ThemedButton style={{backgroundColor: Colors.green, padding: 15, borderRadius:30, alignItems:'center'}} onPress={() => {handleValidation()}}>
            <ThemedText style={{color:'#fff'}}>Continue</ThemedText>
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
              <ThemedText type='titleMedium' style={{textAlign:'center'}}>Enter Pin</ThemedText>
              <View style={{margin:8}}/> 
  
              <ThemedText style={{textAlign:'center', color: Colors.gray9}}>Enter Transaction PIN</ThemedText>
              <View style={{margin:10}}/>
              <View style={{margin:5}}/>
              
  
              <PinInput length={4} secure={true} onSubmit={(pin) => {closePopup1(), pinvalidation(pin)}}/>
              <View style={{margin:10}}/>
            </Animated.View>
            </KeyboardAvoidingView>
          </Modal>

        </Animated.ScrollView>
        
        <ReceiptView visible={visible} onClose={() => setVisible(false)} watermarkText="IGOEPP">
          <ThemedView style={{backgroundColor: Colors.gray6, marginHorizontal:5, paddingHorizontal:10, paddingVertical:10, borderRadius:8}}>
            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
              <ThemedText style={{color: '#000'}} type='small'>From</ThemedText>
              <ThemedText style={{color:Colors.wallet }} type='small'>Wallet</ThemedText>
            </View>
            <View style={{margin:2}}/>

            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
              <ThemedText style={{color: '#000'}} type='small'>Bet id</ThemedText>
              <ThemedText style={{color:Colors.wallet }} type='small'>{formData.betid}</ThemedText>
            </View>
            <View style={{margin:2}}/>

            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
              <ThemedText style={{color: '#000'}} type='small'>Bet Platform</ThemedText>
              <ThemedText style={{color:Colors.wallet }} type='small'>{formData.platformName}</ThemedText>
            </View>
            <View style={{margin:2}}/>

            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
              <ThemedText style={{color: '#000'}} type='small'>Amount</ThemedText>
              <ThemedText style={{color:Colors.wallet }} type='small'>{formData.amount}</ThemedText>
            </View>
            <View style={{margin:2}}/>

            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
              <ThemedText style={{color: '#000'}}>Reference</ThemedText>
              <ThemedText style={{color:Colors.wallet }} >{formData.reference}</ThemedText>
            </View>
            <View style={{margin:2}}/>

            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
              <ThemedText style={{color: '#000'}} type='small'>Date</ThemedText>
              <ThemedText style={{color:Colors.wallet }} type='small'>{dayjs().format("MMMM D, YYYY")}</ThemedText>
            </View>
            <View style={{margin:2}}/>

            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
              <ThemedText style={{color: '#000'}} type='small'>Time</ThemedText>
              <ThemedText style={{color:Colors.wallet }} type='small'>{dayjs().format("h:mm A")}</ThemedText>
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
  popup: {
    position: 'absolute',
    bottom:0,
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    fontSize:15,
    paddingLeft: 6,
    padding:12,
    borderRadius:10,
    backgroundColor: Colors.offwhite1,
    flex:1
  },
  inputInvalid: {
    backgroundColor: Colors.error100,
  },
  invalid: {
    backgroundColor: Colors.error100,
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