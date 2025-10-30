import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import PinInput from '@/components/PinInput'
import ReceiptView from '@/components/ReceiptView'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Animated, Dimensions, KeyboardAvoidingView, Modal, Platform, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


const height = Dimensions.get('window').height;
export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};


export default function billspaymentTv({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [isloading, setIsLoading] = useState(false)
    const [visible, setVisible] = useState(false);
    
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen

    const openPopup = () => {
      setModalVisible(true);
      Animated.timing(slideAnim, {
      toValue: 0, // Slide to the screen
      duration: 300,
      useNativeDriver: true,
      }).start();
    };
        
    const closePopup = () => {
      Animated.timing(slideAnim, {
      toValue: height, // Slide back down
      duration: 300,
      useNativeDriver: true,
      }).start(() => setModalVisible(false)); // Close after animation
    };

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

    const validatehandler = async () => {
      setIsLoading(true)
      openPopup()
      setIsLoading(false)
    } 

    
    const handleSubmit = (pin: any) => {
      console.log("Entered PIN:", pin);
      // handle verification here
    };
        

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
          <ThemedText type="titleMedium">Buy Cable TV</ThemedText>
          <ThemedText style={{color: Colors.gray9}}>Renew your TV subscription effortlessly</ThemedText>
          <View style={{margin:10}}/> 

          <ThemedText>Select Satellite Network</ThemedText>

          <View style={{ flex: 1 }}>
            <Input
              placeholder="Please select"
              keyboardType="phone-pad"
            />
          </View>
          <View style={{margin:5}}/>

          <ThemedText>Select Plan</ThemedText>

          <View style={{ flex: 1 }}>
            <Input
              placeholder="Please select"
              keyboardType="phone-pad"
            />
          </View>

          <View style={{margin:5}}/>

          <ThemedText>Smart Card Number </ThemedText>

          <View style={{ flex: 1 }}>
            <Input
              placeholder="Please select"
              keyboardType="phone-pad"
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
            visible={modalVisible}
            animationType="slide" 
            onRequestClose={closePopup}
          >
            <TouchableOpacity style={styles.overlay} onPress={() => [closePopup()]} />

            <Animated.View
              style={[
                styles.popup,
                { transform: [{ translateY: slideAnim }], backgroundColor: color1 },
              ]}
            >
              <View style={{margin:10}}/>

              <View  style={{flexDirection:'row', justifyContent:'center'}}> 
                <ThemedText type='subtitle' style={{textAlign:'center', flex:1}}>Transaction Review</ThemedText>
                <TouchableOpacity onPress={closePopup} style={{alignSelf:'flex-end'}}>
                  <MaterialIcons name="cancel" size={24} color={Colors.green}/>
                </TouchableOpacity>
              </View>

              <View style={{margin:10}}/>
              <ThemedView style={{backgroundColor: Colors.gray7, marginHorizontal:10}}>
                <View style={{margin:10}}/>
                <ThemedText style={{color:Colors.blacktext, textAlign:'center'}}>Amount</ThemedText>
                <ThemedText style={{color: Colors.green8, textAlign:'center'}} type='subtitle'>NGN 0.00</ThemedText>
                <View style={{margin:10}}/> 
              </ThemedView>

              <View style={{margin:10}}/>

              <ThemedView style={{backgroundColor: Colors.gray7, marginHorizontal:10, paddingHorizontal:20, paddingVertical:20}}>
                <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                  <ThemedText style={{color: '#000'}}>From</ThemedText>
                  <ThemedText style={{color:Colors.wallet }}>Wallet</ThemedText>
                </View>
                <View style={{margin:7}}/>

                <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                  <ThemedText style={{color: '#000'}}>Smart Card Number</ThemedText>
                  <ThemedText style={{color:Colors.wallet }}>12345678910</ThemedText>
                </View>
                <View style={{margin:7}}/>

                <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                  <ThemedText style={{color: '#000'}}>Biller</ThemedText>
                  <ThemedText style={{color:Colors.wallet }} >GoTv Subscription Network</ThemedText>
                </View>
                <View style={{margin:7}}/>

                <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                  <ThemedText style={{color: '#000'}}>Name</ThemedText>
                  <ThemedText style={{color:Colors.wallet }} >Daniel Chinedu</ThemedText>
                </View>
                <View style={{margin:7}}/>

                <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                  <ThemedText style={{color: '#000'}}>Package</ThemedText>
                  <ThemedText style={{color:Colors.wallet }}>Jolly</ThemedText>
                </View>
              </ThemedView>
              <View style={{margin:15}}/>

              <ThemedButton style={{backgroundColor: Colors.green, padding: 15, borderRadius:30, marginHorizontal:10, alignItems:'center'}} onPress={() => [closePopup(), openPopup1()]} disabled={isloading}>
                <ThemedText style={{color:'#fff'}}>Proceed</ThemedText>
              </ThemedButton>
            </Animated.View>
          </Modal>


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

          <ReceiptView visible={visible} onClose={() => setVisible(false)} watermarkText="IGOEPP">
            <ThemedView style={{backgroundColor: Colors.gray6, marginHorizontal:10, paddingHorizontal:20, paddingVertical:20}}>
              <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                <ThemedText style={{color: '#000'}} type='small'>From</ThemedText>
                <ThemedText style={{color:Colors.wallet }} type='small'>Wallet</ThemedText>
              </View>
              <View style={{margin:7}}/>

              <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                <ThemedText style={{color: '#000'}} type='small'>Meter Number</ThemedText>
                <ThemedText style={{color:Colors.wallet }} type='small'>12345678910</ThemedText>
              </View>
              <View style={{margin:7}}/>

              <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                <ThemedText style={{color: '#000'}} type='small'>Name</ThemedText>
                <ThemedText style={{color:Colors.wallet }} type='small'>Daniel Chinedu</ThemedText>
              </View>
              <View style={{margin:7}}/>

              <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                <ThemedText style={{color: '#000'}} type='small'>Disco</ThemedText>
                <ThemedText style={{color:Colors.wallet }} type='small'>Ikeja Electricity</ThemedText>
              </View>

              <View style={{margin:7}}/>

              <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                <ThemedText style={{color: '#000'}} type='small'>From</ThemedText>
                <ThemedText style={{color:Colors.wallet }} type='small'>Wallet</ThemedText>
              </View>
              <View style={{margin:7}}/>

              <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                <ThemedText style={{color: '#000'}} type='small'>Meter Number</ThemedText>
                <ThemedText style={{color:Colors.wallet }}type='small'>12345678910</ThemedText>
              </View>
              <View style={{margin:7}}/>

              <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                <ThemedText style={{color: '#000'}} type='small'>Name</ThemedText>
                <ThemedText style={{color:Colors.wallet }} type='small'>Daniel Chinedu</ThemedText>
              </View>
              <View style={{margin:7}}/>

              <View style={{justifyContent:'space-between', flexDirection:'row'}}>
                <ThemedText style={{color: '#000'}}type='small'>Disco</ThemedText>
                <ThemedText style={{color:Colors.wallet }}type='small'>Ikeja Electricity</ThemedText>
              </View>
            </ThemedView>
          </ReceiptView>
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