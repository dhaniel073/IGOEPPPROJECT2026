import GoBack from '@/components/GoBack';
import Input from '@/components/Input';
import LoadingScreen from '@/components/LoadingScreen';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { category } from '@/hooks/AuthRoutes';
import { useThemeColor } from '@/hooks/useThemeColor';
import { EvilIcons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, ImageBackground, StyleSheet, TextProps, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


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

    const [fetchedCategory, setFetchedCategory] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

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
          onPress={() =>
            router.push({
              pathname: "/subcategoryScreen",
              params: { id: item.id, name: item.cat_name },
            })
          }
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
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
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