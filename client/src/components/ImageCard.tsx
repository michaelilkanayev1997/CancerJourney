import { Dispatch, FC, SetStateAction } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type ImageType = {
  id: string;
  uri: string;
  title: string;
  date: string;
};

interface Props {
  item: ImageType;
  index: number;
  setSelectedImageIndex: Dispatch<SetStateAction<number | null>>;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  numColumns: number;
}

const ImageCard = ({
  item,
  index,
  setSelectedImageIndex,
  setModalVisible,
  numColumns,
}: Props) => {
  return (
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
          onPress={() => {
            /* Handle more options */
            Vibration.vibrate(50);
          }}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={numColumns === 3 ? 24 : 30}
            color="black"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
});

export default ImageCard;
