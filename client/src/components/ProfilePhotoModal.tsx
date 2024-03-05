import { FC, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  Dimensions,
} from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useDispatch } from "react-redux";

import colors from "@utils/colors";
import { requestCameraPermissionsAsync } from "@utils/permissions";
import { ToastNotification } from "@utils/toastConfig";
import catchAsyncError from "src/api/catchError";
import { getClient } from "src/api/client";

import { UserProfile, updateProfile } from "src/store/auth";
import Loader from "@ui/Loader";

interface Props {
  isVisible: boolean;
  toggleModalVisible: () => void;
  profile: UserProfile | null;
}

const ProfilePhotoModal: FC<Props> = ({
  isVisible,
  toggleModalVisible,
  profile,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const screenWidth = Dimensions.get("window").width;

  const handleUpload = async (formData: FormData) => {
    try {
      const client = await getClient({
        "Content-Type": "multipart/form-data;",
      });

      const { data } = await client.post(
        "/auth/profile-image-upload",
        formData
      );

      return data;
    } catch (error) {
      throw error;
    }
  };

  const onCameraPress = async () => {
    try {
      // Request camera permissions
      const hasPermission = await requestCameraPermissionsAsync();
      if (!hasPermission) return;

      // Open the camera with ImagePicker
      const result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true, // Allows editing the picture
        aspect: [1, 1], // Square aspect ratio
        quality: 0.4, // Quality
      });

      // If the user doesn't cancel, set the selected image
      if (result.canceled) return;

      setIsLoading(true);

      const file = result.assets[0];
      const formData = new FormData();
      formData.append("avatar", {
        uri: file.uri,
        type: "image/jpeg",
        name: "profile",
      } as any);

      const data = await handleUpload(formData);

      if (!data.success) {
        throw new Error("Failed to upload image");
      }

      if (profile) {
        dispatch(updateProfile({ ...profile, avatar: file.uri }));
      }

      ToastNotification({
        type: "Success",
        message: "Image uploaded successfully!",
      });
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    }
    toggleModalVisible();
    setIsLoading(false);
  };

  const onGalleryPress = async () => {
    try {
      // Request permission to access the media library
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please allow access to your photo library to upload an image."
        );
        return;
      }

      // Open the image library with editing enabled and limit selection to images only
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Allow editing
        aspect: [1, 1], // Square aspect ratio
        quality: 0.4, // Quality
      });

      if (!result.assets || result.canceled) return;

      setIsLoading(true);

      const file = result.assets[0];

      const formData = new FormData();

      formData.append("avatar", {
        uri: file.uri,
        type: file.mimeType,
        name: "profile",
      } as any);

      const data = await handleUpload(formData);
      console.log(data);
      if (!data.success) {
        throw new Error("Failed to upload image");
      }

      if (profile) {
        dispatch(updateProfile({ ...profile, avatar: file.uri }));
      }
      ToastNotification({
        type: "Success",
        message: "Image uploaded successfully!",
      });
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    }
    toggleModalVisible();
    setIsLoading(false);
  };

  const onRemovePress = async () => {
    try {
      if (!profile?.avatar) throw new Error("There is no profile image");

      setIsLoading(true);

      const client = await getClient();

      await client.post("/auth/profile-image-remove");

      dispatch(updateProfile({ ...profile, avatar: "" }));

      ToastNotification({
        type: "Success",
        message: "Your profile photo has been removed",
      });
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    }
    toggleModalVisible();
    setIsLoading(false);
  };

  const handleModalClose = () => {
    if (!isLoading) {
      toggleModalVisible();
    }
  };

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
              <Text style={styles.modalTitle}>Profile Photo</Text>

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

export default ProfilePhotoModal;
