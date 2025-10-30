import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import PinInput from '@/components/PinInput'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Animated, Dimensions, KeyboardAvoidingView, Modal, Platform, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { height } = Dimensions.get('window');
export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};


export default function billspaymentBetting({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [isloading, setIsLoading] = useState(false)

    const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen
  
    const [visible, setVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const openPopup1 = () => {
      setModalVisible1(true);
      Animated.timing(slideAnim, {
      toValue: 0, // Slide to the screen
      duration: 300,
      useNativeDriver: true,
      }).start();
    };
        
    const closePopup1 = () => {
      Animated.timing(slideAnim, {
      toValue: height, // Slide back down
      duration: 300,
      useNativeDriver: true,
      }).start(() => setModalVisible1(false)); // Close after animation
    };

    const validatehandler = () => { 
      Alert.alert("Confirm Payment", "You are about to pay for WAEC PIN", [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Proceed",
          onPress: () => openPopup1()
        }
      ]); 
    }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // adjust for header height if needed
      >
        <Animated.ScrollView showsVerticalScrollIndicator={false}>  
          <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
            <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
          </GoBack>
          <View style={{margin:15}}/> 
          <ThemedText type="titleMedium">Betting and Lottery</ThemedText>
          <ThemedText style={{color: Colors.gray9}}>Fund your betting account</ThemedText>
          <View style={{margin:10}}/> 

          <ThemedText>Select Betting Platform</ThemedText>

          <View style={{ flex: 1 }}>
            <Input
              placeholder="1x bet"
              keyboardType="phone-pad"
            />
          </View>
          <View style={{margin:5}}/>

          <ThemedText>Bet ID</ThemedText>

          <View style={{ flex: 1 }}>
            <Input
              placeholder="Please enter"
              keyboardType="default"
            />
          </View>
          <View style={{margin:5}}/>

          <ThemedText>Enter Amount</ThemedText>
          <View style={{ flex: 1 }}>
            <Input
              placeholder="NGN 0.00"
              keyboardType="phone-pad"
            />
          </View>
          <View style={{margin:15}}/>

          <ThemedButton style={{backgroundColor: Colors.green, padding: 15, borderRadius:30, alignItems:'center'}} onPress={() => {validatehandler()}} disabled={isloading}>
            <ThemedText style={{color:'#fff'}}>Continue</ThemedText>
          </ThemedButton>

            


          <Modal
            transparent
            visible={modalVisible1}
            animationType="slide" 
            onRequestClose={closePopup1}
          >
            <TouchableOpacity style={styles.overlay} onPress={() => [closePopup1()]} />

            <Animated.View
              style={[
                styles.popup,
                { transform: [{ translateY: slideAnim }], backgroundColor: color1 },
              ]}
            >
              <ThemedText type='titleMedium' style={{textAlign:'center'}}>Enter Pin</ThemedText>
              <View style={{margin:8}}/> 

              <ThemedText style={{textAlign:'center', color: Colors.gray9}}>Enter Transaction PIN</ThemedText>
              <View style={{margin:10}}/>
              <View style={{margin:5}}/>
              <PinInput length={4} secure={true} onSubmit={(pin) => {setVisible(true), closePopup1()}}/>
              <View style={{margin:10}}/>
            </Animated.View>
          </Modal>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    bottom:0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    boxShadow: '0px 4px 6px rgba(0,0,0,0.35)', 
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})