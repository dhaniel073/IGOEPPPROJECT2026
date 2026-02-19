import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  lightColor?: string;
  darkColor?: string;
  headerBackgroundColor?: { dark: string; light: string };
};

export default function LandingScreen({ lightColor, darkColor }: Props) {
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
  const router = useRouter();

  const fade1 = useRef(new Animated.Value(0)).current;
  const fade2 = useRef(new Animated.Value(0)).current;
  const fade3 = useRef(new Animated.Value(0)).current;
  const fade4 = useRef(new Animated.Value(0)).current;
  const fade5 = useRef(new Animated.Value(0)).current;
  const fade6 = useRef(new Animated.Value(0)).current;
  const fade7 = useRef(new Animated.Value(0)).current;
  const fade8 = useRef(new Animated.Value(0)).current;
  const fade9 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fades = [
      fade1, fade2, fade3, fade4, fade5, fade6, fade7, fade8
    ];

    const fadeIn = (fade: Animated.Value) =>
      Animated.timing(fade, {
        toValue: 1,
        duration: 1500, // slower fade-in (was 800)
        useNativeDriver: true,
      });

    const fadeOut = (fade: Animated.Value) =>
      Animated.timing(fade, {
        toValue: 0,
        duration: 1500, // slower fade-out (was 800)
        useNativeDriver: true,
      });

    // Step 1: Fade in one by one (1 → 9)
    const fadeInSequence = Animated.sequence(
      fades.flatMap((fade) => [fadeIn(fade), Animated.delay(700)]) // was 300
    );

    // Step 2: Fade out in reverse (9 → 1)
    const fadeOutSequence = Animated.sequence(
      [...fades].reverse().flatMap((fade) => [fadeOut(fade), Animated.delay(700)])
    );

    // Step 3: Loop forever
    const loopAnimation = Animated.loop(
      Animated.sequence([
        fadeInSequence,
        Animated.delay(2000), // pause a bit when all are visible
        fadeOutSequence,
        Animated.delay(1000), // short pause before restarting
      ])
    );

    loopAnimation.start();

    return () => loopAnimation.stop();
  }, []);


  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={["top", 'bottom']}>
      {/* Header Section */}
      <ThemedView style={styles.headerContainer}>
        <Image source={require("@/assets/images/loader.png")} style={styles.logo} />
        <ThemedText type="titleMedium">I GO EPP</ThemedText>
        <Image source={require("@/assets/images/plane.png")} style={styles.planeIcon} />
      </ThemedView>

      {/* Chat Bubble Section */}
      {/* <Animated.View style={{  }}> */}
      <ThemedView style={styles.bubblesContainer}>
        {/* Left Bubbles */}
        <ThemedView>
          <Animated.View style={[styles.profileWrapper, { opacity: fade6 }]}>
            <Image source={require("@/assets/images/artcraft.jpg")} style={styles.profileLarge} />
          </Animated.View>
          <Animated.View style={[styles.profileSmallWrapper, styles.profileOffset, { opacity: fade7 }]}>
            <Image source={require("@/assets/images/child.jpg")} style={styles.profileSmall} />
          </Animated.View>
        </ThemedView>

        <View style={styles.spacer} />
        <Animated.View style={[styles.messageBox, styles.messageBrown, { opacity: fade8 }]}>
          <ThemedText type="small" style={styles.brownText}>
            Available
          </ThemedText>
          <ThemedText type="small" style={styles.blackText}>
            Yes I'm available! Will be there in 7 minutes.
          </ThemedText>
        </Animated.View>
      </ThemedView>
      {/* </Animated.View> */}


      {/* Right Bubble Section */}
      {/* <Animated.View style={{ opacity: fade3 }}> */}
      <ThemedView style={[styles.bubblesContainer, { alignSelf: "flex-end" }]}>
        <Animated.View style={[styles.messageBox, styles.messageGreen, { opacity: fade2 }]}>
          <ThemedText type="small" style={styles.greenText}>
            Available
          </ThemedText>
          <ThemedText type="small" style={styles.blackText}>
            Yes I'm available! Will be there in 7 minutes.
          </ThemedText>
        </Animated.View>
        <View style={styles.smallSpacer} />
        <Animated.View style={[styles.profileWrapper, { opacity: fade1 }]}>
          <Image source={require("@/assets/images/chef.jpg")} style={styles.profileLarge} />
        </Animated.View>
      </ThemedView>
      {/* </Animated.View> */}

      {/* Third Chat Section */}
      <ThemedView style={styles.bubblesContainer}>
        <ThemedView>
          <Animated.View style={[styles.profileWrapper, { opacity: fade4 }]}>
            <Image source={require("@/assets/images/dressmaker.jpg")} style={styles.profileLarge} />
          </Animated.View>
          <Animated.View style={[styles.profileSmallWrapper, styles.profileOffset, { opacity: fade3 }]}>
            <Image source={require("@/assets/images/portrait.jpg")} style={styles.profileSmall} />
          </Animated.View>
        </ThemedView>
        <View style={styles.spacer} />
        <Animated.View style={[styles.messageBox, styles.messageYellow, { opacity: fade5 }]}>
          <ThemedText type="small" style={styles.yellowText}>
            Available
          </ThemedText>
          <ThemedText type="small" style={styles.blackText}>
            Yes I'm available! Will be there in 7 minutes.
          </ThemedText>
        </Animated.View>
      </ThemedView>

      {/* Description Text */}
      <ThemedView style={styles.descriptionContainer}>
        <ThemedText style={styles.centerText}>Connect with skilled artisans and</ThemedText>
        <ThemedText style={styles.centerText}>reliable helpers right in your</ThemedText>
        <ThemedText style={styles.centerText}>neighborhood</ThemedText>
      </ThemedView>

      {/* Buttons */}
      <ThemedView style={styles.buttonRow}>
        <ThemedButton onPress={() => router.push("/login")}>
          <ThemedText>Login</ThemedText>
        </ThemedButton>

        <ThemedButton
          onPress={() => router.push("/signup")}
          style={styles.signupButton}
        >
          <ThemedText>Signup</ThemedText>
        </ThemedButton>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 3,
    resizeMode: "contain",
  },
  planeIcon: {
    width: 110,
    height: 90,
    position: "absolute",
    top: 5,
    right: 0,
  },
  bubblesContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  profileWrapper: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 100,
  },
  profileLarge: {
    width: 90,
    height: 90,
    borderRadius: 100,
  },
  profileSmallWrapper: {
    backgroundColor: "#fff",
    padding: 4,
    borderRadius: 100,
    alignSelf: "flex-start",
  },
  profileSmall: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  profileOffset: {
    top: -30,
    right: 10,
  },
  messageBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    alignSelf: "center",
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  messageBrown: {
    borderColor: Colors.brown,
    backgroundColor: Colors.brown1,
  },
  messageGreen: {
    borderColor: Colors.green9,
    backgroundColor: Colors.green10,
  },
  messageYellow: {
    borderColor: Colors.lemon,
    backgroundColor: Colors.lemon1,
  },
  brownText: { color: Colors.brown },
  greenText: { color: Colors.green9 },
  yellowText: { color: Colors.lemon },
  blackText: { color: Colors.blacktext },
  spacer: { margin: 5 },
  smallSpacer: { margin: 3 },
  descriptionContainer: {
    marginVertical: 20,
  },
  centerText: {
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 20,
  },
  signupButton: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: Colors.green,
    borderRadius: 40,
  },
});
