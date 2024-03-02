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
import * as Sharing from "expo-sharing";
import { FileSystemDownloadResult } from "expo-file-system";

import colors from "@utils/colors";

interface Props {}

const ExportAndSendEmail: FC<Props> = (props) => {
  const [mailIsAvailable, setMailIsAvailable] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadResult, setDownloadResult] =
    useState<FileSystemDownloadResult | null>(null);

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
    const checkMailAvailability = async () => {
      const isAvailable = await MailComposer.isAvailableAsync();
      setMailIsAvailable(isAvailable);
    };
    checkMailAvailability();
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

  const downloadFile = async () => {
    if (downloadResult) {
      return downloadResult;
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
      // Log the download result
      console.log(downloadResult.headers["content-type"]);

      setDownloadResult(downloadResult);
      return downloadResult;
    } catch (error) {
      console.error("An error occurred:", error);
      Alert.alert("Error", "Failed to send email.");
      return null;
    }
  };

  const downloadFileAndSendEmail = async () => {
    Vibration.vibrate(50);
    if (!mailIsAvailable) {
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

    try {
      // Download the file
      const downloadResult = await downloadFile();

      if (!downloadResult) {
        Alert.alert("Download Error", "Failed to download the file.");
        return;
      }

      setTimeout(async () => {
        // Send the email with the downloaded file as attachment
        await MailComposer.composeAsync({
          subject: "Cancer Journey",
          body: `Hi,\n\nThis message is sent from the CancerJourney app.\n\nThank you.\n\nBest regards,\nMichael.`,
          attachments: [downloadResult.uri],
        });

        // delete the downloaded file from the cache
        //await FileSystem.deleteAsync(fileUri);
      }, 350);
    } catch (error) {
      console.error("An error occurred:", error);
      Alert.alert("Error", "Failed to send email.");
    }
  };

  const downloadFileAndExport = async () => {
    Vibration.vibrate(50);

    if (await Sharing.isAvailableAsync()) {
      const downloadResult = await downloadFile(); // Download the file

      if (!downloadResult) {
        Alert.alert("Download Error", "Failed to download the file.");
        return;
      }

      setTimeout(async () => {
        await Sharing.shareAsync(downloadResult.uri);
      }, 350);
    } else {
      // Sharing is not available, show an alert
      Alert.alert(
        "Unable to Export",
        "Exporting is not available on your device."
      );
    }
  };

  return (
    <>
      <View style={styles.buttonContainer}>
        {/* Export or Share Link */}
        <TouchableOpacity
          onPress={downloadFileAndExport}
          style={styles.iconButton}
        >
          <MaterialCommunityIcons
            name="share-outline"
            size={24}
            color={colors.LIGHT_BLUE}
          />
          <Text style={styles.iconButtonText}>Export/Share</Text>
        </TouchableOpacity>

        {/* Send Email Link */}
        <TouchableOpacity
          onPress={downloadFileAndSendEmail}
          style={styles.iconButton}
        >
          <MaterialCommunityIcons
            name="email-outline"
            size={24}
            color={colors.LIGHT_BLUE}
          />
          <Text style={styles.iconButtonText}>Send Email</Text>
        </TouchableOpacity>
      </View>

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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginHorizontal: 5,
  },
  iconButtonText: {
    color: colors.LIGHT_BLUE,
    marginLeft: 5,
    textDecorationLine: "underline",
  },
  progressContainer: {
    padding: 1,
  },
  progressText: {
    textAlign: "center",
    marginTop: 4,
  },
});

export default ExportAndSendEmail;
