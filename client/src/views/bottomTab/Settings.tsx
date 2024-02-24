import { FC } from "react";
import { View, StyleSheet, Text } from "react-native";

interface Props {}

const Settings: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Settings;
