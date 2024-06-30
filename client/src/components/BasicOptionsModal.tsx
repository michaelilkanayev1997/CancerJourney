import { FC } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  onRequestClose(): void;
  onUpdate: () => void;
  onReport: () => void;
  onDelete: () => void;
}

const BasicOptionsModal: FC<Props> = ({
  visible,
  onRequestClose,
  postTitle,
  onUpdate,
  onReport,
  onDelete,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <Text style={styles.modalTitle}>Options:</Text>
              <Text style={styles.modalTitle}>Creator: Michael Ilkanayev</Text>
              <Text style={styles.modalTitle}>Upload: 25/04/12</Text>
              <TouchableOpacity style={styles.option} onPress={onUpdate}>
                <MaterialIcons
                  name="edit"
                  size={24}
                  color="#4caf50"
                  style={styles.icon}
                />
                <Text style={styles.optionText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={onReport}>
                <MaterialIcons
                  name="report"
                  size={24}
                  color="#f44336"
                  style={styles.icon}
                />
                <Text style={styles.optionText}>Report</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={onDelete}>
                <MaterialIcons
                  name="delete"
                  size={24}
                  color="#ff9800"
                  style={styles.icon}
                />
                <Text style={styles.optionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "80%",
    padding: 20,
    elevation: 5,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 18,
    marginLeft: 10,
    color: "#000", // Text color
  },
  icon: {
    width: 24,
    height: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
});

export default BasicOptionsModal;
