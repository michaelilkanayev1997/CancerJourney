import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { FC } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import colors from "@utils/colors";
import Loader from "@ui/Loader";

interface Props {
  isVisible: boolean;
  handleModalClose: () => void;
  isLoading: boolean;
  onCameraPress: () => Promise<void>;
  onGalleryPress: () => Promise<void>;
  onRemovePress: () => Promise<void>;
  title?: string;
}

const ImageUpload: FC<Props> = ({
  isVisible,
  handleModalClose,
  isLoading,
  onCameraPress,
  onGalleryPress,
  onRemovePress,
  title = "Profile Photo",
}) => {
  const screenWidth = Dimensions.get("window").width;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleModalClose}
    >
      <TouchableWithoutFeedback onPress={handleModalClose}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalView, { width: screenWidth * 0.9 }]}>
              <Text style={styles.modalTitle}>{title}</Text>

              {isLoading ? (
                <Loader loaderStyle={{ height: 70 }} />
              ) : (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={onCameraPress}
                  >
                    <MaterialCommunityIcons
                      name="camera"
                      size={24}
                      color={colors.INFO}
                    />
                    <Text style={styles.buttonText}>Camera</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={onGalleryPress}
                  >
                    <MaterialIcons
                      name="photo-library"
                      size={24}
                      color={colors.INFO}
                    />
                    <Text style={styles.buttonText}>Gallery</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.button}
                    onPress={onRemovePress}
                  >
                    <Entypo name="trash" size={24} color={colors.INFO} />
                    <Text style={styles.buttonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 19,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    marginTop: 5,
    color: colors.INFO,
  },
});

export default ImageUpload;
