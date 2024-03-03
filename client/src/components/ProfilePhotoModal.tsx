import { Dispatch, FC, SetStateAction } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import colors from "@utils/colors";
import { requestCameraPermissionsAsync } from "@utils/permissions";
import { ToastNotification } from "@utils/toastConfig";

interface Props {
  isVisible: boolean;
  toggleModalVisible: () => void;
  setProfileImage: Dispatch<SetStateAction<string>>;
}

const ProfilePhotoModal: FC<Props> = ({
  isVisible,
  toggleModalVisible,
  setProfileImage,
}) => {
  const onCameraPress = async () => {
    // Request camera permissions
    const hasPermission = await requestCameraPermissionsAsync();
    if (!hasPermission) return;

    // Open the camera with ImagePicker
    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      allowsEditing: true, // Allows editing the picture
      aspect: [1, 1],
      quality: 1, // Highest quality
    });

    // If the user doesn't cancel, set the selected image
    if (!result.canceled) {
      const file = result.assets[0];

      const File = {
        uri: file.uri,
        type: file.mimeType,
      };

      setProfileImage(File.uri);
      toggleModalVisible();
    }
  };

  const onGalleryPress = async () => {
    try {
      const docRes = await DocumentPicker.getDocumentAsync({
        type: ["image/*"],
        multiple: false,
      });

      const assets = docRes.assets;
      if (!assets) return;

      const file = assets[0];
      console.log(file);
      // Check if the selected file is a GIF
      if (file.mimeType === "image/gif") {
        // If it's a GIF, alert the user and stop further execution
        Alert.alert(
          "Unsupported Format",
          "GIFs are not supported. Please select a different image."
        );
        return; // Stop execution if the file is a GIF
      }

      const File = {
        name: file.name.split(".")[0],
        uri: file.uri,
        type: file.mimeType,
        size: file.size,
      };

      setProfileImage(File.uri);
      toggleModalVisible();
    } catch (error) {
      console.log(error);
    }
  };

  const onRemovePress = async () => {
    try {
      setProfileImage("");
      toggleModalVisible();

      ToastNotification({
        type: "Success",
        message: "Your profile photo has been removed",
      });
    } catch (error) {
      ToastNotification({
        type: "Error",
        message: "error",
      });
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={toggleModalVisible}
    >
      <TouchableWithoutFeedback onPress={toggleModalVisible}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Profile Photo</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={onCameraPress}>
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

                <TouchableOpacity style={styles.button} onPress={onRemovePress}>
                  <Entypo name="trash" size={24} color={colors.INFO} />
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
              </View>
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

export default ProfilePhotoModal;
