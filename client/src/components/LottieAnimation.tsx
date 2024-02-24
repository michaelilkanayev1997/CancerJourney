import { FC } from "react";
import { StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import colors from "@utils/colors";
import Animated, { withTiming } from "react-native-reanimated";

interface Props {
  onAnimationFinish?: (isCancelled: boolean) => void;
}

const LottieAnimation: FC<Props> = ({ onAnimationFinish }) => {
  const exiting = () => {
    "worklet";
    const animations = {
      opacity: withTiming(0, { duration: 400 }),
    };
    const initialValues = {
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
        source={require("@assets/Animations/LogoAnimation.json")}
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
    backgroundColor: colors.PRIMARY_DARK2,
  },
});

export default LottieAnimation;
