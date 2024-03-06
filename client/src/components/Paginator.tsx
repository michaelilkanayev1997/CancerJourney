import { FC } from "react";
import {
  View,
  useWindowDimensions,
  Animated,
  ImageSourcePropType,
} from "react-native";

import colors from "@utils/colors";

// The structure of each slide's data
interface SlideData {
  id: string;
  title: string;
  description: string;
  image: ImageSourcePropType;
}

interface Props {
  data: SlideData[];
  scrollX: Animated.Value;
}

const Paginator: FC<Props> = ({ data, scrollX }) => {
  const { width } = useWindowDimensions(); // Get the window's width to calculate the dot's position

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [1.0, 1.4, 1.0],
          extrapolate: "clamp",
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 0.8, 0.3],
          extrapolate: "clamp",
        });
        return (
          <Animated.View
            key={i}
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: colors.PRIMARY_BTN,
              margin: 10,
              opacity,
              transform: [{ scale }],
            }}
          />
        );
      })}
    </View>
  );
};

export default Paginator;
