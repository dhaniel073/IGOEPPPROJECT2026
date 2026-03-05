import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-get-random-values';
import 'react-native-reanimated';

import { NetworkMonitor } from '@/components/NetworkMonitor';
import { SecurityWrapper } from '@/components/SecurityWrapper';
import { NotificationProvider } from '@/context/NotificationContext';
import { AuthProvider } from '@/hooks/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';


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
    askNotificationPermission();
  }, []);

  const askNotificationPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();

    // If not granted, ask the user
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
    } else {
      return;
    }
  };


  // if (!paystackKey) {
  //   return (
  //     <LogoSpinner lightColor='' darkColor=''/>
  //   );
  // }

  return (
    <SecurityWrapper>
      <AuthProvider>
        <NotificationProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <StatusBar style="auto" />
            <NetworkMonitor />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(public)" />
              <Stack.Screen name="(protected)" />
            </Stack>
          </ThemeProvider>
        </NotificationProvider>
      </AuthProvider>
    </SecurityWrapper>
  );
}
