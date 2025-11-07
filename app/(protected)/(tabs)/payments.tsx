import LogoSpinner from '@/components/LoadingScreen'
import ReceiptView from '@/components/ReceiptView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { getbillsHistory, getbillsHistoryById } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import dayjs from "dayjs"
import { useNavigation, useRouter } from 'expo-router'
import React, { useLayoutEffect, useState } from 'react'
import { Alert, Animated, Dimensions, FlatList, ScrollView, StyleSheet, Text, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { height } = Dimensions.get('window');


export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};


export default function payments({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const navigation = useNavigation()
    const {user, token, logout} = useAuth()

    const [activeTab, setActiveTab] = useState<'bills' | 'history'>('bills');


    const [isFetching, setIsFetching] = useState(false);
    const [fetchedHistory, setFetchedHistory] = useState<any>([]);
    const [fetchedHistorybyid, setFetchedHistoryById] = useState<any>([]);

    const [visible, setVisible] = useState(false);

    const slideAnim = React.useRef(new Animated.Value(height)).current;
    
    const openPopup = () => {
      setVisible(true);
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
      }).start(() => setVisible(false)); // Close after animation
    };

    
    useLayoutEffect(() => {
      const fetchPendingRequests = async () => {
        try {
          setIsFetching(true);
          const response = await getbillsHistory(user?.customer_id, decryptData(token));
          console.log(response);
          setFetchedHistory(response);
        } catch (error: any) {
          if (error.response?.status === 401) {
            Alert.alert("Session expired", "Please log in again.");
            await logout(); // from your AuthContext
            router.replace("/login"); // navigate to login screen
          } else {
              Alert.alert('Error', 'Unable to load bills history')
          }
          console.error("Error fetching bills history", error);
        } finally {
            setIsFetching(false);
        }
      };
      const unsubscribe = navigation.addListener("focus", fetchPendingRequests);
      return unsubscribe;
    }, []);


    const fetchHistory = async (billerid:any, id:any) => {
      try {
        setIsFetching(true);
        const response = await getbillsHistoryById(user?.customer_id, id, billerid, decryptData(token));
        setFetchedHistoryById(response);
        console.log(id, billerid,)
        console.log(response);
        openPopup()
      } catch (error: any) {
        if (error.response?.status === 401) {
          Alert.alert("Session expired", "Please log in again.");
          await logout(); // from your AuthContext
          router.replace("/login"); // navigate to login screen
        } else {
            Alert.alert('Error', 'Unable to load bills history')
        }
        console.error("Error fetching bills history", error);
      } finally {
          setIsFetching(false);
      }
    };

    const bills = [
      { title: 'Buy Airtime', desc: 'Recharge your phone', link: () => router.push("/billspaymentAirtime")},
      { title: 'Buy Data', desc: 'Purchase data bundles', link: () => router.push("/billspaymentData")},
      { title: 'Buy Electricity', desc: 'Top up your electricity units  ', link: () => router.push("/billspaymentElectricity")},
      { title: 'Buy Cable TV', desc: 'Renew your TV subscription', link: () => router.push("/billspaymentTv")},
      { title: 'Betting', desc: 'Fund your betting wallet', link: () => router.push("/billspaymentBetting")},
      { title: 'Buy WAEC PIN', desc: 'Pay for your WAEC registration', link: () => router.push("/billspaymentEducation") },
    ];

    if(isFetching){
      return <LogoSpinner lightColor='' darkColor=''/>
    }
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:15, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
      <View style={{margin:15}}/> 
      <ThemedText type="titleMedium">Bills Payment</ThemedText>
      <ThemedText style={{color: Colors.gray9}}>View your app activities here</ThemedText>
      <View style={{margin:15}}/>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'bills' && styles.activeTab]}
          onPress={() => setActiveTab('bills')}
        >
          <Text style={[styles.tabText, activeTab === 'bills' && styles.activeTabText]}>
            Bills Payment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Unified Content Area (prevents spacing jump) */}
      <View style={styles.contentContainer}>
        {activeTab === 'bills' ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {bills.map((item, index) => (
              <TouchableOpacity key={index} style={styles.billItem} onPress={item.link}>
                <View style={styles.billLeft}>
                  <Ionicons name="card-outline" size={22} color="#fff" style={styles.icon} />
                  <View>
                    <Text style={styles.billTitle}>{item.title}</Text>
                    <Text style={styles.billDesc}>{item.desc}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#fff" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <>
          {
            fetchedHistory.length === 0 ? 
            <View style={styles.historyContent}>
              <Text style={styles.historyText}>No transaction history yet.</Text>
            </View>
            : 
            <FlatList
              data={fetchedHistory}
              keyExtractor={(item) => item.id.toString()}
              // style
              renderItem={({ item }) => (
                <TouchableOpacity activeOpacity={0.5} style={styles.mainstyle} onPress={() => fetchHistory(item.category, item.id)}>
                  <View style={{flexDirection:'row'}}>
                    <View style={{backgroundColor:Colors.wallet, alignSelf:'center', borderRadius:50, marginRight:15, padding:15  }}>
                      {
                        item.category === "bet" ?  
                          <MaterialCommunityIcons name="ticket-percent" size={17} color="#fff" />
                        :
                        item.category === "disco" ? 
                          <MaterialIcons name="electric-meter" size={17} color="#fff" />
                        :
                        item.category === "vtu" ?
                          <MaterialIcons name="mobiledata-off" size={17} color="#fff" />
                        :
                          item.category === "tv" ?
                          <Entypo name="tv" size={17} color="#fff" />
                        :
                          <Entypo name="book" size={17} color="#fff" />
                      }
                    </View>
                    <View>
                      <ThemedText style={{color: Colors.white}}>{item.biller_id}</ThemedText>
                      <ThemedText style={{color: Colors.white}} type='small' >{dayjs(item.created_at).format("h:mm A")}</ThemedText>
                      <ThemedText style={{color: Colors.white}} type='small'>{dayjs(item.created_at).format("MMMM D, YYYY")}</ThemedText>
                    </View>
                  </View>
                  <View style={{backgroundColor: "#fff", padding:3, borderRadius:15}}>
                    <ThemedText style={{color: Colors.red, fontFamily: "poppinsSemiBold"}}>{item.category === "vtu" ? 
                    "-"+item.topup_amount.toLocaleString('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                    }) : 
                
                    "-"+item.amount.toLocaleString('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                    })}
                  </ThemedText>
                  </View>
                </TouchableOpacity>

              )}
            />
          }
          </>
        )}
      </View>
      <View style={{margin:10}}/>
      
      <FlatList
        data={fetchedHistorybyid}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
      <>

      <ReceiptView visible={visible} onClose={() => setVisible(false)} watermarkText="IGOEPP">
        {/*Tv Receipt */}
        {item.category === "bet" &&
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
          </ThemedView>
        }
        
        {/*Airtime receipt */}
        {item.category === "vtu" &&
          <ThemedView style={{backgroundColor: Colors.gray6, marginHorizontal:10, paddingHorizontal:20, paddingVertical:20}}>
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
          </ThemedView>
        }

        {/*Electricity receipt */}
        {item.category === "disco" &&
        <ThemedView style={{backgroundColor: Colors.gray6, marginHorizontal:10, paddingHorizontal:20, paddingVertical:20}}>
          <View style={{justifyContent:'space-between', flexDirection:'row'}}>
            <ThemedText style={{color: '#000'}} type='small'>From</ThemedText>
            <ThemedText style={{color:Colors.wallet }} type='small'>Wallet</ThemedText>
          </View>
          <View style={{margin:7}}/>

          <View style={{justifyContent:'space-between', flexDirection:'row'}}>
            <ThemedText style={{color: '#000'}} type='small'>Meter Number</ThemedText>
            <ThemedText style={{color:Colors.wallet }} type='small'>{item.meter_id}</ThemedText>
          </View>
          <View style={{margin:7}}/>

          <View style={{justifyContent:'space-between', flexDirection:'row'}}>
            <ThemedText style={{color: '#000'}} type='small'>Customer Name</ThemedText>
            <ThemedText style={{color:Colors.wallet }} type='small'>{item.customer_name}</ThemedText>
          </View>
          <View style={{margin:7}}/>

          <View style={{justifyContent:'space-between', flexDirection:'row'}}>
            <ThemedText style={{color: '#000'}} type='small'>Address</ThemedText>
            <ThemedText style={{color:Colors.wallet }} type='small'>{item.customer_address}</ThemedText>
          </View>
          <View style={{margin:7}}/>

          <View style={{justifyContent:'space-between', flexDirection:'row'}}>
            <ThemedText style={{color: '#000'}} type='small'>Meter Type</ThemedText>
            <ThemedText style={{color:Colors.wallet }} type='small'>{item.meter_type}</ThemedText>
          </View>
          <View style={{margin:7}}/>

          <View style={{justifyContent:'space-between', flexDirection:'row'}}>
            <ThemedText style={{color: '#000'}} type='small'>Amount</ThemedText>
            <ThemedText style={{color:Colors.wallet }} type='small'>{item.amount}</ThemedText>
          </View>
          <View style={{margin:7}}/>

          <View style={{justifyContent:'space-between', flexDirection:'row'}}>
            <ThemedText style={{color: '#000'}} type='small'>Units Purchased</ThemedText>
            <ThemedText style={{color:Colors.wallet }} type='small'>{item.amount}</ThemedText>
          </View>
          <View style={{margin:7}}/>

          <View style={{justifyContent:'space-between', flexDirection:'row'}}>
            <ThemedText style={{color: '#000'}} type='small'>Request id</ThemedText>
            <ThemedText style={{color:Colors.wallet }} type='small'>{item.request_id}</ThemedText>
          </View>
          <View style={{margin:7}}/>

          <View style={{justifyContent:'space-between', flexDirection:'row'}}>
            <ThemedText style={{color: '#000'}} type='small'>Token</ThemedText>
            <ThemedText style={{color:Colors.wallet }} type='small'>{item.created_at}</ThemedText>
          </View>
          <View style={{margin:7}}/>

          <View style={{justifyContent:'space-between', flexDirection:'row'}}>
            <ThemedText style={{color: '#000'}} type='small'>Transaction Date</ThemedText>
            <ThemedText style={{color:Colors.wallet }} type='small'>{item.token}</ThemedText>
          </View>
          <View style={{margin:7}}/>
        </ThemedView>
          }
      </ReceiptView>
      </>)}/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainstyle:{
    flexDirection:'row', 
    borderRadius:8, 
    justifyContent:'space-between', 
    alignItems:'center', 
    backgroundColor: Colors.green11,
    marginHorizontal:10,
    marginVertical:3,
    padding:10, 
    flex:1
  },
   tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius:16,
    // backgroundColor: '#3E6B34',
    backgroundColor: Colors.green,
    padding: 6,
  },
  tab: {
    flex: 1,
    marginVertical:10,
    marginHorizontal:10,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#2E5126',
  },
  tabText: {
    color: '#ddd',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },

  /** unified content area **/
  contentContainer: {
    flex: 1,
    // backgroundColor: '#3E6B34',
    backgroundColor: Colors.green,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: -2,
    paddingVertical: 8,
  },

  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },

  billLeft: { flexDirection: 'row', alignItems: 'center' },
  billTitle: { color: '#fff', fontSize: 16, fontWeight: '500' },
  billDesc: { color: '#ccc', fontSize: 12, marginTop: 2 },
  icon: { marginRight: 14 },

  /** history **/
  historyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyText: { color: '#fff', fontSize: 14 },
})