import { FC } from "react";
import { View, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

interface Props {}

const PreloadIcons: FC<Props> = (props) => {
  // List of icons to preload
  const iconsToPreload = [
    "blood-bag",
    "hospital-box",
    "pill",
    "file-image",
    "calendar-clock",
    "file-document-edit-outline",
    "plus",
    "view-grid-outline",
    "view-list-outline",
    "file-outline",
    "grid",
    "delete",
    "update",
    "close",
    "arrow-left",
    "dots-vertical",
  ];

  return (
    <View style={styles.container}>
      {iconsToPreload.map((iconName) => (
        <MaterialCommunityIcons
          key={iconName}
          name={iconName as any}
          size={1}
          color="transparent"
        />
      ))}
      <MaterialIcons name="add" size={1} color="transparent" />
      <Ionicons name="cloud-upload" size={1} color="transparent" />
      <Ionicons name="calendar" size={1} color="transparent" />
      <Ionicons name="medkit" size={1} color="transparent" />
      <Ionicons name="people" size={1} color="transparent" />
      <Ionicons name="chatbox" size={1} color="transparent" />
      <Ionicons name="settings" size={1} color="transparent" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: 0, height: 0, overflow: "hidden" },
});

export default PreloadIcons;
