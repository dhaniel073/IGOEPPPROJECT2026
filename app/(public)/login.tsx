import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { Colors, encryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { authenticateLogin, loginwithbiometric } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Octicons } from '@expo/vector-icons'
import * as LocalAuthentication from "expo-local-authentication"
import { useRouter } from 'expo-router'
import * as SecureStore from "expo-secure-store"
import React, { useEffect, useState } from 'react'
import { Alert, Animated, Image, KeyboardAvoidingView, Platform, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};

export default function login({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

    const { login, isLoading } = useAuth();
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [isloading, setIsLoading] = useState(false)
    const [email, setemail] = useState<any>("")
    const [password, setpassword] = useState<any>("")
    const isValidEmail = (email: any) =>  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const [supported, setSupported] = useState(false);

    const loginHandler = async () => {
        console.log(email, password);

        // --- Validation ---
        if (!email.trim()) {
            Alert.alert("Error", "Email cannot be empty.");
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert("Error", "Please enter a valid email address.");
            return;
        }

        if (!password.trim()) {
            Alert.alert("Error", "Password cannot be empty.");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters long.");
            return;
        }

        // --- API Call ---
        try {
            setIsLoading(true);
            const encryptedPassword = encryptData(password);
            const response = await authenticateLogin(email, encryptedPassword);
            console.log("Login Response:", response);

            if (response) {
                await login(encryptData(response.access_token), response);
                router.replace("/");
            } else {
                Alert.alert("Login Failed", response?.message || "Invalid credentials.");
            }
        } catch (error: any) {
            console.log("Login Error:", error.response);
            Alert.alert("Error", error.response.data.message || "An error occurred during login.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const checkAvailability = async () => {
            const isSupported = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            setSupported(isSupported && enrolled);
        };
        checkAvailability();
    }, []);


    const handleToggle = async () => {
        // if (loading) return;

        if (!supported) {
            Alert.alert("Not Supported", "Your device does not support biometrics.");
            return;
        }

        // setLoading(true);
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Verify to enable biometrics",
            fallbackLabel: "Enter PIN",
        });

        // setLoading(false);

        if (result.success) {
            await loginbiometrics();
        } else {
            Alert.alert("Failed", "Authentication failed. Try again.");
        }
    };

    const loginbiometrics = async () => {
        let deviceToken = await SecureStore.getItemAsync("deviceToken");
        if (!deviceToken) {
            Alert.alert("No biometric token found", "Please login manually first.");
            return;
        }
        try {
            setIsLoading(true);
            const encryptedBiometric = encryptData(deviceToken);
            const response = await loginwithbiometric(encryptedBiometric);
            console.log("Auth Loading: "+ isLoading)
            console.log("Login Response:", response);

            if (response) {
                await login(encryptData(response.access_token), response);
                router.replace("/");
            } else {
                Alert.alert("Login Failed", response?.message || "Invalid credentials.");
            }
        } catch (error: any) {
            console.log("Login Error:", error.response);
            const msg = error?.response?.data?.message || error.message || "An unexpected error occurred";
            Alert.alert("Error", msg);
            setIsLoading(false);
        }
        console.log(deviceToken);
    }

    if(isloading){
        return <LogoSpinner lightColor='' darkColor=''/>
    }
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust for header height if needed
        >
            <Animated.ScrollView showsVerticalScrollIndicator={false}>  
                <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
                    <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
                </GoBack>
                
                <View style={{margin:10}}/> 

                <View style={{padding:15, borderWidth:1, alignSelf:'flex-start', borderRadius:100, borderColor: Colors.green}}>
                    <Image
                        source={require("@/assets/images/avatar1.png")}
                        style={styles.image}
                    />
                </View>

                <View style={{margin:5}}/> 

                <ThemedText type='title'>Login</ThemedText>
                <View style={{margin:2}}/> 
                <ThemedText style={{fontSize:11}}>Login to see our top picks for you.</ThemedText>

                <View style={{margin:15}}/>

                <ThemedText type='small'>Email Address</ThemedText>
                <Input
                    keyboardType='email-address'
                    placeholder='Enter Email'
                    value={email}
                    onUpdateValue={setemail}
                    isInvalid={email && !email.includes('@')}
                    rightIcon={<Octicons name="person" size={22} color={Colors.gray9} />}
                    />

                <View style={{margin:5}}/>
                <ThemedText type='small'>Password</ThemedText>
                <Input
                    value={password}
                    onUpdateValue={setpassword}
                    isInvalid={!password.trim() || password.length < 6}
                    keyboardType='default'
                    placeholder='Enter Password'
                    secure
                    />
                <View style={{margin:3}}/>

                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <ThemedText type='small' style={{color: Colors.green}}>Remember me</ThemedText>
                    <ThemedButton>
                        <ThemedText type='small' style={{color: Colors.green}}>Forgot password</ThemedText>
                    </ThemedButton>
                </View>
                <View style={{margin:10}}/>

                <ThemedButton style={{backgroundColor: Colors.green, padding: 15, borderRadius:30, alignItems:'center'}} onPress={() => {loginHandler()}}>
                    <ThemedText style={{color:'#fff'}}>Proceed</ThemedText>
                </ThemedButton>

                <View style={{margin:7}}/>

                <TouchableOpacity activeOpacity={0.6} onPress={handleToggle}>
                    <Image
                        source={require("@/assets/images/fingerprint.png")}
                        style={styles.image1}
                        />
                </TouchableOpacity>

                <View style={{margin:5}}/>
                <View style={{flexDirection:'row', justifyContent:'center'}}>
                    <ThemedText type='small'>Don't have an account? </ThemedText>
                    <ThemedButton  onPress={() => router.push("/signup")}><ThemedText type='small' style={{color: Colors.green}}>SignUp</ThemedText></ThemedButton>
                </View>

            </Animated.ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
    image:{
        width: 90,
        height: 90,
        borderRadius: 100,
        alignSelf:'flex-start',
        borderWidth:1,
        borderColor: Colors.green
    },

    image1:{
        width: 35,
        height: 45,
        alignSelf:'center',
        borderColor: Colors.green
    },
})