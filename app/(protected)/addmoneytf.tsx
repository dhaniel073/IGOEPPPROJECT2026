import GoBack from '@/components/GoBack'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { getbanks, PUBLIC_API_BASE_URL } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation, useRouter } from 'expo-router'
import { useLayoutEffect, useState } from 'react'
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


export default function addmoneytf({
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
    const { user, token, updateUserFields, logout } = useAuth();
    const [isloading, setisloading] = useState(false)
    const [bank, setBank] = useState<any>([])
    const navigation = useNavigation()
    const [avail, setavail] = useState<string | null>()



    const { popup } = usePaystack()

    useLayoutEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                setisloading(true);
                const response = await getbanks(decryptData(token));
                console.log(response)
                setBank(response);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    Alert.alert("Session expired", "Please log in again.");
                    await logout(); // from your AuthContext
                    router.replace("/login"); // navigate to login screen
                } else {
                    Alert.alert('Error', 'An error occurred while loading banks.')
                }
                console.error("Error fetching pending requests:", error);
            } finally {
                setisloading(false);
            }
        };

        const unsubscribe = navigation.addListener("focus", fetchPendingRequests);

        return unsubscribe;
    }, []);


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

    const proceed = () => {
        if (avail === 'OPTIMUS BANK') {
            router.push({ pathname: "/(protected)/virtualaccounttopup", params: { bank: avail, formattedamount: formattedamount, amount: amount } })
            setavail(null)
        } else if (avail === 'VFD MICROFINANCE BANK') {
            router.push({ pathname: "/(protected)/virtualaccounttopup", params: { bank: avail, formattedamount: formattedamount, amount: amount } })
            setavail(null)
        } else {
            return;
        }
    }

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
                <ThemedText type="titleMedium">Add Money Using Transfer</ThemedText>
                <ThemedText style={{ color: Colors.gray9 }}>Add money via transfer</ThemedText>

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

                <ThemedText type='subtitle'>Select Bank</ThemedText>
                <View style={{ margin: 5 }} />


                <View style={{ marginTop: 20 }} />
                {bank.map((item: any, key: any) =>
                    <View key={key}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, paddingTop: 10 }} onPress={() => setavail(item.bank_name)}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                <Image style={{ height: 30, borderRadius: 50, width: 30 }} source={{ uri: `${PUBLIC_API_BASE_URL}banks/${item.image}` }} />
                                <View style={{ marginHorizontal: 6 }} />
                                <Text style={{ color: color }}>{item.bank_name}</Text>
                            </View>
                            <TouchableOpacity style={[styles.outer, { borderColor: color }]} onPress={() => setavail(item.bank_name)}>
                                {avail === item.bank_name && <View style={[styles.inner, { backgroundColor: color }]} />}
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={{ marginTop: 20 }} />

                {
                    avail &&
                    <ThemedButton style={{ backgroundColor: Colors.green, padding: 15, borderRadius: 30, alignItems: 'center' }} onPress={() => { !amount ? Alert.alert("Invalid Amount", "Enter an amount to continue") : proceed() }}>
                        <ThemedText style={{ color: '#fff' }}>Proceed</ThemedText>
                    </ThemedButton>
                }

            </Animated.ScrollView>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    inner: {
        width: 15,
        height: 15,
        // backgroundColor: Color.gray8,
        borderRadius: 10
    },
    outer: {
        width: 25,
        height: 25,
        borderWidth: 1,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
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