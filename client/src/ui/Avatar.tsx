import colors from "@utils/colors";
import { FC } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import placeholder from "@assets/user_profile.png";

interface Props {}

const Avatar: FC<Props> = ({ uri, onButtonPress }) => {
  return (
    <View style={styles.container}>
      <Image source={uri ? { uri } : placeholder} style={styles.image} />

      <TouchableOpacity style={styles.editButton} onPress={onButtonPress}>
        <MaterialCommunityIcons name="camera-outline" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "relative",
  },
  image: {
    borderRadius: 75,
    width: 150,
    height: 150,
    borderColor: colors.LIGHT_BLUE,
    borderWidth: 5,
  },
  editButton: {
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 24,
    padding: 8,
    position: "absolute",
    right: 5,
    bottom: 5,
  },
});

export default Avatar;
