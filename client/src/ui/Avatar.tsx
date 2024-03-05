import colors from "@utils/colors";
import { FC, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Modal } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import placeholder from "@assets/user_profile.png";

interface Props {
  onButtonPress?: () => void;
  uri: string;
}

const Avatar: FC<Props> = ({ uri, onButtonPress }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  return (
    <View style={styles.container}>
      {/* TouchableOpacity wraps the image to make it clickable */}
      <TouchableOpacity onPress={toggleModal}>
        <Image source={uri ? { uri } : placeholder} style={styles.image} />
      </TouchableOpacity>

      {onButtonPress && (
        <TouchableOpacity style={styles.editButton} onPress={onButtonPress}>
          <MaterialCommunityIcons
            name="camera-outline"
            size={30}
            color="white"
          />
        </TouchableOpacity>
      )}

      {/* Modal for displaying the image fullscreen */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={toggleModal} // Allows closing the modal by pressing the back button on Android
      >
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={toggleModal}
          >
            <MaterialCommunityIcons name="close" size={30} color="white" />
          </TouchableOpacity>
          <Image
            source={uri ? { uri } : placeholder}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "relative",
  },
  image: {
    borderRadius: 75,
    width: 150,
    height: 150,
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 5,
  },
  editButton: {
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 24,
    padding: 8,
    position: "absolute",
    right: 5,
    bottom: 5,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalImage: {
    width: "100%",
    height: "80%",
  },
  modalCloseButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1, // Ensure the button is clickable by placing it above the image
  },
});

export default Avatar;
