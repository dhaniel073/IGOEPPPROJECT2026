import FullScreenModal from '@/components/FullScreenModal'
import GoBack from '@/components/GoBack'
import Input from '@/components/Input'
import PinInput from '@/components/PinInput'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, DIMENSION } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Animated, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


const numbers = [
  {
    amount: `500`
  },
  {
    amount: "1000"
  },
  {
    amount: "2000"
  },
  {
    amount: "3000"
  },
  {
    amount: "4000"
  },
  {
    amount: "5000"
  },
  {
    amount:"6000"
  },
  {
    amount: "7000"
  }
]

const height = DIMENSION.HEIGHT;

export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};


export default function billspaymentData({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [isloading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<'self' | 'thirdparty'>('self');
    const [isInvalid, setIsInvalid] = useState(false)
    

    const [formattedamount, setFormattedAmount] = useState<any>('')
    const [amount, setAmount] = useState<any>()
    const formatNumber = (text:any) => {
      // Remove any non-numeric characters
      let cleanText = text.replace(/[^0-9]/g, '');
      // Format the number with commas
      return cleanText.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const formatNumber2 = (text:any) => {
      // Remove any non-numeric characters
      let cleanText = text.replace(/[^0-9]/g, '');
      // Format the number with commas
      return cleanText
    };

    const handleChange = (text: any) => {
      // Format the text as the user types
      const formattedValue = formatNumber(text);

      // Convert to raw number
      const newNumber = Number(formatNumber2(text));

      // Make sure it's a valid number (not NaN)
      setAmount(isNaN(newNumber) ? 0 : newNumber);

      setFormattedAmount(formattedValue);
    };

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
          <ThemedText type="titleMedium">Buy Data</ThemedText>
          <ThemedText style={{color: Colors.gray9}}>Select network and enter phone number</ThemedText>
          <ThemedText style={{color: Colors.gray9}}>to purchase data</ThemedText>
          <View style={{margin:10}}/> 

          <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'self' && styles.activeTab]}
            onPress={() => setActiveTab('self')}
          >
            <Text style={[styles.tabText, activeTab === 'self' && styles.activeTabText]}>
              Bills Payment
            </Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={[styles.tab, activeTab === 'thirdparty' && styles.activeTab]}
            onPress={() => setActiveTab('thirdparty')}
          >
            <Text style={[styles.tabText, activeTab === 'thirdparty' && styles.activeTabText]}>
              For Third Party
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{margin:10}}/> 

        <View>
          {activeTab === 'self' ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <ThemedText>Phone Number</ThemedText>
              <View style={{ flexDirection: "row", alignItems: "center"}}>
                {/* Country Code Box */}
                <ThemedView
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 14,
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: Colors.gray9,
                    marginRight: 10, // space between code box and input
                  }}
                >
                  <Image
                    source={require("@/assets/images/flag.png")}
                    style={{ width: 20, height: 15, resizeMode: "contain" }}
                  />
                  <ThemedText style={{ marginLeft: 6, fontSize: 16 }}>+234</ThemedText>
                </ThemedView>

                {/* Phone Number Input */}
                <View style={{ flex: 1 }}>
                  <Input
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={{margin:5}}/> 

              <ThemedText>Choose Network</ThemedText>
              <View style={{ flex: 1 }}>
                <Input
                  placeholder="MTN Nigeria"
                  keyboardType="default"
                />
              </View> 
              <View style={{margin:5}}/> 

              <ThemedText>Data Bundle</ThemedText>
              <View style={{ flex: 1 }}>
                <Input
                  placeholder="Please Select"
                  keyboardType="default"
                />
              </View> 
              <View style={{margin:5}}/> 

              <ThemedText>Enter Amount</ThemedText>
              <View style={{margin:5}}/> 
              <ThemedView style={[styles.container, {marginBottom:5, backgroundColor: Colors.offwhite1}]}>
                <View style={{flexDirection:'row', flex:1, justifyContent:'center', alignItems:'center'}}>
                  <MaterialCommunityIcons name="currency-ngn" size={20} color={Colors.gray9} />
                  <TextInput placeholder={'Amount'} 
                    style={[styles.input, isInvalid && styles.invalid, {color:Colors.gray9, }]} 
                    onFocus={() => setIsInvalid(false)}
                    value={formattedamount}
                    onChangeText={handleChange}
                    placeholderTextColor={Colors.gray9}
                    keyboardType='number-pad'
                    maxLength={9}
                  />
                </View>
                <TouchableOpacity onPress={() => [setFormattedAmount(null), setAmount(null)]} style={{padding:10}}>
                  <AntDesign name="close-circle" size={20} color={Colors.gray9} />
                </TouchableOpacity>
              </ThemedView>

              <View style={{margin:5}}/>

                <ThemedView style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {numbers.map((item, key) => (
                      <TouchableOpacity key={key} style={{backgroundColor:Colors.offwhite,paddingLeft: 5, margin: 5,paddingRight:5, borderRadius:15, padding:5}} onPress={() => handleChange(item.amount)}>
                        <ThemedText style={{color: Colors.green8}} type='smallBold'><MaterialCommunityIcons name="currency-ngn" size={15} color={Colors.green8} /> {item.amount.toLocaleString()+"."+"00"}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </ThemedView>
                <View style={{margin:15}}/>

                <ThemedButton style={{backgroundColor: Colors.green, padding: 15, borderRadius:30, alignItems:'center'}} onPress={() => {validatehandler()}} disabled={isloading}>
                  <ThemedText style={{color:'#fff'}}>Continue</ThemedText>
                </ThemedButton>
             </ScrollView>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <ThemedText>Phone Number</ThemedText>
              <View style={{ flexDirection: "row", alignItems: "center"}}>
                {/* Country Code Box */}
                <ThemedView
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 14,
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: Colors.gray9,
                    marginRight: 10, // space between code box and input
                  }}
                >
                  <Image
                    source={require("@/assets/images/flag.png")}
                    style={{ width: 20, height: 15, resizeMode: "contain" }}
                  />
                  <ThemedText style={{ marginLeft: 6, fontSize: 16 }}>+234</ThemedText>
                </ThemedView>

                {/* Phone Number Input */}
                <View style={{ flex: 1 }}>
                  <Input
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

               <View style={{margin:5}}/> 

              <ThemedText>Choose Network</ThemedText>
              <View style={{ flex: 1 }}>
                <Input
                  placeholder="MTN Nigeria"
                  keyboardType="default"
                />
              </View> 
              <View style={{margin:5}}/> 

              <ThemedText>Data Bundle</ThemedText>
              <View style={{ flex: 1 }}>
                <Input
                  placeholder="Please Select"
                  keyboardType="default"
                />
              </View> 
              <View style={{margin:5}}/> 

              <ThemedText>Enter Amount</ThemedText>
              <View style={{margin:5}}/> 
              <ThemedView style={[styles.container, {marginBottom:5, backgroundColor: Colors.offwhite1}]}>
                <View style={{flexDirection:'row', flex:1, justifyContent:'center', alignItems:'center'}}>
                  <MaterialCommunityIcons name="currency-ngn" size={20} color={Colors.gray9} />
                  <TextInput placeholder={'Amount'} 
                    style={[styles.input, isInvalid && styles.invalid, {color:Colors.gray9, }]} 
                    onFocus={() => setIsInvalid(false)}
                    value={formattedamount}
                    onChangeText={handleChange}
                    placeholderTextColor={Colors.gray9}
                    keyboardType='number-pad'
                    maxLength={9}
                  />
                </View>
                <TouchableOpacity onPress={() => [setFormattedAmount(null), setAmount(null)]} style={{padding:10}}>
                  <AntDesign name="close-circle" size={20} color={Colors.gray9} />
                </TouchableOpacity>
              </ThemedView>

              <View style={{margin:5}}/>

                <ThemedView style={{flexDirection:'row', justifyContent:'space-evenly'}}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {numbers.map((item, key) => (
                      <TouchableOpacity key={key} style={{backgroundColor:Colors.offwhite,paddingLeft: 5, margin: 5,paddingRight:5, borderRadius:15, padding:5}} onPress={() => handleChange(item.amount)}>
                        <ThemedText style={{color: Colors.green8}} type='smallBold'><MaterialCommunityIcons name="currency-ngn" size={15} color={Colors.green8} /> {item.amount.toLocaleString()+"."+"00"}</ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </ThemedView>
                <View style={{margin:15}}/>

                <ThemedButton style={{backgroundColor: Colors.green, padding: 15, borderRadius:30, alignItems:'center'}} onPress={() => {validatehandler()}} disabled={isloading}>
                  <ThemedText style={{color:'#fff'}}>Continue</ThemedText>
                </ThemedButton>
              </ScrollView>
            )
          }
        </View>
      </Animated.ScrollView>

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
              <ThemedText style={{color: '#000'}}>Phone Number</ThemedText>
              <ThemedText style={{color:Colors.wallet }}>12345678910</ThemedText>
            </View>
            <View style={{margin:7}}/>

            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
              <ThemedText style={{color: '#000'}}>Network</ThemedText>
              <ThemedText style={{color:Colors.wallet }} >MTN Nigeria</ThemedText>
            </View>
            <View style={{margin:7}}/>

            <View style={{justifyContent:'space-between', flexDirection:'row'}}>
              <ThemedText style={{color: '#000'}}>Data Plan</ThemedText>
              <ThemedText style={{color:Colors.wallet }}>11GB</ThemedText>
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

      <FullScreenModal
        visible={visible}
        onClose={() => [setVisible(false), router.push('/(tabs)/payments')]}
        mainText="Transaction Successful!"
        subText={`Your data subscription of ${amount} was successful`}
      />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    // backgroundColor: '#3E6B34',
    backgroundColor: Colors.green,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: -2,
    paddingVertical: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 5,
    borderRadius: 100,
    width: DIMENSION.WIDTH * 0.8,
    alignSelf:'center',
    backgroundColor: Colors.gray11,
    paddingHorizontal:5,
  },
  tab: {
    flex: 1,
    marginVertical:10,
    marginHorizontal:10,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: Colors.wallet  ,
  },
  tabText: {
    color: Colors.blacktext ,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  input: {
    fontSize:15,
    paddingLeft: 6,
    padding:12,
    borderRadius:10,
    backgroundColor: Colors.offwhite1,
    flex:1
  },
  inputInvalid: {
    backgroundColor: Colors.error100,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  invalid: {
    backgroundColor: Colors.error100,
  },
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