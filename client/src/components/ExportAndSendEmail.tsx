import { FC, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Vibration,
  Text,
  Platform,
} from "react-native";
import * as MailComposer from "expo-mail-composer";
import * as FileSystem from "expo-file-system";
import ProgressBar from "react-native-progress/Bar";
import * as Sharing from "expo-sharing";
import { FileSystemDownloadResult } from "expo-file-system";
import { useSelector } from "react-redux";

import colors from "@utils/colors";
import { ImageType } from "./ImageCard";
import { getAuthState } from "src/store/auth";
import LinkButton from "@ui/LinkButton";

interface Props {
  item: ImageType;
}

const ExportAndSendEmail: FC<Props> = ({ item }) => {
  const { profile } = useSelector(getAuthState);
  const [mailIsAvailable, setMailIsAvailable] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadResult, setDownloadResult] =
    useState<FileSystemDownloadResult | null>(null);
  const [busy, setBusy] = useState<boolean>(false);

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
    if (progress.totalBytesExpectedToWrite > 0) {
      // We can calculate the percentage progress as normal
      const percentProgress =
        (progress.totalBytesWritten / progress.totalBytesExpectedToWrite) * 100;
      setDownloadProgress(Number(percentProgress.toFixed(2)));
    } else {
      // When totalBytesExpectedToWrite is -1, handle differently
      console.log(progress);
      setDownloadProgress(-1); // Using -1 to indicate unknown size
    }
  };

  const downloadFile = async () => {
    if (downloadResult) {
      return downloadResult;
    }

    setIsDownloading(true);

    let imageUrl = "";
    if (item.type.includes("pdf")) {
      imageUrl = item.pdf_file || item.uri;
    } else {
      imageUrl = item.uri;
    }
    console.log(imageUrl); // fix extension!!!!!!!!!!!!!!!!!!!!!!!!!!
    const extension = getFileExtensionFromUrl(imageUrl);
    console.log(extension);
    let fileUri = "";
    if (extension) {
      const fileName = `${item.title}.${extension}`; // Extract filename from URL
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

      setDownloadResult(downloadResult);
      return downloadResult;
    } catch (error) {
      console.error("An error occurred:", error);
      Alert.alert("Error", "Failed to send email.");
      return null;
    }
  };

  const sendEmail = async () => {
    setBusy(true);
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
          subject: `${profile?.name} shared a document with you through Cancer Journey app`,
          body: `- File Name : ${item?.title}\n- Date : ${item?.date}\n\nCancerJourney is an application designed to assist cancer patients and their families in managing cancer.\n\nThank you.\n\nBest regards.`,
          attachments: [downloadResult.uri],
        });

        setBusy(false);

        // delete the downloaded file from the cache
        //await FileSystem.deleteAsync(fileUri);
      }, 350);
    } catch (error) {
      console.error("An error occurred:", error);
      Alert.alert("Error", "Failed to send email.");
      setBusy(false);
    }
  };

  const exportAndShare = async () => {
    setBusy(true);
    Vibration.vibrate(50);

    if (await Sharing.isAvailableAsync()) {
      const downloadResult = await downloadFile(); // Download the file

      if (!downloadResult) {
        Alert.alert("Download Error", "Failed to download the file.");
        return;
      }

      setTimeout(async () => {
        await Sharing.shareAsync(downloadResult.uri);
        setBusy(false);
      }, 350);
    } else {
      // Sharing is not available, show an alert
      Alert.alert(
        "Unable to Export",
        "Exporting is not available on your device."
      );
      setBusy(false);
    }
  };

  const androidExportFile = async () => {
    setBusy(true);
    Vibration.vibrate(50);

    if (await Sharing.isAvailableAsync()) {
      const downloadResult = await downloadFile(); // Download the file

      if (!downloadResult) {
        Alert.alert("Download Error", "Failed to download the file.");
        setBusy(false);
        return;
      }

      setTimeout(async () => {
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(
            "content://com.android.externalstorage.documents"
          );

        if (permissions.granted) {
          // Check if the directoryUri contains 'externalstorage'
          if (!permissions.directoryUri.includes("externalstorage")) {
            // Inform the user to select a different directory
            Alert.alert(
              "Access Denied",
              "Due to privacy restrictions. Please choose a different directory, preferably in your device's external storage, where the app has permission to save files."
            );
            setBusy(false);
            return; // Exit the function as we do not proceed with saving
          }

          // Read the file content to be saved
          const fileContent = await FileSystem.readAsStringAsync(
            downloadResult.uri,
            {
              encoding: FileSystem.EncodingType.Base64,
            }
          );

          const extension = getFileExtensionFromUrl(downloadResult.uri);
          const fileName = `${item.title}.${extension}`; // Extract filename from URL

          // Use the directory URI directly as obtained from permissions
          try {
            const newFileUri =
              await FileSystem.StorageAccessFramework.createFileAsync(
                permissions.directoryUri,
                fileName,
                downloadResult.headers["content-type"]
              );
            await FileSystem.writeAsStringAsync(newFileUri, fileContent, {
              encoding: FileSystem.EncodingType.Base64,
            });
          } catch (e) {
            console.error("Error creating or writing to the file:", e);
          }
        }

        setBusy(false);
      }, 350);
    } else {
      // Sharing is not available, show an alert
      Alert.alert(
        "Unable to Export",
        "Exporting is not available on your device."
      );
      setBusy(false);
    }
  };

  // Render buttons method
  const renderButtons = () => (
    <>
      {Platform.OS === "ios" ? (
        <LinkButton
          onPress={exportAndShare}
          iconName="share-outline"
          buttonText="Export/Share"
          disabled={busy}
        />
      ) : (
        <>
          <LinkButton
            onPress={androidExportFile}
            iconName="download-outline"
            buttonText="Export"
            disabled={busy}
          />
          <LinkButton
            onPress={exportAndShare}
            iconName="share-outline"
            buttonText="Share"
            disabled={busy}
          />
        </>
      )}
      <LinkButton
        onPress={sendEmail}
        iconName="email-outline"
        buttonText="Send Email"
        disabled={busy}
      />
    </>
  );

  return (
    <>
      <View style={styles.buttonContainer}>{renderButtons()}</View>

      <View
        style={[styles.progressContainer, { opacity: isDownloading ? 1 : 0 }]}
      >
        <ProgressBar
          progress={downloadProgress === -1 ? 100 : downloadProgress / 100}
          width={200}
          color={colors.LIGHT_BLUE}
          animated={true}
          useNativeDriver={true}
        />

        <Text style={styles.progressText}>
          Progress: {downloadProgress === -1 ? "100" : downloadProgress}%
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
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
