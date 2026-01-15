import GoBack from '@/components/GoBack'
import LogoSpinner from '@/components/LoadingScreen'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors, decryptData } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { helperget, showhelperrating } from '@/hooks/AuthRoutes'
import { useThemeColor } from '@/hooks/useThemeColor'
import { AntDesign, Feather, FontAwesome, Octicons } from '@expo/vector-icons'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import React, { useLayoutEffect, useState } from 'react'
import { Alert, Animated, Dimensions, Image, StyleSheet, TextProps, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

 const { height } = Dimensions.get('window');

 export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor:{ dark: string; light: string };
  };

  export default function artisan({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props) {

    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const router = useRouter()
    const {token, user, logout} = useAuth()
    const [data, setData] = useState<any>([])
    const navigation = useNavigation()
    const {request_type, invoice_type, catid, subcatid, preassessment_flg, name, helperid, enable_go_to_artisan} = useLocalSearchParams()
    const [isloading, setisloading] = useState(false)

    console.log(request_type, invoice_type, catid, subcatid, preassessment_flg, name, helperid, enable_go_to_artisan)

    const [rating, setrating] = useState<any[]>([])

    const averageRating =
    rating.length > 0
      ? rating.reduce((sum, r) => sum + parseFloat(r.custom_rating), 0) / rating.length
      : 0;

    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;
    const totalStars = 5;


    useLayoutEffect(() => {
      const fetchPendingRequests = async () => {
      try {
        setisloading(true)
        const response = await helperget(helperid, decryptData(token));
        console.log(response.data.data)
        setData(response.data.data)
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
        setisloading(false);
      }
      };
      const unsubscribe = navigation.addListener("focus", fetchPendingRequests);
      return unsubscribe;
    }, []);

     useLayoutEffect(() => {
      const fetchPendingRating = async () => {
      try {
        setisloading(true)
        const response = await showhelperrating(helperid, decryptData(token));
        console.log(response)
        setrating(response)
      } catch (error: any) {
          console.error("Error fetching pending requests:", error.response);
      } finally {
        setisloading(false);
      }
      };
      const unsubscribe = navigation.addListener("focus", fetchPendingRating);
      return unsubscribe;
    }, []);

    if(isloading){
      return <LogoSpinner lightColor='' darkColor=''/>
    }
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
      <Animated.ScrollView showsVerticalScrollIndicator={false}>  
        <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
          <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
        </GoBack>
        <View style={{margin:6}}/> 
        
        <ThemedText type="titleMedium">Helper Details</ThemedText>

        <View style={{margin:10}}/> 

        {
          !data.photo ? 
          <Image style={[styles.image, ]} source={require("@/assets/images/person-4.png")}/>
          :
          <Image style={[styles.image, ]} source={{ uri: `https://igoeppms.com/igoepp/public/handyman/${data.photo}` }} />
        }

        <View style={{margin:10}}/> 

        <ThemedView style={{flexDirection:'row', alignItems:'center'}}>
          {
            !data.photo ? 
            <Image style={[styles.image1, ]} source={require("@/assets/images/person-4.png")}/>
            :
            <Image style={[styles.image1, ]} source={{ uri: `https://igoeppms.com/igoepp/public/handyman/${data.photo}` }} />
          }
          {/* <Image
            source={require("@/assets/images/cleaning.jpg")}
            style={styles.image1}
          /> */}
          <View>
            <ThemedText type='subtitle'>{data.first_name} {data.last_name}</ThemedText>
            {/* <ThemedText>{data.first_name} {data.last_name}</ThemedText> */}
            <ThemedText style={{backgroundColor:Colors.green, paddingHorizontal:10, textAlign:'center'}}>{name}</ThemedText>
          </View>
        </ThemedView>

        <View style={{margin:20}}/> 

        <ThemedText type="subtitle">About Me</ThemedText>
        <ThemedText style={{color:Colors.gray9}}>Dedicated artisan providing quality, </ThemedText>
        <ThemedText style={{color:Colors.gray9}}>reliable, and timely service.</ThemedText>

        <View style={{margin:20}}/> 

        <ThemedView style={{backgroundColor:Colors.lightgray, padding:15, borderRadius:8}}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Octicons name="location" size={16} color="black" />
            <View>
              <ThemedText style={{color: Colors.gray9, marginLeft:10}}>Address</ThemedText>
              <ThemedText  style={{color: "#000", marginLeft:10}}>{data.address} {data.State}, {data.Country}.</ThemedText>
            </View>
          </View>


          <View style={{margin:5}}/> 

          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Feather name="calendar" size={16} color="black" />
            <View>
              <ThemedText type='smallMedium' style={{color: Colors.gray9, marginLeft:10}}>Budget</ThemedText>
              <ThemedText style={{color: "#000", marginLeft:10}}>NGN 0.00/hr</ThemedText>
            </View>
          </View>

          <View style={{margin:5}}/> 

          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Feather name="calendar" size={16} color="black" />
            <View>
              <ThemedText type='smallMedium' style={{color: Colors.gray9, marginLeft:10}}>Available.</ThemedText>
              <ThemedText style={{color: "#000", marginLeft:10}}>6:00 am - 8:00 pm</ThemedText>
            </View>
          </View>
        </ThemedView>

        <View style={{margin:15}}/> 

        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <ThemedText type="subtitle">Reviews</ThemedText>
          <ThemedText type="subtitle" style={{color: Colors.gray9}}>View all</ThemedText>
        </View>

        <View style={{margin:5}}/> 

        {rating.map((item, index) => {
          const rawRating = parseFloat(item.custom_rating) || 0;
          const safeRating = Math.min(Math.max(rawRating, 0), 5);

          const fullStars = Math.floor(safeRating);
          const hasHalfStar = safeRating - fullStars >= 0.5;
          const totalStars = 5;

          // ⭐ Derived rating from displayed stars
          const displayedRating = fullStars + (hasHalfStar ? 0.5 : 0);

          const date = new Date(item.created_at);
          const formattedDate = date.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
          });

          return (
            <ThemedView
              key={item.id ?? index}
              style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}
            >
              {!item.picture ? (
                <Image
                  source={require('@/assets/images/img1.png')}
                  style={styles.image2}
                />
              ) : (
                <Image
                  source={{ uri: `https://igoeppms.com/igoepp/public/customers/${item.picture}` }}
                  style={styles.image2}
                />
              )}

              <View>
                <ThemedText type="smallMedium">
                  {item.customer_name} • {formattedDate}
                </ThemedText>

                <View style={{ marginVertical: 3 }} />

                <ThemedText>
                  {[...Array(fullStars)].map((_, i) => (
                    <AntDesign key={`full-${i}`} name="star" size={16} color="#FFD700" />
                  ))}

                  {hasHalfStar && (
                    <FontAwesome name="star-half" size={16} color="#FFD700" />
                  )}

                  {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                    <FontAwesome key={`empty-${i}`} name="star-o" size={16} color="#FFD700" />
                  ))}{' '}
                  {displayedRating.toFixed(1)}
                </ThemedText>
              </View>
            </ThemedView>
          );
        })}



        <View style={{margin:10}}/> 

        <ThemedButton style={{backgroundColor: Colors.green, padding: 15, borderRadius:30, alignItems:'center'}} onPress={() => {router.push({pathname:"/requesthelp", params:{
          request_type, invoice_type, catid, subcatid, preassessment_flg, name, helperid, enable_go_to_artisan
        }})}}>
          <ThemedText style={{color:'#fff'}}>Book Now</ThemedText>
        </ThemedButton>

        <View style={{margin:15}}/> 

      </Animated.ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  image:{
    width: "100%",
    height: 250,
    borderRadius: 12,
    alignSelf:'center'
  },
  image1:{
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf:'center',
    marginRight:10
  },
  image2:{
    width: 60,
    height: 60,
    borderRadius: 100,
    alignSelf:'center',
    marginRight:10
  },
})
