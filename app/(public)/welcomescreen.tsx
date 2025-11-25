import { ThemedButton } from '@/components/ThemedButton'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Animated, Image, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


    export type Props = TextProps & {
        lightColor?: string;
        darkColor?: string;
        headerBackgroundColor:{ dark: string; light: string };
    };

    export default function welcomescreen({
        lightColor,
        darkColor,
        headerBackgroundColor,
    }: Props){

    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const color1 = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const router = useRouter()
    const [isloading, setIsLoading] = useState(false)
    // const [selected, setSelected] = useState<string[]>([]);

    const options = ["Apples", "Bananas", "Oranges", "Grapes"];

    const toggleSelect = (item: string) => {
        if (selected.includes(item)) {
        // if already selected, remove it
        setSelected(selected.filter(i => i !== item));
        } else {
        // otherwise add it
        setSelected([...selected, item]);
        }
    };

    const [selected, setSelected] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    if (selected.includes(category)) {
      setSelected(selected.filter((c) => c !== category));
    } else {
      setSelected([...selected, category]);
    }
  };

  // reusable button
  const CategoryButton = ({ label }: { label: string }) => {
    const isSelected = selected.includes(label);
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => toggleCategory(label)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: Colors.lightgray,
        }}
      >
        <ThemedText style={{ color: Colors.blacktext }}>{label}</ThemedText>
        {isSelected && (
          <Ionicons
            name="checkmark-circle"
            size={18}
            color={Colors.yellow}
            style={{ marginLeft: 6 }}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal:20, paddingTop:10, backgroundColor: color1 }} edges={['top']}>
        <Animated.ScrollView showsVerticalScrollIndicator={false}>
            <View style={{margin: 20}}/>

            <View style={{paddingHorizontal:20, paddingVertical:20, borderWidth:1, borderColor:Colors.green, alignSelf:'center', borderRadius:"100%"}}>
                <Image
                source={require("@/assets/images/cleaner.png")}
                style={styles.image}
                />
            </View>
            <Image
                source={require("@/assets/images/img.jpg")}
                style={[styles.image1, {position:'absolute', left:130, top: 90}]}
            />
            <Image
                source={require("@/assets/images/img6.jpg")}
                style={[styles.image1, {position:'absolute', left:130, top: 150}]}
            />
            <Image
                source={require("@/assets/images/img2.jpg")}
                style={[styles.image1, {position:'absolute',  right:130, top: 120}]}
            />
            <Image
                source={require("@/assets/images/img3.jpg")}
                style={[styles.image1, {position:'absolute',  right:140, top: 75}]}
            />
            <Image
                source={require("@/assets/images/img4.jpg")}
                style={[styles.image1, {position:'absolute',  right:140, top: 40}]}
            />
    
            <View style={{margin: 20}}/>
            <ThemedText type='title' style={{textAlign:'center'}}>Welcome Daniel Chinedu to the</ThemedText>
            <ThemedText type='title' style={{textAlign:'center'}}>I Go Epp Mobile App</ThemedText>
    
            <View style={{margin: 10}}/>

            <ThemedText style={{color: Colors.blacktext, textAlign:'center'}}>
                Finally Tell us what services interest you the most so we can connect you with the right artisans and show you relevant items in the marketplace.
            </ThemedText>

            <View style={{margin: 10}}/>

            <ThemedButton>
                <ThemedText style={{color: Colors.green, textAlign:'center'}}>Skip</ThemedText>
            </ThemedButton>

            <View style={{margin: 10}}/>

            <ThemedView
                style={{
                    borderWidth: 1,
                    paddingVertical: 25,
                    borderRadius: 8,
                    backgroundColor: "#fff",
                }}
                >
                {/* Row 1 */}
                <View style={{ alignItems: "center" }}>
                    <CategoryButton label="Beauty and wellness" />
                </View>

                <View style={{ margin: 8 }} />

                {/* Row 2 */}
                <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                    <CategoryButton label="Automobile" />
                    <CategoryButton label="House Cleaning" />
                </View>

                <View style={{ margin: 8 }} />

                {/* Row 3 */}
                <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                    <CategoryButton label="Events" />
                    <CategoryButton label="Handyman" />
                    <CategoryButton label="Repairs" />
                </View>

                <View style={{ margin: 8 }} />

                {/* Row 4 */}
                <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                    <CategoryButton label="Tech & Gadgets" />
                    <CategoryButton label="Fashion" />
                </View>
            </ThemedView>

            <View style={{margin: 30}}/>
            <ThemedButton style={{backgroundColor: Colors.green, padding: 15, borderRadius:30, alignItems:'center', marginHorizontal:10}} onPress={() => router.push("/")}>
                <ThemedText style={{color:'#fff'}}>Go to Dashboard</ThemedText>
            </ThemedButton>
        </Animated.ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    image:{
    width: 100,
    height: 100,
    borderRadius: 1000,
    alignSelf:'center',
    borderWidth:1,
    borderColor: Colors.green,
    backgroundColor: Colors.offwhite2
  },

  image1:{
    width: 15,
    height: 15,
    borderRadius: 1000,
  },
})