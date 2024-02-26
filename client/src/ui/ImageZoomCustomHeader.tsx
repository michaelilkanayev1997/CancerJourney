import { Dispatch, FC, SetStateAction } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ImageType } from "@components/ImageCard";

interface Props {
  currentIndex: number;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  images: ImageType[];
}

const ImageZoomCustomHeader: FC<Props> = ({
  currentIndex,
  setModalVisible,
  images,
}) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.arrowLeftContainer}
        onPress={() => setModalVisible(false)}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerText} numberOfLines={1} ellipsizeMode="tail">
        {images[currentIndex].title.substring(0, 16)} -{" "}
        {images[currentIndex].date}
      </Text>
      <View style={styles.placeholderView}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 28,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  headerText: {
    color: "black",
    fontSize: 18,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  arrowLeftContainer: {
    position: "absolute",
    left: 6,
    zIndex: 1,
  },
  placeholderView: {
    position: "absolute",
    right: 0,
    width: 50,
    height: "100%",
  },
});

export default ImageZoomCustomHeader;
