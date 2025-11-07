import GoBack from '@/components/GoBack'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, decryptamount, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { customerwallethistory } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation, useRouter } from 'expo-router'
import React, { useLayoutEffect, useState } from 'react'
import { Alert, Image, ScrollView, StyleSheet, Text, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};


export default function wallethistory({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [history, sethistory] = useState<any>([])
    const {user, token, logout} = useAuth()
    const [isFetching, setIsFetching] = React.useState(false);
    const navigation = useNavigation()
    
    useLayoutEffect(() => {
        const fetchPendingRequests = async () => {
            try {
            setIsFetching(true);
            const response = await customerwallethistory(user?.customer_id, decryptData(token));
            console.log(response)
            sethistory(response.data);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    Alert.alert("Session expired", "Please log in again.");
                    await logout(); // from your AuthContext
                    router.replace("/login"); // navigate to login screen
                } else {
                    Alert.alert('Error', 'Unable to load notification settings.')
                }
            } finally {
            setIsFetching(false);
            }
        };

        const unsubscribe = navigation.addListener("focus", fetchPendingRequests);

        return unsubscribe;
    }, [navigation, user?.customer_id, token]);

    if(isFetching){
        return <LogoSpinner lightColor='' darkColor=''/>
    }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
        <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
            <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
        </GoBack>

         <ThemedView style={styles.walletcontainer}>
          <View style={{margin:6}}/>

          <ThemedText type='subtitle' style={{fontSize:13}}>Wallet Balance</ThemedText>

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

        <View style={{margin:10}}/> 
        <SafeAreaView style={{ flex: 1, backgroundColor: color1 }}>
            {history.length === 0 ? (
                <View style={{ flexDirection: 'row', padding: 16 }}>
                <Image source={require('@/assets/images/frame7.png')} style={{ width: 50, height: 50, borderRadius: 50 }} />
                <View style={{ marginLeft: 10, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 13, fontFamily: 'poppinsRegular', color: color }}>
                    You haven't made any transactions yet.
                    </Text>
                </View>
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                    {history.map((item: any, key: any) => (
                        <View key={key} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={{
                            padding: 10,
                            backgroundColor: item.status === 'D' ? Colors.red2 : Colors.primary5,
                            borderRadius: 100
                            }}>
                            <AntDesign name="arrow-up" size={20} color={item.status === 'D' ? Colors.red : Colors.primary4} />
                            </View>
                            <View style={{ marginLeft: 10, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 12, fontFamily: 'poppinsMedium', color: color }}>
                                {item.method === 'W' ? 'Withdrawal' : 'Funding'}
                            </Text>
                            <Text style={{ fontSize: 10, fontFamily: 'poppinsMedium', color: color }}>
                                {new Date(item.created_at).toLocaleDateString("en-GB", {
                                day: "2-digit", month: "short", year: "numeric"
                                })}{" "}
                                {new Date(item.created_at).toLocaleTimeString("en-GB", {
                                hour: "2-digit", minute: "2-digit", hour12: true
                                })}
                            </Text>
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={{
                            fontSize: 12,
                            fontFamily: 'poppinsBold',
                            color: item.status === 'D' ? Colors.red : Colors.primary4
                            }}>
                            {item.status === 'D' ? '- NGN' : '+ NGN'} {item.amount.toLocaleString()}
                            </Text>
                        </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    walletcontainer: {
        // borderWidth:0.2, 
        borderColor: Colors.gray9, 
        padding:15, 
        borderRadius:15, 
        boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
        // borderRadius: 12,
    },
})