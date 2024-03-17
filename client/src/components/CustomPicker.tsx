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
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { NewProfile } from "./InputSections";

interface CancerType {
  label: string;
  value: string;
  icon: string;
}

interface Props {
  visible: boolean;
  newProfile: NewProfile;
  setNewProfile: (profile: NewProfile) => void;
  setPickerVisible: Dispatch<SetStateAction<boolean>>;
}

const cancerTypes: CancerType[] = [
  { label: "Breast Cancer", value: "breast", icon: "favorite" },
  { label: "Lung Cancer", value: "1", icon: "smoking_rooms" },
  { label: "Prostate Cancer", value: "2", icon: "male" },
  { label: "Breast Cancer", value: "3", icon: "favorite" },
  { label: "Lung Cancer", value: "4", icon: "smoking_rooms" },
  { label: "Prostate Cancer", value: "5", icon: "male" },
  { label: "Breast Cancer", value: "6", icon: "favorite" },
  { label: "Lung Cancer", value: "7", icon: "smoking_rooms" },
  { label: "Prostate Cancer", value: "8", icon: "male" },
  { label: "Breast Cancer", value: "9", icon: "favorite" },
  { label: "Lung Cancer", value: "0", icon: "smoking_rooms" },
  { label: "Prostate Cancer", value: "11", icon: "male" },
  // Add more cancer types as needed
];

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
                      setNewProfile({ ...newProfile, cancerType: item.label });
                      setPickerVisible(false);
                    }}
                  >
                    <FontAwesome6 name="cannabis" size={24} color="black" />
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
    paddingVertical: 10,
    width: "100%", // Ensure the touchable area is wide
  },
  text: {
    width: "100%", // Ensure the touchable area is wide
    marginLeft: 10,
    fontSize: 16,
    color: "#000", // Text color
  },
});

export default CustomPicker;
