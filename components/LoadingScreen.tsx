import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export type CustomButtonProps = {
  lightColor: string;
  darkColor: string;
};

const LogoSpinner: React.FC<CustomButtonProps> = ({ lightColor, darkColor }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const themeBg = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1700,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    return () => spinAnimation.stop();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View
      style={[
        styles.overlay,
        {
          backgroundColor: themeBg || "rgba(0,0,0,0.6)", // fallback background
        },
      ]}
    >
      <Animated.Image
        source={require("@/assets/images/loader.png")}
        style={[styles.image, { transform: [{ rotate: spin }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    zIndex: 999,
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default LogoSpinner;
