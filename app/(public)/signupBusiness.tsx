import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import LogoSpinner from '@/components/LoadingScreen'
import { PasswordRules } from '@/components/PasswordRules'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { validateSignupBusiness } from '@/components/validateSignupBusiness'
import { Colors, encryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { authenticateSignUpBusiness, termsandconditons } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Octicons } from '@expo/vector-icons'
import { useNavigation, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, Animated, Dimensions, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, TextProps, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { height } = Dimensions.get('window');

export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor: { dark: string; light: string };
};

export default function signupBusiness({
    lightColor,
    darkColor,
    headerBackgroundColor,
}: Props) {

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [modalVisible, setModalVisible] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(height)).current;
    const navigation = useNavigation()
    const [htmlContent, setHtmlContent] = useState();
    const [isloading, setisloading] = useState(false)
    const { login } = useAuth()


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

    const [formData, setFormData] = useState({
        companyname: "",
        tinNumber: "",
        rcNumber: "",
        email: "",
        cemail: "",
        phone: "",
        password: "",
        confirmPassword: "",
        referral_code: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSignup = () => {
        const validationErrors = validateSignupBusiness(formData);
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


    const signupHandler = async () => {
        try {
            setisloading(true);

            // Make signup request
            const response = await authenticateSignUpBusiness(
                formData.email,
                formData.cemail,
                encryptData(formData.password),
                formData.tinNumber,
                formData.rcNumber,
                formData.companyname,
                formData.phone,
                formData.referral_code
            );


            console.log("✅ Signup successful:", response);

            // Log in immediately after signup
            await login(encryptData(response.access_token), response);

        } catch (error: any) {
            console.log("❌ Signup failed:", error.response.data);

            // Safe error extraction
            const errorMessage =
                error?.response?.data?.email ||
                error?.response?.data?.message ||
                "Something went wrong. Please try again.";

            Alert.alert("Sign Up Failed", errorMessage);
        } finally {
            // Always stop loading
            setisloading(false);
        }
    };




    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            try {
                setisloading(true)
                const response = await termsandconditons()
                console.log(response)
                setHtmlContent(response)
                setisloading(false)
            } catch (error: any) {
                setisloading(true)
                console.log(error.response)
                Alert.alert('Error', "An error occured while fetching terms and conditions", [
                    {
                        text: "Ok",
                        onPress: () => ""
                    }
                ])
                setisloading(false)
                // return;
            }
        })
        return unsubscribe;
    }, [])

    if (isloading) {
        return <LogoSpinner lightColor='' darkColor='' />
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust for header height if needed
            >
                <Animated.ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <GoBack lightColor='' darkColor='' onClick={() => router.back()}>
                        <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
                    </GoBack>
                    <View style={{ margin: 15 }} />

                    <ThemedText type="titleMedium">Create A Business Account</ThemedText>

                    <View style={{ margin: 10 }} />

                    <ThemedText>Comapany Name</ThemedText>
                    <Input
                        placeholder="Enter here"
                        keyboardType="default"
                        value={formData.companyname}
                        onUpdateValue={(val) =>
                            setFormData({ ...formData, companyname: val })
                        }
                        isInvalid={!!errors.companyname}
                        autoCapitalize='sentences'
                    // rightIcon={<Octicons name="person" size={18} color={Colors.gray9} />}
                    />
                    <View style={{ margin: 5 }} />

                    <ThemedText>Email</ThemedText>
                    <Input
                        placeholder="Enter here"
                        keyboardType="email-address"
                        // rightIcon={<Octicons name="person" size={18} color={Colors.gray9}/>}
                        value={formData.email}
                        onUpdateValue={(val) =>
                            setFormData({ ...formData, email: val })
                        }
                        isInvalid={!!errors.email}
                    />

                    <View style={{ margin: 5 }} />

                    <ThemedText>Company Email</ThemedText>
                    <Input
                        placeholder="Enter here"
                        keyboardType="email-address"
                        // rightIcon={<Octicons name="person" size={18} color={Colors.gray9}/>}
                        value={formData.cemail}
                        onUpdateValue={(val) =>
                            setFormData({ ...formData, cemail: val })
                        }
                        isInvalid={!!errors.cemail}
                    />
                    <View style={{ margin: 5 }} />

                    <ThemedText>RC Number</ThemedText>
                    <Input
                        placeholder="Enter here"
                        keyboardType="default"
                        value={formData.rcNumber}
                        onUpdateValue={(val) =>
                            setFormData({ ...formData, rcNumber: val })
                        }
                        isInvalid={!!errors.rcNumber}
                    // rightIcon={<Octicons name="person" size={18} color={Colors.gray9}/>}
                    />
                    <View style={{ margin: 5 }} />

                    <ThemedText>TIN</ThemedText>
                    <Input
                        placeholder="Enter here"
                        keyboardType="default"
                        value={formData.tinNumber}
                        onUpdateValue={(val) =>
                            setFormData({ ...formData, tinNumber: val })
                        }
                        isInvalid={!!errors.tinNumber}
                    // rightIcon={<MaterialIcons name="keyboard-arrow-down" size={18} color={Colors.gray9} />}
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
                                isInvalid={!!errors.phone}
                                maxLength={10}
                            />
                        </View>
                    </View>

                    <View style={{ margin: 5 }} />

                    <ThemedText>Referral Code</ThemedText>
                    <Input
                        placeholder="Enter referral code"
                        keyboardType="default"
                        rightIcon={<Octicons name="person" size={18} color={Colors.gray9} />}
                    />
                    <View style={{ margin: 5 }} />

                    <ThemedText>Password</ThemedText>
                    <Input
                        placeholder="Password"
                        secure
                        value={formData.password}
                        onUpdateValue={(val) =>
                            setFormData({ ...formData, password: val })
                        }
                        isInvalid={!!errors.password}
                    />
                    <View style={{ margin: 3 }} />
                    <View style={{ margin: 3 }} />
                    <PasswordRules password={formData.password} />
                    <View style={{ margin: 5 }} />

                    <ThemedText>Confirm Password</ThemedText>
                    <Input
                        placeholder="Confirm Password"
                        secure
                        value={formData.confirmPassword}
                        onUpdateValue={(val) =>
                            setFormData({ ...formData, confirmPassword: val })
                        }
                        isInvalid={!!errors.confirmPassword}
                    />
                    <View style={{ margin: 10 }} />

                    <ThemedButton style={{ backgroundColor: Colors.green, padding: 15, borderRadius: 30, alignItems: 'center' }} onPress={() => { handleSignup() }}>
                        <ThemedText style={{ color: '#fff' }}>Proceed</ThemedText>
                    </ThemedButton>
                    <View style={{ margin: 15 }} />
                </Animated.ScrollView>

                <Modal
                    transparent
                    visible={modalVisible}
                    animationType="slide"
                    onRequestClose={closePopup}
                >
                    {/* Overlay */}
                    <View style={styles.overlay} />

                    {/* Popup Container */}
                    <Animated.View
                        style={[
                            styles.popup,
                            {
                                transform: [{ translateY: slideAnim }],
                                backgroundColor: color1,
                                maxHeight: "80%", // limit height so it can scroll
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                            },
                        ]}
                    >
                        <ScrollView
                            style={{ flexGrow: 0 }}
                            contentContainerStyle={{ padding: 10 }}
                            showsVerticalScrollIndicator={true}
                        >
                            <ThemedText>{htmlContent}</ThemedText>


                            <ThemedButton
                                onPress={() => [
                                    closePopup(),
                                    signupHandler()
                                ]}
                                style={{ paddingHorizontal: 30, paddingVertical: 13, borderRadius: 30, alignSelf: "center", backgroundColor: Colors.green }}
                            >
                                <ThemedText style={{ color: '#fff' }}>I Agree</ThemedText>
                            </ThemedButton>

                            <View style={{ margin: 5 }} />

                            <ThemedButton
                                onPress={() => {
                                    closePopup();
                                }}
                                style={{ paddingHorizontal: 30, paddingVertical: 13, alignSelf: "center" }}
                            >
                                <ThemedText style={{ color: Colors.green }}>I Disagree</ThemedText>
                            </ThemedButton>

                            <View style={{ margin: 10 }} />
                        </ScrollView>
                    </Animated.View>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    popup: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
        // justifyContent:'center'
        // alignItems:'center'
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
})