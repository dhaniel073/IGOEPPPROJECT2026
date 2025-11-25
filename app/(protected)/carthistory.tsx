import EmptyScreen from '@/components/EmptyScreen'
import GoBack from '@/components/GoBack'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { cartpurchase } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useNavigation, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Image, StyleSheet, TextProps, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};
export default function carthistory({
    lightColor,
    darkColor,
    headerBackgroundColor,
}: Props){

  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const router = useRouter()
  const navigation = useNavigation()
  const [cartitem, setCartItems] = useState<any>([])
  const {user, token, logout} = useAuth()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setIsLoading(true)
        const response = await cartpurchase(user?.customer_id, decryptData(token))
        console.log(response)
        setCartItems(response)
      } catch (error: any) {
        if (error.response?.status === 401) {
          Alert.alert("Session expired", "Please log in again.");
          await logout(); // from your AuthContext
          router.replace("/login"); // navigate to login screen
        } else {
          Alert.alert('Error', 'Unable to load categories.')
        }
        console.log(error.response)
      }finally{
        setIsLoading(false)
      }
    })
    return unsubscribe
  }, [])

  if(isLoading){
    return <LogoSpinner lightColor='' darkColor=''/>
  }


  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
      <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
        <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
      </GoBack>
      <View style={{margin:6}}/> 
      <ThemedText type="titleMedium">Cart History</ThemedText>
      <ThemedText style={{color: Colors.gray9}}>View your cart history</ThemedText>

      <View style={{margin:6}}/> 

      {cartitem.length === 0 ? (
        <View style={styles.emptyContainer}>
        <EmptyScreen
          mainText="No history"
          subText="Your cart items will appear here after purchase."
          imageSource={require('@/assets/images/cart.png')} // your local image
        />
        </View>
        ) : (
        <>
        <FlatList
            keyExtractor={(item: any) => item.id.toString()}
            data={cartitem}
            showsVerticalScrollIndicator={false}
            numColumns={1}
            renderItem={({ item }) => (
              <ThemedView style={[styles.shadow, {flexDirection:'row', padding:10, borderRadius:10, marginBottom:8, justifyContent:'space-between'}]}>
                {/* Left Side: Image + Details */}
                <View style={{flexDirection:'row', flex:1}}>
                  {
                    !item.picture ? 
                      <Image
                        style={styles.image}
                        source={require('@/assets/images/brokenimage.png')}
                    />
                    :
                      <Image
                        style={styles.image}
                        source={{
                          uri: `https://phixotech.com/igoepp/public/products/${item.picture}`,
                        }}
                      />
                  }
                  <View style={{marginLeft:8, flexShrink:1}}>
                  <ThemedText>{item.category_name}</ThemedText>
                  <ThemedText type='small'>{item.product_name || 'Brand'}</ThemedText>
                  <ThemedText>NGN {Number(item.sub_total_amount).toLocaleString()}</ThemedText>
                  {item.delivery_status === 'D' ? 
                      <ThemedText type="small" style={{color: Colors.green4}}>
                        Delivered
                      </ThemedText>
                    :
                      <ThemedText type="small">
                        Cancelled
                      </ThemedText>
                  }  
                    <View style={{margin:3}}/> 

                    <ThemedText  type="small">
                      {item.delivery_date}
                    </ThemedText>

                    </View>
                  </View>
            </ThemedView>
          )}
        />
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth:1
  },
  image:{
    width:90,
    height:120,
    borderRadius:6
  },
  shadow: {
    boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
    borderRadius: 12,
  },
})