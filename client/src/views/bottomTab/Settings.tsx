import { FC } from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {}

const Settings: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Text>Settings 🎉</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Settings;
