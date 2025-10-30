import GoBack from '@/components/GoBack'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { getsubcathelper } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import React, { useLayoutEffect, useState } from 'react'
import { Alert, Animated, Dimensions, FlatList, Image, Modal, StyleSheet, TextInput, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
  
 const { height } = Dimensions.get('window');

 export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor:{ dark: string; light: string };
  };

  export default function selectartisan({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props) {

    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const router = useRouter()
    const {token, user, logout} = useAuth()
    const [isModalVisible, setModalVisible] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen
    const {request_type, catid, subcatid, preassessment_flg} = useLocalSearchParams()
    const navigation = useNavigation()
    const [responseData, setresponseData] = useState<any>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [fetchedRequest, setFetchedRequest] = useState<any>([])

    useLayoutEffect(() => {
      const fetchPendingRequests = async () => {
      try {
        const response = await getsubcathelper(catid, decryptData(token));
        console.log(response)
        setresponseData(response.data)
        setFetchedRequest(response.data)
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
      }};
      const unsubscribe = navigation.addListener("focus", fetchPendingRequests);
      return unsubscribe;
    }, []);

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };

    const handleSearch = (query: string) => {
      setSearchQuery(query);

      const formattedQuery = query.toLowerCase().trim();

      // Only filter when something is typed
      if (formattedQuery.length > 0) {
        const filteredData = responseData.filter(
          (item: any) =>
            item.helper_name?.toLowerCase().includes(formattedQuery) ||
            item.helper_location?.toLowerCase().includes(formattedQuery)
        );
        setFetchedRequest(filteredData);
      } else {
        // If query is empty, reset to original data or empty list
        setFetchedRequest(responseData);
      }
    }


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
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
      <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
        <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
      </GoBack>
      <View style={{margin:15}}/> 
      
      <ThemedText type="titleMedium">Select Artisan</ThemedText>

      <View style={{margin:10}}/> 

      <TextInput
        style={styles.input}
        placeholder="Search helper or location"
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor={Colors.gray9}
      />

      <View style={{margin:10}}/> 

      <FlatList
        keyExtractor={(item: any) => item.helper_id.toString()}
        data={responseData}
        showsHorizontalScrollIndicator={false}
        numColumns={1}
        renderItem={({ item }) => (
          <ThemedView style={styles.mainstyle}>
            <View style={{flexDirection:'row'}}>
              <View style={{backgroundColor:Colors.clock1, alignSelf:'center', borderRadius:50, marginRight:15}}>
                {/* <ThemedText style={{color: Colors.green}}>SM</ThemedText> */}
                {
                  item.photo == null ? 
                  <Image style={[styles.image, ]} source={require("@/assets/images/person-4.png")}/>
                  :
                  <Image style={[styles.image, ]} source={{ uri: `https://phixotech.com/igoepp/public/handyman/${item.photo}` }} />
                }
              </View>
              <View>
                <ThemedText>{item.helper_name}</ThemedText>
                <ThemedText type='small'>Amuwo Odofin, Festac</ThemedText>
                {/* <ThemedText type='small'>Lagos</ThemedText> */}
              </View>
            </View>
            <TouchableOpacity onPress={openPopup}>
              <MaterialCommunityIcons name="dots-vertical" size={20} color={color} />
            </TouchableOpacity>
          </ThemedView>
        )}
      />

      <View style={{margin:10}}/> 

    <Modal
      transparent
      visible={isModalVisible}
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
        <TouchableOpacity style={styles.option} onPress={() => [closePopup(), router.push("/requesthelp")]}>
          <ThemedText>Select</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={() => [closePopup(), router.push("/artisan")]}>
          <ThemedText>View Details</ThemedText>
        </TouchableOpacity>
        <View style={{margin:10}}/>
      </Animated.View>
    </Modal>
  </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    paddingVertical: 8,
    marginLeft: 5,
    fontSize: 16,
  },
  image:{
    height:50,
    width:50,
    alignSelf:'center',
    borderRadius:100
  },
  mainstyle:{
    flexDirection:'row', 
    borderRadius:8, 
    justifyContent:'space-between', 
    alignItems:'center', 
    boxShadow: '0px 4px 6px rgba(0,0,0,0.35)', 
    padding:10, 
  },
  name: { fontSize: 16, fontWeight: "500" },
  more: { fontSize: 20 },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  option: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
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