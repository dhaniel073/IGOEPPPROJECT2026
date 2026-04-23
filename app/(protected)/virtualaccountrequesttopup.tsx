import FullScreenModal from '@/components/FullScreenModal'
import GoBack from '@/components/GoBack'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, decryptData, encryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { acceptTopupTransfer, validatetransaction, vfdvalidatetransaction } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Animated, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor: { dark: string; light: string };
};


export default function virtualaccountrequesttopup({
    lightColor,
    darkColor,
    headerBackgroundColor,
}: Props) {

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [payload, setPayload] = useState<any>("")
    const { bank, formattedamount, amount, requestid } = useLocalSearchParams<any>()
    const [isloading, setIsloading] = useState<any>()
    const navigation = useNavigation()
    const { user, token, logout } = useAuth()

    const [visible, setIsVisible] = useState(false)
    const [visible1, setIsVisible1] = useState(false)

    const copyToClipboard = async (number: any) => {
        await Clipboard.setStringAsync(number);
    };

    const handlePlay = () => {

        setIsVisible(true)
        setTimeout(() => {
            setIsVisible(false);
        }, 2000); // Adjust this duration to match the length of your GIF
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            setIsloading(true);

            try {
                const response = await acceptTopupTransfer(
                    encryptData(amount),
                    user?.customer_id,
                    requestid,
                    decryptData(token)
                );

                // Different payload structure per bank
                if (bank === 'OPTIMUS BANK') {
                    setPayload(response);
                } else {
                    setPayload(response);
                }

            } catch (error: any) {
                console.log(error.response);
                const message =
                    error.response?.data?.message ||
                    'Account generation failed. Please try again later';
                Alert.alert('Failed', message, [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack?.(),
                    },
                ]);
            } finally {
                setIsloading(false);
            }
        });

        return unsubscribe;
    }, [navigation, bank, amount, requestid, token]);

    const validate = async () => {
        try {
            setIsloading(true);

            const isOptimus = bank === 'OPTIMUS BANK';
            const validateFn = isOptimus ? validatetransaction : vfdvalidatetransaction;
            const accountNumber = isOptimus ? payload.account_number : payload.accountNumber;

            const response = await validateFn(
                encryptData(amount),
                payload.reference,
                user?.customer_id,
                user?.email,
                accountNumber,
                decryptData(token)
            );

            isOptimus ? setIsVisible(true) : setIsVisible1(true);

        } catch (error: any) {
            const message = error.response?.data?.message || "An unexpected error occurred";
            Alert.alert('Failed', message);
        } finally {
            setIsloading(false);
        }
    };


    if (isloading) {
        return <LogoSpinner lightColor='' darkColor='' />
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }} edges={['top', 'bottom']}>
            <Animated.ScrollView showsVerticalScrollIndicator={false}>
                <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
                    <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
                </GoBack>
                <View style={{ margin: 6 }} />

                <ThemedText type="titleMedium">Transfer</ThemedText>
                <View style={{ marginTop: 20 }} />

                <SafeAreaView style={{ marginHorizontal: 5 }}>

                    <ThemedText style={{ fontFamily: 'poppinsRegular', color: color }}>Transfer To the account details below</ThemedText>


                    <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: Colors.gray7, paddingTop: 30, paddingBottom: 30 }}>
                        <ThemedText>Amount</ThemedText>
                        <ThemedText><MaterialCommunityIcons name="currency-ngn" size={15} color={color} />{formattedamount.toLocaleString()}</ThemedText>
                    </View>

                    <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: Colors.gray7, paddingTop: 30, paddingBottom: 30 }}>
                        <ThemedText>Bank</ThemedText>
                        <ThemedText>{bank}</ThemedText>
                    </View>

                    <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: Colors.gray7, paddingTop: 30, paddingBottom: 30 }}>
                        <View>
                            <ThemedText>Account Number</ThemedText>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                            <ThemedText>{payload.accountNumber}</ThemedText>
                            <TouchableOpacity style={{ paddingLeft: 8 }} onPress={() => [handlePlay(), copyToClipboard(payload.accountNumber)]}>
                                <Ionicons name="copy" size={15} color={color} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: Colors.gray7, paddingTop: 30, paddingBottom: 30 }}>
                        <ThemedText>Account Name</ThemedText>
                        <ThemedText>IGOEPP</ThemedText>
                    </View>
                </SafeAreaView>


                <View style={{ marginBottom: 10 }} />
                <ThemedText type='small' style={{ textAlign: 'center', color: Colors.red }}>Note: *The receiving account is only valid once, please do not repeat the transaction after first attempt*</ThemedText>
                {
                    visible ?
                        <ThemedView style={{ justifyContent: 'center', alignSelf: 'center', marginTop: 30, marginBottom: 10, padding: 10, borderRadius: 8, backgroundColor: color }}>
                            <ThemedText style={{ textAlign: 'center', color: color1 }}>Copied!</ThemedText>
                        </ThemedView>
                        :
                        null
                }

                <View style={{ marginBottom: 5 }} />
                <ThemedButton style={{ backgroundColor: Colors.green, padding: 15, borderRadius: 30, alignItems: 'center' }} onPress={() => { validate() }}>
                    <ThemedText style={{ color: '#fff' }}>Confirm transaction</ThemedText>
                </ThemedButton>

                <FullScreenModal
                    visible={visible1}
                    onClose={() => [setIsVisible1(false), router.push({ pathname: '/(protected)/(tabs)/bookings' })]}
                    mainText="Transaction Successful!"
                    subText={`₦${formattedamount} has been received for material purchase`}
                />
            </Animated.ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})