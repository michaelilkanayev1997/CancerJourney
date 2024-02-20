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
}

const OnBoardingItem: FC<Props> = ({ item }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
      </View>

      <View style={{ flex: 0.3 }}>
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
    width: "80%",
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
  title: {
    fontWeight: "800",
    fontSize: 28,
    marginBottom: 10,
    color: "#493d8a",
    textAlign: "center",
  },
  description: {
    fontWeight: "300",
    color: "#62656b",
    textAlign: "center",
    paddingHorizontal: 64,
  },
});

export default OnBoardingItem;
