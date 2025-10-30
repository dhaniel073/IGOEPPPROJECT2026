import Input from '@/components/Input';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors, decryptamount, decryptData, DIMENSION } from '@/constants/Colors';
import { useAuth } from '@/hooks/AuthContext';
import { customerinfocheck } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Entypo, EvilIcons, Feather, FontAwesome, FontAwesome6, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, Animated, Dimensions, Image, Modal, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

  const { height } = Dimensions.get('window');

  export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor:{ dark: string; light: string };
  };

  export default function HomeScreen({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props) {

  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const insets = useSafeAreaInsets();
  const router = useRouter()
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen
  const { token, user, updateUser, logout } = useAuth();
  const navigation = useNavigation()

  useLayoutEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await customerinfocheck(user?.customer_id, decryptData(token));
        updateUser(response)
      } catch (error: any) {
        if (error.response?.status === 401) {
          Alert.alert("Session expired", "Please log in again.");
          await logout(); // from your AuthContext
          router.replace("/login"); // navigate to login screen
        } else {
          Alert.alert('Error', 'Unable to load notification settings.')
        }
        console.error("Error fetching pending requests:", error.response);
      } finally {
        // setisloading(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", fetchPendingRequests);

    return unsubscribe;
  }, []);

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

  const now = new Date();
  const hour = now.getHours();

  const greeting =
    hour >= 5 && hour < 12
      ? 'Good Morning'
      : hour >= 12 && hour < 16
      ? 'Good Afternoon'
      : 'Good Evening';
  
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, backgroundColor: color1, maxHeight: DIMENSION.HEIGHT }} edges={['top']}>
      <Animated.ScrollView showsVerticalScrollIndicator={false}>     
        <ThemedView style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
          {/* avatar and name */}
          <ThemedView style={{flexDirection:'row'}}>
            <TouchableOpacity activeOpacity={0.6} onPress={() => router.push("/profile")}>
              {user?.picture ? 
                // <Image transition={1000} source={{uri: `https://igoeppms.com/igoepp/public/customers/${authCtx.picture}`}} style={{width:35, height:35, borderRadius:30, borderWidth:1, top:-5}}/>
                <Image
                  source={{uri: `https://phixotech.com/igoepp/public/customers/${user?.picture}`}} 
                  style={styles.reactLogo}
                />
                :
                <Image
                  source={require('@/assets/images/avatar.png')}
                  style={styles.reactLogo}
                />
              }
            </TouchableOpacity>
            
            <ThemedView style={{marginLeft:30}}>
              <ThemedText>{greeting}</ThemedText>
              <ThemedText type='subtitle' style={{fontSize:13}}>{user?.last_name} {user?.first_name}</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* notification and support icon */}
          <ThemedView style={{flexDirection:'row', alignContent:'flex-end'}}>
            <TouchableOpacity style={{marginRight:20}} onPress={() => router.push('/helpandsupport')}>
              <MaterialIcons name="support-agent" size={22} style={{marginLeft:10}} color={color}/>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(protected)/notificationview")}>
              <Feather name="bell" size={20} color={color} />
            </TouchableOpacity>
          </ThemedView>

        </ThemedView>

        <View style={{margin:20}}/>
      
        {/* Wallet panel */}
        <ThemedView style={styles.walletcontainer}>
            <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <View style={{backgroundColor: Colors.yellow, padding: 5, borderRadius: 10, alignSelf: 'flex-start'}}>
                <Fontisto name="wallet" size={10} color={"#fff"} />
              </View>
              <TouchableOpacity onPress={() => router.push("/(protected)/wallethistory")} style={{alignItems:'center', flexDirection:'row'}}>
                <ThemedText>Wallet History </ThemedText>
                <MaterialIcons name="keyboard-arrow-right" size={15} color={color} />
              </TouchableOpacity>
            </View>

          <View style={{margin:6}}/>

          <ThemedText type='subtitle'>Wallet Balance</ThemedText>
          <View style={{margin:3}}/>
          {/* <ThemedText type='default'>2000228665</ThemedText> */}

          <View style={{margin:8}}/>

          <ThemedView style={{flexDirection:'row', justifyContent:'space-between', }}>
           <ThemedText type="title">
              {decryptamount(user?.wallet_balance)
                .toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                })}
            </ThemedText>
            
            <TouchableOpacity>
              <Feather name="eye" size={22} color={color} />
            </TouchableOpacity>

            <TouchableOpacity style={{ alignItems: 'center', marginTop:-20 }} onPress={() => router.push('/addmoney')}>
              <View style={{backgroundColor: Colors.shadow, padding: 8,borderRadius: 30, 
                // iOS shadow
                boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
              }}>
                <View style={{ backgroundColor: Colors.wallet,padding: 5,borderRadius: 20}}>
                  <MaterialCommunityIcons name="wallet-plus" size={24} color="#fff" />
                </View>
              </View> 
              <ThemedText type='small'>Add Money</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <View style={{margin:15}}/>

        <ThemedView style={{flexDirection:'row',justifyContent:'space-between'}}>
          <ThemedView style={styles.container}>
            <ThemedView style={{flexDirection:'row', }}>
              <View style={{backgroundColor: Colors.wallet, padding: 5, borderRadius: 10, alignSelf: 'flex-start'}}>
                <Entypo name="trophy" size={10} color="#fff" />
              </View>
            </ThemedView>

            <ThemedText type='titleLight'>Loyalty Point</ThemedText>
            <View style={{margin:7}}/>
            <ThemedText type='title'>0</ThemedText>
          </ThemedView>

          <ThemedView style={[styles.container]}>
            <ThemedView style={{flexDirection:'row', }}>
              <View style={{backgroundColor: Colors.yellow, padding: 5, borderRadius: 10, alignSelf: 'flex-start'}}>
                <FontAwesome name="group" size={10} color="#fff" />
              </View>
              <ThemedText type='small' style={{paddingLeft:4}}>Ref. Code: {user?.personal_referal_code}</ThemedText>
            </ThemedView>

            <ThemedText type='titleLight'>Customer ID</ThemedText>
            <View style={{margin:7}}/>
            <ThemedText type='title'>{user?.customer_id}</ThemedText>
          </ThemedView>

        </ThemedView>

        <View style={{margin:15}}/>

        <ThemedText type='defaultSemiBold'>Special Offer</ThemedText>
        
        <View style={{margin:5}}/>
        
        <Image
          source={require('@/assets/images/slide1.png')}
          style={styles.slide1}
        />
        
        <View style={{margin:15}}/>

        <TouchableOpacity activeOpacity={0.5} onPress={openPopup}>
          <View style={{backgroundColor: Colors.helmetbackground, borderRadius:8, padding:15, flexDirection:'row', borderWidth:1.5, borderColor: Colors.helmet}}>
            <ThemedView style={{backgroundColor: Colors.helmet, padding: 10, borderRadius: 30, alignSelf: 'flex-start'}}>
              <View style={{backgroundColor: "white", padding: 5, borderRadius: 20, alignSelf: 'flex-start'}}>
                <Image
                  source={require('@/assets/images/helmet.png')}
                  style={styles.helpandsupportlogo}
                />
              </View>
            </ThemedView>

            <View style={{paddingLeft:15}}>
              <ThemedText style={{color:'black'}}>Request Help</ThemedText>
              <ThemedText type='small' style={{color:Colors.blacktext}}>Click to view list of service categories and</ThemedText>
              <ThemedText type='small' style={{color:Colors.blacktext}}>sub-categories that suits your needs</ThemedText>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{margin:10}}/>

        <TouchableOpacity>        
          <ThemedView style={{backgroundColor: Colors.bookingbackground, borderRadius:8, padding:15, flexDirection:'row', borderWidth:1, borderColor: Colors.bookingoutline}}>
            <ThemedView style={{backgroundColor: Colors.clock1, padding: 10, borderRadius: 50, alignSelf: 'flex-start'}}>
              <View style={{backgroundColor: "white", padding: 5, borderRadius: 20, alignSelf: 'flex-start'}}>
                <Image
                  source={require('@/assets/images/clock.jpeg')}
                  style={styles.clock}
                />
              </View>
            </ThemedView>

            <TouchableOpacity style={{paddingLeft:15}} activeOpacity={0.5} onPress={() => router.push('/(protected)/bookinghistory')}>
              <ThemedText style={{color:'black'}}>Booking History</ThemedText>
              <ThemedText type='small' style={{color:Colors.blacktext}}>Click to view list of pending, accepted and ongoing</ThemedText>
              <ThemedText type='small' style={{color:Colors.blacktext}}>bookings here</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </TouchableOpacity>

        <View style={{margin:10}}/>
        
        <ThemedView style={{flexDirection:'row', justifyContent:'space-between'}}>
          <ThemedText type='small'>Frequently Used Artisans</ThemedText>
          <TouchableOpacity>
            <ThemedText type='small' style={{color: Colors.green}}>See All</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <View style={{margin:10}}/>

        <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={{
              borderRadius: 12,
              margin: 10, // space for shadow
              boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
            }}
          >
            <Image source={require('@/assets/images/artisan.png')} style={styles.image} />

            <ThemedView style={{ padding: 10, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
              <ThemedText type="default">Mary Esther</ThemedText>
              <View style={{ margin: 5 }} />
              <ThemedText type="defaultSemiBold">House Cleaning</ThemedText>
              <ThemedText type="titleMedium" style={{color: Colors.green, fontSize:14}}>NGN 10,000</ThemedText>

              <View style={{ margin: 15 }} />

              <ThemedView style={{ borderRadius: 12 }}>
                <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <ThemedText type="small">
                    <MaterialCommunityIcons name="map-marker-outline" size={16} color={color} /> Lagos
                  </ThemedText>
                  <ThemedText type='small'>
                    <Fontisto name="star" size={13} color={Colors.gold} /> 4.8
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </View>

          <View
            style={{
              borderRadius: 12,
              margin: 10, // space for shadow
              boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
            }}
          >
            <Image source={require('@/assets/images/artisan.png')} style={styles.image} />

            <ThemedView style={{ padding: 10, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
              <ThemedText type="default">Mary Esther</ThemedText>
              <View style={{ margin: 5 }} />
              <ThemedText type="defaultSemiBold">House Cleaning</ThemedText>
              <ThemedText type="titleMedium" style={{color: Colors.green, fontSize:14}}>NGN 10,000</ThemedText>

              <View style={{ margin: 15 }} />

              <ThemedView style={{ borderRadius: 12 }}>
                <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <ThemedText type='small'>
                    <MaterialCommunityIcons name="map-marker-outline" size={16} color={color} /> Lagos
                  </ThemedText>
                  <ThemedText type='small'>
                    <Fontisto name="star" size={13} color={Colors.gold} /> 4.8
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </View>
        </Animated.ScrollView>
        <View style={{margin:10}}/>

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
            <ThemedText type='subtitle'>Enter Location</ThemedText>
            <ThemedText type='small' style={{fontSize:12}}>This will help us tailor available help categories</ThemedText>
            <ThemedText type='small' style={{fontSize:12}}>close to you</ThemedText>

            <View style={{margin:10}}/>

            <ThemedText>Address</ThemedText>
            <Input
              placeholder="Enter Address"
              keyboardType="default"
              multiline
              rightIcon={<Entypo name="address" size={20} color={Colors.gray9} />}
            />

            <View style={{margin:5}}/>

            <ThemedText>State</ThemedText>
            <Input
              placeholder="Enter State"
              keyboardType="default"
              rightIcon={<FontAwesome6 name="city" size={18} color={Colors.gray9} />}
            />

            <View style={{margin:5}}/>

            <ThemedText>Local Government Area</ThemedText>
            <Input
              placeholder="Enter State"
              keyboardType="default"
              rightIcon={<EvilIcons name="search" size={20} color={Colors.gray9} />}
            />

            <View style={{margin:15}}/>

            <ThemedButton style={{ padding: 15, borderRadius:30, alignItems:'center', backgroundColor: Colors.green}} onPress={() => [closePopup(),router.push("/categoryScreen")]}>
              <ThemedText type='smallBold' style={{color:"#fff"}}>Proceed</ThemedText>
            </ThemedButton>
          </Animated.View>
        </Modal>
      </Animated.ScrollView>
    </SafeAreaView>
  );
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
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  item: {
    backgroundColor: "",
    borderRadius: 5,
    padding: 10,
    marginRight: 5,
  },
  image:{
    width:170,
    height: 150,
    borderRadius: 15
  },
  slide1:{
    borderRadius: 16,
    width: "100%",
    height: 175,
  },
  walletcontainer: {
    // borderWidth:0.2, 
    borderColor: Colors.gray9, 
    padding:15, 
    borderRadius:15, 
    boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
    // borderRadius: 12,
  },
  container:{
    borderColor: Colors.gray9, 
    padding:15, 
    borderRadius:15, 
    boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
    width: '48%'
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 50,
    width: 50,
    borderRadius:100,
    // position: 'absolute',
  },
  helpandsupportlogo:{
    height: 24,
    width: 25,
  },
  clock:{
    height: 19,
    width: 19,
  },
  notificationlogo:{
    height: 22.02,
    width: 22.2,
  },
});
