import { FC, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  useWindowDimensions,
} from "react-native";
import slidesData from "@assets/OnBoarding/slidesData";

import OnBoardingItem from "@components/OnBoardingItem";
import colors from "@utils/colors";

interface Props {}

const Paginator = ({ data, scrollX }) => {
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
          outputRange: [0.2, 0.8, 0.2],
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

const OnBoarding: FC<Props> = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  return (
    <View style={styles.container}>
      <View style={{ flex: 3 }}>
        <FlatList
          data={slidesData}
          renderItem={({ item }) => <OnBoardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          ref={slidesRef}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Paginator data={slidesData} scrollX={scrollX} />
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
});

export default OnBoarding;
