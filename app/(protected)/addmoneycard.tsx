import GoBack from '@/components/GoBack'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, decryptData, encryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { walletupdate } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, Animated, Image, ScrollView, StyleSheet, Text, TextInput, TextProps, TouchableOpacity, View } from 'react-native'
import { usePaystack } from 'react-native-paystack-webview'
import { SafeAreaView } from 'react-native-safe-area-context'


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
        amount: "6000"
    },
    {
        amount: "7000"
    }
]



export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor: { dark: string; light: string };
};


export default function addmoneycard({
    lightColor,
    darkColor,
    headerBackgroundColor,
}: Props) {

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [formattedamount, setFormattedAmount] = useState<any>('')
    const [amount, setAmount] = useState<any>()
    const [isInvalid, setIsInvalid] = useState(false)
    const { user, token, updateUserFields } = useAuth();
    const [isloading, setisloading] = useState(false)

    const { popup } = usePaystack()

    const SuccessHandler = async (res: any) => {
        console.log("Payment response:", res);
        try {
            setisloading(true);
            const response = await walletupdate(user?.customer_id, decryptData(token), encryptData(String(amount)));
            console.log("Wallet update response:", response);
            if (response) {
                await updateUserFields({ wallet_balance: response });
            }
            setAmount(null)
            router.back()
        } catch (error: any) {
            console.log("Error in SuccessHandler:", error.response);
            Alert.alert("Sorry", "An error occurred. Please try again later", [{ text: "Ok", onPress: () => router.push("/"), },]);
        } finally {
            setisloading(false)
        }
    };


    const paynow = () => {
        popup.newTransaction({
            email: user?.email,
            amount: amount,
            reference: `TNX_${Date.now()}`,
            onSuccess: async (res: any) => {
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

    const formatNumber = (text: any) => {
        // Remove any non-numeric characters
        let cleanText = text.replace(/[^0-9]/g, '');
        // Format the number with commas
        return cleanText.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const formatNumber2 = (text: any) => {
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
                <ThemedText type="titleMedium">Add Money Using Card</ThemedText>
                <ThemedText style={{ color: Colors.gray9 }}>Add money via card</ThemedText>

                <View style={{ margin: 15 }} />

                <ThemedText type='subtitle'>Enter Amount</ThemedText>
                <View style={{ margin: 5 }} />
                <ThemedView style={[styles.container, { marginBottom: 5, backgroundColor: Colors.offwhite1 }]}>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="currency-ngn" size={20} color={Colors.gray9} />
                        <TextInput placeholder={'Amount'}
                            style={[styles.input, isInvalid && styles.invalid, { color: Colors.gray9, }]}
                            onFocus={() => setIsInvalid(false)}
                            value={formattedamount}
                            onChangeText={handleChange}
                            placeholderTextColor={Colors.gray9}
                            keyboardType='number-pad'
                            maxLength={9}
                        />
                    </View>
                    <TouchableOpacity onPress={() => [setFormattedAmount(null), setAmount(0)]} style={{ padding: 10 }}>
                        <AntDesign name="close-circle" size={20} color={Colors.gray9} />
                    </TouchableOpacity>
                </ThemedView>

                <View style={{ margin: 5 }} />

                <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {numbers.map((item, key) => (
                            <TouchableOpacity key={key} style={{ backgroundColor: Colors.gray, paddingLeft: 5, margin: 5, paddingRight: 5, borderRadius: 15, padding: 5 }} onPress={() => handleChange(item.amount)}>
                                <Text style={{ fontFamily: 'poppinsRegular', }}><MaterialCommunityIcons name="currency-ngn" size={15} color="black" /> {item.amount.toLocaleString() + "." + "00"}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </ThemedView>

                <View style={{ margin: 10 }} />

                <ThemedText type='subtitle'>Select Payment Gateway</ThemedText>
                <View style={{ margin: 5 }} />
                <TouchableOpacity style={styles.container1} onPress={paynow}>
                    {/* other options*/}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <ThemedView style={{ padding: 10, borderRadius: 50, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' }}>
                                <Image
                                    source={require('@/assets/images/paystack.png')}
                                    style={styles.reactLogo}
                                />
                            </ThemedView>

                            <View style={{ paddingLeft: 20 }}>
                                <ThemedText style={{ color: '#000' }}>Paystack</ThemedText>
                                <ThemedText style={{ fontSize: 13, color: Colors.gray9, marginTop: 3 }}>
                                    Add money using paystack
                                </ThemedText>
                            </View>
                        </View>

                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 50, marginTop: 4 }}>
                            <MaterialIcons name="keyboard-arrow-right" size={15} color={Colors.green} />
                        </TouchableOpacity>

                    </View>
                    <View style={{ margin: 5 }} />
                    <View style={{ borderColor: Colors.wallet, borderWidth: 0.3 }} />
                </TouchableOpacity>
            </Animated.ScrollView>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container1: {
        borderWidth: 0.2, borderColor: Colors.gray9, padding: 18, borderRadius: 15,
        backgroundColor: Colors.bookingbackground
    },
    reactLogo: {
        height: 30,
        width: 30,
    },
    input: {
        fontSize: 25,
        paddingLeft: 6,
        padding: 12,
        borderRadius: 10,
        backgroundColor: Colors.offwhite1,
        flex: 1
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