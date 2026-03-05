import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { Colors, decryptData, encryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { resettoken, validatecustomerpasswordchangetoken } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Animated, StyleSheet, TextProps, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor: { dark: string; light: string };
};


export default function changepassword1({
  lightColor,
  darkColor,
  headerBackgroundColor,
}: Props) {

  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const router = useRouter()
  const [pin, setPin] = useState<any>()
  const [isloading, setisLoading] = useState(false)
  const { user, token, logout } = useAuth()

  const submitHandler = async () => {
    const emailIsValid = pin.length !== 4

    const onlyNumbers = /^[0-9]*$/;
    if (onlyNumbers.test(pin) && !emailIsValid) {
      try {
        setisLoading(true)
        const response = await validatecustomerpasswordchangetoken(user?.customer_id, encryptData(pin), decryptData(token))
        router.push('/changepassword2')
      } catch (error: any) {
        Alert.alert("Error", `${error.response.data.message}`)
        setisLoading(false)
      } finally {
        setisLoading(false)
      }
    } else {
      Alert.alert("Invalid token", "Please enter a valid token")
    }
  }

  const sendcode = async () => {
    try {
      setisLoading(true)
      const response = await resettoken(user?.customer_id, decryptData(token))
    } catch (error: any) {
      Alert.alert('Error', error.response.data.message ?? 'Unable to change password.')
    } finally {
      setisLoading(false)
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

        <View style={{ margin: 15 }} />
        <ThemedText type="titleMedium">Change Password</ThemedText>
        <ThemedText style={{ color: Colors.gray9 }}>Reset you password here</ThemedText>


        <View style={{ margin: 6 }} />

        <ThemedText>Enter code</ThemedText>
        <Input
          placeholder={"Enter the 4 digit code set to your email"}
          value={pin}
          onUpdateValue={setPin}
          autoCapitalize={'none'}
          maxLength={4}
          keyboardType={'number-pad'}
        />
        <View style={{ margin: 15 }} />

        <ThemedText onPress={sendcode} style={{ textDecorationLine: 'underline', textAlign: 'center' }}>Resend Code?</ThemedText>
        <View style={{ margin: 5 }} />
        <ThemedButton style={{ padding: 15, borderRadius: 30, alignItems: 'center', backgroundColor: Colors.green }} onPress={submitHandler}>
          <ThemedText type='smallBold' style={{ color: "#fff" }}>Proceed</ThemedText>
        </ThemedButton>
      </Animated.ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

})