import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { validateforgotpassword } from '@/components/validateforgotpassword'
import { Colors } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { forgotpass } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Octicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Animated, KeyboardAvoidingView, Platform, StyleSheet, TextProps, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};


export default function forgotpassword({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const router = useRouter()
  const {user, token, logout} = useAuth()
  const [isloading, setisLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: "",
  });


  const handleSignup = () => {
    const validationErrors = validateforgotpassword(formData);
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
    return submitHandler();
  };

  const submitHandler = async () => {
    try {
      setisLoading(true)
      const response = await forgotpass(formData.email)
      console.log(response)
      Alert.alert('Success', 'A mail has been sent', [
        {
          text: "Ok",
          onPress: () => router.replace("/login")
        }
      ])
    } catch (error: any) {
      Alert.alert("Error", `${error.response.data.message}`)  
    }finally{
      setisLoading(false)
    }
  } 

  if(isloading){
    return <LogoSpinner lightColor='' darkColor=''/>
  }

  return(
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust for header height if needed
      >
        <Animated.ScrollView>
          <View style={{flex:1}}>
            <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
              <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
            </GoBack>

              <View style={{margin:6}}/> 
              <ThemedText type="titleMedium">Forgot Password</ThemedText>
              <ThemedText style={{color: Colors.gray9}}>Oh sorry! it happens to us all. Enter your email address below and we will send you a link</ThemedText>

              <View style={{margin:15}}/> 

              <ThemedText>Email Address</ThemedText>
              <Input
                keyboardType='email-address'
                placeholder='Enter Email'
                value={formData.email}
                onUpdateValue={(val) => setFormData({ ...formData, email: val })}
                isInvalid={!!errors.email}
                rightIcon={<Octicons name="person" size={22} color={Colors.gray9} />}
              />

              <View style={{margin:15}}/>
          </View>

          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <ThemedText type='small'>Remember your password? </ThemedText>
            <ThemedButton  onPress={() => router.replace("/login")}><ThemedText type='small' style={{color: Colors.yellow}}>Click here</ThemedText></ThemedButton>
          </View>

          <View style={{margin:10}}/>

          <View style={{marginBottom:30}}>
            <ThemedButton style={{ padding: 15, borderRadius:30, alignItems:'center', backgroundColor: Colors.green}} onPress={handleSignup}>
              <ThemedText type='smallBold' style={{color:"#fff"}}>Proceed</ThemedText>
            </ThemedButton>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

})