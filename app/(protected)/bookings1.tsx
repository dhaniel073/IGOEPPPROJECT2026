import CustomDropdown from '@/components/CustomDropdown'
import GoBack from '@/components/GoBack'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { validateSatisfyRequest } from '@/components/validateSatisfyRequest'
import { Colors, convertToReadableDateTime, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { cancelrequests, customernotsatisfied, customersatisfied, fetchrequestbyid, PUBLIC_API_BASE_URL } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { AntDesign, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import React, { useLayoutEffect, useState } from 'react'
import { Alert, Animated, Dimensions, FlatList, Image, Modal, StyleSheet, TextInput, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { height } = Dimensions.get('window');


export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor: { dark: string; light: string };
};


export default function bookings1({
    lightColor,
    darkColor,
    headerBackgroundColor,
}: Props) {

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        satisfy: "",
        reason: ""
    });


    const [fetchedRequest, setFetchedRequest] = useState<any[]>([])
    const { bookingId } = useLocalSearchParams();
    const [isFetching, setIsFetching] = React.useState(false);
    const navigation = useNavigation();
    const { user, token, updateUserFields, logout } = useAuth();
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


    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleRequest = () => {
        console.log(formData)
        const validationErrors = validateSatisfyRequest(formData);
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
        return satisfyhandle();
    };

    const satisfyhandle = async () => {
        try {
            setIsFetching(true);

            let response;

            if (formData.satisfy === "Y") {
                // Run satisfied API
                response = await customersatisfied(
                    formData.id,
                    decryptData(token)
                );
            } else {
                // Run NOT satisfied API
                response = await customernotsatisfied(
                    formData.id,
                    formData.reason,
                    decryptData(token)
                );
            }

            console.log(response);
            Alert.alert('Successful', 'You have successfully satisfied the handyman', [
                {
                    text: "OK",
                    onPress: () => router.push('/(protected)/(tabs)')
                }
            ])

        } catch (error: any) {
            alert(
                "Booking failed. Please try again or contact support if the issue continues."
            );
            console.log(error.response);
            return;
        } finally {
            setIsFetching(false);
        }
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

    const openPopup3 = () => {
        setModalVisible3(true);
        Animated.timing(slideAnim, {
            toValue: 0, // Slide to the screen
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closePopup3 = () => {
        Animated.timing(slideAnim, {
            toValue: height, // Slide back down
            duration: 300,
            useNativeDriver: true,
        }).start(() => setModalVisible3(false)); // Close after animation
    };


    console.log(fetchedRequest);

    if (isFetching) {
        return <LogoSpinner lightColor='' darkColor='' />
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }} edges={['top', 'bottom']}>
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
                                    <Image source={{ uri: `${PUBLIC_API_BASE_URL}subcategory/${item.image}` }} style={{ width: '100%', height: 150, borderRadius: 10 }} />
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
                                    <ThemedText type="smallMedium" style={{ color: '#fff' }}>
                                        {item.help_status === 'N' ? 'Pending' : item.help_status === 'A' ? 'Accepted' : item.help_status === 'C' ? 'Completed' : item.help_status === 'X' ? 'Cancelled' : item.help_status}
                                    </ThemedText>
                                </ThemedView>
                            </ThemedView>

                            <View style={{ margin: 10 }} />

                            <View>
                                <ThemedView style={{ flexDirection: 'row' }}>
                                    <MaterialCommunityIcons name="map-marker-outline" size={16} color={color} style={{ marginRight: 10 }} />
                                    <ThemedText style={{ color: Colors.gray9 }}>{item.help_location + ", " + item.help_lga + " " + item.help_state + "."}</ThemedText>
                                </ThemedView>

                                {item.help_status === 'A' && (
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={{ position: 'absolute', bottom: '10%', right: 0 }}
                                        onPress={() =>
                                            router.push({
                                                pathname: '/(protected)/chatscreen',
                                                params: { id: item?.id, helperId: item?.assigned_helper, helper_user_id: item.helper_user_id },
                                            })
                                        }
                                    >
                                        <Ionicons name="chatbubbles" size={22} color={Colors.green} />

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
                            </View>


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
                                <MaterialIcons name="mode" size={16} color={color} style={{ marginRight: 10 }} />
                                <ThemedText style={{ color: Colors.gray9 }}>Frequency: {item.help_frequency}</ThemedText>
                            </ThemedView>

                            {
                                item.help_frequency !== 'One-off' &&
                                <>
                                    <View style={{ margin: 4 }} />

                                    <ThemedView style={{ flexDirection: 'row' }}>
                                        <MaterialIcons name="mode" size={16} color={color} style={{ marginRight: 10 }} />
                                        <ThemedText style={{ color: Colors.gray9 }}>Frequency Status: {item.cancel_frequency === 'Y' ? "Inactive" : "Active"}</ThemedText>
                                    </ThemedView>
                                </>
                            }


                            <View style={{ margin: 10 }} />

                            {item.help_status !== 'A' && item.help_status !== 'C' && item.help_status !== 'X' &&
                                <ThemedButton
                                    style={{}}
                                    onPress={() => router.push({ pathname: '/bidspending', params: { bookingId: item.id } })}
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
                keyExtractor={(item: any) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
                            <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
                        </GoBack>
                        <View style={{ margin: 6 }} />
                        <ThemedText type="titleMedium">Bookings</ThemedText>
                        <ThemedText style={{ color: Colors.gray9 }}>View bookings</ThemedText>

                        <View style={{ margin: 6 }} />
                    </>
                }

                ListFooterComponent={
                    <>
                        <View style={{ margin: 10 }} />
                        <ThemedText type='subtitle'>Payment Details</ThemedText>

                        <View style={{ margin: 10 }} />

                        <ThemedView style={{ padding: 15, backgroundColor: Colors.lightgray, borderRadius: 10 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, paddingBottom: 8, borderBottomColor: Colors.offwhite2, borderBottomWidth: 0.7 }}>
                                <ThemedText style={{ color: Colors.blacktext }}>Price</ThemedText>
                                {fetchedRequest.length > 0 && (
                                    <ThemedText style={{ color: Colors.blacktext }}>
                                        {!fetchedRequest[0].agreed_price ? '₦0.00' : fetchedRequest[0].agreed_price.toLocaleString('en-NG', {
                                            style: 'currency',
                                            currency: 'NGN',
                                        })}
                                    </ThemedText>
                                )}
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, paddingBottom: 8, borderBottomColor: Colors.offwhite2, borderBottomWidth: 0.7 }}>
                                <ThemedText style={{ color: Colors.blacktext }}>Subtotal</ThemedText>
                                {fetchedRequest.length > 0 && (
                                    <ThemedText style={{ color: Colors.blacktext }}>
                                        {!fetchedRequest[0].agreed_price ? '₦0.00' : fetchedRequest[0].agreed_price.toLocaleString('en-NG', {
                                            style: 'currency',
                                            currency: 'NGN',
                                        })}
                                    </ThemedText>
                                )}
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, paddingBottom: 8, borderBottomColor: Colors.offwhite2, borderBottomWidth: 0.7 }}>
                                <ThemedText style={{ color: Colors.blacktext }}>Commission</ThemedText>
                                <ThemedText style={{ color: Colors.blacktext }}>₦0.00</ThemedText>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, paddingBottom: 8 }}>
                                <ThemedText style={{ color: Colors.blacktext }}>Total Amount</ThemedText>
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
                                <View style={{ margin: 10 }} />
                                <ThemedButton style={{ backgroundColor: Colors.red, padding: 15, borderRadius: 30, alignItems: 'center' }} onPress={() => Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking?", [
                                    { text: "No" }, { text: "Yes", onPress: () => openPopup2() }])
                                }>
                                    <ThemedText style={{ color: "#fff" }}>Cancel Booking</ThemedText>
                                </ThemedButton>
                            </>
                            :
                            ""
                        }

                        {fetchedRequest.length > 0 && fetchedRequest[0].help_status === 'C' && fetchedRequest[0].customer_statisfy === null ?
                            <>
                                <View style={{ margin: 10 }} />
                                <ThemedButton
                                    style={{
                                        backgroundColor: Colors.wallet,
                                        padding: 15, borderRadius: 30, alignItems: 'center'
                                    }}
                                    onPress={() => [setFormData(prev => ({ ...prev, id: fetchedRequest[0].id })), openPopup3()]}
                                >
                                    <ThemedText style={{ color: '#fff' }} type="defaultSemiBold">
                                        Satisfy Request
                                    </ThemedText>
                                </ThemedButton>
                            </>
                            : ""
                        }

                        <View style={{ margin: 5 }} />

                        <ThemedButton style={{ padding: 15, borderRadius: 30, alignItems: 'center' }} onPress={openPopup1}>
                            <ThemedText>Check Details</ThemedText>
                        </ThemedButton>
                        <View style={{ margin: '8%' }} />
                    </>
                }
            />


            <Modal
                transparent
                visible={modalVisible}
                animationType="slide"
            // onRequestClose={closePopup}
            >

                <TouchableOpacity style={styles.overlay} onPress={() => { }} />

                <Animated.View
                    style={[
                        styles.popup,
                        { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: "15%" },
                    ]}
                >


                    <View style={{ margin: 25 }} />

                    <FontAwesome5 name="exclamation-circle" size={50} color={Colors.red} />

                    <View style={{ margin: 10 }} />

                    <ThemedView style={{ justifyContent: 'center', alignSelf: 'center' }}>
                        <ThemedText type='subtitle' style={{ textAlign: 'center', fontSize: 18, fontFamily: 'poppinsBold' }}>Your booking has</ThemedText>
                        <ThemedText type='subtitle' style={{ textAlign: 'center', fontSize: 18, fontFamily: 'poppinsBold' }}>been canceled</ThemedText>
                    </ThemedView>

                    <View style={{ margin: 15 }} />

                    <ThemedButton style={{ padding: 15, borderRadius: 30, alignItems: 'center' }} onPress={() => router.back()}>
                        <ThemedText type='smallBold' style={{ color: Colors.wallet }}>Go Back</ThemedText>
                    </ThemedButton>

                    <View style={{ margin: 5 }} />

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
                        styles.popup1,
                        { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: "15%" },
                    ]}
                >

                    <View style={{ margin: 10 }} />
                    <ThemedText type='subtitle' style={{ textAlign: 'center', flex: 1 }}>Request Details</ThemedText>
                    <FlatList
                        data={fetchedRequest}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (

                            <ThemedView style={{ backgroundColor: Colors.gray6, marginHorizontal: 10, paddingHorizontal: 20, paddingVertical: 20, borderRadius: 10 }}>


                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <ThemedText style={{ color: '#000' }} type='small'>Id</ThemedText>
                                    <ThemedText style={{ color: Colors.wallet }} type='small'>{item.id}</ThemedText>
                                </View>

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <ThemedText style={{ color: '#000' }} type='small'>Price</ThemedText>
                                    <ThemedText style={{ color: Colors.wallet }} type='small'>{item.agreed_price === null ? '0.00' : item.agreed_price}</ThemedText>
                                </View>

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <ThemedText style={{ color: '#000' }} type='small'>Description</ThemedText>
                                    <ThemedText style={{ color: Colors.wallet }} type='small'>{item.help_desc}</ThemedText>
                                </View>

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <ThemedText style={{ color: '#000' }} type='small'>Help Intervals</ThemedText>
                                    <ThemedText style={{ color: Colors.wallet, textAlign: 'right', }} type='small'>{item.help_frequency}</ThemedText>
                                </View>

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <ThemedText style={{ color: '#000' }} type='small'>Landmark</ThemedText>
                                    <ThemedText style={{ color: Colors.wallet, textAlign: 'right', }} type='small'>{item.help_landmark}</ThemedText>
                                </View>

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <ThemedText style={{ color: '#000' }} type='small'>Request Type</ThemedText>
                                    <ThemedText style={{ color: Colors.wallet, textAlign: 'right', }} type='small'>{item.preassessment_flg === "N" ? "Normal Request" : "Preassessment Request"}</ThemedText>
                                </View>

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <ThemedText style={{ color: '#000' }} type='small'>Address</ThemedText>
                                    <ThemedText style={{ color: Colors.wallet, maxWidth: 210, textAlign: 'right', }} type='small'>{item.help_location}</ThemedText>
                                </View>

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <ThemedText style={{ color: '#000' }} type='small'>Country</ThemedText>
                                    <ThemedText style={{ color: Colors.wallet, textAlign: 'right', }} type='small'>{item.help_country}</ThemedText>
                                </View>

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <ThemedText style={{ color: '#000' }} type='small'>State</ThemedText>
                                    <ThemedText style={{ color: Colors.wallet, textAlign: 'right', }} type='small'>{item.help_state}</ThemedText>
                                </View>

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <ThemedText style={{ color: '#000' }} type='small'>L.G.A</ThemedText>
                                    <ThemedText style={{ color: Colors.wallet }} type='small'>{item.help_lga}</ThemedText>
                                </View>

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <ThemedText style={{ color: '#000' }} type='small'>Help Size</ThemedText>
                                    <ThemedText style={{ color: Colors.wallet }} type='small'>{item.help_size}</ThemedText>
                                </View>

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <ThemedText style={{ color: '#000' }} type='small'>Status</ThemedText>
                                    <ThemedText style={{ color: Colors.wallet }} type='small'>{item.help_status === "A" ? "Active" : item.help_status === "N" ? "Negotiating" : item.help_status === "C" ? "Completed" : "Cancelled"}</ThemedText>
                                </View>

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <ThemedText style={{ color: '#000' }} type='small'>Date</ThemedText>
                                    <ThemedText style={{ color: Colors.wallet }} type='small'>{item.help_date}</ThemedText>
                                </View>

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <ThemedText style={{ color: '#000' }} type='small'>Time</ThemedText>
                                    <ThemedText style={{ color: Colors.wallet }} type='small'>{item.help_time}</ThemedText>
                                </View>

                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <ThemedText style={{ color: '#000' }} type='small'>Security Code</ThemedText>
                                    <ThemedText style={{ color: Colors.wallet }} type='small'>{item.security_code}</ThemedText>
                                </View>
                            </ThemedView>
                        )} />
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


            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible3}
                onRequestClose={closePopup3}
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
                        <ThemedText type="title" style={{ marginBottom: 10, color: "#000" }}>
                            Satisfy  Request
                        </ThemedText>

                        <ThemedText style={{ color: "#000" }}>Satisfied</ThemedText>
                        <View style={{ margin: 5 }} />
                        <CustomDropdown
                            label=""
                            data={[
                                { label: 'Yes', value: 'Y' },
                                { label: 'No', value: 'N' },
                            ]}
                            value={formData.satisfy}
                            onChange={(value: any) => setFormData({ ...formData, satisfy: value })}
                            error={""}
                        />

                        {
                            formData.satisfy === 'N' &&
                            <>
                                <ThemedText style={{ color: Colors.blacktext, marginBottom: 10 }}>
                                    Please provide a reason for not being satisfied:
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
                                    value={formData.reason}
                                    onChangeText={(value: any) => setFormData({ ...formData, reason: value })}
                                />
                            </>
                        }

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                            <TouchableOpacity
                                onPress={() => [closePopup3(), setFormData(prev => ({ ...prev, reason: "", satisfy: "" }))]}
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
                                onPress={() => [handleRequest(), closePopup3()]}
                            >
                                <ThemedText style={{ color: '#fff' }}>Submit</ThemedText>
                            </ThemedButton>
                        </View>
                    </ThemedView>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: 150,
        borderRadius: 8,
        alignSelf: 'center'
    },
    line1: {
        marginTop: 15,
        borderTopWidth: 0.5,
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
        justifyContent: 'center',
        alignItems: 'center'
    },

    popup1: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
})