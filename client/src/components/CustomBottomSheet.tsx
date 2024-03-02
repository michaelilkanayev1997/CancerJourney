import { JSX, forwardRef, useCallback, useMemo } from "react";
import { Text, StyleSheet, View, Alert, Linking } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import colors from "@utils/colors";
import AppButton from "@ui/AppButton";
import { UploadStackParamList } from "src/@types/navigation";

interface Props {}

const CustomBottomSheet = forwardRef<BottomSheetMethods, Props>(
  (props, ref) => {
    const snapPoints = useMemo(() => ["60%"], []);
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

    const requestPermissionsAsync = async () => {
      const { status, canAskAgain } =
        await ImagePicker.requestCameraPermissionsAsync();

      if (status === "granted") {
        return true;
      } else if (status === "denied" && !canAskAgain) {
        // User has denied permissions and cannot ask again. Prompt them to manually enable it.
        Alert.alert(
          "Camera Permission Required",
          "Please go to your settings and allow camera access for this app.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
      } else {
        // General denial without restriction to ask again
        Alert.alert(
          "Permissions required",
          "Camera access is needed to take photos."
        );
      }
      return false;
    };

    const takeImage = async () => {
      // Request camera permissions
      const hasPermission = await requestPermissionsAsync();
      if (!hasPermission) return;

      // Open the camera with ImagePicker
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true, // Allows editing the picture
        quality: 1, // Highest quality
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
          });
        }
      }
    };

    const pickDocument = async () => {
      try {
        const docRes = await DocumentPicker.getDocumentAsync({
          type: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/*",
          ],
          multiple: false,
        });

        const assets = docRes.assets;
        if (!assets) return;

        const file = assets[0];

        const File = {
          name: file.name.split(".")[0],
          uri: file.uri,
          type: file.mimeType,
          size: file.size,
        };

        if (File.type) {
          navigation.navigate("FilePreview", {
            fileUri: File.uri,
            fileType: File.type,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    const handleCanecl = () => {
      // Check if ref and current are available
      if (ref && "current" in ref && ref.current) {
        ref.current.close();
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
          <Text style={styles.sheetTitle}>Upload File</Text>
          <Text style={styles.sheetSubtitle}>
            How would you like to proceed?
          </Text>

          <View style={styles.buttonContainer}>
            <AppButton
              title="Take a Photo"
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
              title="Choose From Phone"
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
              title="Cancel"
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