import { FC, useRef, useState } from "react";
import { View, StyleSheet, FlatList, Animated } from "react-native";

import slidesData from "@assets/OnBoarding/slidesData";
import OnBoardingItem from "@components/OnBoardingItem";
import colors from "@utils/colors";
import Paginator from "@components/Paginator";
import AppLink from "@ui/AppLink";

interface Props {}

const OnBoarding: FC<Props> = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList<any>>(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  return (
    <View style={styles.container}>
      <View style={styles.skipButton}>
        <AppLink
          style={styles.skipButtonText}
          title="Skip"
          onPress={() => {
            slidesRef.current?.scrollToIndex({
              index: slidesData.length - 1,
              animated: true,
            });
          }}
        />
      </View>
      <View style={{ flex: 3 }}>
        <FlatList
          data={slidesData}
          renderItem={({ item }) => <OnBoardingItem item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          overScrollMode="never"
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
      <View style={{ flex: 0.5 }}>
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
    backgroundColor: colors.PRIMARY_DARK2,
  },
  skipButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    zIndex: 100,
  },
  skipButtonText: {
    color: colors.PRIMARY_BTN,
    fontSize: 16,
  },
});

export default OnBoarding;
