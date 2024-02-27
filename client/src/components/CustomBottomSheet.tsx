import { JSX, forwardRef, useCallback, useMemo, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import colors from "@utils/colors";
import AppButton from "@ui/AppButton";

interface Props {
  title: string;
}

const CustomBottomSheet = forwardRef<BottomSheet, Props>(({ title }, ref) => {
  const snapPoints = useMemo(() => ["60%"], []);

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

  const [selectedImage, setSelectedImage] = useState(null);

  const takeImage = async () => {
    // Request camera permissions
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    // Open the camera with ImagePicker
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // Allows editing the picture
      //aspect: [4, 3], // Aspect ratio
      quality: 1, // Highest quality
    });
    console.log(result);
    // If the user doesn't cancel, set the selected image
    if (!result.cancelled) {
      setSelectedImage(result.uri);
    }
  };

  const pickDocument = async () => {
    try {
      const docRes = await DocumentPicker.getDocumentAsync({});
      console.log(docRes);

      const formData = new FormData();
      const assets = docRes.assets;
      if (!assets) return;

      const file = assets[0];

      const File = {
        name: file.name.split(".")[0],
        uri: file.uri,
        type: file.mimeType,
        size: file.size,
      };
      console.log(File);
    } catch (error) {
      console.log(error);
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
        <Text style={styles.sheetSubtitle}>Choose Your File</Text>

        <View style={styles.buttonContainer}>
          <AppButton
            title="Take Photo"
            pressedColor={["#4285F4", "#3578E5", "#2A6ACF"]}
            defaultColor={["#4A90E2", "#4285F4", "#5B9EF4"]}
            onPress={takeImage}
          />
          <AppButton
            title="Choose From Phone"
            pressedColor={["#4285F4", "#3578E5", "#2A6ACF"]}
            defaultColor={["#4A90E2", "#4285F4", "#5B9EF4"]}
            onPress={pickDocument}
          />
          <AppButton
            title="Cancel"
            pressedColor={["#D32F2F", "#C62828", "#B71C1C"]}
            defaultColor={["#EF9A9A", "#E57373", "#EF5350"]}
            onPress={() => ref?.current?.close()}
          />
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

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
