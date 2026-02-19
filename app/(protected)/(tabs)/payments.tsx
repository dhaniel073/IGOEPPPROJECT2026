import LogoSpinner from '@/components/LoadingScreen'
import ReceiptView from '@/components/ReceiptView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, decryptData, toCamelCase } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { billcategory, getbillsHistory, getbillsHistoryById, walletbal } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import dayjs from "dayjs"
import { useNavigation, useRouter } from 'expo-router'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Alert, Animated, Dimensions, FlatList, StyleSheet, Text, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const { height } = Dimensions.get('window');


export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor: { dark: string; light: string };
};


export default function payments({
  lightColor,
  darkColor,
  headerBackgroundColor,
}: Props) {

  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const router = useRouter()
  const navigation = useNavigation()
  const { user, token, logout, updateUserFields } = useAuth()

  const [activeTab, setActiveTab] = useState<'bills' | 'history'>('bills');


  const [isFetching, setIsFetching] = useState(false);
  const [fetchedHistory, setFetchedHistory] = useState<any>([]);
  const [fetchedBillcategory, setFetchedBillcategory] = useState<any>([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await walletbal(user?.customer_id, decryptData(token));
        updateUserFields({ wallet_balance: response.wallet_balance })
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [])



  useLayoutEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        setIsFetching(true);
        const response = await getbillsHistory(user?.customer_id, decryptData(token));
        setFetchedHistory(response);
        console.log(response)
      } catch (error: any) {
        if (error.response?.status === 401) {
          Alert.alert("Session expired", "Please log in again.");
          await logout(); // from your AuthContext
          router.replace("/login"); // navigate to login screen
        } else {
          Alert.alert('Error', 'Unable to load bills history')
        }
        console.error("Error fetching bills history", error.response);
      } finally {
        setIsFetching(false);
      }
    };
    const unsubscribe = navigation.addListener("focus", fetchPendingRequests);
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    const fetchBillCategories = async () => {
      try {
        setIsFetching(true);
        const response = await billcategory(decryptData(token));
        setFetchedBillcategory(response);
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
    const unsubscribe = navigation.addListener("focus", fetchBillCategories);
    return unsubscribe;
  }, []);


  const fetchHistory = async (billerid: any, id: any) => {
    try {
      setIsFetching(true);
      const response = await getbillsHistoryById(user?.customer_id, id, billerid, decryptData(token));
      setFetchedHistoryById(response);
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

  if (isFetching) {
    return <LogoSpinner lightColor='' darkColor='' />
  }
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 15, paddingTop: 10, backgroundColor: color1 }} edges={['top', 'bottom']}>
      <View style={{ margin: 6 }} />
      <ThemedText type="titleMedium">Bills Payment</ThemedText>
      <ThemedText style={{ color: Colors.gray9 }}>View your app activities here</ThemedText>
      <View style={{ margin: 6 }} />

      <View>
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
      </View>

      <View style={{ flex: 1 }}>

        <View style={styles.contentContainer}>
          {activeTab === 'bills' ? (
            <>
              <FlatList
                data={fetchedBillcategory}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity key={index} style={styles.billItem} onPress={() => {
                    item.id === "vtu" && router.push({ pathname: "/(protected)/billspaymentAirtime", params: { name: item.name, billid: item.id } })
                    item.id === "disco" && router.push({ pathname: "/(protected)/billspaymentElectricity", params: { name: item.name, billid: item.id } })
                    item.id === "bet" && router.push({ pathname: "/(protected)/billspaymentBetting", params: { name: item.name, billid: item.id } })
                    item.id === "internet" && router.push({ pathname: "/(protected)/billspaymentInternet", params: { name: item.name, billid: item.id } })
                    item.id === "education" && router.push({ pathname: "/(protected)/billspaymentEducation", params: { name: item.name, billid: item.id } })
                    item.id === "tv" && router.push({ pathname: "/(protected)/billspaymentTv", params: { name: item.name, billid: item.id } })
                  }}>
                    <View style={styles.billLeft}>
                      <Ionicons name="card-outline" size={22} color="#fff" style={styles.icon} />
                      <View>
                        <Text style={styles.billTitle}>{toCamelCase(item.id)}</Text>
                        <Text style={styles.billDesc}>{item.name}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={22} color="#fff" />
                  </TouchableOpacity>
                )}
              />
            </>
          ) : (
            <FlatList
              data={fetchedHistory}
              keyExtractor={(item) => item.id.toString()}
              // style
              renderItem={({ item }) => (
                <>
                  {
                    fetchedHistory.length === 0 ?
                      <View style={styles.historyContent}>
                        <Text style={styles.historyText}>No transaction history yet.</Text>
                      </View>

                      :

                      <TouchableOpacity activeOpacity={0.5} style={styles.mainstyle} onPress={() => fetchHistory(item.category, item.id)}>
                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ backgroundColor: Colors.wallet, alignSelf: 'center', borderRadius: 50, marginRight: 15, padding: 15 }}>
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
                            <ThemedText style={{ color: Colors.white }}>{item.biller_id}</ThemedText>
                            <ThemedText style={{ color: Colors.white }} type='small' >{dayjs(item.created_at).format("h:mm A")}</ThemedText>
                            <ThemedText style={{ color: Colors.white }} type='small'>{dayjs(item.created_at).format("MMMM D, YYYY")}</ThemedText>
                          </View>
                        </View>
                        <View style={{ backgroundColor: "#fff", padding: 3, borderRadius: 15 }}>
                          <ThemedText style={{ color: Colors.red, fontFamily: "poppinsSemiBold" }}>
                            {item.category === "vtu" ?
                              "-" + item.topup_amount.toLocaleString('en-NG', {
                                style: 'currency',
                                currency: 'NGN',
                              })

                              : item.category === "internet" ?

                                "-" + item.topup_amount.toLocaleString('en-NG', {
                                  style: 'currency',
                                  currency: 'NGN',
                                }) :

                                "-" + item.amount.toLocaleString('en-NG', {
                                  style: 'currency',
                                  currency: 'NGN',
                                })}
                          </ThemedText>
                        </View>
                      </TouchableOpacity>
                  }
                </>

              )}
            />
          )}
        </View>
      </View>

      {/* 👇 Custom receipt content goes here */}
      {fetchedHistorybyid.map((item: any, index: any) => (
        <>
          {item.category === "bet" &&
            <ReceiptView
              visible={visible}
              onClose={() => setVisible(false)}
              watermarkText="IGOEPP"
              showIcon={true}
              imageuri={item.imagepath}
            >
              <ThemedView key={item.request_id} style={{ backgroundColor: Colors.gray6, marginHorizontal: 10, paddingHorizontal: 20, paddingVertical: 20 }}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>From</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>Wallet</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Bet id</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.betnija_id}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Bet Platform</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.biller_id}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Amount</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.amount}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }}>Reference</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} >{item.request_id}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Date</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{dayjs(item.created_at).format("MMMM D, YYYY")}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Time</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{dayjs(item.created_at).format("h:mm A")}</ThemedText>
                </View>
              </ThemedView>
            </ReceiptView>
          }

          {/*Airtime receipt */}
          {item.category === "vtu" &&
            <ReceiptView
              visible={visible}
              onClose={() => setVisible(false)}
              watermarkText="IGOEPP"
              showIcon={true}
              imageuri={item.imagepath}
            >
              <ThemedView key={item.referenceId} style={{ backgroundColor: Colors.gray6, marginHorizontal: 10, paddingHorizontal: 20, paddingVertical: 20 }}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>From</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>Wallet</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Network</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.biller_id.split("-")[0]}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small' >Phone number</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small' >{item.phonenumber}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Topup amount</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.topup_amount}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Type</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.vtu_type}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Reference</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.request_id}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Date</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{dayjs(item.created_at).format("MMMM D, YYYY")}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Time</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{dayjs(item.created_at).format("h:mm A")}</ThemedText>
                </View>
              </ThemedView>
            </ReceiptView>
          }


          {item.category === "internet" &&
            <ReceiptView
              visible={visible}
              onClose={() => setVisible(false)}
              watermarkText="IGOEPP"
              showIcon={true}
              imageuri={item.imagepath}
            >
              <ThemedView key={item.referenceId} style={{ backgroundColor: Colors.gray6, marginHorizontal: 10, paddingHorizontal: 20, paddingVertical: 20 }}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>From</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>Wallet</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Network</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.biller_id.split("-")[0]}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Phone number</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.smartcard}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Customer Name</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.customer_name}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Topup amount</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.topup_amount}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Type</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.vtu_type}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Reference</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.request_id}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Date</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{dayjs(item.created_at).format("MMMM D, YYYY")}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Time</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{dayjs(item.created_at).format("h:mm A")}</ThemedText>
                </View>
              </ThemedView>
            </ReceiptView>
          }

          {/*Electricity receipt */}
          {item.category === "disco" &&
            <ReceiptView
              visible={visible}
              onClose={() => setVisible(false)}
              watermarkText="IGOEPP"
              showIcon={true}
              imageuri={item.imagepath}
            >
              <ThemedView key={item.referenceId} style={{ backgroundColor: Colors.gray6, marginHorizontal: 10, paddingHorizontal: 20, paddingVertical: 20 }}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>From</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>Wallet</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Meter Number</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.meter_id}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Meter Type</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.meter_type}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Customer Name</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.customer_name}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Disco</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.biller_id}</ThemedText>
                </View>

                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Amount</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.amount}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Units Purchased</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.purchased_unit}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Receipt Number</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.receipt_number}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Bonus</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.bonus}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Token</ThemedText>
                  <ThemedText style={{ color: Colors.wallet, maxWidth: '50%' }} type='small'>{item.token}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Reference Id</ThemedText>
                  <ThemedText style={{ color: Colors.wallet, maxWidth: '50%' }} type='small'>{item.referenceId}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Date</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{dayjs(item.created_at).format("MMMM D, YYYY")}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Time</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{dayjs(item.created_at).format("h:mm A")}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />
              </ThemedView>
            </ReceiptView>
          }

          {/* tv receipt */}
          {item.category === "tv" &&
            <ReceiptView
              visible={visible}
              onClose={() => setVisible(false)}
              watermarkText="IGOEPP"
              showIcon={true}
              imageuri={item.imagepath}
            >
              <ThemedView key={item.id} style={{ backgroundColor: Colors.gray6, marginHorizontal: 10, paddingHorizontal: 20, paddingVertical: 20 }}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>From</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>Wallet</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Smartcard number</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.smartcard}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Customer name</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.customer_name}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Multichoice</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.biller_id.split("-")[0]}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Package</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.bouquet}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Amount</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.amount}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Request id</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{item.id}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Date</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{dayjs(item.created_at).format("MMMM D, YYYY")}</ThemedText>
                </View>
                <View style={{ margin: 2 }} />

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                  <ThemedText style={{ color: '#000' }} type='small'>Time</ThemedText>
                  <ThemedText style={{ color: Colors.wallet }} type='small'>{dayjs(item.created_at).format("h:mm A")}</ThemedText>
                </View>
              </ThemedView>
            </ReceiptView>
          }
        </>
      ))}
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  mainstyle: {
    flexDirection: 'row',
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.green11,
    marginHorizontal: 10,
    marginVertical: 3,
    padding: 10,
    flex: 1
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    // backgroundColor: '#3E6B34',
    backgroundColor: Colors.green,
    padding: 6,
  },
  tab: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 10,
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
    // // backgroundColor: '#3E6B34',
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