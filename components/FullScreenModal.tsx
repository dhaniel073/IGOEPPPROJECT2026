import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";


type Props = {
  visible: boolean;
  onClose: () => void;
  mainText: string;
  subText: string;
};

export default function FullScreenModal({ visible, onClose, mainText, subText }: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.modalContainer}>
        {/* Centered Content */}
        <View style={styles.textContainer}>
          <ThemedView style={{ padding:15, borderRadius:50, backgroundColor: Colors.green3, alignItems: 'center',justifyContent: 'center'}}>
            <Ionicons name="checkmark-circle-sharp" size={70} color={Colors.green4}/>
          </ThemedView>
          <ThemedText type='smallBold' style={styles.mainText}>{mainText}</ThemedText>
          <ThemedText style={[styles.subText, {color: Colors.gray9, maxWidth:"75%"}]}>{subText}</ThemedText>
        </View>

        {/* Bottom Button */}
        <ThemedButton onPress={onClose} style={[styles.closeButton, {backgroundColor:Colors.green}]}>
          <Text style={styles.closeButtonText}>Close</Text>
        </ThemedButton>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "space-between", // text in middle, button at bottom
    alignItems: "center",
    padding: 20,
    // backgroundColor: "white",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center", // vertically center
    alignItems: "center",
  },
  mainText: {
    marginBottom: 10,
    textAlign: "center",
  },
  subText: {
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  closeButton: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 40,
    alignSelf: "stretch", // make it full width
    marginBottom: 20,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
