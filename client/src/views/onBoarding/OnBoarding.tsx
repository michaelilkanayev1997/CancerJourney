import { FC, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Animated as RNAnimated,
  I18nManager,
} from "react-native";
import Animated, {
  FadeIn,
  ZoomIn,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import slidesData from "@assets/OnBoarding/slidesData";
import OnBoardingItem from "@components/OnBoardingItem";
import colors from "@utils/colors";
import Paginator from "@components/Paginator";
import AppLink from "@ui/AppLink";
import AppButton from "@ui/AppButton";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "src/@types/navigation";

interface Props {}

const OnBoarding: FC<Props> = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const scrollX = useRef(new RNAnimated.Value(0)).current;
  const slidesRef = useRef<FlatList<any>>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const SkipLinkAnim = useAnimatedStyle(() => {
    // Calculate the opacity
    const opacity = withTiming(currentIndex < slidesData.length - 1 ? 1 : 0, {
      duration: 400,
    });

    // Calculate the translation from the right
    const translateX = withTiming(
      currentIndex < slidesData.length - 1 ? 0 : 10,
      { duration: 400 }
    );

    return {
      opacity: opacity,
      transform: [{ translateX: translateX }],
    };
  });

  const NextBtnAnim = useAnimatedStyle(() => {
    // Opacity transition to smoothly fade in/out
    const opacity = withTiming(currentIndex === slidesData.length - 1 ? 1 : 0, {
      duration: 400, // Adjust duration as needed
    });

    // Scale transition for the ZoomIn effect
    const scale = withTiming(currentIndex === slidesData.length - 1 ? 1 : 0, {
      duration: 400,
    });

    return {
      opacity: opacity,
      transform: [{ scale: scale }],
    };
  });

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(400)}>
      <View style={styles.topBar}>
        <Animated.View style={SkipLinkAnim}>
          <AppLink
            style={styles.skipButtonText}
            active={currentIndex < slidesData.length - 1}
            title="Skip"
            onPress={() => {
              slidesRef.current?.scrollToIndex({
                index: slidesData.length - 1,
                animated: true,
              });
            }}
          />
        </Animated.View>
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
          onScroll={RNAnimated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            }
          )}
          contentContainerStyle={[
            { flexDirection: I18nManager.isRTL ? "row" : "row" }, // Fixing RTL Problem
          ]}
          onViewableItemsChanged={viewableItemsChanged}
          ref={slidesRef}
        />
      </View>

      <Animated.View
        style={[
          NextBtnAnim,
          {
            marginBottom: 40,
            width: "80%",
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <AppButton
          title="Next"
          disabled={currentIndex < slidesData.length - 1}
          defaultColor={["#12C7E0", "#0FABCD", "#0E95B7"]}
          pressedColor={["#0DA2BE", "#0FBDD5", "#12C7E0"]}
          onPress={() => {
            navigation.navigate("Welcome");
          }}
        />
      </Animated.View>

      <Animated.View entering={ZoomIn.duration(800)} style={{ flex: 0.5 }}>
        <Paginator
          data={slidesData}
          scrollX={scrollX}
          isRTL={I18nManager.isRTL}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.PRIMARY_DARK2,
  },
  topBar: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 30,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  skipButtonText: {
    color: colors.PRIMARY_BTN,
    fontSize: 16,
  },
});

export default OnBoarding;
