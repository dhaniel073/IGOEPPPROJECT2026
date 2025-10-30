import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const images = [
  "https://igoeppms.com/igoepp/public/products/Vulcanizer1705317221.jpeg",
  "https://igoeppms.com/igoepp/public/products/Plumber1689021238.jpeg",
  "https://igoeppms.com/igoepp/public/products/Tiler1689021324.jpeg",
  "https://igoeppms.com/igoepp/public/products/Transformer-Producers-768x580.webp",
  "https://igoeppms.com/igoepp/public/products/GreenEnergy1705310479.jpeg",
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const goToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      {/* Image Slider */}
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />

      {/* Left Arrow */}
      {currentIndex > 0 && (
        <TouchableOpacity
          onPress={() => goToIndex(currentIndex - 1)}
          style={[styles.arrowButton, { left: 15 }]}
        >
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>
      )}

      {/* Right Arrow */}
      {currentIndex < images.length - 1 && (
        <TouchableOpacity
          onPress={() => goToIndex(currentIndex + 1)}
          style={[styles.arrowButton, { right: 15 }]}
        >
          <Ionicons name="chevron-forward" size={28} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    aspectRatio: 1.6, // keeps height responsive relative to width
  },
  image: {
    width: width,
    height: "100%",
    resizeMode: "cover",
  },
  arrowButton: {
    position: "absolute",
    top: "45%",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
});
