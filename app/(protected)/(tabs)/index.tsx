import { StatusModal } from '@/components/StatusModal';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors, decryptamount, decryptData, DIMENSION, encryptData, formatDate } from '@/constants/Colors';
import { useNotification } from '@/context/NotificationContext';
import { useAuth } from '@/hooks/AuthContext';
import { frequentlyusedartisans, getlatestinvoices, notificationunread, updateExpoToken } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AntDesign, Entypo, Feather, FontAwesome, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Animated, Dimensions, Image, Modal, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
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
  const [modalVisible1, setModalVisible1] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen
  const { token, user, updateUser, logout, updateUserFields } = useAuth();
  const navigation = useNavigation()
  const [visible, setVisible] = useState(false);
  const [handymen, setHandymen] = useState<any>(null);
  const [countryData, setCountryData] = useState<any[]>([]);
  const [stateData, setStateData] = useState<any[]>([]);
  const [cityData, setCityData] = useState<any[]>([]);
  const [country, setCountry] = useState<any[]>([]);
  const [state, setState] = useState<any[]>([]);
  const [city, setCity] = useState<any[]>([]);
  const [invoice, setInvoice] = useState<any>([]);
  const {expoPushToken, notification, error} = useNotification();
  const [formData, setFormData] = useState<any>({
    countryName: "",
    stateName: "",
    cityName: "",
  });

  useFocusEffect(
    useCallback(() => {
      if (!user?.customer_id || !token) return;

      let isActive = true;
      const syncToken = async () => {
        try {
          const tokenResponse = await Notifications.getExpoPushTokenAsync({
            projectId:
              Constants?.expoConfig?.extra?.eas?.projectId ??
              Constants?.easConfig?.projectId,
          });
          const pushtoken = tokenResponse.data;

          if (!isActive) return;
          if (!pushtoken) return;

          // Only update if it's different from what's already stored in context
          if (user?.pushtoken !== pushtoken) {
            console.log("[HomeScreen] pushing new token to server:", pushtoken);
            await updateExpoToken(String(user.customer_id), encryptData(pushtoken), decryptData(token));
            updateUserFields({ pushtoken });
          } else {
            // nothing to do
            // console.log("[HomeScreen] push token unchanged");
          }
        } catch (err) {
          console.log("Error syncing notification token:", err);
        }
      };

      syncToken();

      return () => { isActive = false; };
    }, [user?.customer_id, token, user?.pushtoken, updateUserFields])
  );

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationunread(
          user?.userid,
          decryptData(token)
        );
        updateUserFields({
          notificationcount: response,
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotifications();      
  }, [user?.notificationcount])



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
    setVisible(true);
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
    }).start(() => setVisible(false)); // Close after animation
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const config = {
          method: 'get',
          url: "https://phixotech.com/igoepp/public/api/auth/general/country",
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${decryptData(token)}`,
          },
        };
        const response = await axios(config);
        const data = response.data.data;
        const countryArray = data.map((item: any) => ({
          label: item.country_name,
          value: item.id,
        }));
        setCountryData(countryArray);
      } catch (error) {
        console.error("Country fetch error:", error);
      }
    };
    fetchCountries();
  }, []);

  
  useFocusEffect(
    useCallback(() => {
      if (!user || !token) return;

      if (user?.account_type !== "B" && user?.account_type !== "E") {
        return; // ❌ do nothing if not B or E
      }
      const fetchData = async () => {
        try {
          const response = await getlatestinvoices(user.customer_id, decryptData(token));
          setInvoice(response);
        } catch (error) {
          console.log(error);
        }
      };

      fetchData();
    }, [user, token])
  );

  useFocusEffect(
    useCallback(() => {
      if (!token) return;

      const fetchArtisans = async () => {
        try {
          const response = await frequentlyusedartisans(decryptData(token));
          setHandymen(response);
        } catch (error) {
          console.log(error);
        }
      };

      fetchArtisans();
    }, [token])
  );

  
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.transaction_pin_setup === "N") {
        setModalVisible1(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.transaction_pin_setup]);
    

  const handleState = async (countryCode: string) => {
    try {
      const response = await axios.get(
        `https://phixotech.com/igoepp/public/api/auth/general/state/${countryCode}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${decryptData(token)}`,
          },
        }
      );

      const data = response.data.data;
      const stateArray = data.map((item: any) => ({
        label: item.state_name,
        value: item.id,
      }));
      setStateData(stateArray);
    } catch (error) {
      console.error("State fetch error:", error);
    }
  };

  const handleCity = async (stateCode: string) => {
    try {
      const response = await axios.get(
        `https://phixotech.com/igoepp/public/api/auth/general/lga/${stateCode}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${decryptData(token)}`,
          },
        }
      );

      const data = response.data.data;
      const cityArray = data.map((item: any) => ({
        label: item.lga_name,
        value: item.id,
      }));
      setCityData(cityArray);
    } catch (error) {
      console.error("City fetch error:", error);
    }
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
              {user?.account_type === 'C' || user?.account_type === 'E' ? 
                <ThemedText type='subtitle' style={{fontSize:13}}>{user?.first_name} {user?.last_name} </ThemedText>
                :
                <ThemedText type='subtitle' style={{fontSize:13}}>{user?.company_name }</ThemedText>  
              }
            </ThemedView>
          </ThemedView>

          {/* notification and support icon */}
          <ThemedView style={{flexDirection:'row', alignContent:'flex-end'}}>
            <TouchableOpacity style={{marginRight:15}} onPress={() => router.push('/helpandsupport')}>
              <MaterialIcons name="support-agent" size={22} style={{marginLeft:10}} color={color}/>
            </TouchableOpacity>

            <TouchableOpacity  style={{marginRight:10}}  onPress={() => router.push("/(protected)/notificationview")}>
              <Feather name="bell" size={20} color={color} />
              {user?.notificationcount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    backgroundColor: Colors.red,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 4,
                  }}
                >
                  <ThemedText style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                    {user?.notificationcount > 100 ? '99+' : user?.notificationcount}
                  </ThemedText>
                </View>
              )}
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
              <ThemedText type='small'>Add Money </ThemedText>
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

        {
          user?.account_type === "B" || user?.account_type === 'E' ?
          <>

            {
              invoice.length === 0 ? null : 
              <>
              
                <View style={{margin:15}}/>
                
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                  <ThemedText type='defaultSemiBold'>Invoice Details</ThemedText>
                  <TouchableOpacity onPress={() => router.push("/(protected)/invoice")}>
                    <ThemedText type='defaultSemiBold'>View all</ThemedText>
                  </TouchableOpacity>
                </View>
                
                <View style={{margin:5}}/>
                <ThemedView style={{flexDirection:'row',justifyContent:'space-between', borderRadius:8,boxShadow: '0px 4px 6px rgba(0,0,0,0.35)', paddingBottom:10, paddingHorizontal:5}}>
                  <View>
                    <ThemedText type='small'>INVOICE NUMBER:</ThemedText>
                    <ThemedText type='small'>N : {invoice.invoice_id}</ThemedText>
                  </View>

                  <View>
                    <ThemedText type='small'>ISSUED:</ThemedText>
                    <ThemedText type='small'>{formatDate(invoice.issue_date)}</ThemedText>
                  </View>

                  <View>
                    <ThemedText type='small'>DUE DATE:</ThemedText>
                    <ThemedText type='small'>N : {formatDate(invoice.due_date)}</ThemedText>
                  </View>
                </ThemedView>
              </>
            }
          </>
          : null
        }


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

        <TouchableOpacity onPress={openPopup1} activeOpacity={0.5}>        
          <ThemedView style={{backgroundColor: Colors.bookingbackground, borderRadius:8, padding:15, flexDirection:'row', borderWidth:1, borderColor: Colors.bookingoutline}}>
            <ThemedView style={{backgroundColor: Colors.clock1, padding: 10, borderRadius: 50, alignSelf: 'flex-start'}}>
              <View style={{backgroundColor: "white", padding: 5, borderRadius: 20, alignSelf: 'flex-start'}}>
                <Image
                  source={require('@/assets/images/clock.jpeg')}
                  style={styles.clock}
                />
              </View>
            </ThemedView>

            <View style={{paddingLeft:15}}>
              <ThemedText style={{color:'black'}}>Booking History</ThemedText>
              <ThemedText type='small' style={{color:Colors.blacktext}}>Click to view list of pending, accepted and ongoing</ThemedText>
              <ThemedText type='small' style={{color:Colors.blacktext}}>bookings here</ThemedText>
            </View>
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

        {
        !handymen ? (
        // FALLBACK UI WHEN EMPTY/LOADING
        <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.card}>
            <Image source={require('@/assets/images/artisan.png')} style={styles.image} />
            <ThemedView style={styles.details}>
              <ThemedText type="default">Mary Esther</ThemedText>
              <View style={{ margin: 5 }} />
              <ThemedText type="defaultSemiBold">House Cleaning</ThemedText>
              <ThemedText type="titleMedium" style={{ color: Colors.green, fontSize: 14 }}>
                NGN 10,000
              </ThemedText>
              
              <View style={{ margin: 5 }} />

              <ThemedView style={{ borderRadius: 12 }}>
                <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <ThemedText type="small">
                    <MaterialCommunityIcons name="map-marker-outline" size={16} color={color} /> Lagos
                  </ThemedText>
                  <ThemedText type="small">
                    <Fontisto name="star" size={13} color={Colors.gold} /> 4.8
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          </View>
        </Animated.ScrollView>
      ) : (
        // REAL API DATA DISPLAY
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {handymen.map((artisan: any, index: number) => (
            <View key={index} style={styles.card}>
              <Image
                source={
                  artisan.photo
                    ? {uri: `https://phixotech.com/igoepp/public/handyman/${artisan.photo}`}
                    : require('@/assets/images/artisan.png')
                }
                style={styles.image}
              />

              <ThemedView style={styles.details}>
                <ThemedText type="default">{artisan.first_name} {artisan.last_name}</ThemedText>

                <View style={{ margin: 5 }} />

                <ThemedText type="defaultSemiBold">
                  {artisan.subcategory_name}
                </ThemedText>
                <ThemedText type="titleMedium" style={{ color: Colors.green, fontSize: 14 }}>
                  NGN {Number(artisan.avg_price).toLocaleString()}
                </ThemedText>

                <View style={{ margin: 7 }} />

                <ThemedView style={{ borderRadius: 12 }}>
                  <ThemedView
                    style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                  >
                    <ThemedText type="small">
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={16}
                        color={color}
                      />{" "}
                      {artisan.location || "Lagos"}
                    </ThemedText>

                    <ThemedText type="small">
                      <Fontisto name="star" size={13} color={Colors.gold} />{" "}
                      {Number(artisan.rating).toFixed(1)}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </View>
          ))}
        </Animated.ScrollView>
      )
    }


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
              <View style={{margin:5}}/>
        
          <ThemedText>Country</ThemedText>
          <View style={{margin:5}}/>
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={countryData}
            labelField="label"
            valueField="label"
            placeholder="Please Select"
            maxHeight={300}
            value={formData.countryName}
            search
            searchPlaceholder="Search..."
            inputSearchStyle={{ color: Colors.gray9 }}
            onChange={(item: any) => {
              setFormData({ ...formData, countryName: item.label, stateName: "", cityName: "" });
              setCountry(item.label)
              setStateData([]);
              setCityData([]);
              handleState(item.value);
            }}
            renderRightIcon={() => (
              <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.gray9} />
            )}
          />
                    
          
          <View style={{margin:5}}/>
          
          <ThemedText>State</ThemedText>
          <View style={{margin:5}}/>
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={stateData}
            labelField="label"
            valueField="label"
            placeholder="Please Select"
            value={formData.stateName}
            maxHeight={300}
            search
            searchPlaceholder="Search..."
            inputSearchStyle={{ color: Colors.gray9 }}
            onChange={(item: any) => {
              setFormData({ ...formData, stateName: item.label, cityName: "" });
              setCityData([]);
              setState(item.label)
              handleCity(item.value);
            }}
            renderRightIcon={() => (
              <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.gray9} />
            )}
          />

          <View style={{margin:5}}/>

          <ThemedText>Local Government Area</ThemedText>
          <View style={{margin:5}}/>
          <Dropdown
            style={[styles.dropdown]}
            // placeholderStyle={{ color: Colors.gray9 }}
            // selectedTextStyle={{ color: "#000" }}
            data={cityData}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            labelField="label"
            valueField="label"
            placeholder="Please Select"
            value={formData.cityName}
            maxHeight={300}
            search
            searchPlaceholder="Search..."
            inputSearchStyle={{ color: Colors.gray9 }}
            onChange={(item: any) => {
              setFormData({ ...formData, cityName: item.label });
              setCity(item.label)
            }}
            renderRightIcon={() => (
              <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.gray9} />
            )}
          />

        <View style={{margin:5}}/>

            <View style={{margin:15}}/>

            <ThemedButton style={{ padding: 15, borderRadius:30, alignItems:'center', backgroundColor: Colors.green}} onPress={() => !formData.cityName ? alert("Please select one of the following to continue")  : [closePopup(),router.push({pathname:"/categoryScreen", params:{lga: formData.cityName}})]}>
              <ThemedText type='smallBold' style={{color:"#fff"}}>Proceed</ThemedText>
            </ThemedButton>
          </Animated.View>
        </Modal>

         <Modal
            transparent
            visible={visible}
            animationType="slide" // Disable default animation for custom one
            onRequestClose={() => [closePopup1()]} // Close on back press
          >

            <TouchableOpacity style={styles.overlay} onPress={() => {closePopup1()}} />

            <Animated.View
              style={[
              styles.popup,
              { transform: [{ translateY: slideAnim }], backgroundColor: color1  },
              ]}
            >
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={closePopup1}>
                  <AntDesign name="close-circle" size={20} color={color} />
                </TouchableOpacity>
                <View style={{flexDirection:'row', flex:1, justifyContent:'center'}}>
                  <ThemedText type='titleMedium'>Actions</ThemedText>
                </View>
              </View>

              <View style={{marginTop:20}}/>
              <TouchableOpacity style={{flexDirection:'row',}} onPress={() => [closePopup1(), router.push('/(protected)/bookinghistory')]}>
                  <MaterialIcons name="view-headline" size={20} color={color}/>
                  <View style={{margin:5}}/>
                  <View style={{alignItems:'center', alignContent:'center',alignSelf:'center'}}>
                  <ThemedText>{"Request History"}</ThemedText>
                  </View>
              </TouchableOpacity>

              <View style={{marginTop:20}}/>

              <TouchableOpacity style={{flexDirection:'row',}} onPress={() => [closePopup1(),router.push('/(protected)/recurringrequest')]}>
                  <AntDesign name="edit" size={20} color={color} />
                  <View style={{margin:5}}/>
                  <View style={{alignItems:'center', alignContent:'center',alignSelf:'center'}}>
                  <ThemedText>{"Recurring Request"}</ThemedText>
                  </View>
              </TouchableOpacity>

              <View style={{marginTop:20}}/>
              </Animated.View>
              {/* </Pressable> */}
          </Modal>

        <StatusModal
          visible={modalVisible1}
          onClose={() => setModalVisible1(false)}
          title="No Transaction PIn"
          message="Please create your transaction PIN to secure your account and enable transactions."
          navigateTo="/transactionpin"
          close={false}
        />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginRight: 15,
    boxShadow: "0px 4px 6px rgba(0,0,0,0.35)",
    backgroundColor: "#fff",
    overflow: "hidden"
  },
 
  details: {
    padding: 10,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12
  },
  dropdown: {
    height: 60,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'poppinsRegular'
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'poppinsRegular'
  },
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
