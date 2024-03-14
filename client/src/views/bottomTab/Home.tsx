import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FC, useCallback } from "react";
import { View, StyleSheet, Text, Button } from "react-native";

import { ToastNotification } from "@utils/toastConfig";
import colors from "@utils/colors";

interface Props {}

const Home: FC<Props> = (props) => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Enable the drawer gesture and header when HomeScreen is focused
      const parent = navigation.getParent();
      //parent?.setOptions({ swipeEnabled: true, headerShown: true });

      return () => {
        // Disable the drawer gesture and header when HomeScreen is not focused
        parent?.setOptions({ swipeEnabled: false, headerShown: false });
      };
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.LIGHT_BLUE,
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default Home;
