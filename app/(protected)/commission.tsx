import GoBack from '@/components/GoBack'
import LogoSpinner from '@/components/LoadingScreen'
import PinInput from '@/components/PinInput'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, decryptamount, decryptData, encryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { customerinfocheck, movecommissiontocustomerwallet, sessioncheckcustomer, validatepin } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Animated, Dimensions, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TextProps, TouchableOpacity, View } from 'react-native'
import { usePaystack } from 'react-native-paystack-webview'
import { SafeAreaView } from 'react-native-safe-area-context'


const { height } = Dimensions.get('window');

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



export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};


export default function addmoneycard({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [formattedamount, setFormattedAmount] = useState<any>('')
    const [amount, setAmount] = useState<any>()
    const [isInvalid, setIsInvalid] = useState(false)
    const { user, token, updateUser, logout, updateUserFields } = useAuth();
    const [isloading, setisloading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(height)).current;
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const [isPinLoading, setIsPinLoading] = useState(false);
    const [sessionid, setSessionId] = useState<any>()
    const navigation = useNavigation()

    const {popup} = usePaystack()

    useEffect(() => {
        const onFocus = async () => {
            try {
                setisloading(true);

                // 1. Fetch user info
                const infoRes = await customerinfocheck(user?.customer_id, decryptData(token));
                updateUser(infoRes);

                // 2. Fetch session
                const sessionRes = await sessioncheckcustomer(user?.email, decryptData(token));
                updateUserFields({ session_id: sessionRes.login_session_id });

            } catch (error: any) {
                if (error.response?.status === 401) {
                    Alert.alert("Session expired", "Please log in again.");
                    await logout();
                    router.replace("/login");
                    return;
                }

                console.log(error.response);
                Alert.alert("Error", "An error occurred.");
            } finally {
                setisloading(false);
            }
        };

        const unsubscribe = navigation.addListener("focus", onFocus);

        return unsubscribe;
    }, []);


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
            closePopup();        // close the PIN modal
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
            const response = await movecommissiontocustomerwallet(
                user?.customer_id,
                amount,
                user?.session_id,
                decryptData(token)
            );

            console.log(response)
            Alert.alert('Successful', 'Commission withdrawal was successful',[
                {
                  text: 'OK',
                  onPress: () => refresh()
                }
            ])

            // console.log(response);
            
        } catch (error: any) {
            Alert.alert("Error", error.response?.data.message || "Payment failed");
            console.log(error.response);

        } finally {
            setIsPaymentLoading(false);
        }
    };

    const refresh = async() => {
        try {
            setisloading(true);
            const infoRes = await customerinfocheck(user?.customer_id, decryptData(token));
            updateUser(infoRes);
            router.replace("/(protected)/(tabs)")
        } catch (error: any) {
            if (error.response?.status === 401) {
                Alert.alert("Session expired", "Please log in again.");
                await logout();
                router.replace("/login");
                return;
            }
            console.log(error.response);
            Alert.alert("Error", "An error occurred.");
        } finally {
            setisloading(false);
        }
    }

    
    if(isloading || isPaymentLoading || isPinLoading){
        return <LogoSpinner lightColor='' darkColor=''/>
    }
  return (        
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
        <Animated.ScrollView showsVerticalScrollIndicator={false}>  
            <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
                <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
            </GoBack>

            <View style={{margin:6}}/> 
            <ThemedText type="titleMedium">Commission Withdrawal</ThemedText>
            <ThemedText style={{color: Colors.gray9}}>Withdraw your commission to your wallet</ThemedText>

            <View style={{margin:15}}/>

            <ThemedText>Commission Balance</ThemedText>
            <View style={{margin:5}}/> 
            <ThemedView style={{marginBottom:5, padding:13, backgroundColor: Colors.offwhite1,borderRadius: 10}}>
                <View style={{flexDirection:'row', flex:1}}>
                   <ThemedText type='titleLight' style={{fontSize:20, color: decryptamount(user?.commission_balance) > 1000 ? Colors.wallet : Colors.red }}> 
                        {decryptamount(user?.commission_balance)
                        .toLocaleString('en-NG', {
                            style: 'currency',
                            currency: 'NGN',
                        })}
                    </ThemedText>
                </View>
            </ThemedView>

            <View style={{margin:10}}/> 
            
            <ThemedText>Enter Amount</ThemedText>
            <View style={{margin:5}}/> 
            <ThemedView style={[styles.container, {marginBottom:5, backgroundColor: Colors.offwhite1}]}>
                <View style={{flexDirection:'row', flex:1, justifyContent:'center', alignItems:'center'}}>
                    <MaterialCommunityIcons name="currency-ngn" size={20} color={Colors.gray9} />
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
                <TouchableOpacity onPress={() => [setFormattedAmount(null), setAmount(0)]} style={{padding:10}}>
                    <AntDesign name="close-circle" size={20} color={Colors.gray9} />
                </TouchableOpacity>
            </ThemedView>

            <View style={{margin:5}}/>

            <ThemedView style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {numbers.map((item, key) => (
                        <TouchableOpacity key={key} style={{backgroundColor:Colors.gray,paddingLeft: 5, margin: 5,paddingRight:5, borderRadius:15, padding:5}} onPress={() => handleChange(item.amount)}>
                            <Text style={{ fontFamily:'poppinsRegular', }}><MaterialCommunityIcons name="currency-ngn" size={15} color="black" /> {item.amount.toLocaleString()+"."+"00"}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </ThemedView>

            <View style={{margin:10}}/>

            <ThemedButton style={{ padding: 15, borderRadius:30, alignItems:'center', backgroundColor: Colors.green}} onPress={() => !amount ? alert("Please enter an amount to continue")  : openPopup()}>
                <ThemedText type='smallBold' style={{color:"#fff"}}>Proceed</ThemedText>
            </ThemedButton>
        </Animated.ScrollView>

        <Modal
            transparent
            visible={modalVisible}
            animationType="slide" 
            onRequestClose={closePopup}
        >
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust for header height if needed
            >
                <TouchableOpacity style={styles.overlay} onPress={() => [closePopup()]} />

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
                    

                    <PinInput length={4} secure={true} onSubmit={(pin) => {closePopup(), pinvalidation(pin)}}/>
                    <View style={{margin:10}}/>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
    container1:{
        borderWidth:0.2, borderColor: Colors.gray9, padding:18, borderRadius:15, 
        backgroundColor: Colors.bookingbackground
    },
    reactLogo: {
        height: 30,
        width: 30,
    },
    input: {
        fontSize:20,
        paddingLeft: 6,
        padding:12,
        borderRadius:10,
        backgroundColor: Colors.offwhite1,
        flex:1
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
})