import GoBack from '@/components/GoBack'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Alert, Animated, Linking, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'



export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor: { dark: string; light: string };
};


export default function helpandsupport1({
  lightColor,
  darkColor,
  headerBackgroundColor,
}: Props) {

  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const router = useRouter()

  const makeCall = (phoneNumber: string) => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "Unable to make a call on this device.");
        }
      })
      .catch((err) => console.error("Error occurred", err));
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }} edges={['top', 'bottom']}>
      <Animated.ScrollView showsVerticalScrollIndicator={false}>
        <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
          <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
        </GoBack>

        <View style={{ margin: 6 }} />

        <ThemedText type="titleMedium">Help & Support</ThemedText>
        <ThemedText>How can we help you?</ThemedText>

        <View style={{ margin: 15 }} />

        <ThemedView style={{ justifyContent: 'center', alignSelf: 'center' }}>
          <ThemedView style={{ justifyContent: 'center', alignSelf: 'center' }}>
            <ThemedView style={{ backgroundColor: Colors.clock, padding: 30, borderRadius: 15, alignSelf: 'flex-start' }}>
              <Feather name="phone-call" size={24} color="black" />
            </ThemedView>
          </ThemedView>

          <View style={{ margin: 15 }} />

          <ThemedText type='titleLight' style={{ textAlign: 'center' }}>Hi, let's help you today</ThemedText>


          <View style={{ margin: 15 }} />

          <ThemedText style={{ textAlign: 'center', color: Colors.gray9 }}>Phone lines are available between 8:00 AM</ThemedText>
          <ThemedText style={{ textAlign: 'center', color: Colors.gray9 }}>and 5:00 PM on weekdays</ThemedText>


          <View style={{ margin: 15 }} />
          <ThemedText style={{ textAlign: 'center', color: Colors.green1 }}>Tap the number to call</ThemedText>

          <View style={{ margin: 15 }} />

          <TouchableOpacity onPress={() => makeCall('+2348105638530')}>
            <ThemedText type='subtitle' style={{ textAlign: 'center' }}>+2348105638530</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </Animated.ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({

})