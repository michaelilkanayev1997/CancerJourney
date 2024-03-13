import ImageZoomCustomHeader from "@ui/ImageZoomCustomHeader";
import { FC, Fragment, useCallback, useState } from "react";
import { StyleSheet, Modal, View } from "react-native";
import ImageZoomViewer from "react-native-image-zoom-viewer";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ImageType } from "./ImageCard";
import Loader from "@ui/Loader";
import AppLink from "@ui/AppLink";
import CustomPdfViewer from "./CustomPdfViewer";

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
  const [active, setActive] = useState(true);
  const [isOpenPdf, setIsopenPdf] = useState(false);
  const [ImageIndex, setImageIndex] = useState(0);

  const toggleOpenPdf = useCallback(() => {
    setActive((prevState) => !prevState);
    setIsopenPdf((prevVisible) => !prevVisible);
  }, []);

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      onRequestClose={toggleModalVisible}
      hardwareAccelerated={true}
      animationType="fade"
    >
      <ImageZoomViewer
        imageUrls={images.map((img) => ({ url: img.uri }))}
        index={selectedImageIndex}
        onSwipeDown={toggleModalVisible}
        saveToLocalByLongPress={false}
        enableSwipeDown={true}
        backgroundColor="white"
        useNativeDriver={true}
        onChange={(index) => setImageIndex(index || 0)}
        renderHeader={(index) => (
          <ImageZoomCustomHeader
            currentIndex={index || 0}
            toggleModalVisible={toggleModalVisible}
            images={images}
          />
        )}
        renderFooter={(index) => {
          const isCurrentPDF = images[index]?.type === "pdf";
          if (isCurrentPDF) {
            return (
              <Animated.View entering={FadeInDown.delay(100)}>
                <AppLink
                  title="Open PDF"
                  onPress={toggleOpenPdf}
                  style={{ fontSize: 18 }}
                  active={active}
                />
              </Animated.View>
            );
          } else {
            // empty Fragment to satisfy TypeScript's return type requirement
            return <Fragment />;
          }
        }}
        footerContainerStyle={{
          position: "absolute",
          bottom: "25%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
        loadingRender={() => (
          <View style={styles.loadingContainer}>
            <Loader />
          </View>
        )}
      />

      <CustomPdfViewer
        modalVisible={isOpenPdf}
        toggleModalVisible={toggleOpenPdf}
        item={images[ImageIndex]}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomImageZoomViewer;
