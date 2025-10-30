import GoBack from '@/components/GoBack'
import LogoSpinner from '@/components/LoadingScreen'
import PinInput from '@/components/PinInput'
import { ThemedText } from '@/components/ThemedText'
import { Colors, decryptData, encryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { customerinfocheck, setuppin, updatepin, validatepin } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useNavigation, useRouter } from 'expo-router'
import React, { useLayoutEffect, useState } from 'react'
import { Alert, Animated, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export type Props = {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor?: { dark: string; light: string };
};

export default function TransactionPin({
  lightColor,
  darkColor,
  headerBackgroundColor,
}: Props) {

  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const router = useRouter();
  const navigation = useNavigation();

  const { user, updateUser, token, logout } = useAuth();

  const [step, setStep] = useState<'create' | 'verifyOld' | 'newPin' | 'confirmPin' | null>(null);
  const [tempNewPin, setTempNewPin] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  //Fetch user info first
  useLayoutEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await customerinfocheck(user?.customer_id, decryptData(token));
        updateUser(response);
        if (response?.transaction_pin_setup === 'Y') {
          setStep('verifyOld');
        } else {
          setStep('create');
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          Alert.alert("Session expired", "Please log in again.");
          await logout(); // from your AuthContext
          router.replace("/login"); // navigate to login screen
        } else {
          Alert.alert('Error', 'Unable to load notification settings.')
        }
        // console.error("Error fetching user info:", error.response || error);
        setStep('create');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", fetchUserInfo);
    fetchUserInfo(); // run on mount too
    return unsubscribe;
  }, []);

 
  // Handlers
 
  //new pin
  const handleSetNewPin = async (pin: string) => {
    try {
      setLoading(true);
      console.log("Setting new PIN:", pin);
      // await api.post('/set-pin', { pin });
      const response = await setuppin(user?.customer_id, encryptData(pin), decryptData(token))
      alert("PIN set successfully!");
      router.back();
    } catch (error) {
      // console.error("Error setting PIN:", error);
    } finally {
      setLoading(false);
    }
  };

  //validate pin
  const handleVerifyOldPin = async (pin: string) => {
    try {
      setLoading(true)
      console.log("Verifying old PIN:", pin);
      const verified = await validatepin(user?.customer_id, encryptData(pin), decryptData(token));
      console.log(verified)
      // const verified = true; // mock
      if (verified) {
        setStep('newPin');
      } else {
        alert("Incorrect old PIN");
      }
    } catch (error: any) {
      // console.error("Error verifying old pin:", error.response);
      alert(error.response.data.message || "Incorrect old PIN")
    } finally {
      setLoading(false);
    }
  };

  const handleNewPin = (pin: string) => {
    setTempNewPin(pin);
    setStep('confirmPin');
  };

  //update pin
  const handleConfirmPin = async (pin: string) => {
    if (pin !== tempNewPin) {
      alert("Pins do not match");
      setStep('newPin');
      return;
    }
    try {
      setLoading(true)
      console.log("Updating new PIN:", pin);
      await updatepin(user?.customer_id, encryptData(pin), decryptData(token))
      alert("PIN reset successfully!");
      router.back();
    } catch (error) {
      // console.error("Error updating PIN:", error);
    } finally {
      setLoading(false);
    }
  };

 
  // Dynamic UI per step
  const renderStepUI = () => {

    switch (step) {
      case 'create':
        return (
          <>
            <ThemedText type='titleMedium' style={{ textAlign: 'center' }}>Enter PIN</ThemedText>
            <View style={{ margin: 8 }} />
            <ThemedText style={{ textAlign: 'center', color: Colors.gray9 }}>
              Set your four-digit transaction PIN
            </ThemedText>
            <View style={{ margin: 10 }} />
            <PinInput length={4} secure={true} onSubmit={handleSetNewPin} />
          </>
        );

      case 'verifyOld':
        return (
          <>
            <ThemedText type='titleMedium' style={{ textAlign: 'center' }}>Enter Old PIN</ThemedText>
            <View style={{ margin: 8 }} />
            <ThemedText style={{ textAlign: 'center', color: Colors.gray9 }}>
              Verify your current transaction PIN
            </ThemedText>
            <View style={{ margin: 10 }} />
            <PinInput length={4} secure={true} onSubmit={handleVerifyOldPin} />
          </>
        );

      case 'newPin':
        return (
          <>
            <ThemedText type='titleMedium' style={{ textAlign: 'center' }}>Enter New PIN</ThemedText>
            <View style={{ margin: 10 }} />
            <PinInput length={4} secure={true} onSubmit={handleNewPin} />
          </>
        );

      case 'confirmPin':
        return (
          <>
            <ThemedText type='titleMedium' style={{ textAlign: 'center' }}>Confirm New PIN</ThemedText>
            <View style={{ margin: 10 }} />
            <PinInput length={4} secure={true} onSubmit={handleConfirmPin} />
          </>
        );

      default:
        return null;
    }
  };

  if (loading || !step) {
    return <LogoSpinner lightColor='' darkColor=''/>
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust for header height if needed
      >
        <Animated.ScrollView showsVerticalScrollIndicator={false}>
          <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
            <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
          </GoBack>

          <View style={{ margin: 15 }} />

          <ThemedText type="titleMedium">Set Transaction PIN</ThemedText>
          <ThemedText style={{ color: Colors.gray9 }}>
            Enter a four-digit transaction PIN to enable
          </ThemedText>
          <ThemedText style={{ color: Colors.gray9 }}>
            transactions on the IGOEPP app
          </ThemedText>

          <View style={{ margin: 20 }} />

          {renderStepUI()}
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
