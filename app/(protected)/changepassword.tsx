import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { resettoken } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Octicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Animated, StyleSheet, TextProps, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};


export default function changepassword({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const router = useRouter()
  const {user, token, logout} = useAuth()
  const [isloading, setisLoading] = useState(false)

  const submitHandler = async () => {
    try {
      setisLoading(true)
      const response = await resettoken(user?.customer_id, decryptData(token))
      console.log(response)
      router.push('/changepassword1')
    } catch (error: any) {
      if (error.response?.status === 401) {
        Alert.alert("Session expired", "Please log in again.");
        await logout(); // from your AuthContext
        router.replace("/login"); // navigate to login screen
      } else {
        Alert.alert('Error', 'Unable to load notification settings.')
      }
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
      <Animated.ScrollView showsVerticalScrollIndicator={false}>  
        <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
          <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
        </GoBack>

        <View style={{margin:15}}/> 
        <ThemedText type="titleMedium">Change Password</ThemedText>
        <ThemedText style={{color: Colors.gray9}}>Reset you password here</ThemedText>
        <ThemedText style={{color: Colors.gray9}}>A  4 digit code will be sent to your email address for verification.</ThemedText>

        <View style={{margin:15}}/> 

        <ThemedText>Email Address</ThemedText>
        <Input
          keyboardType='email-address'
          placeholder='Enter Email'
          value={user?.email}
          editable={false}
          rightIcon={<Octicons name="person" size={22} color={Colors.gray9} />}
        />

        <View style={{margin:10}}/>

        <ThemedButton style={{ padding: 15, borderRadius:30, alignItems:'center', backgroundColor: Colors.green}} onPress={submitHandler}>
          <ThemedText type='smallBold' style={{color:"#fff"}}>Proceed</ThemedText>
        </ThemedButton>
      </Animated.ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

})