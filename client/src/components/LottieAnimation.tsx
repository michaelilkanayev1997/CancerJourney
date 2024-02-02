import { FC, useRef } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

interface Props {}

const LottieAnimation: FC<Props> = (props) => {
  const animation = useRef<LottieView>(null);

  return (
    <View style={styles.animationContainer}>
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: "80%",
          height: "100%",
        }}
        source={require("@assets/LogoAnimation.json")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

export default LottieAnimation;
