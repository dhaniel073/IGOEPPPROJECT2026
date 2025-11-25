import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { NotificationProvider } from '@/context/NotificationContext';
import { AuthProvider } from '@/hooks/AuthContext';
import { getpaystackkey } from '@/hooks/AuthRoutes';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { PaystackProvider } from 'react-native-paystack-webview';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldShowAlert: true
  }),
});

SplashScreen.preventAutoHideAsync

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [paystackKey, setPaystackKey] = useState<any>(null);

  const [loaded] = useFonts({
    poppinsRegular: require("@/assets/fonts/Poppins-Regular.ttf"),
    poppinsMedium: require("@/assets/fonts/Poppins-Medium.ttf"),
    poppinsSemiBold: require("@/assets/fonts/Poppins-SemiBold.ttf"),
    poppinsBold: require("@/assets/fonts/Poppins-Bold.ttf"),
    interBold: require("@/assets/fonts/Inter-Bold.ttf"),
    interMedium: require("@/assets/fonts/Inter-Medium.ttf"),
    interRegular: require("@/assets/fonts/Inter-Regular.ttf"),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const fetchPaystackKey = async () => {
      try {
        const response = await getpaystackkey();
        setPaystackKey(response);
      } catch (error) {
        console.error("Error fetching Paystack key:", error);
      }
    };

    fetchPaystackKey();
  }, []);

  useEffect(() => {
    askNotificationPermission();
  }, []);

  const askNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();

    // If not granted, ask the user
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      console.log("Notification permission:", newStatus);
    } else {
      console.log("Notification already granted");
    }
  };


  // if (!paystackKey) {
  //   return (
  //     <LogoSpinner lightColor='' darkColor=''/>
  //   );
  // }

  return (
    <PaystackProvider
      debug
      publicKey={paystackKey}
      currency='NGN'
      defaultChannels={["card", "bank_transfer"]}
    >
      <NotificationProvider>
        <AuthProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(public)" />
              <Stack.Screen name="(protected)" />
            </Stack>
          </ThemeProvider>
        </AuthProvider>
      </NotificationProvider>
    </PaystackProvider>
  );
}
