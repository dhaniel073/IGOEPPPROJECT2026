import { Colors, decryptData } from "@/constants/Colors";
import { useAuth } from "@/hooks/AuthContext";
import { customerinfocheck } from "@/hooks/AuthRoutes";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Entypo, Feather, Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { ReactNode, useRef } from "react";
import {
  Alert,
  Image,
  ImageSourcePropType,
  Modal,
  StyleSheet,
  Text,
  View
} from "react-native";
import ViewShot, { captureRef } from "react-native-view-shot";
import RepeatedWatermark from "./RepeatedWater";
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
  imageuri?: any;

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
  imageuri,
}: Props) {
  const router = useRouter();
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  const viewShotRef = useRef<View>(null);
  const { user, token, updateUser } = useAuth();

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

  const shareReceipt = async () => {
    try {
      if (!viewShotRef.current) {
        Alert.alert("Error", "Receipt is not ready to share.");
        return;
      }

      // Capture the image
      const uri = await captureRef(viewShotRef.current, {
        format: "png",
        quality: 1,
        result: "tmpfile", // ensures temporary file path
      });

      // Check if Sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Not Supported", "Sharing is not available on this device.");
        return;
      }

      // Share the file
      await Sharing.shareAsync(uri, {
        mimeType: "image/png",
        dialogTitle: "Share Receipt",
        UTI: "public.png",
      });

    } catch (error) {
      console.error("Share error:", error);
      Alert.alert("Error", "Failed to share receipt.");
    }
  };

  const reload = async () => {
    try {
      const response = await customerinfocheck(user?.customer_id, decryptData(token))
      updateUser(response);
      console.log(response)
    } catch (error: any) {
      console.log(error.response)
      return;
    }
  }

  console.log(imageuri)

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={() => { }}>
      <ThemedView
        style={[styles.modalContainer, { backgroundColor }]}
        lightColor={backgroundColor}
        darkColor={backgroundColor}
      >
        {/* Main Capture Area */}
        <ViewShot ref={viewShotRef} style={{ flex: 1, width: "100%", backgroundColor }}>
          {/* Header */}
          <View style={styles.headerContainer}>
            {
              !imageuri ?
                <>
                  {showIcon && (
                    <View
                      style={{
                        padding: 10,
                        borderRadius: 50,
                        backgroundColor: iconBg,
                        marginBottom: 10,
                      }}
                    >
                      <Ionicons name={iconName} size={50} color={iconColor} />
                    </View>
                  )}
                </>
                :
                <>
                  <Image source={{ uri: imageuri }} style={{ width: 70, height: 70 }} resizeMode="contain" />
                </>
            }
            <ThemedText type="smallBold">Transaction Successful!</ThemedText>
          </View>

          <View style={{ margin: 3 }} />
          {/* Custom content (amount, txn ID, etc.) */}
          <View style={styles.contentContainer}>{children}</View>

          {/* 💧 Watermark overlay (captured inside ViewShot) */}
          {/* {(watermarkText || watermarkImage) && (
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
          )} */}
          <RepeatedWatermark text="IGOEPP" />
        </ViewShot>

        {/* Action Buttons */}
        <View style={styles.footerContainer}>
          <View style={styles.actionButtonsRow}>
            <ThemedButton
              onPress={saveReceipt}
              style={[styles.smallButton, { backgroundColor: Colors.green }]}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Download Receipt</Text>
                <Feather name="download" size={16} color="white" />
              </View>
            </ThemedButton>

            <ThemedButton
              onPress={shareReceipt}
              style={[styles.smallButton, { backgroundColor: Colors.green }]}
            >
              <View style={styles.buttonContent}>
                <ThemedText type="small" style={styles.buttonText}>Share Receipt</ThemedText>
                <Entypo name="share" size={16} color="white" />
              </View>
            </ThemedButton>
          </View>

          <ThemedButton style={styles.homeButton} onPress={() => [onClose(), router.push("/payments")]}>
            <ThemedText style={styles.homeButtonText}>Go To Home</ThemedText>
          </ThemedButton>
          <View style={{ margin: 15 }} />
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
    padding: 5,
    borderRadius: 10
  },
  footerContainer: {
    width: "100%",
    paddingBottom: 20,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  smallButton: {
    width: '48%',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: "white",
    fontSize: 13,
    fontWeight: '600',
    marginRight: 6,
    textAlign: "center",
  },
  homeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignSelf: "stretch",
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  homeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: "center",
  },
});
