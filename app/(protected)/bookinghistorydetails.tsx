import GoBack from '@/components/GoBack'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, convertToReadableDateTime, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { fetchrequestbyid } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import React, { useLayoutEffect, useState } from 'react'
import { Alert, Animated, Dimensions, FlatList, Image, Modal, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { height } = Dimensions.get('window');


export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};


export default function bookingshistorydetails({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [modalVisible1, setModalVisible1] = useState(false);

    
    const [fetchedRequest, setFetchedRequest] = useState<any[]>([])
    const {bookingId} = useLocalSearchParams();
    const [isFetching, setIsFetching] = React.useState(false);
    const navigation = useNavigation();
    const {user, token, updateUserFields, logout} = useAuth();

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

    const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen
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
                        <Image source={{ uri: `https://igoeppms.com/igoepp/public/subcategory/${item.image}` }} style={{ width: '100%', height: 150, borderRadius: 10 }} />
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

                        <View style={{ margin: 4 }} />

                        <ThemedView style={{ flexDirection: 'row' }}>
                        <AntDesign name="calendar" size={16} color={color} style={{ marginRight: 10 }} />
                        <ThemedText style={{ color: Colors.gray9 }}>{convertToReadableDateTime(item.help_date, item.help_time)}</ThemedText>
                        </ThemedView>

                        <View style={{ margin: 4 }} />

                        <ThemedView style={{ flexDirection: 'row' }}>
                        <Ionicons name="person-outline" size={16} color={color} style={{ marginRight: 10 }} />
                        <ThemedText style={{ color: Colors.gray9 }}>{!item.helper_name ? "Not assigned" : item.helper_name}</ThemedText>
                        </ThemedView>
                        
                        <View style={{ margin: 4 }} />

                        <ThemedView style={{ flexDirection: 'row' }}>
                        <Ionicons name="person-outline" size={16} color={color} style={{ marginRight: 10 }} />
                        <ThemedText style={{ color: Colors.gray9 }}>Frequency: {item.help_frequency}</ThemedText>
                        </ThemedView>

                        {
                            item.help_frequency !== 'One-off' &&
                            <>
                                <View style={{ margin: 4 }} />

                                <ThemedView style={{ flexDirection: 'row' }}>
                                <Ionicons name="person-outline" size={16} color={color} style={{ marginRight: 10 }} />
                                <ThemedText style={{ color: Colors.gray9 }}>Frequency Status: {item.cancel_frequency === 'Y' ? "Inactive" : "Active" }</ThemedText>
                                </ThemedView>
                            </>
                        }

                        <View style={{ margin: 10 }} />

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

                    <View style={{margin:6}}/>
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

               <View style={{margin:10}}/>
                <ThemedText type='subtitle' style={{textAlign:'center', flex:1}}>Request Details</ThemedText>
                <FlatList
                    data={fetchedRequest}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (

                        <ThemedView style={{backgroundColor: Colors.gray6, marginHorizontal:10, paddingHorizontal:20, paddingVertical:20}}>
                        

                            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                <ThemedText style={{color: '#000'}} type='small'>Id</ThemedText>
                                <ThemedText style={{color:Colors.wallet }} type='small'>{item.id}</ThemedText>
                            </View>

                            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                <ThemedText style={{color: '#000'}} type='small'>Price</ThemedText>
                                <ThemedText style={{color:Colors.wallet }} type='small'>{item.agreed_price === null ? '0.00' : item.agreed_price}</ThemedText>
                            </View>

                            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                <ThemedText style={{color: '#000'}} type='small'>Description</ThemedText>
                                <ThemedText style={{color:Colors.wallet}} type='small'>{item.help_desc}</ThemedText>
                            </View>

                            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                <ThemedText style={{color: '#000'}} type='small'>Help Intervals</ThemedText>
                                <ThemedText style={{color:Colors.wallet,  textAlign:'right', }} type='small'>{item.help_frequency}</ThemedText>
                            </View>

                            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                <ThemedText style={{color: '#000'}} type='small'>Landmark</ThemedText>
                                <ThemedText style={{color:Colors.wallet, textAlign:'right', }} type='small'>{item.help_landmark}</ThemedText>
                            </View>

                            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                <ThemedText style={{color: '#000'}} type='small'>Request Type</ThemedText>
                                <ThemedText style={{color:Colors.wallet, textAlign:'right', }} type='small'>{item.preassessment_flg === "N" ? "Normal Request" : "Preassessment Request"}</ThemedText>
                            </View>

                            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                <ThemedText style={{color: '#000'}} type='small'>Address</ThemedText>
                                <ThemedText style={{color:Colors.wallet, maxWidth:210, textAlign:'right', }} type='small'>{item.help_location}</ThemedText>
                            </View>

                            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                <ThemedText style={{color: '#000'}} type='small'>Country</ThemedText>
                                <ThemedText style={{color:Colors.wallet, textAlign:'right', }} type='small'>{item.help_country}</ThemedText>
                            </View>
                        
                        <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                <ThemedText style={{color: '#000'}} type='small'>State</ThemedText>
                                <ThemedText style={{color:Colors.wallet,  textAlign:'right', }} type='small'>{item.help_state}</ThemedText>
                            </View>
                            
                            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                <ThemedText style={{color: '#000'}} type='small'>L.G.A</ThemedText>
                                <ThemedText style={{color:Colors.wallet}} type='small'>{item.help_lga}</ThemedText>
                            </View>

                            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                <ThemedText style={{color: '#000'}} type='small'>Help Size</ThemedText>
                                <ThemedText style={{color:Colors.wallet}} type='small'>{item.help_size}</ThemedText>
                            </View>

                            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                <ThemedText style={{color: '#000'}} type='small'>Status</ThemedText>
                                <ThemedText style={{color:Colors.wallet}} type='small'>{item.help_status === "A" ? "Active" : item.help_status === "N" ? "Negotiating" : item.help_status === "C" ? "Completed" : "Cancelled"}</ThemedText>
                            </View>

                            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                <ThemedText style={{color: '#000'}} type='small'>Date</ThemedText>
                                <ThemedText style={{color:Colors.wallet}} type='small'>{item.help_date}</ThemedText>
                            </View>

                            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                <ThemedText style={{color: '#000'}} type='small'>Time</ThemedText>
                                <ThemedText style={{color:Colors.wallet}} type='small'>{item.help_time}</ThemedText>
                            </View>

                            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                                <ThemedText style={{color: '#000'}} type='small'>Security Code</ThemedText>
                                <ThemedText style={{color:Colors.wallet}} type='small'>{item.security_code}</ThemedText>
                            </View>
                        </ThemedView>
                    )} />
            </Animated.View>
        </Modal>
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