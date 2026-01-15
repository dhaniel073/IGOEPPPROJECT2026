import EmptyScreen from '@/components/EmptyScreen'
import FullScreenModal from '@/components/FullScreenModal'
import GoBack from '@/components/GoBack'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { cartitemupdate, cartshow, deletefromcart } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { FontAwesome5, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useNavigation, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Image, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};

const dataBusiness = [
    {
        id:"W",
        name: 'Pay with wallet',
        icon: <Fontisto name="wallet" size={20} color={Colors.white} />
    },
    {
        id:"C",
        name: "Pay with cash",
        icon: <FontAwesome5 name="money-bill-wave" size={20} color={Colors.white} />
    },
]


const data = ["Y"]

export default function cart({
    lightColor,
    darkColor,
    headerBackgroundColor,
}: Props){

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const navigation = useNavigation()
    const [avail, setavail] = useState<any>("")
    const [visible, setVisible] = useState(false);
    const [cart, setCart] = useState<any>([1]);
    const [isloading, setIsLoading] = useState(false);
    const [cartitem, setCartItems] = useState<any>([])
    const {user, token} = useAuth()
    const [totalPrice, setTotalPrice] = useState(0);
    let priceArray = 0

    console.log(avail)
    const calculateTotal = (items: any) => {
        return items.reduce((total: any, item: any) => total + Number(item.sub_total_amount || 0), 0);
    };

    useEffect(() => {
        const unsuscribe = navigation.addListener('focus', async() => {
            try {
                setIsLoading(true)
                const response = await cartshow(user?.customer_id, decryptData(token))
                console.log(response)
                setCartItems(response)
            } catch (error: any) {
                console.log(error.response)
                Alert.alert('Error', 'Sorry an error occured')
                return;
            }finally{
                setIsLoading(false)
            }
        })
        return unsuscribe;
    }, [])

    useEffect(() => {
        if (cartitem.length > 0) {
            setTotalPrice(calculateTotal(cartitem));
        } else {
            setTotalPrice(0);
        }
    }, [cartitem]);

    const updateCart = async (itemId: number | string, supplier_id: number | string, quantity: any) => {
        console.log("productid"+itemId, "supplierID"+supplier_id, "quantity"+quantity)
        console.log('Adding to cart:', { id: itemId, quantity });
        try {
            setIsLoading(true) 
            const response = await cartitemupdate(itemId,quantity,user?.customer_id,supplier_id,decryptData(token),)  
            console.log(response)
            Alert.alert('Success', `Added ${quantity} item(s) to your cart`, [
                {
                text: 'Continue',
                onPress: () => {},
                },
            ]);
            setQuantities(prev => {
                const updated = { ...prev };
                delete updated[itemId]; // remove that item so it falls back to item.quantity
                return updated;
            });
            await reload();
        } catch (error) {
            Alert.alert("Error", "Error Purchasing Item, Please Try Again Later")
        }finally{
            setIsLoading(false)
        }
    };

    const deleteCartItem = async (id: any) => {
        try {
            setIsLoading(true);
            const response = await deletefromcart(id, decryptData(token));
            console.log(response);

            Alert.alert('Success', 'Item(s) deleted from your cart');
            await reload();
        } catch (error) {
            Alert.alert('Error', 'Error deleting item, please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const reload = async() => {
        try {
            setIsLoading(true)
            const response = await cartshow(user?.customer_id, decryptData(token))
            console.log(response)
            setCartItems(response)
        } catch (error: any) {
            console.log(error)
            Alert.alert('Error', 'Sorry an error occured')
            return;
        }finally{
            setIsLoading(false)
        }
    }

    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const handleQuantityChange = (itemId: string | number, change: number) => {
        const key = String(itemId); // Always use string keys

        setQuantities((prev) => {
            // Get current quantity: either from state or cart items
            const current =
            prev[key] ??
            cartitem.find((item: any) => String(item.product_id) === key)?.quantity ??
            1;

            const updated = Math.max(1, current + change); // Prevent 0 or negative
            return { ...prev, [key]: updated };
        });
    };

    if(isloading){
        return <LogoSpinner lightColor='' darkColor=''/>
    }

  return (
   <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
        <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
            <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
        </GoBack>
        <View style={{margin:6}}/> 
        <ThemedText type="titleMedium">Cart</ThemedText>
        <ThemedText style={{color: Colors.gray9}}>View list of item available</ThemedText>

        <View style={{margin:15}}/>

        <View style={{ flex: 1 }}>
            

            {cartitem.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <EmptyScreen
                        mainText="No new Items in cart"
                        subText="Your cart items will appear here when you add one."
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
                            <ThemedView style={[styles.shadow, {flexDirection:'row', padding:10, borderRadius:10,  justifyContent:'space-between'}]}>
                                {/* Left Side: Image + Details */}
                                <View style={{flexDirection:'row', flex:1}}>
                                    <Image
                                        style={styles.image}
                                        source={{
                                            uri: `https://igoeppms.com/igoepp/public/products/${item.product_picture}`,
                                        }}
                                    />
                                    <View style={{marginLeft:8, flexShrink:1}}>
                                    <ThemedText>{item.category_name}</ThemedText>
                                    <ThemedText type='small'>{item.catname || 'Brand'}</ThemedText>
                                    <ThemedText>NGN {item.price.toLocaleString()}</ThemedText>
                                    <ThemedText type="small">
                                        In stock -{' '}
                                        <ThemedText style={{ color: Colors.green4 }} type="small">
                                        {item.available ? 'Yes' : 'No'}
                                        </ThemedText>
                                    </ThemedText>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-evenly',
                                            alignItems: 'center',
                                            marginTop: 5,
                                            marginLeft: -10,
                                            width: 100,
                                        }}
                                        >
                                        {/* ↓ Decrease Quantity */}
                                        <TouchableOpacity
                                            onPress={() => handleQuantityChange(item.product_id, -1)}
                                            activeOpacity={0.4}
                                            style={{ borderWidth: 1, borderColor: Colors.gray9, borderRadius: 100 }}
                                        >
                                            <MaterialIcons name="keyboard-arrow-down" size={24} color={Colors.gray9} />
                                        </TouchableOpacity>

                                        {/* Current Quantity */}
                                        <ThemedText>{quantities[item.product_id] ?? item.quantity}</ThemedText>

                                        {/* ↑ Increase Quantity */}
                                        <TouchableOpacity
                                            onPress={() => handleQuantityChange(item.product_id, 1)}
                                            activeOpacity={0.4}
                                            style={{ borderWidth: 1, borderColor: Colors.gray9, borderRadius: 50 }}
                                        >
                                            <MaterialIcons name="keyboard-arrow-up" size={24} color={Colors.gray9} />
                                        </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                {/* Right Side: Delete Button */}
                                {(quantities[item.product_id] ?? item.quantity) !== item.quantity ? (
                                    // Quantity changed → Show Update button
                                    <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                        <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center' }}
                                        onPress={() => updateCart(item.product_id, item.supplier_id, quantities[item.product_id])}
                                        >
                                        <ThemedText style={{ color: Colors.green, fontSize: 12 }}>
                                            Update cart
                                        </ThemedText>
                                        <MaterialIcons name="shopping-cart" size={20} color={Colors.green} />
                                        </TouchableOpacity>
                                    </View>
                                    ) : (
                                    // Quantity not changed → Show Delete button
                                    <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                        <TouchableOpacity
                                        style={{ flexDirection: 'row', alignItems: 'center' }}
                                        onPress={() => deleteCartItem(item.id)}
                                        >
                                        <ThemedText style={{ color: Colors.red }}>Delete</ThemedText>
                                        <MaterialCommunityIcons name="trash-can" size={20} color={Colors.red} />
                                        </TouchableOpacity>
                                    </View>
                                )}

                            </ThemedView>
                        )}
                        ListFooterComponent={
                            <>
                            {
                                cartitem && 

                                <>
                            
                                    <View style={{margin:35}}/>

                                    {/* <ThemedView style={[styles.shadow, {padding:10, borderRadius:6}]}>
                                        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                                            <ThemedText>Delivery Address</ThemedText>
                                            <MaterialIcons name="keyboard-arrow-right" size={24} color={color} />
                                        </View>

                                        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center',}}>
                                            <ImageBackground source={require('@/assets/images/location.png')} style={{width:60, height:60, justifyContent:'center', alignItems:'center'}}>
                                                <View style={{backgroundColor:Colors.marker, padding:3, borderRadius:50}}>
                                                    <Octicons name="location" size={16} color="#fff" />
                                                </View>
                                            </ImageBackground>
                                            
                                            <View style={{marginLeft:-30}}>
                                                <ThemedText>18, agege road mushin, Lagos</ThemedText>
                                                <ThemedText style={{color: Colors.gray9}}>Lagos</ThemedText>
                                            </View>
                                            <Octicons name="check-circle-fill" size={24} color={Colors.green4} />
                                        </View>
                                    </ThemedView>

                                    <View style={{margin:12 }}/> */}

                                    {/* Payment method */}
                                    <ThemedText type="subtitle">Payment Method</ThemedText>
                                    <View style={{margin:3}}/>

                                {dataBusiness.map((item: any, key: any) => 
                                    <>

                                    <ThemedView key={item.id} style={[{padding:15, borderRadius:6, borderWidth:1, borderColor: Colors.gray10}]}>
                                        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center',}}>
                                            <View style={{flexDirection:'row'}}>
                                                <View style={{ backgroundColor: Colors.wallet, alignSelf:'center', padding: 10,borderRadius: 50}}>
                                                    {item.icon}
                                                </View>
                                                <View style={{marginLeft:10}}>
                                                    <ThemedText>{item.name}</ThemedText>
                                                    <ThemedText style={{color: Colors.gray9}}>{totalPrice.toLocaleString('en-NG', {
                                                            style: 'currency',
                                                            currency: 'NGN',
                                                        })}
                                                    </ThemedText>
                                                </View>
                                            </View>
                                                <View key={key}>
                                                    <TouchableOpacity style={{padding: 15, borderRadius:10, flexDirection:'row', justifyContent:'space-between'}} onPress={() => [setavail(item.id)]}>
                                                        <TouchableOpacity style={[styles.outer, {borderColor: color}]} onPress={() => setavail(item.id)}>
                                                            {avail === item.id && <View style={styles.inner}/>}
                                                        </TouchableOpacity>
                                                    </TouchableOpacity>
                                                </View>
                                        </View>
                                    </ThemedView>
                                    <View style={{margin:5}}/>
                                    </>
                                )}

                                    <View style={{margin:12 }}/>
                                    
                                    <ThemedText type="subtitle">Order Info</ThemedText>

                                    <ThemedView>
                                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                            <ThemedText>Subtotal</ThemedText>
                                            <ThemedText>{totalPrice.toLocaleString('en-NG', {
                                                    style: 'currency',
                                                    currency: 'NGN',
                                                })}
                                            </ThemedText>
                                        </View>
                                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                            <ThemedText>Delivery</ThemedText>
                                            <ThemedText>NGN 0.00</ThemedText>
                                        </View>
                                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                            <ThemedText>Total</ThemedText>
                                            <ThemedText>{totalPrice.toLocaleString('en-NG', {
                                                    style: 'currency',
                                                    currency: 'NGN',
                                                })}
                                            </ThemedText>
                                        </View>
                                    </ThemedView>

                                    <View style={{margin:15 }}/>
                                    
                                    <ThemedButton enabled={true} style={{backgroundColor: Colors.green, padding: 15, borderRadius:30, alignItems:'center'}} onPress={() => !avail ? alert("Select a payment method") : router.push({pathname:"/(protected)/checkout", params:{paymentmethod: avail}})}>
                                        <ThemedText style={{color:'#fff'}}>CheckOut</ThemedText>
                                    </ThemedButton>

                                    <View style={{margin:15 }}/>
                                </>
                            }
                            </>

                        }
                    />
                </>
            )}


            

            <FullScreenModal
                visible={visible}
                onClose={() => [setVisible(false), router.push('/(protected)/(tabs)/market')]}
                mainText="Order Confirmed"
                subText="Your order(s) is on the way and should arrive shortly."
            />
        </View>
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
    outer:{
        width:20,
        height: 20,
        borderWidth: 1,
        borderRadius: 15,
        justifyContent:'center',
        alignItems: 'center'
    },
    inner:{
        width:10,
        height:10,
        backgroundColor: Colors.green,
        borderRadius:10
    },
})