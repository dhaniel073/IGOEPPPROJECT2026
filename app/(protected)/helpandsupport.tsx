import GoBack from '@/components/GoBack';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, StyleSheet, Text, TextProps, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type Props = TextProps & {
    lightColor?: string;
    darkColor?: string;
    headerBackgroundColor:{ dark: string; light: string };
  };
  
  
export default function helpandsupport({
    lightColor,
    darkColor,
    headerBackgroundColor,
}: Props){

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
            <Animated.ScrollView showsVerticalScrollIndicator={false}>  
                <GoBack onClick={() => router.back()} lightColor={color} darkColor={color}> 
                    <ThemedText style={{ marginLeft: 5 }}>Back</ThemedText>
                </GoBack>

                <View style={{margin:6}}/> 
                <ThemedText type="titleMedium">Help & Support</ThemedText>
                <ThemedText>How can we help you?</ThemedText>
                
                <View style={{margin:6}}/>

                <TouchableOpacity onPress={() => router.push({pathname:'/helpandsupport1'})}  style={{backgroundColor: Colors.clock2, padding:22, paddingTop:30, paddingBottom:30, borderRadius:5, flexDirection:'row', justifyContent:'space-between'}}>
                    <View style={{justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'poppinsBold'}}>Call us</Text>
                        <Text style={{fontFamily:'poppinsRegular', color: Colors.gray9}}>Contact our support agents and centers</Text>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <MaterialIcons name="arrow-forward-ios" size={15} color={Colors.gray9} />
                    </View>
                </TouchableOpacity>

                <View style={{margin:6}}/>
                
                <TouchableOpacity onPress={() => router.push({pathname:'/helpandsupport2'})} style={{backgroundColor: Colors.clock2, padding:22, borderRadius:5, paddingTop:30, paddingBottom:30, flexDirection:'row', justifyContent:'space-between'}}>
                    <View style={{justifyContent:'space-between'}}>
                        <Text style={{fontFamily:'poppinsBold'}}>Chat with us</Text>
                        <Text style={{fontFamily:'poppinsRegular', color: Colors.gray9}}>Resolve issue quicker. Help yourself with our </Text><ThemedText style={{color: Colors.gray9}}>frequently asked questions</ThemedText>
                    </View>
                    <View style={{justifyContent: 'center'}}>
                        <MaterialIcons name="arrow-forward-ios" size={15} color={Colors.gray9} />
                    </View>
                </TouchableOpacity>
            </Animated.ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    
})