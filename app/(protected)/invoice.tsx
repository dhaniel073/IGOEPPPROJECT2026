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
                console.log(response)
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
                Alert.alert('Error', 'Unable to load notification settings.')
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
            amount: Number(amount1),
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



    const StatusBadge = ({ status }: { status: string }) => {
        const isPaid = status === 'S';
        return (
            <View style={[
                styles.badge,
                { backgroundColor: isPaid ? '#E8F5E9' : '#FFF3E0' }
            ]}>
                <View style={[
                    styles.badgeDot,
                    { backgroundColor: isPaid ? '#4CAF50' : '#FF9800' }
                ]} />
                <Text style={[
                    styles.badgeText,
                    { color: isPaid ? '#2E7D32' : '#E65100' }
                ]}>
                    {isPaid ? 'Paid' : 'Unpaid'}
                </Text>
            </View>
        );
    };

    const DetailRow = ({ label, value, color }: any) => (
        <View style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>{label}</ThemedText>
            <ThemedText style={[styles.detailValue, color ? { color } : {}]}>{value}</ThemedText>
        </View>
    );

    const InvoiceItem = ({ item, expanded, onPress }: any) => {
        const now = new Date();
        const dueDate = new Date(item.due_date);
        const paymentDate = item.payment_date ? new Date(item.payment_date) : null;
        const isUnpaid = item.payment_status !== 'S';

        // Determine if we should use balance_due (for late payments or currently overdue)
        const isPaidLate = !isUnpaid && paymentDate !== null && paymentDate.getTime() > dueDate.getTime();
        const isCurrentlyOverdue = isUnpaid && now.getTime() > dueDate.getTime();
        const shouldUseBalanceDue = isPaidLate || isCurrentlyOverdue;

        const displayAmount = (shouldUseBalanceDue && item.balance_due) ? item.balance_due : item.amount;

        return (
            <View style={styles.cardContainer}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={onPress}
                    style={[
                        styles.invoiceCard,
                        expanded && styles.invoiceCardExpanded
                    ]}
                >
                    <View style={styles.cardHeader}>
                        <View style={styles.iconContainer}>
                            <MaterialIcons name="receipt-long" size={24} color={Colors.green} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <ThemedText style={styles.invoiceNumber}>Invoice #{item.invoice_id}</ThemedText>
                            <ThemedText style={styles.invoiceDate}>{formatDate(item.issue_date)}</ThemedText>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <ThemedText style={styles.invoiceAmount}>₦{Number(displayAmount).toLocaleString()}</ThemedText>
                            <StatusBadge status={item.payment_status} />
                        </View>
                    </View>

                    <View style={styles.expandIconContainer}>
                        <MaterialIcons
                            name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                            size={20}
                            color={Colors.gray9}
                        />
                    </View>
                </TouchableOpacity>

                {expanded && (
                    <View style={styles.detailsContainer}>
                        <View style={styles.receiptHeader}>
                            <ThemedText style={styles.receiptTitle}>Invoice Details</ThemedText>
                            <View style={styles.divider} />
                        </View>

                        <View style={styles.detailsGrid}>
                            <DetailRow label="Bill To" value={item.customer_name} />
                            <DetailRow label="Request ID" value={item.request_id} />
                            <DetailRow label="Business ID" value={item.business_id} />
                            <DetailRow label="Issue Date" value={formatDate(item.issue_date)} />
                            <DetailRow label="Due Date" value={formatDate(item.due_date)} color={isCurrentlyOverdue ? "#d32f2f" : undefined} />
                            {item.payment_date && <DetailRow label="Payment Date" value={formatDate(item.payment_date)} color={isPaidLate ? "#d32f2f" : undefined} />}
                            <DetailRow label="Created At" value={formatDate(item.created_at)} />
                        </View>

                        <View style={styles.dashedDivider} />

                        <View style={styles.totalSection}>
                            <ThemedText type="small" style={{ color: Colors.gray9 }}>
                                {isCurrentlyOverdue ? "Balance Due (Overdue)" : (isPaidLate ? "Amount Paid (Late)" : (!isUnpaid ? "Amount Paid" : "Total Amount Due"))}
                            </ThemedText>
                            <ThemedText type="titleMedium" style={styles.totalAmount}>₦{Number(displayAmount).toLocaleString()}</ThemedText>
                        </View>

                        {isUnpaid && (
                            <TouchableOpacity
                                onPress={() => [setAmount1(displayAmount), setInvoiceid(item.invoice_id), openPopup1()]}
                                style={styles.payButton}
                            >
                                <ThemedText style={styles.payButtonText}>Pay Now</ThemedText>
                                <MaterialIcons name="chevron-right" size={20} color="white" />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        );
    };

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
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="description" size={64} color={Colors.gray9} style={{ opacity: 0.3 }} />
                        <ThemedText style={styles.emptyText}>No invoices found</ThemedText>
                        <ThemedText style={styles.emptySubtext}>Your pending and past invoices will appear here.</ThemedText>
                    </View>
                )}
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
                        {!amount1 ? "₦0.00" : Number(amount1).toLocaleString('en-NG', {
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
                                                {!amount1 ? "₦0.00" : Number(amount1).toLocaleString('en-NG', {
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
    cardContainer: {
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    invoiceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    invoiceCardExpanded: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomWidth: 0,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F1F8E9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    invoiceNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    invoiceDate: {
        fontSize: 12,
        color: Colors.gray9,
        marginTop: 2,
    },
    invoiceAmount: {
        fontSize: 16,
        fontWeight: '800',
        color: Colors.green,
    },
    expandIconContainer: {
        marginLeft: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 4,
    },
    badgeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    detailsContainer: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        padding: 20,
        paddingTop: 0,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        borderTopWidth: 0,
    },
    receiptHeader: {
        marginBottom: 16,
    },
    receiptTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
    detailsGrid: {
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 13,
        color: Colors.gray9,
    },
    detailValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    dashedDivider: {
        height: 1,
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'dashed',
        marginVertical: 20,
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1a1a1a',
    },
    payButton: {
        backgroundColor: Colors.green,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    payButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    emptyContainer: {
        paddingTop: 60,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: Colors.gray9,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    popup: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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