import { Dispatch, FC, SetStateAction, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { requestCameraPermissionsAsync } from "@utils/permissions";
import { ToastNotification } from "@utils/toastConfig";
import catchAsyncError from "src/api/catchError";
import ImageUpload from "./ImageUpload";

interface Props {
  isVisible: boolean;
  toggleModalVisible: () => void;
  setPhoto: Dispatch<SetStateAction<ImagePicker.ImagePickerAsset | null>>;
  photo: ImagePicker.ImagePickerAsset | null;
  title?: string;
}

const PhotoModal: FC<Props> = ({
  isVisible,
  toggleModalVisible,
  setPhoto,
  photo,
  title,
}) => {
  const [isLoading, setIsLoading] = useState(false);

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
        quality: 0.2, // Quality
      });

      // If the user doesn't cancel, set the selected image
      if (result.canceled) return;

      setIsLoading(true);

      const file = result.assets[0];

      setPhoto(file);

      ToastNotification({
        type: "Success",
        message: "Photo uploaded successfully!",
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
        quality: 0.2, // Quality
      });

      if (!result.assets || result.canceled) return;

      setIsLoading(true);

      const file = result.assets[0];

      setPhoto(file);

      ToastNotification({
        type: "Success",
        message: "Photo uploaded successfully!",
      });
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage || "Network error",
      });
    }
    toggleModalVisible();
    setIsLoading(false);
  };

  const onRemovePress = async () => {
    try {
      if (!photo) throw new Error("There is no Photo to remove");

      setIsLoading(true);

      setPhoto(null);

      ToastNotification({
        type: "Success",
        message: "Your photo has been removed",
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
    <ImageUpload
      isVisible={isVisible}
      handleModalClose={handleModalClose}
      isLoading={isLoading}
      onCameraPress={onCameraPress}
      onGalleryPress={onGalleryPress}
      onRemovePress={onRemovePress}
      title={title}
    />
  );
};

const styles = StyleSheet.create({});

export default PhotoModal;
