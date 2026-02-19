import GoBack from '@/components/GoBack';
import Input from '@/components/Input';
import LogoSpinner from '@/components/LoadingScreen';
import PinInput from '@/components/PinInput';
import { StatusModal } from '@/components/StatusModal';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { validateCheckout } from '@/components/validateCheckout';
import { Colors, decryptData, encryptData } from '@/constants/Colors';
import { useAuth } from '@/hooks/AuthContext';
import { cartcheckout, validatepin, YOUR_API_BASE_URL } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Entypo, MaterialIcons, Octicons } from '@expo/vector-icons';
import axios from 'axios';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Animated, Dimensions, Image, KeyboardAvoidingView, Modal, Platform, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor: { dark: string; light: string };
};

export default function checkout({
    lightColor,
    darkColor,
    headerBackgroundColor,
}: Props) {

    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const router = useRouter()
    const { user, token, logout } = useAuth()
    const [countryData, setCountryData] = useState<any[]>([]);
    const [stateData, setStateData] = useState<any[]>([]);
    const [cityData, setCityData] = useState<any[]>([]);
    const { paymentmethod } = useLocalSearchParams()
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [modalVisible, setModalVisible] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(height)).current;
    const [isPinLoading, setIsPinLoading] = useState(false);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [formData, setFormData] = useState<any>({
        address: "",
        countryName: "",
        stateName: "",
        cityName: "",
        landmark: "",
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
    });

    useFocusEffect(
        useCallback(() => {
            if (user?.transaction_pin_setup === "N") {
                setModalVisible2(true);
            }
        }, [user?.transaction_pin_setup])
    );

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

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const config = {
                    method: 'get',
                    url: `${YOUR_API_BASE_URL}auth/general/country`,
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${decryptData(token)}`,
                    },
                };
                const response = await axios(config);
                const data = response.data.data;
                const countryArray = data.map((item: any) => ({
                    label: item.country_name,
                    value: item.id,
                }));
                setCountryData(countryArray);
            } catch (error) {
                console.error("Country fetch error:", error);
            }
        };
        fetchCountries();
    }, []);

    const handleState = async (countryCode: string) => {
        try {
            const response = await axios.get(
                `${YOUR_API_BASE_URL}auth/general/state/${countryCode}`,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${decryptData(token)}`,
                    },
                }
            );

            const data = response.data.data;
            const stateArray = data.map((item: any) => ({
                label: item.state_name,
                value: item.id,
            }));
            setStateData(stateArray);
        } catch (error) {
            console.error("State fetch error:", error);
        }
    };

    const handleCity = async (stateCode: string) => {
        try {
            const response = await axios.get(
                `${YOUR_API_BASE_URL}auth/general/lga/${stateCode}`,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${decryptData(token)}`,
                    },
                }
            );

            const data = response.data.data;
            const cityArray = data.map((item: any) => ({
                label: item.lga_name,
                value: item.id,
            }));
            setCityData(cityArray);
        } catch (error) {
            console.error("City fetch error:", error);
        }
    };


    const handlevalidation = () => {
        console.log(formData)
        const validationErrors = validateCheckout(formData);
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
        return openPopup();
    };

    const pinvalidation = async (pin: any) => {
        console.log(pin);

        try {
            setIsPinLoading(true);

            const response = await validatepin(
                user?.customer_id,
                encryptData(pin),
                decryptData(token)
            );

            console.log(response);

            closePopup();        // close the PIN modal
            makepayment();        // start payment loading immediately

        } catch (error: any) {
            Alert.alert("Error", error.response?.data?.message || "PIN validation failed");
            console.log(error.response?.data?.message);

        } finally {
            setIsPinLoading(false);
        }
    };

    const makepayment = async () => {
        try {
            setIsPaymentLoading(true);

            // Call endpoint B
            const response = await cartcheckout(
                formData.first_name, formData.last_name, formData.address, formData.landmark, formData.phone, formData.email, formData.stateName,
                formData.cityName, formData.countryName, user?.customer_id, paymentmethod, decryptData(token)
            );

            console.log(response)
            Alert.alert('Successful', 'item purchased successfully', [
                {
                    text: 'OK',
                    onPress: () => router.push("/(protected)/(tabs)/market")
                }
            ])

            console.log(response);

        } catch (error: any) {
            Alert.alert("Error", error.response?.data.message || "Payment failed");
            console.log(error.response);

        } finally {
            setIsPaymentLoading(false);
        }
    };

    if (isPinLoading || isPaymentLoading) {
        return <LogoSpinner lightColor='' darkColor='' />
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust for header height if needed
            >
                <Animated.ScrollView showsVerticalScrollIndicator={false}>
                    <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
                        <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
                    </GoBack>
                    <View style={{ margin: 6 }} />

                    <ThemedText type="titleMedium">Checkout cart items</ThemedText>

                    <View style={{ margin: 5 }} />

                    <ThemedText>First Name</ThemedText>
                    <Input
                        placeholder="Please enter"
                        keyboardType="default"
                        rightIcon={<Octicons name="person" size={18} color={Colors.gray9} />}
                        value={formData.first_name}
                        onUpdateValue={(val) =>
                            setFormData({ ...formData, first_name: val })
                        }
                        autoCapitalize='sentences'
                    />
                    <View style={{ margin: 5 }} />

                    <ThemedText>Last Name</ThemedText>
                    <Input
                        placeholder="Please enter"
                        keyboardType="default"
                        rightIcon={<Octicons name="person" size={18} color={Colors.gray9} />}
                        value={formData.last_name}
                        onUpdateValue={(val) =>
                            setFormData({ ...formData, last_name: val })
                        }
                        autoCapitalize='sentences'

                    />
                    <View style={{ margin: 5 }} />

                    <ThemedText>Email</ThemedText>
                    <Input
                        placeholder="Please enter"
                        keyboardType="email-address"
                        rightIcon={<Octicons name="person" size={18} color={Colors.gray9} />}
                        value={formData.email}
                        onUpdateValue={(val) =>
                            setFormData({ ...formData, email: val })
                        }
                    />

                    <View style={{ margin: 5 }} />

                    <ThemedText>Address</ThemedText>
                    <Input
                        placeholder="Enter Address"
                        value={formData.address}
                        onUpdateValue={(text) => setFormData({ ...formData, address: text })}
                        keyboardType="default"
                        multiline
                        // isInvalid={!!errors.addressfield}
                        rightIcon={<Entypo name="address" size={20} color={Colors.gray9} />}
                    />

                    <View style={{ margin: 5 }} />

                    <ThemedText>Country</ThemedText>
                    <View style={{ margin: 5 }} />
                    <Dropdown
                        style={[styles.dropdown]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={countryData}
                        labelField="label"
                        valueField="label"
                        placeholder="Please Select"
                        maxHeight={300}
                        value={formData.countryName}
                        search
                        searchPlaceholder="Search..."
                        inputSearchStyle={{ color: Colors.gray9 }}
                        onChange={(item: any) => {
                            setFormData({ ...formData, countryName: item.label, stateName: "", cityName: "" });
                            setStateData([]);
                            setCityData([]);
                            handleState(item.value);
                        }}
                        renderRightIcon={() => (
                            <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.gray9} />
                        )}
                    />


                    <View style={{ margin: 5 }} />

                    <ThemedText>State</ThemedText>
                    <View style={{ margin: 5 }} />
                    <Dropdown
                        style={[styles.dropdown]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={stateData}
                        labelField="label"
                        valueField="label"
                        placeholder="Please Select"
                        value={formData.stateName}
                        maxHeight={300}
                        search
                        searchPlaceholder="Search..."
                        inputSearchStyle={{ color: Colors.gray9 }}
                        onChange={(item: any) => {
                            setFormData({ ...formData, stateName: item.label, cityName: "" });
                            setCityData([]);
                            handleCity(item.value);
                        }}
                        renderRightIcon={() => (
                            <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.gray9} />
                        )}
                    />

                    <View style={{ margin: 5 }} />

                    <ThemedText>Local Government Area</ThemedText>
                    <View style={{ margin: 5 }} />
                    <Dropdown
                        style={[styles.dropdown]}
                        // placeholderStyle={{ color: Colors.gray9 }}
                        // selectedTextStyle={{ color: "#000" }}
                        data={cityData}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        labelField="label"
                        valueField="label"
                        placeholder="Please Select"
                        value={formData.cityName}
                        maxHeight={300}
                        search
                        searchPlaceholder="Search..."
                        inputSearchStyle={{ color: Colors.gray9 }}
                        onChange={(item: any) => {
                            setFormData({ ...formData, cityName: item.label });
                        }}
                        renderRightIcon={() => (
                            <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.gray9} />
                        )}
                    />
                    <View style={{ margin: 5 }} />

                    <ThemedText>Landmark</ThemedText>
                    <Input
                        placeholder="Enter Landmark"
                        value={formData.landmark}
                        onUpdateValue={(text) => setFormData({ ...formData, landmark: text })}
                        keyboardType="default"
                        // isInvalid={!!errors.landmark}
                        rightIcon={<Entypo name="address" size={20} color={Colors.gray9} />}
                    />

                    <View style={{ margin: 5 }} />

                    <ThemedText>Phone Number</ThemedText>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {/* Country Code Box */}
                        <ThemedView
                            style={{
                                paddingHorizontal: 12,
                                paddingVertical: 14,
                                borderRadius: 8,
                                flexDirection: "row",
                                alignItems: "center",
                                borderWidth: 1,
                                borderColor: Colors.gray9,
                                marginRight: 10, // space between code box and input
                            }}
                        >
                            <Image
                                source={require("@/assets/images/flag.png")}
                                style={{ width: 20, height: 15, resizeMode: "contain" }}
                            />
                            <ThemedText style={{ marginLeft: 6, fontSize: 16 }}>+234</ThemedText>
                        </ThemedView>

                        {/* Phone Number Input */}
                        <View style={{ flex: 1 }}>
                            <Input
                                placeholder="Enter phone number"
                                keyboardType="phone-pad"
                                value={formData.phone}
                                onUpdateValue={(val) =>
                                    setFormData({ ...formData, phone: val })
                                }
                                maxLength={10}
                            />
                        </View>
                    </View>

                    <View style={{ margin: 10 }} />

                    <ThemedButton style={{ backgroundColor: Colors.green, padding: 15, borderRadius: 30, alignItems: 'center' }} onPress={() => { handlevalidation() }}>
                        <ThemedText style={{ color: '#fff' }}>Proceed</ThemedText>
                    </ThemedButton>
                    <View style={{ margin: 15 }} />

                    <Modal
                        transparent
                        visible={modalVisible}
                        animationType="slide"
                        onRequestClose={closePopup}
                    >
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust for header height if needed
                        >
                            <TouchableOpacity style={styles.overlay} onPress={() => [closePopup()]} />

                            <Animated.View
                                style={[
                                    styles.popup,
                                    { transform: [{ translateY: slideAnim }], backgroundColor: color1 },
                                ]}
                            >
                                <ThemedText type='titleMedium' style={{ textAlign: 'center' }}>Enter Pin</ThemedText>
                                <View style={{ margin: 8 }} />

                                <ThemedText style={{ textAlign: 'center', color: Colors.gray9 }}>Enter Transaction PIN</ThemedText>
                                <View style={{ margin: 10 }} />
                                <View style={{ margin: 5 }} />


                                <PinInput length={4} secure={true} onSubmit={(pin) => { closePopup(), pinvalidation(pin) }} />
                                <View style={{ margin: 10 }} />
                            </Animated.View>
                        </KeyboardAvoidingView>
                    </Modal>

                    <StatusModal
                        visible={modalVisible2}
                        onClose={() => setModalVisible2(false)}
                        title="No Transaction PIn"
                        message="Please create your transaction PIN to secure your account and enable transactions."
                        navigateTo="/transactionpin"
                        close={true}
                    />
                </Animated.ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        height: 60,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    placeholderStyle: {
        color: '#999',
        fontSize: 14,
        fontFamily: 'poppinsRegular'
    },
    selectedTextStyle: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'poppinsRegular'
    },
    popup: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // boxShadow: '0px 4px 6px rgba(0,0,0,0.35)', 
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
})