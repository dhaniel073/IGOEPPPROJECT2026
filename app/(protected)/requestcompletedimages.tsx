import LogoSpinner from '@/components/LoadingScreen';
import { decryptData } from '@/constants/Colors';
import { useAuth } from '@/hooks/AuthContext';
import { inquirehelperproofbyproofimageRequestID, PUBLIC_API_BASE_URL } from '@/hooks/AuthRoutes';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import ImageViewer from "react-native-image-zoom-viewer";

const requestcompletedimages = () => {
  const router = useRouter()
  const { imageUrl } = useLocalSearchParams<any>()
  const { token, logout } = useAuth()
  const { id } = useLocalSearchParams()
  const [isfetching, setIsFetching] = useState(false);
  const [fetchedPictures, setFetchedPictures] = useState<any[]>([]);
  const navigation = useNavigation()

  useLayoutEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        setIsFetching(true);
        const response = await inquirehelperproofbyproofimageRequestID(id, decryptData(token));
        console.log(response)
        setFetchedPictures(response);
      } catch (error: any) {
        console.log(error.response)
        Alert.alert('Error', error.response.data.message ?? 'Unable to load proof images.', [
          { text: "Ok", onPress: () => router.back() },
        ])
      } finally {
        setIsFetching(false);
      }
    };

    const unsubscribe = navigation.addListener("focus", fetchPendingRequests);

    return unsubscribe;
  }, [navigation, id, token]);

  if (isfetching) {
    return <LogoSpinner lightColor='' darkColor='' />
  }

  const imageUrls = fetchedPictures.map((img) => ({
    url: `${PUBLIC_API_BASE_URL}helpproof/${img.picture}`,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: 40,
          left: 20,
          zIndex: 10,
          padding: 10,
        }}
      >
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Zoomable Image */}

      <ImageViewer
        imageUrls={imageUrls}
        enableSwipeDown={false}
        saveToLocalByLongPress={false}
        backgroundColor="#000"
      />


    </View>
  )
}

export default requestcompletedimages

const styles = StyleSheet.create({})