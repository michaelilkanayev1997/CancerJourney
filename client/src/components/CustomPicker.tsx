import { Dispatch, FC, SetStateAction } from "react";
import {
  View,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

import { NewProfile } from "./InputSections";
import { NewPost } from "@views/bottomTab/posts/NewPost";
import { cancerTypes } from "@utils/enums";

interface Props {
  visible: boolean;
  newProfile: NewProfile | NewPost;
  setNewProfile:
    | Dispatch<SetStateAction<NewProfile>>
    | Dispatch<SetStateAction<NewPost>>;
  setPickerVisible: Dispatch<SetStateAction<boolean>>;
}

const { width, height } = Dimensions.get("window");

const CustomPicker: FC<Props> = ({
  visible,
  newProfile,
  setNewProfile,
  setPickerVisible,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={() => setPickerVisible(false)} // Android back button
    >
      <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <FlatList
                data={cancerTypes}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                      setNewProfile({
                        ...(newProfile as any),
                        cancerType: item.value,
                      });
                      setPickerVisible(false);
                    }}
                  >
                    <Image
                      source={item.imageUrl}
                      style={{ width: 25, height: 25, marginRight: 5 }}
                    />
                    <Text style={styles.text}>{item.label}</Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                contentContainerStyle={styles.flatListContainer}
              />
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
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent background
  },
  separator: {
    height: 1, // Separator thickness
    width: "100%",
    backgroundColor: "#e1e1e1",
  },
  modalView: {
    maxHeight: height * 0.7, // Set a max height for the modal
    width: width - 40, // Use a percentage of screen width
    backgroundColor: "white",
    borderRadius: 5,
    padding: 25,
    alignItems: "flex-start", // Align items to the start
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden", // Ensure the shadows don't overflow
  },
  flatListContainer: {
    paddingBottom: 20, // Add padding at the bottom of the list
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    width: "100%",
  },
  text: {
    width: "100%",
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
});

export default CustomPicker;
