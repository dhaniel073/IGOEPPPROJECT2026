import GoBack from '@/components/GoBack';
import LogoSpinner from '@/components/LoadingScreen';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors, decryptData, formatDate } from '@/constants/Colors';
import { useAuth } from '@/hooks/AuthContext';
import { getpendinginvoices } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor: { dark: string; light: string };
};


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
                console.error("Error fetching pending requests:", error);
                if (error.response?.status === 401) {
                    Alert.alert("Session expired", "Please log in again.");
                    await logout(); // from your AuthContext
                    router.replace("/login"); // navigate to login screen
                } else {
                    Alert.alert('Error', error.response.data.message || " Unable to load invoices")
                }
            } finally {
                setIsFetching(false);
            }
        };

        const unsubscribe = navigation.addListener("focus", fetchPendingRequests);

        return unsubscribe;
    }, []);


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

                </ThemedView>
            )}
        </>
    );

    if (isFetching) {
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
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({})