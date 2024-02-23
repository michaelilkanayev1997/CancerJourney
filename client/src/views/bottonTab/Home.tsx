import { ToastNotification } from "@utils/toastConfig";
import { FC } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

interface Props {}

const Home: FC<Props> = (props) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Button
        title="Success"
        onPress={() => {
          ToastNotification({ message: "asdasdasdasd asdasa asdas asd as" });
        }}
      />
      <Button
        title="Error"
        onPress={() => {
          ToastNotification({
            type: "Error",
            message: "asdasdasdasd asdasa asdas asd as",
          });
        }}
      />
      <Button
        title="Info"
        onPress={() => {
          ToastNotification({
            type: "Info",
            message: "asdasdasdasd asdasa asdas asd as",
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Home;
