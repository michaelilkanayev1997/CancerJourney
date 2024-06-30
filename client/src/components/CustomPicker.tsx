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

interface Props {
  visible: boolean;
  newProfile: NewProfile;
  setNewProfile: (profile: NewProfile) => void;
  setPickerVisible: Dispatch<SetStateAction<boolean>>;
}

export const cancerTypes = [
  {
    label: "Breast Cancer",
    value: "breast",
    imageUrl: require("@assets/CancerType/breast-cancer.png"),
  },
  {
    label: "Brain Cancer",
    value: "brain",
    imageUrl: require("@assets/CancerType/brain-cancer.png"),
  },
  {
    label: "Appendix Cancer",
    value: "appendix",
    imageUrl: require("@assets/CancerType/appendix-cancer.png"),
  },
  {
    label: "bladder Cancer",
    value: "bladder",
    imageUrl: require("@assets/CancerType/bladder-cancer.png"),
  },
  {
    label: "Blood Cancer",
    value: "blood",
    imageUrl: require("@assets/CancerType/blood-cancer.png"),
  },
  {
    label: "Kidney Cancer",
    value: "kidney",
    imageUrl: require("@assets/CancerType/kidney-cancer.png"),
  },
  {
    label: "Bone Cancer",
    value: "bone",
    imageUrl: require("@assets/CancerType/bone-cancer.png"),
  },
  {
    label: "Childhood Cancer",
    value: "childhood",
    imageUrl: require("@assets/CancerType/childhood-cancer.png"),
  },
  {
    label: "Colorectal Cancer",
    value: "colorectal",
    imageUrl: require("@assets/CancerType/colorectal-cancer.png"),
  },
  {
    label: "Gallbladder & Bile Duct Cancer",
    value: "gallbladder-and-bile-duct",
    imageUrl: require("@assets/CancerType/gallbladder-and-bile-duct-cancer.png"),
  },
  {
    label: "Gastric Cancer",
    value: "gastric",
    imageUrl: require("@assets/CancerType/gastric-cancer.png"),
  },
  {
    label: "Gynecological Cancer",
    value: "gynecological",
    imageUrl: require("@assets/CancerType/gynecological-cancer.png"),
  },
  {
    label: "Head & Neck Cancer",
    value: "head-and-neck",
    imageUrl: require("@assets/CancerType/head-and-neck-cancer.png"),
  },
  {
    label: "Liver Cancer",
    value: "liver",
    imageUrl: require("@assets/CancerType/liver-cancer.png"),
  },
  {
    label: "Lung Cancer",
    value: "lung",
    imageUrl: require("@assets/CancerType/lung-cancer.png"),
  },
  {
    label: "Pancreatic Cancer",
    value: "pancreatic",
    imageUrl: require("@assets/CancerType/pancreatic-cancer.png"),
  },
  {
    label: "Prostate Cancer",
    value: "prostate",
    imageUrl: require("@assets/CancerType/prostate-cancer.png"),
  },
  {
    label: "Skin Cancer",
    value: "skin",
    imageUrl: require("@assets/CancerType/skin-cancer.png"),
  },
  {
    label: "Testicular Cancer",
    value: "testicular",
    imageUrl: require("@assets/CancerType/testicular-cancer.png"),
  },
  {
    label: "Thyroid Cancer",
    value: "thyroid",
    imageUrl: require("@assets/CancerType/thyroid-cancer.png"),
  },
  {
    label: "Other",
    value: "other",
    imageUrl: require("@assets/CancerType/other-cancer.png"),
  },
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
                      setNewProfile({ ...newProfile, cancerType: item.value });
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
