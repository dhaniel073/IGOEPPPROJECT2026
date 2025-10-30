import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import React, { ReactNode, useRef } from "react";
import {
    Alert,
    Image,
    ImageSourcePropType,
    Modal,
    StyleSheet,
    Text,
    View,
} from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type Props = {
  visible: boolean;
  onClose: () => void;
  children?: ReactNode;

  // Icon configuration
  showIcon?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBg?: string;

  // Theme colors
  lightColor?: string;
  darkColor?: string;

  // Watermark options
  watermarkText?: string;
  watermarkImage?: ImageSourcePropType;
  watermarkOpacity?: number;
  watermarkSize?: number;
};

export default function ReceiptView({
  visible,
  onClose,
  children,
  showIcon = true,
  iconName = "checkmark-circle-sharp",
  iconColor = Colors.green4,
  iconBg = Colors.green3,
  lightColor,
  darkColor,
  watermarkText,
  watermarkImage,
  watermarkOpacity = 0.08,
  watermarkSize = 0.8,
}: Props) {
  const router = useRouter();
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  const viewShotRef = useRef<View>(null);

  // 📸 Save receipt image to gallery
  const saveReceipt = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please allow access to save receipts.");
        return;
      }

      const uri = await captureRef(viewShotRef, {
        format: "png",
        quality: 1,
      });

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Receipts", asset, false);

      Alert.alert("✅ Saved!", "Receipt has been saved to your gallery.");
    } catch (err) {
      console.error("Save error:", err);
      Alert.alert("Error", "Failed to save receipt.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <ThemedView
        style={[styles.modalContainer, { backgroundColor }]}
        lightColor={backgroundColor}
        darkColor={backgroundColor}
      >
        {/* Main Capture Area */}
        <ViewShot ref={viewShotRef} style={{ flex: 1, width: "100%", backgroundColor }}>
          {/* Header */}
          <View style={styles.headerContainer}>
            {showIcon && (
              <View
                style={{
                  padding: 10,
                  borderRadius: 50,
                  backgroundColor: iconBg,
                  marginBottom: 15,
                }}
              >
                <Ionicons name={iconName} size={70} color={iconColor} />
              </View>
            )}
            <ThemedText type="smallBold">Transaction Successful!</ThemedText>
          </View>

        <View style={{margin:15}}/>
          {/* Custom content (amount, txn ID, etc.) */}
          <View style={styles.contentContainer}>{children}</View>

          {/* 💧 Watermark overlay (captured inside ViewShot) */}
          {(watermarkText || watermarkImage) && (
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFillObject,
                { justifyContent: "center", alignItems: "center" },
              ]}
            >
              {watermarkImage ? (
                <Image
                  source={watermarkImage}
                  resizeMode="contain"
                  style={{
                    width: `${Math.round(watermarkSize * 100)}%`,
                    opacity: watermarkOpacity,
                    transform: [{ rotate: "-25deg" }],
                  }}
                />
              ) : (
                <ThemedText
                  style={{
                    fontSize: 60,
                    opacity: watermarkOpacity,
                    transform: [{ rotate: "-25deg" }],
                    color: Colors.gray8,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {watermarkText}
                </ThemedText>
              )}
            </View>
          )}
        </ViewShot>

        {/* Action Buttons */}
        <View style={{ width: "100%" }}>
          <ThemedButton
            onPress={saveReceipt}
            style={[styles.button, { backgroundColor: Colors.green }]}
          >
            <Text style={styles.buttonText}>Download Receipt</Text>
          </ThemedButton>

          <ThemedButton onPress={() => [onClose(), router.push("/payments")]}>
            <Text style={styles.buttonText}>Go To Home</Text>
          </ThemedButton>
        </View>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  contentContainer: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    // padding: 10,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 40,
    alignSelf: "stretch",
    marginBottom: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
