import { FC } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeInUp, withSpring } from "react-native-reanimated";

interface Props {}

const LogoContainer: FC<Props> = (props) => {
  const entering = () => {
    "worklet";
    const animations = {
      //translateY: withTiming(-30, { duration: 600 }),
      translateY: withSpring(-30, {
        mass: 1,
        damping: 7,
        stiffness: 23,
      }),
      // opacity: withTiming(1, { duration: 300 }),
    };
    const initialValues = {
      translateY: 190,
      // opacity: 1,
    };
    return {
      initialValues,
      animations,
    };
  };

  return (
    <>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          alignItems: "center",
          paddingTop: 30,
          width: "100%",
        }}
      >
        <Animated.Image
          entering={entering}
          source={require("@assets/Logo.png")}
          style={{
            resizeMode: "contain",
            width: "80%",
          }}
        />
      </View>
      <View style={{ height: 100, width: 150 }}>
        <Animated.Image
          entering={FadeInUp.delay(1000).duration(1000).springify().damping(3)}
          style={{
            flex: 0.2,
            width: null,
            height: null,
            resizeMode: "contain",
          }}
          source={require("@assets/Welcome!.png")}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default LogoContainer;
