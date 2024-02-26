import { Dispatch, FC, SetStateAction, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "@utils/colors";

export type ImageType = {
  id: string;
  uri: string;
  title: string;
  date: string;
  description?: string;
};

interface Props {
  item: ImageType;
  index: number;
  setSelectedImageIndex: Dispatch<SetStateAction<number | null>>;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  numColumns: number;
  description?: string;
}

const ImageCard = ({
  item,
  index,
  setSelectedImageIndex,
  setModalVisible,
  numColumns,
}: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleMoreOptionsPress = () => {
    setIsModalVisible(true);
    Vibration.vibrate(50);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setSelectedImageIndex(index);
          setModalVisible(true);
        }}
        activeOpacity={0.6}
        style={styles.cardContainer}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.uri }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text
              style={styles.imageTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
            <Text style={styles.imageDate}>{item.date}</Text>
          </View>
          <TouchableOpacity
            style={styles.moreIcon}
            onPress={handleMoreOptionsPress}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={numColumns === 3 ? 24 : 30}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Custom Modal for More Options */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)} // This is for Android's back button
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setIsModalVisible(false)} // Dismiss modal on outside press
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
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
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    padding: 8,
    paddingBottom: 20,
    width: "100%",
  },
  imageContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
  },
  textContainer: {
    padding: 8,
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  imageDate: {
    fontSize: 14,
    color: "gray",
  },
  moreIcon: {
    position: "absolute",
    right: 0,
    top: 5,
  },
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
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
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

export default ImageCard;
