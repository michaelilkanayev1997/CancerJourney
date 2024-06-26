import { Dispatch, FC, SetStateAction, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch } from "react-redux";

import { requestCameraPermissionsAsync } from "@utils/permissions";
import { ToastNotification } from "@utils/toastConfig";
import catchAsyncError from "src/api/catchError";
import { getClient } from "src/api/client";
import { UserProfile, updateProfile } from "src/store/auth";
import ImageUpload from "./ImageUpload";

interface Props {
  isVisible: boolean;
  toggleModalVisible: () => void;
  profile: UserProfile | null;
  setPhoto?: Dispatch<SetStateAction<null>>;
}

const ProfilePhotoModal: FC<Props> = ({
  isVisible,
  toggleModalVisible,
  profile,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

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
        quality: 0.2, // Quality
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

      if (!data?.success) {
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
        quality: 0.2, // Quality
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

      // console.log(data);
      if (!data.success) {
        throw new Error("Failed to upload image");
      }

      if (profile) {
        dispatch(updateProfile({ ...profile, avatar: file.uri }));
      }

      // setPhoto(file.uri);

      ToastNotification({
        type: "Success",
        message: "Image uploaded successfully!",
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
    <ImageUpload
      isVisible={isVisible}
      handleModalClose={handleModalClose}
      isLoading={isLoading}
      onCameraPress={onCameraPress}
      onGalleryPress={onGalleryPress}
      onRemovePress={onRemovePress}
    />
  );
};

const styles = StyleSheet.create({});

export default ProfilePhotoModal;
