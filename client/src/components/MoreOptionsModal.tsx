import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Text,
  Vibration,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as MailComposer from "expo-mail-composer";
import * as FileSystem from "expo-file-system";
import ProgressBar from "react-native-progress/Bar";

import colors from "@utils/colors";
import { ImageType } from "./ImageCard";

interface Props {
  item: ImageType;
  isOptionModalVisible: boolean;
  setOptionModalVisible: Dispatch<SetStateAction<boolean>>;
}

const MoreOptionsModal: FC<Props> = ({
  item,
  isOptionModalVisible,
  setOptionModalVisible,
}) => {
  const [mailIsAviliable, setMailIsAviliable] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);
  console.log(downloadProgress / 100);

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
      console.log(fileUri);
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

  const handleCloseMoreOptionsPress = () => {
    setOptionModalVisible(false);
    Vibration.vibrate(40);
  };

  return (
    <Modal
      visible={isOptionModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCloseMoreOptionsPress} // This is for Android's back button
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={handleCloseMoreOptionsPress} // Dismiss modal on outside press
      >
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseMoreOptionsPress}
          >
            <MaterialCommunityIcons name="close" size={24} color="#333" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              console.log("lol");
            }}
            value={item.title}
            placeholder="Title"
          />

          <TextInput
            style={[styles.input, styles.descriptionInput]}
            onChangeText={(text) => {
              console.log("lol");
            }}
            value={item.description ? item.description : ""}
            placeholder="Description"
            multiline={true}
            maxLength={200}
          />

          <TouchableOpacity
            onPress={downloadFileAndSendEmail}
            style={styles.iconButton}
          >
            <MaterialCommunityIcons
              name="email-outline"
              size={24}
              color="#fff"
            />
            <Text style={styles.iconButtonText}>Send Email</Text>
          </TouchableOpacity>

          <View
            style={[
              styles.progressContainer,
              { opacity: isDownloading ? 1 : 0 },
            ]}
          >
            <ProgressBar
              progress={downloadProgress / 100}
              width={200}
              color={colors.LIGHT_BLUE}
              animated={true}
              useNativeDriver={true}
            />
            <Text style={styles.progressText}>
              Progress: {downloadProgress}%
            </Text>
          </View>

          <View style={styles.dateContainer}>
            <MaterialCommunityIcons
              name="calendar-clock"
              size={16}
              color={colors.LIGHT_BLUE}
            />
            <Text style={styles.modalText}>{item.date}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => console.log("Delete")}
              style={styles.modalActionButton}
            >
              <MaterialCommunityIcons
                name="delete"
                size={20}
                color={colors.ERROR}
              />
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => console.log("Update")}
              style={styles.modalActionButton}
            >
              <MaterialCommunityIcons
                name="update"
                size={20}
                color={colors.INFO}
              />
              <Text style={styles.actionButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
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

  modalText: {
    marginLeft: 5,
    fontSize: 14,
    color: "black",
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  modalActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 2, // for Android
    shadowColor: "#000", // for iOS
    shadowOffset: { width: 0, height: 1 }, // for iOS
    shadowOpacity: 0.22, // for iOS
    shadowRadius: 2.22, // for iOS
  },
  actionButtonText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "85%",
    borderRadius: 5,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  descriptionInput: {
    height: 100, // Larger height for the description field
    textAlignVertical: "top", // Align text to the top for multiline input
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    marginBottom: 15,
  },
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

export default MoreOptionsModal;
