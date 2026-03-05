import GoBack from '@/components/GoBack'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { getsubcathelper, PUBLIC_API_BASE_URL } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Alert, Animated, Dimensions, FlatList, Image, Modal, StyleSheet, TextInput, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { height } = Dimensions.get('window');

export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor: { dark: string; light: string };
};

export default function selectartisan({
  lightColor,
  darkColor,
  headerBackgroundColor,
}: Props) {

  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const router = useRouter()
  const { token, user, logout } = useAuth()
  const [isModalVisible, setModalVisible] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen
  const navigation = useNavigation()
  const [responseData, setresponseData] = useState<any>([])
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(responseData);
  const [fetchedRequest, setFetchedRequest] = useState<any>([])
  const [isloading, setisloading] = useState(false)
  const { request_type, catid, subcatid, preassessment_flg, name, enable_go_to_artisan } = useLocalSearchParams()
  const [formData, setFormData] = useState({
    helperid: "",
  });


  useLayoutEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        setisloading(true)
        const response = await getsubcathelper(subcatid, decryptData(token));
        setresponseData(response.data)
        setFetchedRequest(response.data)
      } catch (error: any) {
        Alert.alert('Error', 'Unable to load artisans.')
      } finally {
        setisloading(false);
      }
    };
    const unsubscribe = navigation.addListener("focus", fetchPendingRequests);
    return unsubscribe;
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length === 0) {
      setFilteredData(responseData);
    } else {
      setFilteredData(
        responseData.filter((item: any) =>
          (item.helper_name || '').toLowerCase().includes(q)
        ));
    }
  }, [searchQuery, responseData]);

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

  if (isloading) {
    return <LogoSpinner lightColor='' darkColor='' />
  }
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 10, backgroundColor: color1 }} edges={['top', 'bottom']}>
      <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
        <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
      </GoBack>
      <View style={{ margin: 6 }} />

      <ThemedText type="titleMedium">Select Artisan</ThemedText>
      <View style={{ margin: 5 }} />

      <View style={styles.searchRow}>
        <TextInput style={styles.input} placeholder="Search artisans by name" placeholderTextColor={"#000"} value={searchQuery} onChangeText={setSearchQuery} returnKeyType="search" />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialCommunityIcons name="close" size={20} color={color} />
          </TouchableOpacity>)}
      </View>
      <View style={{ margin: 10 }} />

      <FlatList
        keyExtractor={(item: any) => item.helper_id.toString()}
        data={filteredData}
        showsHorizontalScrollIndicator={false}
        numColumns={1}
        renderItem={({ item }) => (
          <ThemedView style={styles.mainstyle}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ backgroundColor: Colors.clock1, alignSelf: 'center', borderRadius: 50, marginRight: 15 }}>
                {/* <ThemedText style={{color: Colors.green}}>SM</ThemedText> */}
                {
                  !item.photo ?
                    <Image style={[styles.image,]} source={require("@/assets/images/person-4.png")} />
                    :
                    <Image style={[styles.image,]} source={{ uri: `${PUBLIC_API_BASE_URL}handyman/${item.photo}` }} />
                }
              </View>
              <View>
                <ThemedText>{item.helper_name}</ThemedText>
                <ThemedText type='small'>{item.helper_location}</ThemedText>
                {/* <ThemedText type='small'>Lagos</ThemedText> */}
              </View>
            </View>
            <TouchableOpacity onPress={() => [setFormData({ helperid: item.helper_id }), openPopup()]}>
              <MaterialCommunityIcons name="dots-vertical" size={20} color={color} />
            </TouchableOpacity>
          </ThemedView>
        )}
      />

      <View style={{ margin: 5 }} />

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
            { transform: [{ translateY: slideAnim }], backgroundColor: color1, paddingBottom: '15%' },
          ]}
        >
          <TouchableOpacity style={styles.option} onPress={() => [closePopup(), router.push({ pathname: "/requesthelp", params: { request_type, catid, subcatid, preassessment_flg, name, helperid: formData.helperid, enable_go_to_artisan } })]}>
            <ThemedText>Select</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => [closePopup(), router.push({ pathname: "/artisan", params: { request_type, catid, subcatid, preassessment_flg, name, helperid: formData.helperid, enable_go_to_artisan } })]}>
            <ThemedText>View Details</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',           // layout children horizontally
    alignItems: 'center',           // center vertically
    backgroundColor: Colors.clock1, // subtle background color matching your app palette
    borderRadius: 8,                // rounded corners
    paddingHorizontal: 10,          // left and right padding inside the bar
    paddingVertical: 10,             // top and bottom padding inside the bar
    marginBottom: 10,               // space below the search bar before the list
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.blacktext,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  image: {
    height: 50,
    width: 50,
    alignSelf: 'center',
    borderRadius: 100
  },
  mainstyle: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0px 4px 6px rgba(0,0,0,0.35)',
    padding: 10,
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
    bottom: 0,
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