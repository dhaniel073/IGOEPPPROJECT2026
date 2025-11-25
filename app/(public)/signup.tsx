import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Image, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};

export default function signup({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [isloading, setIsLoading] = useState(false)

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
      <View style={{flex:1}}>
        <View style={{margin:30}}/> 

        <TouchableOpacity style={{paddingHorizontal:30, paddingVertical:30, borderWidth:1, borderColor:Colors.green, alignSelf:'center', borderRadius:"100%"}}>
          <Image
            source={require("@/assets/images/cleaner.png")}
            style={styles.image}
          />
        </TouchableOpacity>
        <Image
          source={require("@/assets/images/img.jpg")}
          style={[styles.image1, {position:'absolute', left:70, top: 150}]}
        />
        <Image
          source={require("@/assets/images/img6.jpg")}
          style={[styles.image1, {position:'absolute', left:80, top: 270}]}
        />
        <Image
          source={require("@/assets/images/img2.jpg")}
          style={[styles.image1, {position:'absolute',  right:80, top: 220}]}
        />
        <Image
          source={require("@/assets/images/img3.jpg")}
          style={[styles.image1, {position:'absolute',  right:90, top: 120}]}
        />
        <Image
          source={require("@/assets/images/img4.jpg")}
          style={[styles.image1, {position:'absolute',  right:100, top: 60}]}
        />

        <View style={{margin: 20}}/>
        <ThemedText type='title' style={{textAlign:'center'}}>Let's Get You</ThemedText>
        <ThemedText type='title' style={{textAlign:'center'}}>Started!</ThemedText>

        <View style={{margin: 20}}/>

        <ThemedButton style={{backgroundColor: Colors.green, padding: 15, borderRadius:30, alignItems:'center', marginHorizontal:10}} onPress={() => router.push("/signup1")}>
          <ThemedText style={{color:'#fff'}}>Signup</ThemedText>
        </ThemedButton>
      </View>

      <View style={{flexDirection:'row', justifyContent:'center', marginBottom:30}}>
        <ThemedText >Already have an account? </ThemedText>
        <ThemedButton onPress={() => router.push("/login")}><ThemedText style={{color: Colors.green}}>Login</ThemedText></ThemedButton>
      </View>
    </SafeAreaView>  
  )
}


const styles = StyleSheet.create({
  image:{
    width: 200,
    height: 200,
    borderRadius: 1000,
    alignSelf:'center',
    borderWidth:1,
    borderColor: Colors.green,
    backgroundColor: Colors.offwhite2
  },

  image1:{
    width: 30,
    height: 30,
    borderRadius: 1000,
  },
})