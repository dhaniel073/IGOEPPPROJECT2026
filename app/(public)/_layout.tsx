import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useAuth } from '@/hooks/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useEffect } from 'react';

export const unstable_settings = {
  initialRouteName: "(public)"
}

export default function PublicLayout() {
  const colorScheme = useColorScheme();
  const { token, isLoading } = useAuth();
  const router = useRouter();

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

  useEffect(() => {
    if (!isLoading && token) {
      // Already logged in → redirect to protected tabs
      router.replace("/");
    }
  }, [isLoading, token]);

  if (isLoading) {
    // return <LogoSpinner lightColor='' darkColor=''/>
  }

  console.log(isLoading)
  // if (token) return null;


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="landingscreen" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="signup1" options={{ headerShown: false }} />
        <Stack.Screen name="signupPersonal" options={{ headerShown: false }} />
        <Stack.Screen name="signupBusiness" options={{ headerShown: false }} />
        <Stack.Screen name="welcomescreen" options={{ headerShown: false }} />
        <Stack.Screen name="signupBusinessEntity" options={{ headerShown: false }} />
        <Stack.Screen name="forgotpassword" options={{ headerShown: false }} />


        {/* <Stack.Screen name="+not-found" /> */}
      </Stack>
    </ThemeProvider>
  );
}
