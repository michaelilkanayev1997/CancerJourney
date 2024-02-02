import { FC } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import colors from "@utils/colors";
import Animated, {
  FadeIn,
  FadeOut,
  FadeOutUp,
  SlideOutUp,
  ZoomOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Props {
  onAnimationFinish?: (isCancelled: boolean) => void;
}

const LottieAnimation: FC<Props> = ({ onAnimationFinish }) => {
  const exiting = () => {
    "worklet";
    const animations = {
      translateY: withTiming(-200, { duration: 1000 }),
      //opacity: withTiming(0, { duration: 3000 }),
    };
    const initialValues = {
      translateY: 0,
      opacity: 1,
    };
    return {
      initialValues,
      animations,
    };
  };

  return (
    <Animated.View style={styles.animationContainer} exiting={exiting}>
      <LottieView
        autoPlay
        onAnimationFinish={onAnimationFinish}
        loop={false}
        style={{
          width: "100%",
          height: "100%",
        }}
        source={require("@assets/LogoAnimation.json")}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.PRIMARY,
  },
});

export default LottieAnimation;
