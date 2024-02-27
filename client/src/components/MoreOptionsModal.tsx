import { Dispatch, FC, SetStateAction } from "react";
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
});

export default MoreOptionsModal;
