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
  onRequestClose: () => void;
  deleteLoading: boolean;
  onUpdate?: () => void;
  onReport?: () => void;
  onDelete?: () => void;
  position: { top: number; right: number };
}

const PopupMenu: FC<Props> = ({
  visible,
  onRequestClose,
  deleteLoading,
  onUpdate,
  onReport,
  onDelete,
  position,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={deleteLoading ? undefined : onRequestClose} // Android back button
    >
      <TouchableWithoutFeedback
        disabled={deleteLoading}
        onPress={onRequestClose}
      >
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={[styles.popup, position]}>
              {onUpdate && (
                <TouchableOpacity style={styles.option} onPress={onUpdate}>
                  <MaterialIcons
                    name="edit"
                    size={24}
                    color="#4caf50"
                    style={styles.icon}
                  />
                  <Text style={styles.optionText}>Update</Text>
                </TouchableOpacity>
              )}

              {onReport && (
                <TouchableOpacity style={styles.option} onPress={onReport}>
                  <MaterialIcons
                    name="report"
                    size={24}
                    color="#ff9800"
                    style={styles.icon}
                  />
                  <Text style={styles.optionText}>Report</Text>
                </TouchableOpacity>
              )}

              {onDelete && (
                <TouchableOpacity style={styles.option} onPress={onDelete}>
                  <MaterialIcons
                    name="delete"
                    size={24}
                    color="#f44336"
                    style={styles.icon}
                  />
                  <Text style={styles.optionText}>Delete</Text>
                </TouchableOpacity>
              )}

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
  popup: {
    borderRadius: 8,
    borderColor: "#333",
    borderWidth: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    position: "absolute",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

export default PopupMenu;
