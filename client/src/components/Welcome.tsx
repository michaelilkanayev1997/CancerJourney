import { FC } from "react";
import { View, StyleSheet } from "react-native";

interface Props {}

const Welcome: FC<Props> = (props) => {
  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {},
});

export default Welcome;
