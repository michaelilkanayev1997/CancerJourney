import { JSX, forwardRef, useCallback, useMemo } from "react";
import { Text, StyleSheet, View, Dimensions } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import colors from "@utils/colors";
import AppButton from "@ui/AppButton";
import { UploadStackParamList } from "src/@types/navigation";
import { requestCameraPermissionsAsync } from "@utils/permissions";
import { ToastNotification } from "@utils/toastConfig";
import { calculateCompression } from "@utils/helper";

export interface Props {
  folderName: string;
}

const screenHeight = Dimensions.get("window").height;

const bottomSheetHeight = screenHeight * 0.56; // 56% of the screen height

const CustomBottomSheet = forwardRef<BottomSheetMethods, Props>(
  ({ folderName }, ref) => {
    const { t } = useTranslation();
    const snapPoints = useMemo(() => [bottomSheetHeight], [bottomSheetHeight]);
    const navigation =
      useNavigation<NativeStackNavigationProp<UploadStackParamList>>();

    const renderBackdrop = useCallback(
      (
        backdropProps: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps
      ) => (
        <BottomSheetBackdrop
          {...backdropProps}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ),
      []
    );

    const handleCanecl = () => {
      // Check if ref and current are available
      if (ref && "current" in ref && ref.current) {
        ref.current.close();
      }
    };

    const takeImage = async () => {
      // Request camera permissions
      const hasPermission = await requestCameraPermissionsAsync();
      if (!hasPermission) return;

      // Open the camera with ImagePicker
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true, // Allows editing the picture
        quality: 0.7, // Quality
      });

      // If the user doesn't cancel, set the selected image
      if (!result.canceled) {
        const file = result.assets[0];

        const File = {
          uri: file.uri,
          type: file.mimeType,
        };

        if (File.type) {
          navigation.navigate("FilePreview", {
            fileUri: File.uri,
            fileType: File.type,
            folderName,
          });
        }
        handleCanecl(); // close Bottom Sheet
      }
    };

    const pickDocument = async () => {
      try {
        const docRes = await DocumentPicker.getDocumentAsync({
          type: [
            "application/pdf", // Allows PDFs
            "image/webp",
            "image/png",
            "image/jpg",
            "image/jpeg",
            "image/pjpeg",
          ],
          multiple: false,
        });

        const assets = docRes.assets;
        if (!assets) return;

        const file = assets[0];

        if (file.size !== undefined && file.size > 3000000) {
          ToastNotification({
            type: "Info",
            message: t("file-too-large"),
          });

          return;
        }

        let File;
        if (file.mimeType?.startsWith("image/")) {
          const compression = calculateCompression(file.size || 1000000);

          // The picked document is an image, let's manipulate it
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            file.uri,
            [], // Actions like resize or rotate would go here
            { compress: compression, format: ImageManipulator.SaveFormat.JPEG } // Compress and convert to JPEG
          );

          File = {
            uri: manipulatedImage.uri,
            type: "image/jpeg",
          };
        } else {
          File = {
            uri: file.uri,
            type: "application/pdf",
          };
        }

        if (File.type) {
          navigation.navigate("FilePreview", {
            fileUri: File.uri,
            fileType: File.type,
            folderName,
          });
        }
        handleCanecl(); // close Bottom Sheet
      } catch (error) {
        console.error("Error picking document:", error);
        ToastNotification({
          type: "Error",
          message: t("error-selecting-file"),
        });
      }
    };

    return (
      <BottomSheet
        ref={ref}
        index={-1} // Start hidden
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.PRIMARY }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Text style={styles.sheetTitle}>{t("upload-file")}</Text>
          <Text style={styles.sheetSubtitle}>{t("how-to-proceed")}</Text>

          <View style={styles.buttonContainer}>
            <AppButton
              title={t("take-photo")}
              pressedColor={["#4285F4", "#3578E5", "#2A6ACF"]}
              defaultColor={["#4A90E2", "#4285F4", "#5B9EF4"]}
              onPress={takeImage}
              icon={
                <MaterialCommunityIcons
                  name="camera"
                  size={20}
                  color="white"
                  style={{ marginRight: 10 }}
                />
              }
            />
            <AppButton
              title={t("choose-from-phone")}
              pressedColor={["#4285F4", "#3578E5", "#2A6ACF"]}
              defaultColor={["#4A90E2", "#4285F4", "#5B9EF4"]}
              onPress={pickDocument}
              icon={
                <MaterialCommunityIcons
                  name="file-document"
                  size={20}
                  color="white"
                  style={{ marginRight: 10 }}
                />
              }
            />
            <AppButton
              title={t("cancel")}
              pressedColor={["#D32F2F", "#C62828", "#B71C1C"]}
              defaultColor={["#EF9A9A", "#E57373", "#EF5350"]}
              onPress={handleCanecl}
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
    padding: 5,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sheetSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "80%",
    alignItems: "center",
    display: "flex",
    gap: 10,
  },
});

export default CustomBottomSheet;
