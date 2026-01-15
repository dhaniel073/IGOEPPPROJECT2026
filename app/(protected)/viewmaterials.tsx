import EmptyScreen from '@/components/EmptyScreen';
import GoBack from '@/components/GoBack';
import LogoSpinner from '@/components/LoadingScreen';
import PinInput from '@/components/PinInput';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors, decryptData, encryptData } from '@/constants/Colors';
import { useAuth } from '@/hooks/AuthContext';
import { getbanks, getmaterialdetailsbyrequestidmobile, gettotalamountnmaterialrequestid, materialpaymentbycustomer, sessionId, validatepin } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FontAwesome, FontAwesome5, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, Animated, Dimensions, FlatList, Image, KeyboardAvoidingView, Modal, Platform, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native';
import { usePaystack } from 'react-native-paystack-webview';
import { SafeAreaView } from 'react-native-safe-area-context';


const { height } = Dimensions.get('window');

const data = [
  {
        id:"W",
        name: 'Pay with wallet',
        icon: <Fontisto name="wallet" size={14} color={Colors.wallet} />
    },
    {
        id:"C",
        name: "Pay with debit card",
        icon: <FontAwesome5 name="money-bill-wave" size={14} color={Colors.wallet} />
    },
    {
      id:"T",
      name: 'Pay with transfer',
      icon:  <FontAwesome name="bank" size={14} color={Colors.wallet} />

    },
];




export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};


export default function viewmaterials({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const {token, logout, user, updateUserFields} = useAuth()
    const {requestid} = useLocalSearchParams<any>()
    const [isfetching, setIsFetching] = useState(false)
    const [fetchedmaterials, setFetchedMaterial] = useState<any>([])
    const navigation = useNavigation()
    const [visible,setIsVisible] = useState(false)
    const [amount, setAmount] = useState<any>("")
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isModalVisible1, setIsModalVisible1] = useState(false)
    const [isModalVisible2, setIsModalVisible2] = useState(false)
    const slideAnim = React.useRef(new Animated.Value(height)).current;
    const [paymentmethod, setPaymentMethod] = useState<any>('')
    const [paymentmethodInvalid,setPaymentMethodInvalid] = useState(false)
    const {popup} = usePaystack()
    const [avail, setavail] = useState<any>("")
    const [bankavail, setBankAvail] = useState<any>("")
    const [bank, setBank] = useState<any>([])
    const [formattedamount, setFormattedAmount] = useState<any>('')

    const paynow = async () => {  
        popup.newTransaction({
            email: user?.email,
            amount: amount,
            reference: `TNX_${Date.now()}`,
            onSuccess: async(res: any) => {
                await SuccessHandler(res);
                console.log("Payment success:", res);
            },
            onCancel: () => {
                Alert.alert("Cancelled", "Transaction Cancelled")
            },
            onLoad: (res: any) => console.log("Webview loading"),
            onError: (err: any) => {
                console.log("An error occured while per", err)
            }
        })
    }

    const SuccessHandler = async (res: any) => {
        console.log("Payment response:", res);
        try {
            setIsFetching(true);
            const response = await materialpaymentbycustomer(user?.customer_id, requestid, avail?.id, user?.session_id, decryptData(token));
            console.log("Wallet update response:", response);
            fetchAll()
            Alert.alert("Success", "Payment was successful", [ { text: "Ok", onPress: () => {} }, ]);
        } catch (error:any) {
            console.log("Error in SuccessHandler:", error.response);
            Alert.alert("Sorry", "An error occurred. Please try again later", [ { text: "Ok", onPress: () => router.push("/"), }, ]);
        }finally{
            setIsFetching(false)
        }
    };


    const openPopup = () => {
        setIsModalVisible(true);
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
        }).start(() => setIsModalVisible(false)); // Close after animation
    };

    //for select bank
    const openPopup1 = () => {
        setIsModalVisible1(true);
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
        }).start(() => setIsModalVisible1(false)); // Close after animation
    };

    //for enter pin
    const openPopup2 = () => {
        setIsModalVisible2(true);
        Animated.timing(slideAnim, {
        toValue: 0, // Slide to the screen
        duration: 300,
        useNativeDriver: true,
        }).start();
    };

    const closePopup2 = () => {
        Animated.timing(slideAnim, {
        toValue: height, // Slide back down
        duration: 300,
        useNativeDriver: true,
        }).start(() => setIsModalVisible2(false)); // Close after animation
    };


    useLayoutEffect(() => {
        const fetchAll = async () => {
            try {
            setIsFetching(true);

            const [materials, totalAmount, session, banks] = await Promise.all([
                getmaterialdetailsbyrequestidmobile(requestid, decryptData(token)),
                gettotalamountnmaterialrequestid(requestid, decryptData(token)),
                sessionId(user?.email, decryptData(token)),
                getbanks(decryptData(token))
            ]);

            console.log("Materials:", materials);
            console.log("Total amount:", totalAmount);
            console.log("Session:", session);

            setFetchedMaterial(materials);
            setAmount(totalAmount);
            setBank(banks)
            // setSession(session);
            updateUserFields({session_id: session.login_session_id})
            } catch (error: any) {
            console.error("Error fetching data:", error.response);
            if (error.response?.status === 401) {
                Alert.alert("Session expired", "Please log in again.");
                await logout();
                router.replace("/login");
            } else {
                Alert.alert("Error", "Unable to load data. Please try again later.");
            }
            } finally {
            setIsFetching(false);
            }
        };

        const unsubscribe = navigation.addListener("focus", fetchAll);
        return unsubscribe;
    }, [navigation, requestid, token, user?.email]);

    const fetchAll = async () => {
        try {
        setIsFetching(true);

        const [materials, totalAmount, session] = await Promise.all([
            getmaterialdetailsbyrequestidmobile(requestid, decryptData(token)),
            gettotalamountnmaterialrequestid(requestid, decryptData(token)),
            sessionId(user?.email, decryptData(token)),
        ]);

        console.log("Materials:", materials);
        console.log("Total amount:", totalAmount);
        console.log("Session:", session);

        setFetchedMaterial(materials);
        setAmount(totalAmount);
        // setSession(session);
        updateUserFields({session_id: session.login_session_id})
        } catch (error: any) {
        console.error("Error fetching data:", error.response);
        if (error.response?.status === 401) {
            Alert.alert("Session expired", "Please log in again.");
            await logout();
            router.replace("/login");
        } else {
            Alert.alert("Error", "Unable to load data. Please try again later.");
        }
        } finally {
        setIsFetching(false);
        }
    };

    const formatNumber = (value: number | string) => {
        let cleanText = String(value).replace(/[^0-9]/g, '');
        return cleanText.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };


   const proceed = () => {
        const validBanks = ['OPTIMUS BANK', 'VFD MICROFINANCE BANK'];

        if (validBanks.includes(bankavail)) {
            router.push({
            pathname: "/(protected)/virtualaccountmaterial",
            params: {
                bank: bankavail,
                formattedamount: formatNumber(amount),
                amount: amount,
                requestid: requestid
            }
            });
            setBankAvail("");
        }
    };
    
    const pinValidateCheck = async (code: any) => {
        closePopup2();
        try {
            setIsFetching(true);

            const response = await validatepin(
            user?.customer_id,
            encryptData(code),
            decryptData(token)
            );

            // ✅ Wait for paybywallet() to complete before continuing
            await paybywallet();
            setavail("");
        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message + " Please try again", [
            {
                text: "Ok",
                onPress: () => openPopup2(),
            },
            ]);
        } finally {
            // ✅ Now this will only run after both validatepin and paybywallet finish
            setIsFetching(false);
        }
    };

    //for wallet payment
    const paybywallet = async () => {
        try { 
            const response = await materialpaymentbycustomer(user?.customer_id, requestid, avail?.id, user?.session_id,  decryptData(token));
            console.log("Wallet payment response:", response);
            Alert.alert("Success", "Payment was successful", [ { text: "Ok", onPress: () => fetchAll() }, ]);
        } catch (error:any) {
            console.log("Error in SuccessHandler:", error.response);
            Alert.alert("Sorry", error.response.data.message || "An error occurred. Please try again later", [ { text: "Ok", onPress: () => router.push("/bookings"), }, ]);
        }finally{
            setIsFetching(false)
        }
    }

    if(isfetching){
        return <LogoSpinner lightColor='' darkColor=''/>
    }


    return (
     <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>            
        <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
            <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
        </GoBack>

        <View style={{margin:6}}/>
        
        <ThemedText type="titleMedium">View Material Requests</ThemedText>

        <View style={{margin:5}}/>

        {fetchedmaterials.length === 0  ? 
            <Animated.ScrollView showsVerticalScrollIndicator={false}>  
                <EmptyScreen
                    mainText="You have no material yet"
                    subText="Material request will appear once one is made."
                    imageSource={require('@/assets/images/history.png')}
                />
            </Animated.ScrollView>
        :
            <FlatList
                data={fetchedmaterials}
                showsVerticalScrollIndicator={false}
                renderItem={({item}:{item:any}) => (

                    <View style={{boxShadow: '4px 4px 6px rgba(0,0,0,0.35)', borderWidth:0.3,borderColor: Colors.gray9, borderRadius:13,  marginBottom:25}}>
                        <View style={{flexDirection:'row', padding:10, justifyContent:'space-between', borderBottomWidth:0.5, borderBottomColor: Colors.gray7, paddingTop:10, paddingBottom:10}}>
                            <ThemedText type='small'>Id</ThemedText>
                            <ThemedText type='small'>{item.id}</ThemedText>
                        </View>

                        <View style={{flexDirection:'row', padding:10, justifyContent:'space-between', borderBottomWidth:0.5, borderBottomColor: Colors.gray7, paddingTop:10, paddingBottom:10}}>
                            <ThemedText type='small'>Request Id</ThemedText>
                            <ThemedText type='small'>{item.request_id}</ThemedText>
                        </View>

                        <View style={{flexDirection:'row', padding:10, justifyContent:'space-between', borderBottomWidth:0.5, borderBottomColor: Colors.gray7, paddingTop:10, paddingBottom:10}}>
                            <ThemedText type='small'>Amount</ThemedText>
                            <ThemedText type='small'><MaterialCommunityIcons name="currency-ngn" size={13} color={color}/>{item.amount.toLocaleString()}</ThemedText>
                        </View>

                        <View style={{flexDirection:'row', padding:10, justifyContent:'space-between', borderBottomWidth:0.5, borderBottomColor: Colors.gray7, paddingTop:10, paddingBottom:10}}>
                            <ThemedText type='small'>Item</ThemedText>
                            <ThemedText type='small'>{item.reason_for_transaction}</ThemedText>
                        </View>
            
                        <View style={{flexDirection:'row', padding:10, justifyContent:'space-between', paddingTop:10, paddingBottom:10}}>
                            <ThemedText type='small'>Status</ThemedText>

                            {item.customer_payment_status === 'S' ? 

                                <ThemedText type='small' style={{color: Colors.green}}>Successful</ThemedText>

                                :

                                <ThemedText type='small' style={{color: Colors.yellow}}>Approval Pending</ThemedText>

                                // :

                                // <ThemedText type='small' style={{color: Colors.red}}>Cancelled</ThemedText>
                            }
                        </View>
                    </View>
                )}
            />
        }

        <View
            style={{
                marginBottom: 30,
                flexDirection: 'row',
                alignItems: 'center'
            }}
        >
            {amount ?
                // <View style={{ }}>
                    <ThemedButton onPress={openPopup} style={{backgroundColor: Colors.green, paddingHorizontal:10, paddingVertical:10, borderRadius: 8, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <ThemedText>Make Payment</ThemedText>    
                    </ThemedButton>
                // </View>
            : ""
            }

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ThemedText
                    style={{
                    textAlign: 'center',
                    fontSize: 12,
                    fontFamily: 'poppinsRegular',
                    }}
                >Total Amount: ₦{amount.toLocaleString()}</ThemedText>
            </View>
        </View>

        <View style={{margin:'5%'}}/>
        
        <Modal
            transparent
            visible={isModalVisible}
            animationType="slide" 
            onRequestClose={closePopup}
        >
        
            <TouchableOpacity style={styles.overlay} onPress={() => [closePopup(), setavail("")]} />

            <Animated.View
                style={[
                    styles.popup,
                    { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: '15%' },
                ]}
            >


                <View style={{margin:5}}/>
                
                <ThemedView style={{flexDirection:'row', alignItems:'center'}}>
                    <View style={{flex:1, alignItems:'center', marginLeft:15}}>
                        <ThemedText type='titleMedium'>Select Payment Method</ThemedText>
                    </View>
                    <TouchableOpacity onPress={() => [closePopup(), setavail("")]}>
                        <MaterialIcons name="cancel" size={24} color={Colors.green} />
                    </TouchableOpacity>
                </ThemedView>

                <View style={{margin:6}}/>

                <ThemedText style={{textAlign:'center', color: Colors.green}} type='titleMedium'>
                    {!amount ? "0.00" : amount.toLocaleString('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                    })}
                </ThemedText>
                <View style={{margin:8}}/>

                {data.map((item: any, key: any) => 
                    <ThemedView key={item.id} style={{flexDirection:'row', justifyContent:'space-between', padding:12,
                        borderRadius: 12,
                        margin: 10, // space for shadow
                        // iOS shadow
                        boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
                    }}>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <View style={{backgroundColor: Colors.clock2, padding: 10, borderRadius: 50, marginRight:10}}>
                                {item.icon}
                            </View>
                            <View>
                                <ThemedText>{item.name}</ThemedText>
                                
                                <ThemedText style={{color: Colors.gray9}} type='small'>
                                    {!amount ? "0.00" : amount.toLocaleString('en-NG', {
                                        style: 'currency',
                                        currency: 'NGN',
                                    })}
                                </ThemedText>
                            </View>
                        </View>
                        <View>
                            <View key={key}>
                                <TouchableOpacity style={{padding: 15, borderRadius:10, flexDirection:'row', justifyContent:'space-between'}} onPress={() => [setavail(item)]}>
                                    <TouchableOpacity style={styles.outer} onPress={() => setavail(item)}>
                                        {avail === item && <View style={styles.inner}/>}
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ThemedView>
                )}

                <View style={{margin:10}}/>
                
                <ThemedButton onPress={() => !avail.id ? alert("Select a payment method to continue") : avail?.id === 'T' ? [closePopup(), openPopup1()] : avail?.id === 'C' ? [paynow(), closePopup()] : [closePopup(), openPopup2()]} enabled={!avail ? false : true} style={{backgroundColor: Colors.green, padding: 15, borderRadius:30, alignItems:'center'}}>
                    <ThemedText style={{color: '#fff'}}>Make Payment</ThemedText>
                </ThemedButton>
            </Animated.View>
        </Modal>

        <Modal
            transparent
            visible={isModalVisible1}
            animationType="slide" 
            onRequestClose={closePopup1}
        >

            <TouchableOpacity style={styles.overlay} onPress={() => [closePopup1(), setavail("")]} />

            <Animated.View
                style={[
                    styles.popup,
                    { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: '15%' },
                ]}
            >

                <ThemedView style={{marginTop:20}}/>
                    {bank.map((item: any, key: any) => 
                    <View key={key}>
                    <TouchableOpacity style={{flexDirection:'row', justifyContent:'space-between', paddingBottom:10, paddingTop:10}} onPress={() => setBankAvail(item.bank_name)}>
                    <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center',}}>
                        <Image style={{height:30, borderRadius: 50, width:30}} source={{uri: `https://igoeppms.com/igoepp/public/banks/${item.image}`}}/>
                        <View style={{marginHorizontal:6}}/>
                        <View>
                            <ThemedText>{item.bank_name}</ThemedText>
                            <ThemedText style={{color: Colors.gray9}} type='small'>
                                {!amount ? "0.00" : amount.toLocaleString('en-NG', {
                                    style: 'currency',
                                    currency: 'NGN',
                                })}
                            </ThemedText>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.outer, {borderColor: color}]} onPress={() => setBankAvail(item.bank_name)}>
                        {bankavail === item.bank_name && <View style={[styles.inner, {backgroundColor: color}]}/>}
                    </TouchableOpacity>
                    </TouchableOpacity>
                </View>
                )}
                <View style={{marginTop:20}}/>

              
                <ThemedButton enabled={!bankavail ? false : true}  style={{backgroundColor: Colors.green, padding: 15, borderRadius:30, alignItems:'center'}} onPress={() => proceed()}>
                    <ThemedText style={{color:'#fff'}}>Proceed</ThemedText>
                </ThemedButton>
                
            </Animated.View>
        </Modal>
        
        <Modal
            transparent
            visible={isModalVisible2}
            animationType="slide" 
            onRequestClose={closePopup2}
        >
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust for header height if needed
            >
                <TouchableOpacity style={styles.overlay} onPress={() => [closePopup2()]} />

                <Animated.ScrollView
                    style={[
                        styles.popup,
                        { transform: [{ translateY: slideAnim }], backgroundColor: color1},
                    ]}
                >
                    <ThemedText type='titleMedium' style={{ textAlign: 'center' }}>Enter PIN</ThemedText>
                    <View style={{ margin: 8 }} />
                    <ThemedText style={{ textAlign: 'center', color: Colors.gray9 }}>
                        Enter your four-digit transaction PIN
                    </ThemedText>
                    <View style={{ margin: 10 }} />
                    <PinInput length={4} secure={true} onSubmit={pinValidateCheck} />

                    <View style={{margin:10}}/>
                </Animated.ScrollView>
            </KeyboardAvoidingView>
        </Modal>
{/* router.push({pathname:'/materialselectbank', params:{id:requestid, amount: amount}}) */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    outer:{
        width:20,
        height: 20,
        borderWidth: 1,
        borderRadius: 15,
        justifyContent:'center',
        alignItems: 'center'
    },
    inner:{
        width:10,
        height:10,
        backgroundColor: Colors.green,
        borderRadius:10
    },
    dropdown: {
        height: 50,
        borderColor: Colors.gray8,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: Colors.offwhite
    },

    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    popup: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
    },
})