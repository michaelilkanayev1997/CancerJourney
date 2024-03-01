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
import CustomMailComposer from "./CustomMailComposer";

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
      onRequestClose={handleCloseMoreOptionsPress} // Android back button
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPressOut={handleCloseMoreOptionsPress}
      >
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.header}>
            <View style={styles.dateHeader}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={20}
                color={colors.LIGHT_BLUE}
              />
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseMoreOptionsPress}
            >
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={() => {
              console.log("Enter Name here");
            }}
            value={item.title}
            placeholder="Enter Name here"
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            onChangeText={() => {
              console.log("Enter description here");
            }}
            value={item.description || ""}
            placeholder="Enter description here"
            multiline
          />

          <CustomMailComposer />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => console.log("Delete")}
              style={styles.modalActionButton}
            >
              <MaterialCommunityIcons name="delete" size={20} color="#FF5C5C" />
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => console.log("Update")}
              style={styles.modalActionButton}
            >
              <MaterialCommunityIcons name="update" size={20} color="#4A90E2" />
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
});

export default MoreOptionsModal;
