import { FC } from "react";
import { View, StyleSheet, Text } from "react-native";

interface Props {}

const Test: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Text>Hello !!!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Test;
