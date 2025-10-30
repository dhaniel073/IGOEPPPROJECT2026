import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BottomModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  respectSafeArea?: boolean; // 👈 choose whether to respect safe area or not
};

const BottomModal: React.FC<BottomModalProps> = ({
  visible,
  onClose,
  title,
  children,
  respectSafeArea = true,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      style={styles.modal}
      useNativeDriver
      hideModalContentWhileAnimating
    >
      <View
        style={[
          styles.modalContent,
          { paddingBottom: respectSafeArea ? insets.bottom || 12 : 12 },
        ]}
      >
        {title && <Text style={styles.title}>{title}</Text>}

        <View style={styles.body}>{children}</View>

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default BottomModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0, // 👈 removes default spacing
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  body: {
    marginBottom: 16,
  },
  closeButton: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  closeText: {
    color: "red",
    fontSize: 16,
  },
});
