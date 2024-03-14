import { FC, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Modal,
  TouchableOpacity,
  Text,
  Linking,
  Alert,
} from "react-native";
import Pdf from "react-native-pdf";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ToastNotification } from "@utils/toastConfig";
import { ImageType } from "./ImageCard";

interface Props {
  modalVisible: boolean;
  toggleModalVisible: () => void;
  item: ImageType;
}

const CustomPdfViewer: FC<Props> = ({
  modalVisible,
  toggleModalVisible,
  item,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const Source = {
    uri: item?.pdf_file,
    cache: true,
  };

  const handleLinkPress = async (url: string) => {
    // Check if the link is supported
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Cannot Open Link: ${url}. Please try again later.`);
    }
  };

  const handleError = (error: object) => {
    toggleModalVisible();
    ToastNotification({
      type: "Error",
      message: "Error loading PDF",
    });
  };

  return (
    <Modal
      visible={modalVisible}
      onRequestClose={toggleModalVisible}
      hardwareAccelerated={true}
      animationType="fade"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={toggleModalVisible}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.pageInfo}>
            {currentPage} / {totalPages}
          </Text>
          <Text
            style={styles.headerText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title.substring(0, 20)}
          </Text>
        </View>
        <Pdf
          trustAllCerts={false}
          source={Source}
          style={styles.pdf}
          onLoadComplete={(numberOfPages) => {
            setTotalPages(numberOfPages);
          }}
          onPageChanged={(page) => {
            setCurrentPage(page);
          }}
          onError={(error) => handleError(error)}
          onPressLink={(uri) => handleLinkPress(uri)}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  backButton: {
    marginRight: 10,
  },
  pageInfo: {
    fontSize: 18,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  headerText: {
    paddingLeft: 25,
    color: "black",
    fontSize: 18,
    textAlign: "center",
  },
});

export default CustomPdfViewer;
