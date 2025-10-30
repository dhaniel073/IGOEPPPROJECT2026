import GoBack from '@/components/GoBack'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { useAuth } from '@/hooks/AuthContext'
import { useThemeColor } from '@/hooks/useThemeColor'
import { FontAwesome6 } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Animated, Image, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};

export default function profile({
    lightColor,
    darkColor,
    headerBackgroundColor,
  }: Props){

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [isloading, setIsLoading] = useState(false)
    const {user, token} = useAuth()

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
        <Animated.ScrollView showsVerticalScrollIndicator={false}>  
            <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
                <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
            </GoBack>
            <View style={{margin:15}}/> 
            <ThemedText type="titleMedium">Profile</ThemedText>
            <ThemedText style={{color: Colors.gray9}}>View your app activities here</ThemedText>
            
            <View style={{margin:10}}/> 

            <View style={{padding:15, borderWidth:1, alignSelf:'flex-start', borderRadius:100, borderColor: Colors.green}}>
                {
                    user?.picture ?
                    <Image
                        source={{uri: `https://phixotech.com/igoepp/public/customers/${user?.picture}`}} 
                        style={styles.image}
                    />
                    :
                    <Image
                        source={require("@/assets/images/avatar1.png")}
                        style={styles.image}
                    />
                }
            </View>

            <View style={{margin:5}}/> 

            <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} activeOpacity={0.6} onPress={() => router.push("/profileEdit")}>
                <ThemedText style={{marginRight:10}}>Edit</ThemedText>
                <TouchableOpacity >
                    <FontAwesome6 name="edit" size={13} color={Colors.green} />
                </TouchableOpacity>
            </TouchableOpacity>    
            <View style={{margin:15}}/> 


            <ThemedView style={{backgroundColor:Colors.gray10, paddingHorizontal:15, paddingVertical:20, borderRadius:8}}>
                <ThemedText style={{color: Colors.green}}>Basic Info</ThemedText>

                <View style={{margin:5}}/> 

                <ThemedText style={{color: Colors.blacktext}}>Name</ThemedText>
                <ThemedText style={{color: '#000'}}>{user?.last_name+" "+user?.first_name}</ThemedText>
                
                <View style={{margin:5}}/> 


                <ThemedText style={{color: Colors.blacktext}}>Phone number</ThemedText>
                <ThemedText style={{color: '#000'}}>{user?.phone && `+234${user?.phone.startsWith('0') ? user?.phone.slice(1) : user?.phone}`}</ThemedText>
                <View style={{margin:5}}/> 


                <ThemedText style={{color: Colors.blacktext}}>Email</ThemedText>
                <ThemedText style={{color: '#000'}}>{user?.email}</ThemedText>

            </ThemedView>

        </Animated.ScrollView>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
    image:{
        width: 100,
        height: 100,
        borderRadius: 100,
        alignSelf:'flex-start',
        borderWidth:1,
        borderColor: Colors.green
    },
})