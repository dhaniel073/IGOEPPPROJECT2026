import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  navigateTo?: any; // screen name to navigate
  close?: boolean;
};

export const StatusModal: React.FC<Props> = ({
  visible,
  onClose,
  title,
  message,
  navigateTo,
  close,
}) => {
  const router = useRouter();

  const handleNavigate = () => {
    onClose(); // close modal first
    if (navigateTo) router.push(navigateTo);
  };

  const handleClose = () => {
    onClose(); // close modal first
    if (close) router.push("/(protected)/(tabs)");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title || "Alert"}</Text>
          <Text style={styles.message}>{message || "Something happened!"}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={!close ? onClose : handleClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>

            {navigateTo && (
              <TouchableOpacity style={[styles.button, styles.goButton]} onPress={handleNavigate}>
                <Text style={styles.buttonText}>Go</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 25,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  closeButton: {
    backgroundColor: "#ccc",
  },
  goButton: {
    backgroundColor: Colors.green,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
