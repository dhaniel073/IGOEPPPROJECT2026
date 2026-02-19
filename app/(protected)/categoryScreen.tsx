import EmptyScreen from '@/components/EmptyScreen';
import GoBack from '@/components/GoBack';
import LoadingScreen from '@/components/LoadingScreen';
import { ThemedText } from '@/components/ThemedText';
import { Colors, decryptData } from '@/constants/Colors';
import { useAuth } from '@/hooks/AuthContext';
import { categoriesbylga, PUBLIC_API_BASE_URL } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, FlatList, Image, ImageBackground, Modal, StyleSheet, Text, TextInput, TextProps, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');


export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor: { dark: string; light: string };
};

export default function categoryScreen({
  lightColor,
  darkColor,
  headerBackgroundColor,
}: Props) {

  const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const router = useRouter()
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [responseData, setresponseData] = useState<any>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { user, token } = useAuth()
  const [filteredData, setFilteredData] = useState(responseData);
  const [searchQuery, setSearchQuery] = useState('');
  const { lga } = useLocalSearchParams()


  const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen
  const [formData, setFormData] = useState({
    name: "",
    id: "",
  });
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      try {
        setIsLoading(true)
        const response = await categoriesbylga(lga, decryptData(token))
        console.log(response)
        if (response.length === 0) {
          alert(response.message)
        }
        setresponseData(response.categories || [])
        setIsLoading(false)
      } catch (error: any) {
        console.log(error.response)
        setIsLoading(false)
      }
    })
    return unsubscribe
  }, [navigation])


  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length === 0) {
      setFilteredData(responseData);
    } else {
      setFilteredData(
        responseData.filter((item: any) =>
          (item.cat_name || '').toLowerCase().includes(q)
        ));
    }
  }, [searchQuery, responseData]);

  if (isLoading) {
    return <LoadingScreen lightColor="" darkColor="" />
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: color1 }}
      edges={['top', 'bottom']}
    >
      <FlatList
        keyExtractor={(item: any) => item.id.toString()}
        data={filteredData}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {/* Cart Button */}
            <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}>
              <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
            </GoBack>

            <View style={{ margin: 10 }} />
            <View style={styles.searchRow}>
              <TextInput style={styles.input} placeholder="Search categories by name" placeholderTextColor={"#000"} value={searchQuery} onChangeText={setSearchQuery} returnKeyType="search" />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <MaterialCommunityIcons name="close" size={20} color={color} />
                </TouchableOpacity>)}
            </View>
            <View style={{ margin: 10 }} />

            {/* Titles */}
            <ThemedText type="titleMedium">Categories</ThemedText>
            <ThemedText style={styles.subtitle}>
              View all available help categories close to you
            </ThemedText>
            <View style={{ margin: 20 }} />

          </>
        }
        ListFooterComponent={
          <>
            <Image
              source={require('@/assets/images/slide1.png')}
              style={styles.slide1}
            />
          </>
        }

        renderItem={({ item }) => (
          <>

            {
              item.length === 0 ?

                (
                  <View style={styles.emptyContainer}>
                    <EmptyScreen
                      mainText="No category found"
                      subText="No available category found in this area"
                      imageSource={""} // your local image
                    />
                  </View>
                ) : (

                  <TouchableOpacity
                    style={styles.card}
                    activeOpacity={0.5}
                    onPress={() => {
                      router.push({
                        pathname: '/subcategoryScreen',
                        params: {
                          id: item.id,
                          name: item.cat_name,
                        }
                      })
                    }}
                  >

                    {/* Image only */}
                    <ImageBackground
                      source={{
                        uri: `${PUBLIC_API_BASE_URL}category/${item.image}`,
                      }}
                      style={styles.imageBackground}
                      imageStyle={styles.imageStyle}
                    />

                    {/* Text under the image */}
                    <ThemedText
                      type="small"
                      style={[styles.categoryText, { color: color }]}
                      numberOfLines={1}      // only 1 line
                      ellipsizeMode="tail"   // adds "..." at the end if too long
                    >
                      {item.cat_name}
                    </ThemedText>
                  </TouchableOpacity>
                )}
          </>
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
          <TouchableOpacity onPress={closePopup} style={{ alignSelf: 'flex-end' }}>
            <MaterialIcons name="cancel" size={24} color={Colors.green} />
          </TouchableOpacity>

          <ThemedText type='subtitle' style={{ textAlign: 'center' }}>Select a request type</ThemedText>

          <View style={{ margin: 10 }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>

            <TouchableOpacity activeOpacity={0.6} style={[styles.card, { backgroundColor: Colors.yellow3, padding: 12, borderRadius: 12 }]} onPress={() => [closePopup(), router.push(
              { pathname: '/subcategoryScreen', params: { id: formData.id, name: formData.name, invoice_type: 'Y' } })]}>
              {/* <MaterialIcons name="person" size={28} color={Colors.yellow2} style={styles.icon} /> */}
              <Text style={styles.cardTitle}>
                Invoice Payment
              </Text>
              <Text style={styles.cardText}>Make payment later as invoice</Text>
            </TouchableOpacity>

            <View style={{ marginHorizontal: 5 }} />

            <TouchableOpacity activeOpacity={0.6} style={[styles.card, { backgroundColor: Colors.green6, padding: 12, borderRadius: 12 }]} onPress={() => [closePopup(), router.push(
              { pathname: '/subcategoryScreen', params: { id: formData.id, name: formData.name, invoice_type: 'N' } })]}>
              {/* <FontAwesome name="group" size={20} color={Colors.green4} style={styles.icon} /> */}
              <Text style={styles.cardTitle}>
                Outright Payment
              </Text>
              <Text style={styles.cardText}>Make payment now</Text>
            </TouchableOpacity>
          </View>
          <View style={{ margin: 15 }} />
        </Animated.View>
      </Modal>
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

  cardText: {
    color: Colors.blacktext,
  },
  icon: {
    marginBottom: 8,
  },
  cardTitle: {
    color: '#000',
    marginBottom: 6,
    fontSize: 12,
    fontFamily: 'poppinsMedium',
    textAlign: 'center'

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
  slide1: {
    borderRadius: 16,
    width: "100%",
    height: 175,
  },
  cartButton: {
    backgroundColor: Colors.clock1,
    alignSelf: 'flex-end',
    padding: 8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
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
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
    marginLeft: 5
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
    marginTop: 5,
    textAlign: "center",
    fontSize: 12,
    width: 80,
  },
})

