import { FC } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { useDispatch } from "react-redux";
import { updateNotification } from "src/store/notification";

interface Props {}

const Home: FC<Props> = (props) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Button
        title="Success"
        onPress={() => {
          dispatch(
            updateNotification({
              message:
                "ttttttttttttttttttttttttttttttttttttttttttttttttttttttt",
              type: "success",
            })
          );
        }}
      />
      <Button
        title="Error"
        onPress={() => {
          dispatch(updateNotification({ message: "Test", type: "error" }));
        }}
      />
      <Button
        title="Info"
        onPress={() => {
          dispatch(updateNotification({ message: "Test", type: "info" }));
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Home;
