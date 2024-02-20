import colors from "@utils/colors";
import { FC } from "react";
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  Text,
  ImageSourcePropType,
} from "react-native";

interface Props {
  item: {
    id: string;
    title: string;
    description: string;
    image?: ImageSourcePropType;
  };
  currentIndex: number;
}

const OnBoardingItem: FC<Props> = ({ item, currentIndex }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "70%",
    height: undefined,
    aspectRatio: 1,
    borderRadius: 50,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  infoContainer: { flex: 0.3, paddingTop: 30 },
  title: {
    fontWeight: "800",
    fontSize: 30,
    marginBottom: 10,
    color: colors.PRIMARY_BTN,
    textAlign: "center",
  },
  description: {
    fontWeight: "400",
    textAlign: "center",
    paddingHorizontal: 26,
  },
});

export default OnBoardingItem;
