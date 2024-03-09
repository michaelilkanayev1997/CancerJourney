import { FC, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Vibration,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "@utils/colors";
import placeholder from "@assets/user_profile.png";
import PulseAnimationContainer from "@components/PulseAnimationContainer";

interface Props {
  onButtonPress?: () => void;
  uri: string;
}

const Avatar: FC<Props> = ({ uri, onButtonPress }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImageLoading, setImageIsLoading] = useState(true);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    Vibration.vibrate(50);
  };

  if (isImageLoading)
    return (
      <PulseAnimationContainer>
        <View style={styles.container}>
          <Image
            source={uri ? { uri } : placeholder}
            style={styles.dummyImage}
            onLoad={() => setImageIsLoading(false)} // Image loaded successfully
            onError={() => setImageIsLoading(false)} // Image failed to load
          />
        </View>
      </PulseAnimationContainer>
    );

  return (
    <View style={styles.container}>
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
        onRequestClose={toggleModal} // Back button on Android
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
    borderRadius: 55,
    width: 110,
    height: 110,
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 3,
  },
  editButton: {
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 24,
    padding: 8,
    position: "absolute",
    right: 5,
    bottom: 5,
    elevation: 5, // Works on Android
    // iOS shadow properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
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
    top: 90,
    right: 10,
    zIndex: 1,
  },
  dummyImage: {
    borderRadius: 75,
    width: 150,
    height: 150,
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 5,
    backgroundColor: colors.INACTIVE_CONTRAST,
  },
});

export default Avatar;
