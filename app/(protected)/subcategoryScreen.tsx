import GoBack from '@/components/GoBack';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/AuthContext';
import { subcategory } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, Animated, Dimensions, FlatList, Image, Modal, StyleSheet, Text, TextProps, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

  export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor:{ dark: string; light: string };
  };

  export default function subcategoryScreen({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props) {

    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const router = useRouter()
    const navigation = useNavigation();
    const {id, name, invoice_type} = useLocalSearchParams<any>()
    const {logout} = useAuth()
    const [modalVisible, setModalVisible] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen
    const [fetchedCategory, setFetchedCategory] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState({
        subcatid: "",
        preassessment_flg: "",
    });
    

    useLayoutEffect(() => {
        const fetchPendingRequests = async () => {
        try {
            const response = await subcategory(id);
            console.log(response)
            setFetchedCategory(response)
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

    const openPopup = (subcatid:any, preassessment_flg:any) => {
        setFormData({subcatid:id, preassessment_flg: preassessment_flg})
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

    
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color1, paddingHorizontal:20, paddingTop:10}} edges={['top']}>
        <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
            <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
        </GoBack>
        <View style={{margin:15}}/> 

        <ThemedText type="titleMedium">{name}</ThemedText>
        <ThemedText style={{color: Colors.gray9}}>View all sub categories</ThemedText>

        <View style={{margin:15}}/>

        <FlatList
            keyExtractor={(item: any) => item.id.toString()}
            data={fetchedCategory}
            showsHorizontalScrollIndicator={false}
            numColumns={1}
            renderItem={({ item }) => (
                <TouchableOpacity>
                    <ThemedView style={{padding:20, borderColor: Colors.gray9, borderWidth:0.5, borderRadius:15, marginBottom:15, boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',}}>
                        {
                            item.image === null || "" ? 
                            <Image source={require('@/assets/images/bookings.png')} style={styles.image} />
                            :
                            <Image source={{uri: `https://phixotech.com/igoepp/public/subcategory/${item.image}`}} style={styles.image} />
                        }

                        <View style={{margin:15}}/>

                        <ThemedView style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <ThemedText type="titleLight">{item.sub_cat_name}</ThemedText>
                        </ThemedView>

                        <View style={{margin:7}}/>

                        <ThemedView style={{flexDirection:'row'}}>
                            <ThemedText  style={{color:Colors.gray9}}>{item.sub_cat_desc}</ThemedText>
                        </ThemedView>

                        <View style={{margin:10}}/>
                        
                        <ThemedButton style={{backgroundColor: Colors.green, alignSelf: 'flex-end', padding:7, borderRadius:25, paddingHorizontal:15}} onPress={() => openPopup(item.id, item.preassessment_flg)}>
                            <ThemedText style={{color:'#fff'}} type='defaultSemiBold'>Proceed</ThemedText>
                        </ThemedButton>
                        
                    </ThemedView>
                </TouchableOpacity>
            )}
        />
        

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
                <TouchableOpacity onPress={closePopup} style={{alignSelf:'flex-end'}}> 
                    <MaterialIcons name="cancel" size={24} color={Colors.green} />
                </TouchableOpacity>

                <ThemedText type='subtitle' style={{textAlign:'center'}}>Select a request type</ThemedText>

                <View style={{margin:10}}/>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>

                    <TouchableOpacity activeOpacity={0.6} style={[styles.card, { backgroundColor: Colors.yellow3, padding:12, borderRadius:12 }]} onPress={() => [closePopup(), router.push(
                        {pathname: '/selectartisan', params:{request_type:"P", invoice_type: invoice_type, catid: id, subcatid:formData.subcatid, preassessment_flg: formData.preassessment_flg}})]}>
                        <MaterialIcons name="person" size={28} color={Colors.yellow2} style={styles.icon} />
                        <Text style={styles.cardTitle}>
                            Send to an Artisan
                        </Text>
                        <Text style={styles.cardText}>Request a particular artisan</Text>
                    </TouchableOpacity>

                    <View style={{marginHorizontal:5}}/>

                    <TouchableOpacity activeOpacity={0.6} style={[styles.card, { backgroundColor: Colors.green6, padding:12, borderRadius:12 }]} onPress={() => [closePopup(), router.push(
                        {pathname:'/requesthelp', params:{request_type:"G", invoice_type: invoice_type,catid:id, subcatid:formData.subcatid, preassessment_flg: formData.preassessment_flg}})]}>
                        <FontAwesome name="group" size={20} color={Colors.green4} style={styles.icon} />
                        <Text style={styles.cardTitle}>
                            Send to all Artisans
                        </Text>
                        <Text style={styles.cardText}>Send request to a general pool of artisans</Text>
                    </TouchableOpacity>
                </View>
                <View style={{margin:15}}/>
            </Animated.View>
        </Modal>
        
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    card: {
        flex: 1,
        // padding: 12,
        // borderRadius: 12,
        // marginHorizontal: 5,
    },
    icon: {
        marginBottom: 8,
    },
    cardTitle: {
        color: '#000',
        marginBottom: 6,
        fontSize:12,
        fontFamily:'poppinsMedium'
    },
    cardText: {
        color: Colors.blacktext,
    },
    image:{
        width: "100%",
        height: 150,
        borderRadius: 12,
        alignSelf:'center'
    },
    popup: {
        position: 'absolute',
        bottom:0,
        width: '100%',
        backgroundColor: '#fff',
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        boxShadow: '0px 4px 6px rgba(0,0,0,0.35)', 
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
})