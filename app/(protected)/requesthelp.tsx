import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Entypo, EvilIcons, Feather, Fontisto, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Animated, Dimensions, Modal, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

  const { height } = Dimensions.get('window');


 export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor:{ dark: string; light: string };
  };

  export default function categoryScreen({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props) {

  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(height)).current; 

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
  const makerequest = async () => {
    return openPopup()
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
      <Animated.ScrollView showsVerticalScrollIndicator={false}>  
        <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
          <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
        </GoBack>
        <View style={{margin:15}}/> 
        
        <ThemedText type="titleMedium">Make a Booking</ThemedText>


        <ThemedText>Selet Date</ThemedText>
        <Input
          placeholder="Please select"
          keyboardType="default"
          rightIcon={<Fontisto name="date" size={18} color={Colors.gray9} />}
        />

        <View style={{margin:5}}/>

        <ThemedText>Time</ThemedText>
        <Input
          placeholder="Please select"
          keyboardType="default"
          rightIcon={<Ionicons name="time-outline" size={20} color={Colors.gray9} />}
        />

        <ThemedText>Address</ThemedText>
        <Input
          placeholder="Enter Address"
          keyboardType="default"
          multiline
          rightIcon={<Entypo name="address" size={20} color={Colors.gray9} />}
        />

        <View style={{margin:5}}/>

        <ThemedText>Additional info</ThemedText>
        <Input
          placeholder="Enter Info"
          keyboardType="default"
        //   rightIcon={<FontAwesome6 name="city" size={18} color={Colors.gray9} />}
        />

        <View style={{margin:15}}/>

        <TouchableOpacity style={{backgroundColor: Colors.offwhite1, paddingHorizontal:18, paddingVertical:10, justifyContent:'space-between', flexDirection:'row', alignItems:'center', borderRadius:7}}>
            <View>
                <ThemedText style={{color: "#000"}}>Upload Image</ThemedText>
                <ThemedText type='small' style={{color: Colors.gray9}}>Upload Image</ThemedText>
            </View>
            <EvilIcons name="image" size={24} color={Colors.gray9} />
        </TouchableOpacity>

        <View style={{margin:15}}/>

        <ThemedButton style={{ padding: 15, borderRadius:30, alignItems:'center', backgroundColor: Colors.green}} onPress={() => makerequest()}>
          <ThemedText type='smallBold' style={{color:"#fff"}}>Proceed</ThemedText>
        </ThemedButton>
      </Animated.ScrollView>

      <Modal
        transparent
        visible={modalVisible}
        animationType="slide" 
        onRequestClose={closePopup}
      >
        <TouchableOpacity style={styles.overlay} onPress={() => {}} />

        <Animated.View
          style={[
            styles.popup,
            { transform: [{ translateY: slideAnim }], backgroundColor: color1 },
          ]}
        >
          <View style={{margin:15}}/>

          <Feather name="check-circle" size={120} color={Colors.green} />

          <View style={{margin:15}}/>

          <ThemedText>Booking Sent</ThemedText>
          <ThemedText>Congratulations, your booking</ThemedText>
          <ThemedText>has been submitted.</ThemedText>

          <View style={{margin:15}}/>
          <ThemedText>A notification will be sent to you</ThemedText>
          <ThemedText>shortly once an artisan make</ThemedText>
          <ThemedText>a bid</ThemedText>

          <View style={{margin:15}}/>

          <ThemedButton onPress={() => [closePopup(),router.push("/")]}>
              <ThemedText style={{color: Colors.green}}>Go to Home</ThemedText>
          </ThemedButton>

          <View style={{margin:15}}/>

        </Animated.View>
      </Modal>
    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  popup: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
    // justifyContent:'center'
    alignItems:'center'
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})