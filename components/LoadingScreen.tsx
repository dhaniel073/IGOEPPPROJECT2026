import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const { width, height } = Dimensions.get("window");

export type CustomButtonProps = {
  lightColor: string;
  darkColor: string;
};

const LogoSpinner: React.FC<CustomButtonProps> = ({ lightColor, darkColor }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1700, // 1.2 seconds per rotation
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    return () => spinAnimation.stop();
  }, [spinValue]);

  // Map value 0-1 to 0deg-360deg
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={[styles.container, { borderWidth: 1, borderColor: color, backgroundColor: color, }]}>
      <Animated.Image
        source={require("@/assets/images/loader.png")} // put your image here
        style={[styles.image, { transform: [{ rotate: spin }] }]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 100,
    height: 100,
  },
});

export default LogoSpinner;
