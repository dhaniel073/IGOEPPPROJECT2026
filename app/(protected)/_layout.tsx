import LogoSpinner from '@/components/LoadingScreen';
import { decryptData } from '@/constants/Colors';
import { useAuth } from '@/hooks/AuthContext';
import { getpaystackkey } from '@/hooks/AuthRoutes';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useNavigation, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { PaystackProvider } from 'react-native-paystack-webview';
import 'react-native-reanimated';

export const unstable_settings = {
  initialRouteName: "(protected)"
}

export default function ProtectedLayout() {
  const colorScheme = useColorScheme();


  const [loaded] = useFonts({
    poppinsRegular: require("@/assets/fonts/Poppins-Regular.ttf"),
    poppinsMedium: require("@/assets/fonts/Poppins-Medium.ttf"),
    poppinsSemiBold: require("@/assets/fonts/Poppins-SemiBold.ttf"),
    poppinsBold: require("@/assets/fonts/Poppins-Bold.ttf"),
    interBold: require("@/assets/fonts/Inter-Bold.ttf"),
    interMedium: require("@/assets/fonts/Inter-Medium.ttf"),
    interRegular: require("@/assets/fonts/Inter-Regular.ttf"),
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { token, isLoading, user, updateUser, updateUserFields } = useAuth();
  const router = useRouter();
  const navigation = useNavigation()
  const [paystackKey, setPaystackKey] = useState<any>(null);


  useEffect(() => {
    if (!isLoading) {
      if (!token) {
        router.replace("/(public)/landingscreen");
      }
    }
  }, [isLoading, token]);

  useEffect(() => {
    const fetchPaystackKey = async () => {
      try {
        const response = await getpaystackkey(decryptData(token));
        setPaystackKey(response.public_key);
      } catch (error) {
        console.error("Error fetching Paystack key:", error);
      }
    };

    fetchPaystackKey();
  }, []);


  if (isLoading) {
    // Show loading indicator while restoring session
    return <LogoSpinner lightColor='' darkColor='' />;
  }

  if (!token) return null; // Prevent flicker while redirecting


  return (
    <PaystackProvider
      debug
      publicKey={paystackKey}
      currency='NGN'
      defaultChannels={["card", "bank_transfer"]}
    >
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* <InactivityProvider> */}

        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="helpandsupport" options={{ headerShown: false }} />
          <Stack.Screen name="helpandsupport1" options={{ headerShown: false }} />
          <Stack.Screen name="helpandsupport2" options={{ headerShown: false }} />
          <Stack.Screen name="addmoney" options={{ headerShown: false }} />
          <Stack.Screen name="addmoneycard" options={{ headerShown: false }} />


          <Stack.Screen name="bookings1" options={{ headerShown: false }} />
          <Stack.Screen name="bookinghistory" options={{ headerShown: false }} />
          <Stack.Screen name="bookinghistorydetails" options={{ headerShown: false }} />
          <Stack.Screen name="bidspending" options={{ headerShown: false }} />
          <Stack.Screen name="cart" options={{ headerShown: false }} />
          <Stack.Screen name="categoryScreen" options={{ headerShown: false }} />
          <Stack.Screen name="subcategoryScreen" options={{ headerShown: false }} />
          <Stack.Screen name="requesthelp" options={{ headerShown: false }} />
          <Stack.Screen name="selectartisan" options={{ headerShown: false }} />
          <Stack.Screen name="artisan" options={{ headerShown: false }} />
          <Stack.Screen name="marketitems" options={{ headerShown: false }} />
          <Stack.Screen name="transactionpin" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="profileEdit" options={{ headerShown: false }} />
          <Stack.Screen name="changepassword" options={{ headerShown: false }} />
          <Stack.Screen name="changepassword1" options={{ headerShown: false }} />
          <Stack.Screen name="changepassword2" options={{ headerShown: false }} />

          <Stack.Screen name="billspaymentAirtime" options={{ headerShown: false }} />
          <Stack.Screen name="billspaymentInternet" options={{ headerShown: false }} />
          <Stack.Screen name="billspaymentBetting" options={{ headerShown: false }} />
          <Stack.Screen name="billspaymentEducation" options={{ headerShown: false }} />
          <Stack.Screen name="billspaymentElectricity" options={{ headerShown: false }} />
          <Stack.Screen name="billspaymentTv" options={{ headerShown: false }} />
          <Stack.Screen name="virtualaccounttopup" options={{ headerShown: false }} />
          <Stack.Screen name="virtualaccountmaterial" options={{ headerShown: false }} />
          <Stack.Screen name="virtualaccountrequest" options={{ headerShown: false }} />
          <Stack.Screen name="addmoneytf" options={{ headerShown: false }} />
          <Stack.Screen name="notificationsetup" options={{ headerShown: false }} />
          <Stack.Screen name="compliance" options={{ headerShown: false }} />
          <Stack.Screen name="notificationview" options={{ headerShown: false }} />
          <Stack.Screen name="viewmaterials" options={{ headerShown: false }} />
          <Stack.Screen name="chatscreen" options={{ headerShown: false }} />
          <Stack.Screen name="wallethistory" options={{ headerShown: false }} />
          <Stack.Screen name="profilepictureview" options={{ headerShown: false }} />
          <Stack.Screen name="recurringrequest" options={{ headerShown: false }} />
          <Stack.Screen name="invoice" options={{ headerShown: false }} />
          <Stack.Screen name="checkout" options={{ headerShown: false }} />
          <Stack.Screen name="carthistory" options={{ headerShown: false }} />
          <Stack.Screen name="addressdetialsforrequest" options={{ headerShown: false }} />
          <Stack.Screen name="commission" options={{ headerShown: false }} />
          <Stack.Screen name="dispute" options={{ headerShown: false }} />
          <Stack.Screen name="customerrating" options={{ headerShown: false }} />
          <Stack.Screen name="inactivescreen" options={{ headerShown: false }} />

          {/* <Stack.Screen name="+not-found" /> */}
        </Stack>
        {/* </InactivityProvider> */}
      </ThemeProvider>
    </PaystackProvider>
  );
}
