import { FC } from "react";
import { View, StyleSheet, Text } from "react-native";

interface Props {}

const Upload: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Text>Upload</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Upload;
