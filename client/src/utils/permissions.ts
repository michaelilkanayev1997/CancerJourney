import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";

export const requestCameraPermissionsAsync = async () => {
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
