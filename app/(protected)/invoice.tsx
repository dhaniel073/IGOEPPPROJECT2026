import GoBack from '@/components/GoBack';
import LogoSpinner from '@/components/LoadingScreen';
import PinInput from '@/components/PinInput';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors, decryptData, encryptData, formatDate } from '@/constants/Colors';
import { useAuth } from '@/hooks/AuthContext';
import { getbanks, getpendinginvoices, PUBLIC_API_BASE_URL, updateinvoice, validatepin } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, FlatList, Image, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextProps, TouchableOpacity, View } from 'react-native';
import { usePaystack } from 'react-native-paystack-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor: { dark: string; light: string };
};


const dataBusiness = [
    {
        id: "DC",
        name: "Pay with debit card",
        icon: <Entypo name="credit-card" size={14} color={Colors.wallet} />,
    },
    {
        id: "T",
        name: 'Pay with transfer',
        icon: <FontAwesome name="bank" size={14} color={Colors.wallet} />

    },
]

export default function invoice({
    lightColor,
    darkColor,
    headerBackgroundColor,
}: Props) {

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const navigation = useNavigation()
    const { user, token, logout } = useAuth()
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [invoiceList, setInvoiceList] = useState<any[]>([])
    const { popup } = usePaystack()
    const [amount1, setAmount1] = useState<any>()
    const [invoiceid, setInvoiceid] = useState<any>()
    const [modalVisible1, setModalVisible1] = useState(false);
    const height = Dimensions.get('window').height;
    const slideAnim = useRef(new Animated.Value(height)).current;
    const [avail, setavail] = useState<any>("")
    const [isPinLoading, setIsPinLoading] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [modalVisible4, setModalVisible4] = useState(false);
    const [bank, setBank] = useState<any>([])
    const [availbank, setavailbank] = useState<string | null>()

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

    const closePopup2 = () => {
        Animated.timing(slideAnim, {
            toValue: height, // Slide back down
            duration: 300,
            useNativeDriver: true,
        }).start(() => setModalVisible4(false)); // Close after animation
    };

    const openPopup2 = () => {
        setModalVisible4(true);
        Animated.timing(slideAnim, {
            toValue: 0, // Slide to the screen
            duration: 300,
            useNativeDriver: true,
        }).start();
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

    const toggleExpand = (id: number) => {
        setExpandedId((prev: any) => prev === id ? null : id);
    };

    const [isFetching, setIsFetching] = React.useState(false);

    useLayoutEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                setIsFetching(true);
                const response = await getpendinginvoices(user?.business_id, decryptData(token));
                setInvoiceList(response);
            } catch (error: any) {
                Alert.alert('Error', error.response.data.message || " Unable to load invoices")
            } finally {
                setIsFetching(false);
            }
        };

        const unsubscribe = navigation.addListener("focus", fetchPendingRequests);

        return unsubscribe;
    }, []);

    useLayoutEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                setIsFetching(true);
                const response = await getbanks(decryptData(token));
                console.log(response)
                setBank(response);
            } catch (error: any) {
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

    const pinvalidation = async (pin: any) => {

        try {
            setIsPinLoading(true);

            const response = await validatepin(
                user?.customer_id,
                encryptData(pin),
                decryptData(token)
            );

            //   closePopup2();        // close the PIN modal
            makepayment();        // start payment loading immediately

        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "PIN validation failed");
        } finally {
            setIsPinLoading(false);
        }
    };

    const makepayment = async () => {
        try {
            if (avail?.id === 'DC') {
                await paynow();
            } else if (avail?.id === 'T') {
                closePopup1(), openPopup3()
            } else {
                return
            }
        } catch (error) {
            return;
        }
    };


    const SuccessHandler = async () => {
        try {
            setIsFetching(true);
            const response = await updateinvoice(invoiceid, decryptData(token));
            setAmount1(null)
            Alert.alert("Success", "Payment was successful", [{ text: "Ok", onPress: () => router.push("/invoice"), },]);
        } catch (error: any) {
            Alert.alert("Sorry", "An error occurred. Please try again later", [{ text: "Ok", onPress: () => router.push("/invoice"), },]);
            setIsFetching(false);
        }
    }

    const paynow = async () => {
        popup.newTransaction({
            email: user?.email,
            amount: amount1,
            reference: `TNX_${Date.now()}`,
            onSuccess: async (res: any) => {
                await SuccessHandler();
            },
            onCancel: () => {
                Alert.alert("Cancelled", "Transaction Cancelled")
            },
            onLoad: (res: any) => { },
            onError: (err: any) => {
                Alert.alert("Error", "An error occured while per")
            }
        })
    }



    const InvoiceItem = ({ item, expanded, onPress }: any) => (
        <>
            <TouchableOpacity onPress={onPress}>
                <ThemedView style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderRadius: 8,
                    paddingBottom: 10,
                    paddingHorizontal: 5,
                    boxShadow: '0px 2px 5px rgba(0,0,0,0.35)',
                }}>
                    <View>
                        <ThemedText type="small">INVOICE NUMBER:</ThemedText>
                        <ThemedText type="small">{item.invoice_id}</ThemedText>
                    </View>

                    <View>
                        <ThemedText type="small">ISSUED:</ThemedText>
                        <ThemedText type="small">{formatDate(item.issue_date)}</ThemedText>
                    </View>

                    <View>
                        <ThemedText type="small">DUE DATE:</ThemedText>
                        <ThemedText type="small">{formatDate(item.due_date)}</ThemedText>
                    </View>

                </ThemedView>
            </TouchableOpacity>

            {expanded && (
                <ThemedView style={{
                    borderRadius: 8,
                    marginTop: 10,
                    backgroundColor: Colors.invoicebrg,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    shadowColor: "#000",
                    shadowOpacity: 0.35,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 4 }
                }}>

                    <ThemedView style={{
                        borderRadius: 8,
                        padding: 10,
                        borderWidth: 1,
                        borderColor: "#ccc",
                        shadowColor: "#000",
                        shadowOpacity: 0.35,
                        shadowRadius: 6,
                        shadowOffset: { width: 0, height: 2 }
                    }}>
                        <ThemedText>Amount Due</ThemedText>
                        <ThemedText type='titleMedium'>NGN {Number(item.amount).toLocaleString()}</ThemedText>
                        <ThemedText style={{ color: 'red' }}>{formatDate(item.due_date)}</ThemedText>
                    </ThemedView>

                    <View style={{ margin: 6 }} />

                    <View>
                        <ThemedText>INVOICE TO:</ThemedText>
                        <ThemedText>Made by: {item.customer_name}</ThemedText>
                        <ThemedText>Status: {item.payment_status === 'S' ? 'PAID' : 'NOT PAID'}</ThemedText>
                        <ThemedText>Request Id: {item.request_id}</ThemedText>
                        <ThemedText>Business Id: {item.business_id}</ThemedText>
                        <ThemedText>Customer Id: {item.customer_id}</ThemedText>
                        <ThemedText>Date Created : {formatDate(item.created_at)}</ThemedText>
                    </View>

                    <View style={{ margin: 6 }} />

                    <TouchableOpacity onPress={() => [setAmount1(item.amount), setInvoiceid(item.invoice_id), openPopup1()]} style={{
                        backgroundColor: Colors.green,
                        padding: 10,
                        borderRadius: 8,
                        alignItems: 'center',
                        marginTop: 10,
                    }}>
                        <ThemedText style={{ color: 'white' }}>Pay Now</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            )}
        </>
    );

    if (isFetching || isPinLoading) {
        return <LogoSpinner lightColor='' darkColor='' />
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 15, paddingTop: 10, backgroundColor: color1 }} edges={['top', 'bottom']}>
            <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
                <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
            </GoBack>
            <View style={{ margin: 6 }} />
            <ThemedText type="titleMedium">Invoice Details</ThemedText>
            <ThemedText style={{ color: Colors.gray9 }}>View your invoice details</ThemedText>
            <View style={{ margin: 8 }} />

            <FlatList
                data={invoiceList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <InvoiceItem
                        item={item}
                        expanded={expandedId === item.id}
                        onPress={() => toggleExpand(item.id)}
                    />
                )}
            />

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
                        { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: "15%" },
                    ]}
                >


                    <View style={{ margin: 5 }} />

                    <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, alignItems: 'center', marginLeft: 15 }}>
                            <ThemedText type='titleMedium'>Select Payment Method</ThemedText>
                        </View>
                        <TouchableOpacity onPress={() => [closePopup1(), setavail("")]}>
                            <MaterialIcons name="cancel" size={24} color={Colors.green} />
                        </TouchableOpacity>
                    </ThemedView>

                    <ThemedText style={{ textAlign: 'center', color: Colors.green }} type='titleMedium'>
                        {!amount1 ? "0.00" : amount1.toLocaleString('en-NG', {
                            style: 'currency',
                            currency: 'NGN',
                        })}
                    </ThemedText>

                    {
                        <>
                            {dataBusiness.map((item: any, key: any) =>
                                <ThemedView key={item.id} style={{
                                    flexDirection: 'row', justifyContent: 'space-between', padding: 12,
                                    borderRadius: 12,
                                    margin: 10, // space for shadow
                                    // iOS shadow
                                    boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
                                }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ backgroundColor: Colors.clock2, padding: 10, borderRadius: 50, marginRight: 10 }}>
                                            {item.icon}
                                        </View>
                                        <View>
                                            <ThemedText>{item.name}</ThemedText>

                                            <ThemedText style={{ color: Colors.gray9 }} type='small'>
                                                {!amount1 ? "0.00" : amount1.toLocaleString('en-NG', {
                                                    style: 'currency',
                                                    currency: 'NGN',
                                                })}
                                            </ThemedText>
                                        </View>
                                    </View>
                                    <View>
                                        <View key={key}>
                                            <TouchableOpacity style={{ padding: 15, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => [setavail(item)]}>
                                                <TouchableOpacity style={styles.outer} onPress={() => setavail(item)}>
                                                    {avail === item && <View style={styles.inner} />}
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </ThemedView>
                            )}
                        </>
                    }

                    <View style={{ margin: 10 }} />
                    <ThemedButton onPress={() => [closePopup1(), openPopup2()]} enabled={!avail ? false : true} style={{ backgroundColor: Colors.green, padding: 15, borderRadius: 30, alignItems: 'center' }}>
                        <ThemedText style={{ color: '#fff' }}>Make Payment</ThemedText>
                    </ThemedButton>

                </Animated.View>
            </Modal>

            <Modal
                transparent
                visible={modalVisible3}
                animationType="slide"
                onRequestClose={closePopup3}
            >

                <TouchableOpacity style={styles.overlay} onPress={() => [closePopup3()]} />

                <Animated.View
                    style={[
                        styles.popup,
                        { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: "15%" },
                    ]}
                >
                    <View style={{ margin: 5 }} />

                    <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, alignItems: 'center', marginLeft: 15 }}>
                            <ThemedText type='titleMedium'>Select Bank</ThemedText>
                        </View>
                        <TouchableOpacity onPress={closePopup3}>
                            <MaterialIcons name="cancel" size={24} color={Colors.green} />
                        </TouchableOpacity>
                    </ThemedView>

                    <View style={{ margin: 6 }} />

                    {bank.map((item: any, key: any) =>
                        <View key={key}>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, paddingTop: 10 }} onPress={() => setavailbank(item.bank_name)}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                    <Image style={{ height: 30, borderRadius: 50, width: 30 }} source={{ uri: `${PUBLIC_API_BASE_URL}banks/${item.image}` }} />
                                    <View style={{ marginHorizontal: 6 }} />
                                    <Text style={{ color: color }}>{item.bank_name}</Text>
                                </View>
                                <TouchableOpacity style={[styles.outer, { borderColor: color }]} onPress={() => setavailbank(item.bank_name)}>
                                    {availbank === item.bank_name && <View style={[styles.inner, { backgroundColor: color }]} />}
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={{ marginTop: 20 }} />

                    {
                        availbank &&
                        <ThemedButton style={{ backgroundColor: Colors.green, padding: 15, borderRadius: 30, alignItems: 'center' }} onPress={() => [closePopup3(), router.push({ pathname: "/(protected)/virtualaccountinvoice", params: { amount: amount1, invoiceid: invoiceid, bank: availbank } })]}>
                            <ThemedText style={{ color: '#fff' }}>Proceed</ThemedText>
                        </ThemedButton>
                    }
                </Animated.View>
            </Modal>

            <Modal
                transparent
                visible={modalVisible4}
                animationType="slide"
                onRequestClose={closePopup2}
            >
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust for header height if needed
                >
                    <TouchableOpacity style={styles.overlay} onPress={() => [closePopup2()]} />

                    <Animated.View
                        style={[
                            styles.popup,
                            { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: "5%" },
                        ]}
                    >
                        <ThemedText type='titleMedium' style={{ textAlign: 'center' }}>Enter Pin</ThemedText>
                        <View style={{ margin: 8 }} />

                        <ThemedText style={{ textAlign: 'center', color: Colors.gray9 }}>Enter Transaction PIN</ThemedText>
                        <View style={{ margin: 10 }} />
                        <View style={{ margin: 5 }} />


                        <PinInput length={4} secure={true} onSubmit={(pin) => { closePopup2(), pinvalidation(pin) }} />
                        <View style={{ margin: 10 }} />
                    </Animated.View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    popup: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    outer: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inner: {
        width: 10,
        height: 10,
        backgroundColor: Colors.green,
        borderRadius: 10
    },
})