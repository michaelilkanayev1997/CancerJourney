import { Dispatch, FC, SetStateAction, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Text,
  Vibration,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import colors from "@utils/colors";
import { ImageType } from "./ImageCard";
import ExportAndSendEmail from "./ExportAndSendEmail";
import Loader from "@ui/Loader";
import { useFileMutations } from "src/hooks/mutations";

interface Props {
  item: ImageType;
  isOptionModalVisible: boolean;
  setOptionModalVisible: Dispatch<SetStateAction<boolean>>;
  folderName: string;
}

const MoreOptionsModal: FC<Props> = ({
  item,
  isOptionModalVisible,
  setOptionModalVisible,
  folderName,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState<string>(item.title);
  const [description, setDescription] = useState<string>(
    item.description || ""
  );
  const {
    deleteFileMutation,
    deleteLoading,
    updateFileMutation,
    updateLoading,
  } = useFileMutations();

  const handleCloseMoreOptionsPress = useCallback(() => {
    setOptionModalVisible(false);
    Vibration.vibrate(40);
  }, [setOptionModalVisible]);

  const handleNameChange = useCallback((text: string) => {
    setTitle(text);
  }, []);

  const handleDescriptionChange = useCallback((text: string) => {
    setDescription(text);
  }, []);

  // Delete button is pressed
  const handleDelete = () => {
    deleteFileMutation({
      fileId: item._id,
      folderName,
      handleCloseMoreOptionsPress,
    });
  };

  // Update button is pressed
  const handleUpdate = async () => {
    if (title === "") {
      return;
    }

    updateFileMutation({
      fileId: item._id,
      folderName,
      title,
      description,
      handleCloseMoreOptionsPress,
    });
  };

  return (
    <Modal
      visible={isOptionModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={
        deleteLoading || updateLoading ? undefined : handleCloseMoreOptionsPress
      } // Android back button
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        disabled={deleteLoading || updateLoading}
        onPressOut={handleCloseMoreOptionsPress}
      >
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          {/* Loader Component */}
          {(deleteLoading || updateLoading) && (
            <View style={styles.loaderOverlay}>
              <Loader
                loaderStyle={{
                  width: 150,
                  height: 150,
                }}
              />
            </View>
          )}

          <View style={styles.header}>
            <View style={styles.dateHeader}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={20}
                color={colors.LIGHT_BLUE}
              />
              <Text style={styles.dateText}>{item.uploadTime}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseMoreOptionsPress}
            >
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.titleWithError}>
            <Text style={styles.label}>{t("title")}</Text>
            {title.length === 0 ? (
              <Animated.Text
                entering={FadeInLeft.duration(500)}
                exiting={FadeOutRight.duration(500)}
                style={styles.errorMessage}
              >
                {t("title-required")}
              </Animated.Text>
            ) : null}
          </View>
          <TextInput
            style={styles.input}
            onChangeText={handleNameChange}
            value={title}
            placeholder={t("enter-title-here")}
          />

          <Text style={styles.label}>{t("description-placeholder")}</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            onChangeText={handleDescriptionChange}
            value={description}
            placeholder={t("enter-description-here")}
            multiline
          />

          <ExportAndSendEmail item={item} />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              disabled={deleteLoading || updateLoading}
              onPress={handleDelete}
              style={[styles.modalActionButton]}
            >
              <MaterialCommunityIcons name="delete" size={20} color="#FF5C5C" />
              <Text style={styles.actionButtonText}>{t("delete")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={deleteLoading || updateLoading}
              onPress={handleUpdate}
              style={styles.modalActionButton}
            >
              <MaterialCommunityIcons name="update" size={20} color="#4A90E2" />
              <Text style={styles.actionButtonText}>{t("update")}</Text>
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
    marginBottom: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 15,
  },
  label: {
    fontSize: 14,
    alignSelf: "flex-start",
    marginLeft: 12,
  },
  input: {
    height: 40,
    margin: 8,
    borderWidth: 1,
    padding: 10,
    width: "90%",
    borderRadius: 5,
    borderColor: "#ddd",
    alignSelf: "center",
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginTop: 20,
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
    elevation: 2,
  },
  actionButtonText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Ensure loader is above the overlay
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20, // Match modalContent's borderRadius
  },
  titleWithError: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%", // Ensure this container stretches to fill its parent
  },
  errorMessage: {
    color: colors.ERROR,
    paddingRight: 12,
    fontWeight: "400",
  },
});

export default MoreOptionsModal;
