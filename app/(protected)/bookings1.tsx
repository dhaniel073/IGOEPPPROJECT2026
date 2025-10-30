import GoBack from '@/components/GoBack'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, convertToReadableDateTime, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { cancelrequests, fetchrequestbyid } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { AntDesign, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import React, { useLayoutEffect, useState } from 'react'
import { Alert, Animated, Dimensions, FlatList, Image, Modal, StyleSheet, TextInput, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { height } = Dimensions.get('window');


export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};


export default function bookings1({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);

    
    const [fetchedRequest, setFetchedRequest] = useState<any[]>([])
    const {bookingId} = useLocalSearchParams();
    const [isFetching, setIsFetching] = React.useState(false);
    const navigation = useNavigation();
    const {user, token, updateUserFields, logout} = useAuth();
    const [reason, setReason] = useState<any>("No longer needed");

    useLayoutEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                setIsFetching(true);
                const response = await fetchrequestbyid(bookingId, decryptData(token));
                setFetchedRequest(response);
            } catch (error: any) {
                console.error("Error fetching pending requests:", error);
                if (error.response?.status === 401) {
                    Alert.alert("Session expired", "Please log in again.");
                    await logout(); // from your AuthContext
                    router.replace("/login"); // navigate to login screen
                } else {
                    Alert.alert('Error', 'Unable to load notification settings.')
                }
            } finally {
                setIsFetching(false);
            }
        };

        const unsubscribe = navigation.addListener("focus", fetchPendingRequests);

        return unsubscribe;
    }, []);

    const cancelrequesthandler = async () => {
        closePopup2();
        try {
            setIsFetching(true);
            const response = await cancelrequests(bookingId, decryptData(token), reason);
            console.log(response);
            openPopup();
        } catch (error) {
            console.error("Error cancelling request:", error);
        } finally {
            setIsFetching(false);
        }
        
    }

    const handleSubmit = () => {
        if (!reason.trim()) {
            alert('Please enter a reason before submitting.');
            return;
        }
        cancelrequesthandler();
        setReason('');
    };

    const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen
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

    const openPopup2 = () => {
        setModalVisible2(true);
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
        }).start(() => setModalVisible2(false)); // Close after animation
    };

    console.log(fetchedRequest);

    if(isFetching){
        return <LogoSpinner lightColor='' darkColor=''/>
    }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>            
        <FlatList
            data={fetchedRequest}
            renderItem={({ item }) => (
                <View>
                    <ThemedView
                        style={{
                        padding: 20,
                        borderColor: Colors.gray9,
                        borderWidth: 0.5,
                        borderRadius: 15,
                        marginBottom: 15,
                        }}
                    >
                        {
                        item.image === null ? <Image source={require('@/assets/images/bookings.png')} style={{ width: '100%', height: 150, borderRadius: 10 }} /> 
                        : 
                        <Image source={{ uri: `https://phixotech.com/igoepp/public/subcategory/${item.image}` }} style={{ width: '100%', height: 150, borderRadius: 10 }} />
                        }
                        
                        <View style={{ margin: 10 }} />

                        <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <ThemedText type="titleLight">{item.sub_cat_name}</ThemedText>
                        <ThemedView
                            style={{
                            backgroundColor: Colors.yellow1,
                            alignSelf: 'flex-start',
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                            borderRadius: 4,
                            }}
                        >
                            <ThemedText style={{ color: '#fff' }} type="smallBold">
                            #{item.id}
                            </ThemedText>
                        </ThemedView>
                        </ThemedView>

                        <View style={{ margin: 7 }} />

                        <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <ThemedText type="title">NGN {!item.agreed_price ? '0.00' : item.agreed_price.toLocaleString()}</ThemedText>
                        <ThemedView
                            style={{
                            paddingHorizontal: 8,
                            backgroundColor: item.help_status === 'A' ? Colors.yellow1 : item.help_status === 'N' ? "#FD6922" : item.help_status === "C" ? Colors.green : '#FD6922',
                            alignSelf: 'flex-start',
                            borderRadius: 10,
                            }}
                        >
                            <ThemedText type="smallMedium" style={{ color:'#fff'}}>
                            {item.help_status === 'N' ? 'Pending' : item.help_status === 'A' ? 'Accepted' : item.help_status === 'C' ? 'Completed' : item.help_status === 'X' ? 'Cancelled' : item.help_status}
                            </ThemedText>
                        </ThemedView>
                        </ThemedView>

                        <View style={{ margin: 10 }} />

                        <ThemedView style={{ flexDirection: 'row' }}>
                        <MaterialCommunityIcons name="map-marker-outline" size={16} color={color} style={{ marginRight: 10 }} />
                        <ThemedText style={{ color: Colors.gray9 }}>{item.help_location+", "+item.help_lga+" "+item.help_state+"."}</ThemedText>
                        </ThemedView>

                        {item.help_status === 'A' && (
                            <TouchableOpacity
                            activeOpacity={0.7}
                            style={{ position: 'absolute', bottom: '32%', right: 20 }}
                            onPress={() =>
                                router.push({
                                pathname: '/(protected)/chatscreen',
                                params: { id: item?.id, helperId: item?.assigned_helper, helper_user_id: item.helper_user_id },
                                })
                            }
                            >
                            <Ionicons name="chatbubbles" size={32} color={Colors.green} />
            
                            {/* Unread badge */}
                            {item.chat_unread_customer > 0 && (
                                <View
                                style={{
                                    position: 'absolute',
                                    top: -5,
                                    right: -5,
                                    backgroundColor: Colors.red,
                                    minWidth: 18,
                                    height: 18,
                                    borderRadius: 9,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingHorizontal: 4,
                                }}
                                >
                                <ThemedText style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                                    {item.chat_unread_customer > 100 ? '99+' : item.chat_unread_customer}
                                </ThemedText>
                                </View>
                            )}
                            </TouchableOpacity>
                        )}

                        <View style={{ margin: 7 }} />

                        <ThemedView style={{ flexDirection: 'row' }}>
                        <AntDesign name="calendar" size={16} color={color} style={{ marginRight: 10 }} />
                        <ThemedText style={{ color: Colors.gray9 }}>{convertToReadableDateTime(item.help_date, item.help_time)}</ThemedText>
                        </ThemedView>

                        <View style={{ margin: 7 }} />

                        <ThemedView style={{ flexDirection: 'row' }}>
                        <Ionicons name="person-outline" size={16} color={color} style={{ marginRight: 10 }} />
                        <ThemedText style={{ color: Colors.gray9 }}>{!item.helper_name ? "Not assigned" : item.helper_name}</ThemedText>
                        </ThemedView>

                        <View style={{ margin: 10 }} />

                        {item.help_status !== 'A' && item.help_status !== 'C' && item.help_status !== 'X' &&
                        <ThemedButton
                            style={{}}
                            onPress={() => router.push({pathname:'/bidspending',  params: { bookingId: item.id } })}
                        >
                            <ThemedText style={{ color: Colors.green }} type="defaultSemiBold">
                                View Pending Requests({item.bid_count})
                            </ThemedText>
                        </ThemedButton>
                        }

                        <View style={{ height: 1, backgroundColor: Colors.gray9, marginTop: 10 }} />
                    </ThemedView>
                </View>

            )}
            keyExtractor={(item:any) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                <>
                    <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
                        <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
                    </GoBack>
                    <View style={{margin:15}}/> 
                    <ThemedText type="titleMedium">Bookings</ThemedText>
                    <ThemedText style={{color: Colors.gray9}}>View bookings</ThemedText>

                    <View style={{margin:15}}/>
                </>
            }

            ListFooterComponent={
                <>
                    <View style={{margin:10}}/>
                    <ThemedText type='subtitle'>Payment Details</ThemedText>

                    <View style={{margin:10}}/>

                    <ThemedView style={{padding:15, backgroundColor: Colors.lightgray, borderRadius:10}}>
                        <View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:8, paddingBottom:8, borderBottomColor: Colors.offwhite2, borderBottomWidth:0.7 }}>
                            <ThemedText style={{color: Colors.blacktext}}>Price</ThemedText>
                            {fetchedRequest.length > 0 && (
                                <ThemedText style={{ color: Colors.blacktext }}>
                                    {!fetchedRequest[0].agreed_price ? '₦0.00' : fetchedRequest[0].agreed_price.toLocaleString('en-NG', {
                                        style: 'currency',
                                        currency: 'NGN',
                                    })}
                                </ThemedText>
                            )}
                        </View>

                        <View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:8, paddingBottom:8, borderBottomColor: Colors.offwhite2, borderBottomWidth:0.7}}>
                            <ThemedText style={{color: Colors.blacktext}}>Subtotal</ThemedText>
                            {fetchedRequest.length > 0 && (
                                <ThemedText style={{ color: Colors.blacktext }}>
                                    {!fetchedRequest[0].agreed_price ? '₦0.00' : fetchedRequest[0].agreed_price.toLocaleString('en-NG', {
                                        style: 'currency',
                                        currency: 'NGN',
                                    })}
                                </ThemedText>
                            )}
                        </View>

                        <View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:8, paddingBottom:8, borderBottomColor: Colors.offwhite2, borderBottomWidth:0.7}}>
                            <ThemedText style={{color: Colors.blacktext}}>Commission</ThemedText>
                            <ThemedText style={{color: Colors.blacktext}}>₦0.00</ThemedText>
                        </View>

                        <View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:8, paddingBottom:8}}>
                            <ThemedText style={{color: Colors.blacktext}}>Total Amount</ThemedText>
                            {fetchedRequest.length > 0 && (
                                <ThemedText style={{ color: Colors.blacktext }}>
                                    {!fetchedRequest[0].agreed_price ? '₦0.00' : fetchedRequest[0].agreed_price.toLocaleString('en-NG', {
                                        style: 'currency',
                                        currency: 'NGN',
                                    })}
                                </ThemedText>
                            )}
                        </View>
                    </ThemedView>


                    {fetchedRequest.length > 0 && fetchedRequest[0].help_status === 'N' ?
                        <>
                            <View style={{margin:10}}/>
                            <ThemedButton style={{backgroundColor: Colors.red, padding: 15, borderRadius:30, alignItems:'center'}} onPress={() => Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking?", [
                                { text: "No" }, { text: "Yes", onPress: () => openPopup2() }] )    
                            }>
                                <ThemedText  style={{color: "#fff"}}>Cancel Booking</ThemedText>
                            </ThemedButton>
                        </>
                        :
                        ""
                    }

                    <View style={{margin:5}}/>

                    <ThemedButton style={{ padding: 15, borderRadius:30, alignItems:'center'}} onPress={openPopup1}>
                        <ThemedText style={{color: color}}>Check Details</ThemedText>
                    </ThemedButton>
                    <View style={{margin:10}}/>
                </>
            }
        />
            
        
        <Modal
            transparent
            visible={modalVisible}
            animationType="slide" 
            // onRequestClose={closePopup}
        >

            <TouchableOpacity style={styles.overlay} onPress={() => {}} />

            <Animated.View
                style={[
                    styles.popup,
                    { transform: [{ translateY: slideAnim }], backgroundColor: color1 },
                ]}
            >


                <View style={{margin:25}}/>

                <FontAwesome5 name="exclamation-circle" size={50} color={Colors.red} />
                
                <View style={{margin:10}}/>
                
                <ThemedView style={{justifyContent:'center', alignSelf:'center'}}>
                    <ThemedText type='subtitle' style={{textAlign:'center', fontSize:18, fontFamily: 'poppinsBold'}}>Your booking has</ThemedText>
                    <ThemedText type='subtitle' style={{textAlign:'center',  fontSize:18, fontFamily: 'poppinsBold'}}>been canceled</ThemedText>
                </ThemedView>

                <View style={{margin:15}}/>

                <ThemedButton style={{ padding: 15, borderRadius:30, alignItems:'center'}} onPress={() => router.back()}>
                    <ThemedText type='smallBold' style={{color: Colors.wallet}}>Go Back</ThemedText>
                </ThemedButton>

                <View style={{margin:5}}/>
                
            </Animated.View>
        </Modal>


        <Modal
            transparent
            visible={modalVisible1}
            animationType="slide" 
            onRequestClose={closePopup1}
        >

            <TouchableOpacity style={styles.overlay} onPress={() => [closePopup1()]} />

            <Animated.View
                style={[
                    styles.popup,
                    { transform: [{ translateY: slideAnim }], backgroundColor: color1 },
                ]}
            >

                <View style={{margin:25}}/>

                <ThemedView style={{justifyContent:'center', alignSelf:'center'}}>

                    <ThemedText>Details</ThemedText>
                    
                </ThemedView>

                <View style={{margin:25}}/>
                
            </Animated.View>
        </Modal>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible2}
            onRequestClose={closePopup2}
        >
            <View
                style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                }}
            >
                <ThemedView
                style={{
                    width: '85%',
                    backgroundColor: '#fff',
                    borderRadius: 15,
                    padding: 20,
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: 5,
                }}
                >
                <ThemedText type="title" style={{ marginBottom: 10 }}>
                    Cancel Request
                </ThemedText>

                <ThemedText style={{ color: Colors.gray9, marginBottom: 10 }}>
                    Please provide a reason for canceling this request:
                </ThemedText>

                <TextInput
                    style={{
                    height: 100,
                    borderColor: Colors.gray9,
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 10,
                    textAlignVertical: 'top',
                    color: Colors.blacktext,
                    marginBottom: 20,
                    }}
                    multiline
                    numberOfLines={4}
                    placeholder="Enter reason..."
                    placeholderTextColor={Colors.gray9}
                    value={reason}
                    onChangeText={setReason}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                    <TouchableOpacity
                    onPress={closePopup2}
                    style={{
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        borderRadius: 8,
                        backgroundColor: Colors.gray9,
                    }}
                    >
                    <ThemedText style={{ color: '#fff' }}>Cancel</ThemedText>
                    </TouchableOpacity>

                    <ThemedButton
                    style={{
                        backgroundColor: Colors.red,
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        borderRadius: 8,
                    }}
                    onPress={handleSubmit}
                    >
                    <ThemedText style={{ color: '#fff' }}>Submit</ThemedText>
                    </ThemedButton>
                </View>
                </ThemedView>
            </View>
        </Modal>

        {/* <Modal
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


                <View style={{margin:25}}/>

            </Animated.View>
        </Modal> */}

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    image:{
        width: "100%",
        height: 150,
        borderRadius: 8,
        alignSelf:'center'
    },
    line1: {
        marginTop:15,
        borderTopWidth:0.5,
        borderTopColor: Colors.gray9
    },
    popup: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
        // borderRadius: 12,
        justifyContent:'center',
        alignItems:'center'
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
})