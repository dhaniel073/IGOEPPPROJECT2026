import GoBack from '@/components/GoBack'
import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { StyleSheet, TextProps, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export type Props = TextProps & {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor:{ dark: string; light: string };
};

export default function signup1({
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
            <GoBack lightColor='' darkColor='' onClick={() => router.back()}>
                <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
            </GoBack>
            <View style={{margin:15}}/> 
            
            <ThemedText type="titleMedium">Let's get started</ThemedText>
            <ThemedText style={{color: Colors.gray9}}>Signup as a new business or existing</ThemedText>
            <ThemedText style={{color: Colors.gray9}}>business ( add a new user to an entity )</ThemedText>

            <View style={{margin:15}}/> 
                      
            <ThemedView>
                <ThemedView style={{paddingHorizontal:20, paddingVertical:10, backgroundColor:Colors.offwhite3, borderTopLeftRadius:8, borderTopRightRadius: 8}}>
                    <ThemedText type='titleLight' style={{color:'#000'}}>Signup as a personal account</ThemedText>
                    <ThemedText style={{color: Colors.blacktext, textAlign:'justify'}}>
                        Ideal for individuals who need artisan services like home cleaning, repairs, or tailoring. Create jobs, track progress, and request invoices, right from your phone.
                    </ThemedText>
                </ThemedView>
                <ThemedView style={{paddingHorizontal:20, paddingVertical:10, backgroundColor:Colors.clock2}}>
                    <ThemedButton style={{paddingHorizontal:20, paddingVertical:5, backgroundColor:Colors.green, borderRadius:40, alignSelf:'flex-end'}} onPress={() => router.push("/signupPersonal")}>
                        <ThemedText style={{color:'#fff'}}>Proceed</ThemedText>
                    </ThemedButton>
                </ThemedView>
            </ThemedView>

            <View style={{margin:10}}/> 

            <ThemedView style={{flexDirection:'row', justifyContent:'center'}}>
                <View style={{borderBottomWidth:1, width:"40%", borderBottomColor: Colors.gray9}}/>
                <ThemedText style={{width:"20%", textAlign:'center'}}>Or</ThemedText>
                <View style={{borderBottomWidth:1, width:"40%", borderBottomColor: Colors.gray9}}/>
            </ThemedView>

            <View style={{margin:10}}/> 


            <ThemedView>
                <ThemedView style={{paddingHorizontal:20, paddingVertical:10, backgroundColor:Colors.offwhite3, borderTopLeftRadius:8, borderTopRightRadius: 8}}>
                    <ThemedText type='titleLight' style={{color:'#000'}}>Signup as a new business</ThemedText>
                    <ThemedText style={{color: Colors.blacktext, textAlign:'justify'}}>
                        For companies registering for the first time. Hire artisans for office tasks like fumigation or maintenance and generate invoices for internal processing.
                    </ThemedText>
                </ThemedView>
                <ThemedView style={{paddingHorizontal:20, paddingVertical:10, backgroundColor:Colors.clock2}}>
                    <ThemedButton style={{paddingHorizontal:20, paddingVertical:5, backgroundColor:Colors.green, borderRadius:40, alignSelf:'flex-end'}} onPress={() => router.push("/signupBusiness")}>
                        <ThemedText style={{color:'#fff'}}>Proceed</ThemedText>
                    </ThemedButton>
                </ThemedView>
            </ThemedView>
        </View>
        <View style={{flexDirection:'row', justifyContent:'center', marginBottom:30}}>
            <ThemedText >Already have an account? </ThemedText>
            <ThemedButton onPress={() => router.push("/login")}><ThemedText style={{color: Colors.green}}>Login</ThemedText></ThemedButton>
        </View>
    </SafeAreaView>
 )
}

const styles = StyleSheet.create({

})