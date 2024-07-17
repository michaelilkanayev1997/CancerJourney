import { FC } from "react";
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  ImageSourcePropType,
  Text,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import colors from "@utils/colors";

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
    <Animated.View
      entering={FadeIn.delay(200).duration(1200)}
      style={[styles.container, { width }]}
    >
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  imageContainer: {
    width: "70%",
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
