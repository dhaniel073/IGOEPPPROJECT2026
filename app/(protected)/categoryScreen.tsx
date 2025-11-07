import GoBack from '@/components/GoBack';
import Input from '@/components/Input';
import LoadingScreen from '@/components/LoadingScreen';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { category } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { EvilIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, FlatList, Image, ImageBackground, Modal, StyleSheet, Text, TextProps, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');


  export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor:{ dark: string; light: string };
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
    const [fetchedCategory, setFetchedCategory] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const slideAnim = React.useRef(new Animated.Value(height)).current; // Start below the screen
    const [formData, setFormData] = useState({
      cat_name: "",
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
          const response = await category()
          setFetchedCategory(response || [])
          setIsLoading(false)
        } catch (error: any) {
          console.log(error.response)
          setIsLoading(false)
        }
      })
      return unsubscribe
    }, [navigation])

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
            <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
              <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
            </GoBack>

            <View style={{margin:10}}/>
            <Input
              placeholder="Search category"
              keyboardType="default"
              rightIcon={<EvilIcons name="search" size={20} color={Colors.gray9} />}
            />

            {/* Titles */}
            <ThemedText type="titleMedium">Categories</ThemedText>
            <ThemedText style={styles.subtitle}>
              View all available help categories close to you
            </ThemedText>
            <View style={{margin:20}}/>

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
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.5}
          onPress={() => [setFormData({id: item.id, cat_name: item.sub_cat_name}), openPopup()]}
        >
          {/* Image only */}
          <ImageBackground
            source={{
              uri: `https://igoeppms.com/igoepp/public/category/${item.image}`,
            }}
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
          />

          {/* Text under the image */}
          <ThemedText
            type="small"
            style={[styles.categoryText, {color: color}]}
            numberOfLines={1}      // only 1 line
            ellipsizeMode="tail"   // adds "..." at the end if too long
          >
            {item.cat_name}
          </ThemedText>
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
          {pathname: '/subcategoryScreen', params:{id: formData.id, name: formData.cat_name, invoice_type: 'Y'}})]}>
          {/* <MaterialIcons name="person" size={28} color={Colors.yellow2} style={styles.icon} /> */}
          <Text style={styles.cardTitle}>
            Invoice Payment
          </Text>
          <Text style={styles.cardText}>Make payment later as invoice</Text>
        </TouchableOpacity>

        <View style={{marginHorizontal:5}}/>

        <TouchableOpacity activeOpacity={0.6} style={[styles.card, { backgroundColor: Colors.green6, padding:12, borderRadius:12 }]} onPress={() => [closePopup(), router.push(
          {pathname:'/subcategoryScreen', params:{id: formData.id, name: formData.cat_name, invoice_type: 'Y'}})]}>
          {/* <FontAwesome name="group" size={20} color={Colors.green4} style={styles.icon} /> */}
          <Text style={styles.cardTitle}>
            Outright Payment
          </Text>
          <Text style={styles.cardText}>Make payment now</Text>
        </TouchableOpacity>
        </View>
        <View style={{margin:15}}/>
      </Animated.View>
    </Modal>
  </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  cardText: {
    color: Colors.blacktext,
  },
  icon: {
    marginBottom: 8,
  },
  cardTitle: {
    color: '#000',
    marginBottom: 6,
    fontSize:12,
    fontFamily:'poppinsMedium',
    textAlign: 'center'
    
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
  slide1:{
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
    marginTop: 5,
    textAlign: "center",
    fontSize: 12,
    width: 80,
  },
})