import { FC } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import LottieView from "lottie-react-native";

interface Props {
  blackLoading?: boolean;
  loaderStyle?: StyleProp<ViewStyle>;
}

const Loader: FC<Props> = ({ blackLoading = false, loaderStyle }) => {
  return (
    <View style={styles.container}>
      <LottieView
        style={[{ width: 125, height: 125 }, loaderStyle]}
        key="animation"
        autoPlay
        loop
        resizeMode="contain"
        source={
          blackLoading
            ? require("../assets/Loading.json")
            : require("../assets/Loading.json")
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Loader;
