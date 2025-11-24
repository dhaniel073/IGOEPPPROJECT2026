import GoBack from '@/components/GoBack'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Alert, Animated, Linking, StyleSheet, TextProps, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};


export default function helpandsupport2({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const router = useRouter()

  const openWhatsApp = () => {
  const phoneNumber = "+2348105638530"; // Replace with the phone number
  const message = "Hello IGOEPP customer care."; // Replace with your message
  const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  
  Linking.canOpenURL(url)
    .then((supported) => {
    if (supported) {
      return Linking.openURL(url);
    } else {
      Alert.alert("Error", "WhatsApp is not installed on this device");
    }
    })
    .catch((err) => Alert.alert("Error", err.message));
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
      <Animated.ScrollView showsVerticalScrollIndicator={false}>  
        <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
            <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
        </GoBack>

        <View style={{margin:6}}/> 
        
        <ThemedText type="titleMedium">Chat with us</ThemedText>
        <ThemedText>How can we help you?</ThemedText>
        
        <View style={{margin:15}}/>  

        <ThemedView style={{justifyContent:'center', alignSelf:'center'}}>
          <ThemedView style={{justifyContent:'center', alignSelf:'center'}}>
            <ThemedView style={{backgroundColor: Colors.clock, padding: 8, borderRadius: 50, alignSelf: 'flex-start'}}>
              <View style={{backgroundColor: Colors.clock3, padding: 8, borderRadius: 50, alignSelf: 'flex-start'}}>
                <View style={{backgroundColor: Colors.wallet, padding: 15, borderRadius: 50, alignSelf: 'flex-start'}}>
                  <MaterialIcons name="support-agent" size={24} color={'#fff'}/>
                </View>
              </View>
            </ThemedView>
          </ThemedView>

          <View style={{margin:15}}/>  

          <ThemedText style={{textAlign:'center'}}>Hi, let's guild you to fix it</ThemedText>


          <View style={{margin:15}}/>  

          <ThemedText style={{textAlign:'center', color: Colors.gray9}}>Phone lines are available between 8:00 AM</ThemedText>
          <ThemedText style={{textAlign:'center',color: Colors.gray9}}>and 5:00 PM on weekdays</ThemedText>


          <View style={{margin:15}}/>  


          <ThemedButton style={{backgroundColor: Colors.green, borderRadius:30, padding:15}} onPress={openWhatsApp}>
            <ThemedText style={{textAlign:'center', color: '#fff'}}>Contact Live Chat</ThemedText>
          </ThemedButton>
        </ThemedView>

      </Animated.ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  
})