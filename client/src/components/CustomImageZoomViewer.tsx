import ImageZoomCustomHeader from "@ui/ImageZoomCustomHeader";
import { FC } from "react";
import { StyleSheet, Modal } from "react-native";
import ImageZoomViewer from "react-native-image-zoom-viewer";
import { ImageType } from "./ImageCard";

interface Props {
  modalVisible: boolean;
  toggleModalVisible: () => void;
  selectedImageIndex: number | undefined;
  images: ImageType[];
}

const CustomImageZoomViewer: FC<Props> = ({
  modalVisible,
  toggleModalVisible,
  selectedImageIndex,
  images,
}) => {
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      onRequestClose={() => toggleModalVisible()}
      hardwareAccelerated={true}
      animationType="fade"
    >
      <ImageZoomViewer
        imageUrls={images.map((img) => ({ url: img.uri }))}
        index={selectedImageIndex}
        onSwipeDown={() => toggleModalVisible()}
        enableSwipeDown={true}
        backgroundColor="white"
        renderHeader={(index) => (
          <ImageZoomCustomHeader
            currentIndex={index || 0}
            setModalVisible={toggleModalVisible}
            images={images}
          />
        )}
        useNativeDriver={true}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default CustomImageZoomViewer;
