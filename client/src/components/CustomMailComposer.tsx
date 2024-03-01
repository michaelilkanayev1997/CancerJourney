import { FC, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Vibration,
  TouchableOpacity,
  Text,
} from "react-native";
import * as MailComposer from "expo-mail-composer";
import * as FileSystem from "expo-file-system";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProgressBar from "react-native-progress/Bar";

import colors from "@utils/colors";

interface Props {}

const CustomMailComposer: FC<Props> = (props) => {
  const [mailIsAviliable, setMailIsAviliable] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const getFileExtensionFromUrl = (url: string) => {
    // Use a regular expression to match the file extension
    const match = url.match(/\.([0-9a-z]+)([\?#]|$)/i);
    if (match && match.length > 1) {
      // Return the file extension
      return match[1];
    }
    // Return null if no extension found
    return null;
  };

  useEffect(() => {
    const checkMailAvilability = async () => {
      const isMailAvilable = await MailComposer.isAvailableAsync();
      setMailIsAviliable(isMailAvilable);
    };
    checkMailAvilability();
  }, []);

  const progressCallback = (progress: {
    totalBytesWritten: number;
    totalBytesExpectedToWrite: number;
  }) => {
    const percentProgress = (
      (progress.totalBytesWritten / progress.totalBytesExpectedToWrite) *
      100
    ).toFixed(2);
    setDownloadProgress(Number(percentProgress));
  };

  const downloadFileAndSendEmail = async () => {
    Vibration.vibrate(50);
    if (!mailIsAviliable) {
      Alert.alert(
        "Set Up Email Account",
        "To send an email, please ensure you have a default email account set up. You can do this in your device's settings under 'Accounts' or 'Mail'.",
        [
          {
            text: "OK",
          },
        ]
      );
      return;
    }

    setIsDownloading(true);
    const imageUrl =
      "https://wallpapers.com/images/featured/4k-nature-ztbad1qj8vdjqe0p.jpg";
    const extension = getFileExtensionFromUrl(imageUrl);

    let fileUri = "";
    if (extension) {
      const fileName = `File.${extension}`; // Extract filename from URL
      fileUri = `${FileSystem.documentDirectory}${fileName}`; // Local URI to download the file to
    } else {
      Alert.alert("Error", "Could not attach file.");
      return;
    }

    try {
      // Download the file with progress callback
      const downloadResumable = FileSystem.createDownloadResumable(
        imageUrl,
        fileUri,
        {},
        progressCallback
      );

      const downloadResult = await downloadResumable.downloadAsync();

      if (!downloadResult) {
        Alert.alert("Error", "Could not Download file.");
        return;
      }

      setTimeout(async () => {
        // Send the email with the downloaded file as attachment
        await MailComposer.composeAsync({
          subject: "Cancer Journey",
          body: `Hi something,\n\nThanks for your interest in Cancer Journey!\n\nYou can find more information about the project here: https://cancerjourney.com\n\nBest regards,\n<NAME>`,
          attachments: [downloadResult.uri],
        });

        // delete the downloaded file from the cache
        await FileSystem.deleteAsync(fileUri);
      }, 350);
    } catch (error) {
      console.error("An error occurred:", error);
      Alert.alert("Error", "Failed to send email.");
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={downloadFileAndSendEmail}
        style={styles.iconButton}
      >
        <MaterialCommunityIcons name="email-outline" size={24} color="#fff" />
        <Text style={styles.iconButtonText}>Send Email</Text>
      </TouchableOpacity>

      <View
        style={[styles.progressContainer, { opacity: isDownloading ? 1 : 0 }]}
      >
        <ProgressBar
          progress={downloadProgress / 100}
          width={200}
          color={colors.LIGHT_BLUE}
          animated={true}
          useNativeDriver={true}
        />
        <Text style={styles.progressText}>Progress: {downloadProgress}%</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.LIGHT_BLUE,
    padding: 10,
    borderRadius: 5,
  },
  iconButtonText: {
    color: "#fff",
    marginLeft: 8,
  },
  progressContainer: {
    padding: 10,
  },
  progressText: {
    textAlign: "center",
    marginTop: 4,
  },
});

export default CustomMailComposer;
