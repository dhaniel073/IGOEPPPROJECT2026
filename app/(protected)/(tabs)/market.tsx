import ImageCarousel from '@/components/ImageCarousel'
import LoadingScreen from '@/components/LoadingScreen'
import { ThemedText } from '@/components/ThemedText'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { cartshow, category, walletbal } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Market() {
  const color1 = useThemeColor({}, 'background')
  const navigation = useNavigation()
  const [fetchedCategory, setFetchedCategory] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const {user, token, updateUserFields} = useAuth()
  const {logout} = useAuth()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setIsLoading(true)
        const response = await category()
        setFetchedCategory(response)
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setIsLoading(true)
        const response = await cartshow(user?.customer_id, decryptData(token))
        const wallet = await walletbal(user?.customer_id, decryptData(token));
        updateUserFields({cartcount: response.length, wallet_balance: wallet.wallet_balance})
      } catch (error: any) {
        console.log(error.response)
      }finally{
        setIsLoading(false)
      }
    })
    return unsubscribe
  }, [])

  if (isLoading) {
    return <LoadingScreen lightColor="" darkColor="" />
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: color1 }}
      edges={['top']}
    >
      <FlatList
        keyExtractor={(item: any) => item.id.toString()}
        data={fetchedCategory}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Cart Button */}
            <View style={{alignItems:'center', flexDirection:'row', justifyContent:'space-between'}}>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/carthistory')}
              >
                <ThemedText style={{ fontSize: 15 }}>
                  Order history
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.cartButton}
                onPress={() => router.push('/cart')}
              >
                <MaterialIcons name="shopping-cart" size={22} color={Colors.green} />
                {user?.cartcount > 0 && (
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
                      {user?.cartcount > 100 ? '99+' : user?.cartcount}
                    </ThemedText>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            
            {/* Titles */}
            <ThemedText type="titleMedium">Market Place</ThemedText>
            <ThemedText style={styles.subtitle}>
              Shop items from the market place store
            </ThemedText>

            {/* Image Carousel */}
            <View style={{ marginVertical: 10 }}>
              <ImageCarousel />
            </View>

            {/* Categories Label */}
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Categories
            </ThemedText>
          </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.5}
            onPress={() => router.push({pathname:"/marketitems", params:{catname:item.cat_name, catid: item.id}})}
          >
            <ImageBackground
              source={{ uri: `https://igoeppms.com/igoepp/public/category/${item.image}` }}
              style={styles.imageBackground}
              imageStyle={styles.imageStyle}
            >
              <ThemedText style={styles.categoryText} type='small'>
                {item.cat_name}
              </ThemedText>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  cartButton: {
    backgroundColor: Colors.clock1,
    alignSelf: 'flex-end',
    padding: 5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:10,
  },
  subtitle: {
    color: Colors.gray9,
    marginBottom: 10,
  },
  sectionTitle: {
    marginTop: 15,
    marginBottom: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    alignItems:'center',
    flex:1,
    marginRight:5,
    marginLeft:5
  },
  imageBackground: {
    width: "100%",
    height: 90,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imageStyle: {
    borderRadius: 7,
  },
  categoryText: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    width: '100%',
    textAlign: 'center',
    paddingVertical: 5,
  },
})
