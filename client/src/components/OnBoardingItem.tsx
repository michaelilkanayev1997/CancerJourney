import colors from "@utils/colors";
import { FC } from "react";
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  ImageSourcePropType,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

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
      <Animated.View
        style={styles.imageContainer}
        entering={FadeInUp.delay(200).duration(1000)}
      >
        <Image source={item.image} style={styles.image} />
      </Animated.View>

      <View style={styles.infoContainer}>
        <Animated.Text
          entering={FadeInDown.delay(200).duration(1200).springify()}
          style={styles.title}
        >
          {item.title}
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(600).duration(1200).springify()}
          style={styles.description}
        >
          {item.description}
        </Animated.Text>
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
