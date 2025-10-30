import EmptyScreen from '@/components/EmptyScreen';
import GoBack from '@/components/GoBack';
import LogoSpinner from '@/components/LoadingScreen';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors, decryptData } from '@/constants/Colors';
import { useAuth } from '@/hooks/AuthContext';
import { bidaccept, bidacceptcash, bidacceptdebitcard, biddecline, bidnegotiate, bidrequests, getsession } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Feather, FontAwesome, FontAwesome5, FontAwesome6, Fontisto, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Animated, Dimensions, FlatList, Image, Modal, StyleSheet, TextInput, TextProps, TouchableOpacity, View } from 'react-native';
import { usePaystack } from 'react-native-paystack-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

const data1 = ["Y"]
const data = [
    {
        id:"W",
        name: 'Pay with wallet',
        icon: <Fontisto name="wallet" size={14} color={Colors.wallet} />
    },
    // {
    //     id:"C",
    //     name: "Pay with card",
    //     icon: <Ionicons name="card" size={14} color={Colors.wallet} />
    // },
    {
        id:"DC",
        name: "Pay with debit card",
        icon: <FontAwesome5 name="money-bill-wave" size={14} color={Colors.wallet} />
    },
    {
      id:"T",
      name: 'Pay with transfer',
      icon:  <FontAwesome name="bank" size={14} color={Colors.wallet} />

    },
]


export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};


export default function bidspending({
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
    const [avail, setavail] = useState<any>("")
    const [avail1, setavail1] = useState<any>("")
    const [enabled, setenabled] = useState<any>(false)
    const [bidid, setBidid] = useState<any>()

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchedRequest, setFetchedRequest] = useState<any>([]);
    const {bookingId} = useLocalSearchParams()
    const {user, token, logout} = useAuth()
    const navigation = useNavigation();
    const [amount1, setAmount1] = useState<any>()
    const {popup} = usePaystack()
    const [sessionid, setSessionId] = useState<any>()
    const [renegotiatedata, setRenegotiateData] = useState<any>({service_name: '', date: '', time: ''})   

    const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen
    
    useLayoutEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                setIsFetching(true);
                const response = await bidrequests(bookingId, decryptData(token));
                console.log(response);
                setFetchedRequest(response);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    Alert.alert("Session expired", "Please log in again.");
                    await logout(); // from your AuthContext
                    router.replace("/login"); // navigate to login screen
                } else {
                    Alert.alert('Error', 'Unable to load notification settings.')
                }
                console.error("Error fetching pending requests:", error);
            } finally {
                setIsFetching(false);
            }
        };

        const unsubscribe = navigation.addListener("focus", fetchPendingRequests);

        return unsubscribe;
    }, []);

    useEffect(() => {
        const fetchSession = async () => {
        try {
            setIsFetching(true);
            const response = await getsession(user?.email, decryptData(token));
            setSessionId(response.login_session_id)
            console.log('Session response:', response);
        } catch (error) {
            console.error('Error fetching session:', error);
        } finally {
            setIsFetching(false);
        }
        };

        fetchSession(); 
    }, []);

    //for debit card payment
    const SuccessHandler = async () => {
        try {
            setIsFetching(true);
            const response = await bidacceptdebitcard(bidid, sessionid,  decryptData(token));
            console.log("Wallet update response:", response);
            setAmount1(null)
            Alert.alert("Success", "Payment was successful", [ { text: "Ok", onPress: () => router.push("/bookings"), }, ]);
        } catch (error:any) {
            console.log("Error in SuccessHandler:", error.response);
            Alert.alert("Sorry", "An error occurred. Please try again later", [ { text: "Ok", onPress: () => router.push("/bookings"), }, ]);
            setIsFetching(false);
        }
    }
    // router.push('/BillPayment')

    //for cash payment
    const paybycash = async () => {
        try {
            setIsFetching(true);
            const response = await bidacceptcash(bidid, sessionid,  decryptData(token));
            console.log("Wallet update response:", response);
            setAmount1(null)
            Alert.alert("Success", "You have accepted the bid. Please ensure you have enough cash on hand to pay the artisan on service delivery", [ { text: "Ok", onPress: () => router.push("/bookings"), }, ]);
        } catch (error:any) {
            console.log("Error in SuccessHandler:", error.response);
            Alert.alert("Sorry", "An error occurred. Please try again later", [ { text: "Ok", onPress: () => router.push("/bookings"), }, ]);
            setIsFetching(false);
        }
    }

    //for wallet payment
    const paybywallet = async () => {
        try { 
            setIsFetching(true);
            const response = await bidaccept(bidid, sessionid,  decryptData(token));
            console.log("Wallet update response:", response);
            Alert.alert("Success", "Payment was successful", [ { text: "Ok", onPress: () => router.push("/bookings"), }, ]);
        } catch (error:any) {
            console.log("Error in SuccessHandler:", error.response);
            Alert.alert("Sorry", error.response.data.message || "An error occurred. Please try again later", [ { text: "Ok", onPress: () => router.push("/bookings"), }, ]);
        }
    }
  
    const paynow = async () => {  
        popup.newTransaction({
            email: user?.email,
            amount: amount1,
            reference: `TNX_${Date.now()}`,
            onSuccess: async(res: any) => {
                await SuccessHandler();
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

    const makepayment = async () => {
        try {
            if (avail?.id === 'DC') {
            await paynow();
            } else if (avail?.id === 'C') {
            await paybycash();
            } else if (avail?.id === 'T') {
            // await paybytransfer();
            } else {
                await paybywallet();
            }
        } catch (error) {
            console.error('Payment error:', error);
        }
    };

    const renegotiatehandler = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return Alert.alert("Invalid", "Please enter a valid amount")
        }

        try {
            setIsFetching(true);
            const response = await bidnegotiate(bidid, amount, decryptData(token));
            Alert.alert("Success", "Your offer has been sent to the artisan", [{ text: "Ok", onPress: () => [setAmount(null), setFormattedAmount(''), closePopup(), router.back()], }, ]);
        } catch (error: any) {
            console.error("Renegotiate error:", error);
            Alert.alert("Error", error.response.data.message || "An error occurred. Please try again later");
            setIsFetching(false);
        }
    }

    const formatDate = (dateString:any) => {
        if (!dateString) return "";
        
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
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

    const handleChange = (text:any) => {
      // Format the text as the user types
      const formattedValue = formatNumber(text);
      const newnumber = formatNumber2(text)
      setAmount(newnumber)
      setFormattedAmount(formattedValue)
    };

    const declinehandler = async (id:any) => {
        try {
            setIsFetching(true);
            const response = await biddecline(id, token);
            Alert.alert("Success", "You have sucessfully declined the artisan's bid", [{ text: "Ok", onPress: () => [router.back()], }, ]);
        } catch (error: any) {
            console.error("Renegotiate error:", error.response);
            Alert.alert("Error", error.response.data.message || "An error occurred. Please try again later");
            setIsFetching(false);
        }
    }

    if(isFetching){
        return <LogoSpinner lightColor='' darkColor=''/>
    }
    
    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>            
            <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
                <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
            </GoBack>

            <View style={{margin:15}}/>
            
            <ThemedText type="titleMedium">Pending Bid Requests</ThemedText>
            
            <View style={{margin:15}}/>

            {fetchedRequest.length === 0 ?
                <Animated.ScrollView showsVerticalScrollIndicator={false}>  
                    <EmptyScreen
                        mainText="You have no bid's yet"
                        subText="Bid's will appear once artisan's start bidding on the request."
                        imageSource={require('@/assets/images/history.png')}
                    />
                </Animated.ScrollView>    
                :
            
                <FlatList
                    data={fetchedRequest}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        
                        <ThemedView style={{padding:20, borderColor: Colors.gray9, boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',   borderRadius:15, marginBottom:15}}>

                            <ThemedView style={{flexDirection: 'row', justifyContent:'space-between', alignItems:'center'}}>
                                <View style={{flexDirection:'row'}}>
                                    <View>
                                        <Image
                                            source={require('@/assets/images/sman.png')}
                                            style={styles.sman}
                                        />
                                    </View>
                                    <View style={{ marginLeft:10}}>
                                        <ThemedText type='smallBold'>{item.last_name+" "+item.first_name}</ThemedText>
                                        <ThemedText style={{color: Colors.gray9}}>{item.sub_cat_name}</ThemedText>
                                    </View>
                                </View>

                                <ThemedText type='subtitle' style={{color: Colors.green}}>
                                    {item.proposed_price.toLocaleString('en-NG', {
                                        style: 'currency',
                                        currency: 'NGN',
                                    })}
                                </ThemedText>
                            </ThemedView>

                            <View style={{ margin:10}}/>

                            {/* details */}
                            <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flex: 1, borderRightWidth: 0.5, borderRightColor: Colors.gray1 }}>
                                    <ThemedText style={{color: Colors.gray1}}>Phone Number</ThemedText>
                                    <View style={{margin:3}}/>
                                    <ThemedText style={{color: Colors.gray9}}>{item.phone && `+234${item.phone.startsWith('0') ? item.phone.slice(1) : item.phone}`}</ThemedText>
                                </View>
                                <View style={{margin:10}}/>
                                <View style={{ paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center', padding:7, backgroundColor:Colors.lightgray, borderRadius:5 }}>
                                    <FontAwesome6 name="location-crosshairs" size={16} color={Colors.wallet} />
                                </View>
                            </ThemedView>


                            <View style={{ marginTop:10, marginBottom:10, marginRight:60, borderBottomWidth: 0.5, borderBottomColor: Colors.gray1,}}/>

                            {/* location */}
                            <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/* Left block takes up remaining space */}
                                <View style={{ flex: 1, borderRightWidth: 0.5, borderRightColor: Colors.gray1, paddingRight: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <ThemedText style={{ color: item.available === 'Y' ? Colors.green4 : Colors.red }}>Available </ThemedText>
                                        {item.available === 'Y' ?
                                            <MaterialCommunityIcons name="check-decagram" size={20} color={Colors.green4} />
                                        :
                                            <MaterialIcons name="cancel" size={20} color={Colors.red} />
                                        }
                                    </View>
                                
                                    <View style={{margin:3}}/>
                                
                                    <View style={{ flexDirection: 'row', gap: 5 }}>
                                        <ThemedText>{item.lga}</ThemedText>
                                        <ThemedText>{item.State}</ThemedText>
                                    </View>
                                </View>
                                <View style={{margin:10}}/>
                                {/* Icon block only takes needed space */}
                                <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8, padding:7, backgroundColor:Colors.lightgray, borderRadius:5 }}>
                                    <SimpleLineIcons name="location-pin" size={16} color={Colors.wallet} />
                                </View>
                            </ThemedView>

                            <View   
                                style={{
                                    alignSelf: 'center',
                                    width: 1,
                                    height: 30, // adjust based on spacing
                                    borderLeftWidth: 1,
                                    borderStyle: 'dashed',
                                    position:'absolute',
                                    borderColor: color,
                                    bottom:120,
                                    right:36,
                                }}
                            />
                            
                            <View style={{ margin:10}}/>

                            {/* buttons */}
                            <ThemedView style={{flexDirection:'row', justifyContent:'flex-end'}}>
                                <ThemedButton style={{padding:10}} onPress={() => [Alert.alert('Confirm', 'Decline artisans bid', [
                                    {
                                        text:'No',
                                        onPress: () => {}
                                    },
                                    {
                                        text: 'Yes',
                                        onPress: () => declinehandler(item.id)
                                    }
                                ])]}>
                                    <ThemedText style={{color: Colors.red}}>Decline</ThemedText>
                                </ThemedButton>
                                {item.negotiable === 'Y' &&
                                    <ThemedButton style={{padding:10}} onPress={() => [openPopup(), setBidid(item.id), setRenegotiateData({service_name: item.sub_cat_name, date: item.help_date, time: item.help_time})]}>
                                        <ThemedText style={{color: Colors.red}}>Negotiate</ThemedText>
                                    </ThemedButton>
                                }

                                <View style={{margin:5  }}/>

                                <ThemedButton style={{paddingLeft:20, paddingRight:20, backgroundColor:Colors.green, borderRadius:40, justifyContent:'center'}} onPress={() => [openPopup1(), setAmount1(item.proposed_price), setBidid(item.id)]} >
                                    <ThemedText style={{color:'#fff'}}>Accept</ThemedText>
                                </ThemedButton>
                            </ThemedView>
                        </ThemedView>
                    )}
                />
            }

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
                    { transform: [{ translateY: slideAnim }], backgroundColor: color1 },
                ]}
            >


                <View style={{margin:5}}/>
                
                <ThemedView style={{flexDirection:'row', alignItems:'center'}}>
                    <View style={{flex:1, alignItems:'center', marginLeft:15}}>
                        <ThemedText type='titleMedium'>Renegotiate Offer</ThemedText>
                    </View>
                    <TouchableOpacity onPress={closePopup}>
                        <MaterialIcons name="cancel" size={24} color={Colors.green} />
                    </TouchableOpacity>
                </ThemedView>

                <View style={{margin:6}}/>

                <ThemedText style={{textAlign:'center', color: Colors.gray9}} type='titleLight'>Would you like to renegotiate an offer</ThemedText>
                <ThemedText style={{textAlign:'center', color: Colors.gray9}} type='titleLight'>and proceed with this booking?</ThemedText>

                <View style={{margin:6}}/>

                <ThemedView style={{padding:20, backgroundColor:Colors.lightgray, flex:1, borderColor: Colors.gray9, borderWidth:0.5, borderRadius:15, marginBottom:15}}>

                    <View style={{flexDirection:'row', justifyContent:'space-between', padding:10}}>
                        <ThemedText style={{color: '#000'}}>Service Name</ThemedText>
                        <ThemedText style={{color: Colors.wallet}}>{renegotiatedata.service_name}</ThemedText>
                    </View>

                    <View style={{flexDirection:'row', justifyContent:'space-between',padding:10}}>
                        <ThemedText style={{color: '#000'}}>Date</ThemedText>
                        <ThemedText style={{color: Colors.wallet}}>{formatDate(renegotiatedata.date)}</ThemedText>
                    </View>

                    <View style={{flexDirection:'row', justifyContent:'space-between', padding:10}}>
                        <ThemedText style={{color: '#000'}}>Time</ThemedText>
                        <ThemedText style={{color: Colors.wallet}}>{renegotiatedata.time}</ThemedText>
                    </View>
                </ThemedView>   

                <ThemedText>Enter your new offer</ThemedText>
                <View style={{margin:5}}/> 
                <ThemedView style={[styles.container, {marginBottom:5, backgroundColor: Colors.offwhite1}]}>
                    <View style={{flexDirection:'row', flex:1, justifyContent:'center', alignItems:'center'}}>
                        {/* <MaterialCommunityIcons name="currency-ngn" size={20} color={'black'} /> */}
                        <ThemedText style={{color:Colors.gray9, fontSize:16}}>NGN</ThemedText>
                        <TextInput placeholder={'Amount'} 
                            style={[styles.input, isInvalid && styles.invalid, {}]} 
                            onFocus={() => setIsInvalid(false)}
                            value={formattedamount}
                            onChangeText={handleChange}
                            placeholderTextColor={Colors.gray9}
                            keyboardType='number-pad'
                            maxLength={9}
                        />
                    </View>
                    <Feather name="edit" size={20} color={Colors.wallet} />
                </ThemedView>

                <View style={{margin:6}}/>

                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <View style={{marginRight:5}}>
                        {data1.map((item: any, key: any) => 
                            <View key={key}>
                                <TouchableOpacity style={{padding: 15, borderRadius:10, flexDirection:'row', justifyContent:'space-between'}} onPress={() => setavail1(item)}>
                                    <TouchableOpacity style={styles.outer} onPress={() => setavail1(item)}>
                                        {avail1 === item && <View style={styles.inner}/>}
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    <View>
                        <ThemedText>I have read an agreed to the <ThemedText style={{color: Colors.green}}>terms and</ThemedText></ThemedText>
                        <ThemedText style={{color: Colors.green}}>conditons.</ThemedText>
                    </View>
                </View>

                <View style={{margin:4}}/>

                <ThemedButton onPress={renegotiatehandler} enabled={!avail1 ? false : true} style={{padding:15, backgroundColor:Colors.green, borderRadius:40, justifyContent:'center'}}>
                    <ThemedText style={{textAlign:'center', color:"#fff"}}>Send to Artisan</ThemedText>
                </ThemedButton>
                
            </Animated.View>
        </Modal>

        <Modal
            transparent
            visible={modalVisible1}
            animationType="slide" 
            onRequestClose={closePopup1}
        >

            <TouchableOpacity style={styles.overlay} onPress={() => [closePopup1(), setavail("")]} />

            <Animated.View
                style={[
                    styles.popup,
                    { transform: [{ translateY: slideAnim }], backgroundColor: color1 },
                ]}
            >


                <View style={{margin:5}}/>
                
                <ThemedView style={{flexDirection:'row', alignItems:'center'}}>
                    <View style={{flex:1, alignItems:'center', marginLeft:15}}>
                        <ThemedText type='titleMedium'>Select Payment Method</ThemedText>
                    </View>
                    <TouchableOpacity onPress={() => [closePopup1(), setavail("")]}>
                        <MaterialIcons name="cancel" size={24} color={Colors.green} />
                    </TouchableOpacity>
                </ThemedView>

                <View style={{margin:6}}/>

                <ThemedText style={{textAlign:'center', color: Colors.green}} type='titleMedium'>
                    {!amount1 ? "0.00" : amount1.toLocaleString('en-NG', {
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
                                    {!amount1 ? "0.00" : amount1.toLocaleString('en-NG', {
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
                <ThemedButton onPress={() => avail.id === makepayment()} enabled={!avail ? false : true} style={{backgroundColor: Colors.green, padding: 15, borderRadius:30, alignItems:'center'}}>
                    <ThemedText style={{color: '#fff'}}>Make Payment</ThemedText>
                </ThemedButton>
            </Animated.View>
        </Modal>
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
    shadow:{
        marginBottom: 20,
        borderRadius: 20, 
        boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
    },
    sman:{
        height: 50,
        width: 50,
        borderRadius:5
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
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container1:{
        borderWidth:0.2, borderColor: Colors.gray9, padding:18, borderRadius:15, 
        backgroundColor: Colors.bookingbackground
    },
    input: {
        fontSize:16,
        paddingLeft: 6,
        padding:12,
        borderRadius:10,
        backgroundColor: Colors.offwhite1,
        color: Colors.gray9,
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
})