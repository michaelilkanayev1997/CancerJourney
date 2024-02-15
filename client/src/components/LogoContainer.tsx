import { FC } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeInUp, withSpring } from "react-native-reanimated";

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

  return (
    <View style={styles.logoContainer}>
      <Animated.Image
        entering={entering}
        source={require("@assets/Logo.png")}
        style={styles.logo}
      />

      <Animated.Image
        entering={FadeInUp.delay(1000).duration(1000).springify().damping(3)}
        source={require("@assets/Welcome!.png")}
        style={styles.welcome}
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
