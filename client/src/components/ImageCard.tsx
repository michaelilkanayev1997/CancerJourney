import { Dispatch, SetStateAction, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import MoreOptionsModal from "./MoreOptionsModal";

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
  const [isOptionModalVisible, setOptionModalVisible] = useState(false);

  const handleMoreOptionsPress = () => {
    setOptionModalVisible(true);
    Vibration.vibrate(60);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setSelectedImageIndex(index);
          setModalVisible(true);
        }}
        onLongPress={handleMoreOptionsPress}
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
      <MoreOptionsModal
        item={item}
        isOptionModalVisible={isOptionModalVisible}
        setOptionModalVisible={setOptionModalVisible}
      />
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
});

export default ImageCard;
