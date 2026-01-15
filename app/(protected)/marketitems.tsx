import EmptyScreen from '@/components/EmptyScreen'
import GoBack from '@/components/GoBack'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { cartitem, cartitemstore, cartshow } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { height } = Dimensions.get('window')

export type Props = {
  lightColor?: string
  darkColor?: string
  headerBackgroundColor: { dark: string; light: string }
}

export default function marketitems({
  lightColor,
  darkColor,
  headerBackgroundColor,
}: Props) {
  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background')
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text')
  const router = useRouter()
  const { catname, catid } = useLocalSearchParams()
  const { user, token, updateUserFields } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [category, setCategory] = useState<any>([])
  const navigation = useNavigation()

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const handleQuantityChange = (itemId: string | number, change: number) => {
    setQuantities((prev) => {
        const current = prev[itemId] || 1;
        const updated = Math.max(1, current + change); // never below 1
        return { ...prev, [itemId]: updated };
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const response = await cartitem(catid, decryptData(token))
        console.log(response)
        setCategory(response)
      } catch (error: any) {
        console.log(error)
        Alert.alert('Error', 'Error fetching Market Items')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setIsLoading(true)
        const response = await cartshow(user?.customer_id, decryptData(token))
        updateUserFields({cartcount: response.length})
      } catch (error: any) {
        console.log(error.response)
      }finally{
        setIsLoading(false)
      }
    })
    return unsubscribe
  }, [])

  const addToCart = async (itemId: number | string, supplier_id: number | string) => {
    const quantity = quantities[itemId] || 1;

    // You can handle the actual cart logic here:
    console.log('Adding to cart:', { id: itemId, quantity });
    try {
      setIsLoading(true) 
      const response = await cartitemstore(itemId,quantity,user?.customer_id,supplier_id,decryptData(token))  
      console.log(response)
      Alert.alert('Success', `Added ${quantity} item(s) to your cart`, [
        {
          text: 'Continue',
          onPress: () => {},
        },
        {
          text: 'Go to cart',
          onPress: () => router.push('/cart'),
        },
      ]);
    } catch (error: any) {
      console.log(error.response)
      Alert.alert("Error", "Error Purchasing Item, Please Try Again Later")
    }finally{
      setIsLoading(false)
    }
  };

    

    if(isLoading){
        return <LogoSpinner lightColor='' darkColor=''/>
    }
  return (
    <SafeAreaView
      style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }}
      edges={['top']}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
          <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
        </GoBack>
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

      <View style={{ marginVertical: 15 }}>
        <ThemedText type="titleMedium">{catname}</ThemedText>
        <ThemedText type="small">View list of items available</ThemedText>
      </View>

      {/* Main Content */}
      {category.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyScreen
            mainText="No Items"
            subText="No items available under this category."
            imageSource={require('@/assets/images/cart.png')}
          />
        </View>
      ) : (
        <>
          <FlatList
            keyExtractor={(item: any) => item.id.toString()}
            data={category}
            showsHorizontalScrollIndicator={false}
            numColumns={1}
            renderItem={({ item }) => (
              <ThemedView
                style={[
                  styles.shadow,
                  {
                    flexDirection: 'row',
                    padding: 10,
                    borderRadius: 10,
                    justifyContent: 'space-between',
                    marginBottom: 12,
                  },
                ]}
              >
                {/* Left Side */}
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <Image
                    style={styles.image}
                    source={{
                      uri: `https://igoeppms.com/igoepp/public/products/${item.picture}`,
                    }}
                  />
                  <View style={{ marginLeft: 8, flexShrink: 1 }}>
                    <ThemedText>{item.name || 'Item'}</ThemedText>
                    <ThemedText type="small">{catname || 'Brand'}</ThemedText>
                    <ThemedText>NGN {item.price.toLocaleString() || '0.00'}</ThemedText>
                    <ThemedText type="small">
                      In stock -{' '}
                      <ThemedText style={{ color: Colors.green4 }} type="small">
                        {item.available ? 'Yes' : 'No'}
                      </ThemedText>
                    </ThemedText>

                    {/* Quantity control */}
                    <View style={styles.quantityContainer}>
                      <TouchableOpacity
                        activeOpacity={0.4}
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item.id, -1)}
                      >
                        <MaterialIcons
                          name="keyboard-arrow-down"
                          size={24}
                          color={Colors.gray9}
                        />
                      </TouchableOpacity>
                      <ThemedText>{quantities[item.id] || 1}</ThemedText>
                      <TouchableOpacity
                        activeOpacity={0.4}
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item.id, 1)}
                      >
                        <MaterialIcons
                          name="keyboard-arrow-up"
                          size={24}
                          color={Colors.gray9}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Right Side */}
                <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => addToCart(item.id, item.supplier_id)}
                  >
                    <ThemedText style={{ color: Colors.green, fontSize: 12 }}>
                      Add to cart
                    </ThemedText>
                    <MaterialIcons name="shopping-cart" size={20} color={Colors.green} />
                  </TouchableOpacity>
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
  cartButton: {
    backgroundColor: Colors.clock1,
    padding: 5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 90,
    height: 120,
    borderRadius: 6,
  },
  shadow: {
    boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
    borderRadius: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: -10,
    width: 100,
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: Colors.gray9,
    borderRadius: 50,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth:1
  },
})
