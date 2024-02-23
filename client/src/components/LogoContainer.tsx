import { useFocusEffect } from "@react-navigation/native";
import { useFadeInUp } from "@utils/animated";
import { FC, useCallback } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { withSpring } from "react-native-reanimated";

interface Props {}

const LogoContainer: FC<Props> = (props) => {
  const entering = () => {
    "worklet";
    return {
      initialValues: {
        translateY: 190, // Initial vertical position
      },
      animations: {
        translateY: withSpring(-30, {
          mass: 1,
          damping: 7,
          stiffness: 23,
        }),
      },
    };
  };

  useFocusEffect(
    useCallback(() => {
      // Reset Animations
      startLogoAnimation();
      startLogo2Animation();
    }, [])
  );

  // Initialization of custom hooks for animations
  const {
    animatedStyle: LogoAnimatedStyle,
    startAnimation: startLogoAnimation,
  } = useFadeInUp(200, 7);

  const {
    animatedStyle: Logo2AnimatedStyle,
    startAnimation: startLogo2Animation,
  } = useFadeInUp(600, 5);

  return (
    <View style={styles.logoContainer}>
      <Animated.Image
        source={require("@assets/Logo.png")}
        style={[styles.logo, LogoAnimatedStyle]}
      />

      <Animated.Image
        source={require("@assets/Welcome!.png")}
        style={[styles.welcome, Logo2AnimatedStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    width: "100%",
  },
  logo: {
    resizeMode: "contain",
    width: "80%",
  },
  welcome: {
    resizeMode: "contain",
    width: "35%",
    marginTop: -70,
  },
});

export default LogoContainer;
