import LottieAnimation from "@components/LottieAnimation";
import { FC } from "react";
import { View, StyleSheet } from "react-native";

interface Props {}

const AnimatedSplashScreen: FC<Props> = ({ onAnimationFinish }) => {
  return (
    <View style={styles.container}>
      <LottieAnimation onAnimationFinish={onAnimationFinish} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default AnimatedSplashScreen;
