import GoBack from '@/components/GoBack'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, decryptamount, decryptData, DIMENSION } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { customerinfocheck } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Feather, FontAwesome, Fontisto, Ionicons, MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { useNavigation, useRouter } from 'expo-router'
import React, { useLayoutEffect, useState } from 'react'
import { Alert, Animated, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};


export default function addmoney({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [visible,setIsVisible] = useState(false)
    const { user, token, updateUser, logout } = useAuth();
    const navigation = useNavigation()

    const copyToClipboard = async (number: string) => {
        await Clipboard.setStringAsync(number);
        // Alert.alert('copied')
    };

    const handlePlay = () => {
        setIsVisible(true)
        setTimeout(() => {
          setIsVisible(false);
        }, 2000); // Adjust this duration to match the length of your GIF
    };

    useLayoutEffect(() => {
        const fetchPendingRequests = async () => {
            try {
                const response = await customerinfocheck(user?.customer_id, decryptData(token));
                console.log(response)
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
    
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, backgroundColor: color1, maxHeight: DIMENSION.HEIGHT }} edges={['top']}>
        <Animated.ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow:1}}>  
            <GoBack onClick={() => router.push("/")} lightColor={color} darkColor={color}> 
                <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
            </GoBack>

            <View style={{margin:10}}/> 
            <ThemedText type="titleMedium">Add Money</ThemedText>
            <ThemedText style={{color: Colors.gray9}}>Add money via card or account transfer</ThemedText>

            <View style={{margin:15}}/>
        
            <ThemedView style={styles.walletcontainer}>
                <View style={{backgroundColor: Colors.yellow, padding: 5, borderRadius: 10, alignSelf: 'flex-start'}}>
                    <Fontisto name="wallet" size={10} color={"#fff"} />
                </View>

                <View style={{margin:6}}/>

                <ThemedText type='subtitle'>Wallet Balance</ThemedText>
                <View style={{margin:3}}/>
                {/* <ThemedText type='default'>2000228665</ThemedText> */}

                <View style={{margin:8}}/>

                <ThemedView style={{flexDirection:'row', justifyContent:'space-between', }}>
                    <ThemedView>
                        <ThemedText type='title'>
                            {decryptamount(user?.wallet_balance)
                                .toLocaleString('en-NG', {
                                    style: 'currency',
                                    currency: 'NGN',
                                })
                            }
                        </ThemedText>
                        <ThemedText type='small' style={{color:Colors.gray9}}>Available balance</ThemedText>
                    </ThemedView>

                    
                    <TouchableOpacity>
                        <Feather name="eye" size={24} color={color} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ alignItems: 'center', marginTop:-25 }}>
                        <View style={{
                            padding: 8,borderRadius: 50, 
                            backgroundColor: '#fff',
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

            <View style={{margin:13}}/>
            <View style={{borderTopColor: Colors.wallet, borderWidth:0.5}}/>
            <View style={{margin:13}}/>
            
           <ThemedView
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                }}
                >
                {/* Left Section - Icon + Text */}
                <ThemedView style={{ flexDirection: 'row' }}>
                    <ThemedView style={{ padding:15, borderRadius:50, backgroundColor: Colors.green, alignItems: 'center',justifyContent: 'center', alignSelf: 'flex-start'}}>
                        <FontAwesome name="bank" size={12} color="#fff" />
                    </ThemedView>

                    <ThemedView style={{ paddingLeft: 20 }}>
                        <ThemedText>Bank Transfer</ThemedText>
                        <ThemedText type='small' style={{ color: Colors.gray9, marginTop: 1 }}>
                            Add money via mobile or internet
                        </ThemedText>
                        <ThemedText type='small' style={{ color: Colors.gray9 }}>
                            banking
                        </ThemedText>
                    </ThemedView>
                </ThemedView>

                {/* Right Section - Recommended Badge */}
                <ThemedView
                    style={{flexDirection: 'row',alignItems: 'center',backgroundColor: '#fff',paddingHorizontal: 6,paddingVertical: 2,borderRadius: 6,marginTop: 4,}}
                >
                    <Ionicons name="checkmark-circle-sharp" size={14} color={Colors.green2} style={{ marginRight: 3 }} />
                    <ThemedText type="defaultSemiBold" style={{ color: Colors.green2, fontSize: 10, lineHeight: 14 }}>
                        Recommended
                    </ThemedText>
                </ThemedView>
            </ThemedView>

            <View style={{margin:13}}/>

            {/* <ThemedView style={styles.container}>
                <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'flex-start'}}>
                    <View style={{ flexDirection: 'row' }}>
                        <ThemedView style={{ padding:15, borderRadius:50, backgroundColor: Colors.green, alignItems: 'center',justifyContent: 'center', alignSelf: 'flex-start'}}>
                            <MaterialCommunityIcons name="bank" size={18} color="#fff" />
                        </ThemedView>

                        <View style={{ paddingLeft: 20 }}>
                            <ThemedText style={{color: '#fff'}}>Bank Name</ThemedText>
                            <ThemedText style={{ fontSize: 13, color: '#fff', marginTop: 3 }}>
                                VFD Microfinance bank
                            </ThemedText>
                        </View>
                    </View>
                    <ThemedView style={{flexDirection: 'row',alignItems: 'center',backgroundColor: '#fff', padding:10, borderRadius: 50,marginTop: 4}}>
                        <EvilIcons name="share-google" size={15} color={Colors.green} />
                    </ThemedView>
                </View>

                <View style={{margin:7}}/>
                <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'flex-start'}}>
                    <View style={{ flexDirection: 'row' }}>
                        <ThemedView style={{ padding:15, borderRadius:50, backgroundColor: Colors.green, alignItems: 'center',justifyContent: 'center', alignSelf: 'flex-start'}}>
                            <Ionicons name="person-outline" size={18} color="#fff" />
                        </ThemedView>

                        <View style={{ paddingLeft: 20 }}>
                            <ThemedText style={{color: '#fff'}}>Account Number</ThemedText>
                            <ThemedText style={{ fontSize: 13, color: '#fff', marginTop: 3 }}>
                                2000228665
                            </ThemedText>
                        </View>
                    </View>
                    <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',backgroundColor: '#fff', padding:10, borderRadius: 50,marginTop: 4}} onPress={()=> [handlePlay(),copyToClipboard('2000228665')]}>
                        <Feather name="copy" size={15} color={Colors.green} />
                    </TouchableOpacity>
                </View>

                <View style={{margin:7}}/>
                
                <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'flex-start'}}>
                    <View style={{ flexDirection: 'row' }}>
                        <ThemedView style={{ padding:15, borderRadius:50, backgroundColor: Colors.green, alignItems: 'center',justifyContent: 'center', alignSelf: 'flex-start'}}>
                            <Ionicons name="person-add-outline" size={18} color="#fff" />
                        </ThemedView>

                        <View style={{ paddingLeft: 20 }}>
                            <ThemedText style={{color: '#fff'}}>Account Name</ThemedText>
                            <ThemedText style={{ fontSize: 13, color: '#fff', marginTop: 3 }}>
                                Daniel Chinedu Emmanuel
                            </ThemedText>
                        </View>
                    </View>
                </View>

            </ThemedView> */}

            {/* <View style={{margin:15}}/> */}
        
            <ThemedText type='subtitle'>Other Options</ThemedText>

            
            <View style={{margin:7}}/>

            <TouchableOpacity activeOpacity={0.3} style={styles.container1} onPress={() => router.push('/addmoneycard')}>
                {/* other options*/}
                <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'flex-start'}}>
                    <View style={{ flexDirection: 'row' }}>
                        <ThemedView style={{ padding:15, borderRadius:50, backgroundColor: Colors.wallet, alignItems: 'center',justifyContent: 'center', alignSelf: 'flex-start'}}>
                            <SimpleLineIcons name="credit-card" size={18} color="#fff" />
                        </ThemedView>

                        <View style={{ paddingLeft: 20 }}>
                            <ThemedText style={{color: '#000'}}>Add money using card</ThemedText>
                            <ThemedText style={{ fontSize: 13, color: Colors.gray9, marginTop: 3 }}>
                                Add money directly from your
                            </ThemedText>
                            <ThemedText style={{ fontSize: 13, color: Colors.gray9, marginTop: 3 }}> bank card</ThemedText>
                        </View>
                    </View>
                </View>
                <View style={{margin:5}}/>
                <View style={{borderColor: Colors.wallet, borderWidth:0.3}}/>
            </TouchableOpacity>

            <View style={{margin:5}}/>

            <TouchableOpacity activeOpacity={0.3} style={styles.container1} onPress={() => router.push('/addmoneytf')}>
                {/* other options*/}
                <View style={{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'flex-start'}}>
                    <View style={{ flexDirection: 'row' }}>
                        <ThemedView style={{ padding:15, borderRadius:50, backgroundColor: Colors.wallet, alignItems: 'center',justifyContent: 'center', alignSelf: 'flex-start'}}>
                            {/* <SimpleLineIcons name="credit-card" size={18} color="#fff" /> */}
                            <MaterialCommunityIcons name="bank" size={18} color="#fff"/>
                        </ThemedView>

                        <View style={{ paddingLeft: 20 }}>
                            <ThemedText style={{color: '#000'}}>Bank Transfer</ThemedText>
                            <ThemedText style={{ fontSize: 13, color: Colors.gray9, marginTop: 3 }}>
                                Make a transfer from
                            </ThemedText>
                            <ThemedText style={{ fontSize: 13, color: Colors.gray9, marginTop: 3 }}> your bank</ThemedText>
                        </View>
                    </View>
                </View>
                <View style={{margin:5}}/>
                <View style={{borderColor: Colors.wallet, borderWidth:0.3}}/>
            </TouchableOpacity>
            {
                visible ? 
                <ThemedView style={{backgroundColor:color, justifyContent:'center', position:'absolute', alignSelf:'center',  top: 40, padding:10, borderRadius:8}}>
                    <ThemedText style={{textAlign:'center', color:color1}}>Copied!</ThemedText>
                </ThemedView>
                :
                null
            }
        </Animated.ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    walletcontainer: {
        borderColor: Colors.gray9, 
        padding:15, borderRadius:15, 
        boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
    },
    container:{
        borderColor: Colors.gray9, padding:15, borderRadius:15, 
        backgroundColor: Colors.green

    },
    container1:{
        borderWidth:0.2, borderColor: Colors.gray9, padding:18, borderRadius:15, 
        backgroundColor: Colors.offwhite
    }
})