import { PUBLIC_API_BASE_URL } from '@/hooks/AuthRoutes';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ImageViewer from "react-native-image-zoom-viewer";

const profilepictureview = () => {
  const router = useRouter()
  const { imageUrl } = useLocalSearchParams<any>()
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
        imageUrls={[{ url: `${PUBLIC_API_BASE_URL}customers/${imageUrl}` }]}
        enableSwipeDown={false}
        saveToLocalByLongPress={false}
        backgroundColor="#000"
      />


    </View>
  )
}

export default profilepictureview

const styles = StyleSheet.create({})