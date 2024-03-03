import { FC } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";

import colors from "@utils/colors";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onCameraPress: () => void;
  onGalleryPress: () => void;
  onRemovePress: () => void;
}

const ProfilePhotoModal: FC<Props> = ({
  isVisible,
  onClose,
  onCameraPress,
  onGalleryPress,
  onRemovePress,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Profile Photo</Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={onCameraPress}>
                  <MaterialCommunityIcons
                    name="camera"
                    size={24}
                    color={colors.INFO}
                  />
                  <Text style={styles.buttonText}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={onGalleryPress}
                >
                  <MaterialIcons
                    name="photo-library"
                    size={24}
                    color={colors.INFO}
                  />
                  <Text style={styles.buttonText}>Gallery</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={onRemovePress}>
                  <Entypo name="trash" size={24} color={colors.INFO} />
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
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
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 19,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    marginTop: 5,
    color: colors.INFO,
  },
});

export default ProfilePhotoModal;
