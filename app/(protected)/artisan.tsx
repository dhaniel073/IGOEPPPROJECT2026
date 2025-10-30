import GoBack from '@/components/GoBack'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { AntDesign, Feather, FontAwesome, Octicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Animated, Dimensions, Image, StyleSheet, TextProps, View } from 'react-native'
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
    const [rating, setrating] = useState<any>([4.5])

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const totalStars = 5;

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
      <Animated.ScrollView showsVerticalScrollIndicator={false}>  
        <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
          <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
        </GoBack>
        <View style={{margin:15}}/> 
        
        <ThemedText type="titleMedium">Helper Details</ThemedText>

        <View style={{margin:10}}/> 

        <Image
          source={require("@/assets/images/bookings.png")}
          style={styles.image}
        />

        <View style={{margin:10}}/> 

        <ThemedView style={{flexDirection:'row', alignItems:'center'}}>
          <Image
            source={require("@/assets/images/cleaning.jpg")}
            style={styles.image1}
          />
          <View>
            <ThemedText type='subtitle'>Office Cleaning</ThemedText>
            <ThemedText>Senior Man</ThemedText>
            <ThemedText style={{backgroundColor:Colors.green, paddingHorizontal:10}}>Office Cleaning</ThemedText>
          </View>
        </ThemedView>

        <View style={{margin:20}}/> 

        <ThemedText type="subtitle">About Me</ThemedText>
        <ThemedText style={{color:Colors.gray9}}>Clean and restore you office space to it's</ThemedText>
        <ThemedText style={{color:Colors.gray9}}>original status</ThemedText>

        <View style={{margin:20}}/> 

        <ThemedView style={{backgroundColor:Colors.lightgray, padding:15, borderRadius:8}}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Octicons name="location" size={16} color="black" />
            <ThemedText type='smallMedium' style={{color: "#000", marginLeft:10}}>Amuwo Odofin, Festac Lagos, Nigeria.</ThemedText>
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

        <ThemedView style={{flexDirection:'row'}}>
          <Image
            source={require("@/assets/images/img1.png")}
            style={styles.image2}
          />
          <View>
            <ThemedText type='subtitle'>Office Cleaning 02 Dec</ThemedText>
            <View style={{margin:3}}/>
            <ThemedText>
              {
                !rating ? <> <AntDesign name="star" size={20} color="#FFD700" />0</> :

                  <>
                  
                {[...Array(fullStars)].map((_, i) => (
                  <AntDesign key={`full-${i}`} name="star" size={20} color="#FFD700" />
                ))}

                {hasHalfStar && (
                  <FontAwesome name="star-half" size={20} color="#FFD700" />
                )}

                {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                  <AntDesign key={`empty-${i}`} name="star" size={20} color="#FFD700" />
                ))}  {!rating  ? "0" : rating}
                </>
              }
            </ThemedText>
          </View>
        </ThemedView>

        <View style={{margin:10}}/> 

        <ThemedView style={{flexDirection:'row'}}>
          <Image
            source={require("@/assets/images/img1.png")}
            style={styles.image2}
          />
          <View>
            <ThemedText type='subtitle'>Office Cleaning 02 Dec</ThemedText>
            <View style={{margin:3}}/>
            <ThemedText>
              {
                !rating ? <> <AntDesign name="star" size={20} color="#FFD700" />0</> :

                  <>
                  
                {[...Array(fullStars)].map((_, i) => (
                  <AntDesign key={`full-${i}`} name="star" size={20} color="#FFD700" />
                ))}

                {hasHalfStar && (
                  <FontAwesome name="star-half" size={20} color="#FFD700" />
                )}

                {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
                  <AntDesign key={`empty-${i}`} name="star" size={20} color="#FFD700" />
                ))}  {!rating  ? "0" : rating}
                </>
              }

            </ThemedText>
          </View>
        </ThemedView>

        <View style={{margin:15}}/> 

        <ThemedButton style={{backgroundColor: Colors.green, padding: 15, borderRadius:30, alignItems:'center'}} onPress={() => {router.push("/requesthelp")}}>
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
