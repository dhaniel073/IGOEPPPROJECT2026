import { Ionicons } from "@expo/vector-icons";
import { Modal, TouchableOpacity, View } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

export default function profileimageviewer({ visible, onClose, imageUrl }:{visible:any, onClose:any, imageUrl:any}) {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        
        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: "absolute",
            top: 40,
            left: 20,
            zIndex: 10,
            padding: 10,
          }}
        >
          <Ionicons name="close" size={30} color="#fff" />
        </TouchableOpacity>

        {/* Zoomable Image */}
        <ImageViewer
          imageUrls={[{ url: imageUrl }]}
          enableSwipeDown
          onSwipeDown={onClose}
          backgroundColor="#000"
          saveToLocalByLongPress={false}
        />
      </View>
    </Modal>
  );
}
