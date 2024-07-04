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
import Loader from "@ui/Loader";

interface Props {
  visible: boolean;
  onRequestClose(): void;
  deleteLoading: boolean;
  onUpdate: () => void;
  onReport: () => void;
  onDelete: () => void;
}

const BasicOptionsModal: FC<Props> = ({
  visible,
  onRequestClose,
  deleteLoading,
  onUpdate,
  onReport,
  onDelete,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={deleteLoading ? undefined : onRequestClose} // Android back button
    >
      <TouchableWithoutFeedback
        disabled={deleteLoading}
        onPress={onRequestClose}
      >
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
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
                  color="#ff9800"
                  style={styles.icon}
                />
                <Text style={styles.optionText}>Report</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={onDelete}>
                <MaterialIcons
                  name="delete"
                  size={24}
                  color="#f44336"
                  style={styles.icon}
                />
                <Text style={styles.optionText}>Delete</Text>
              </TouchableOpacity>

              {/* Loader Component */}
              {deleteLoading && (
                <View style={styles.loaderOverlay}>
                  <Loader
                    loaderStyle={{
                      width: 150,
                      height: 150,
                    }}
                  />
                </View>
              )}
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
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    width: "45%",
    paddingVertical: 30,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
    marginLeft: 20,
    color: "#333",
    fontWeight: "500",
  },
  icon: {
    width: 24,
    height: 24,
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
});

export default BasicOptionsModal;
