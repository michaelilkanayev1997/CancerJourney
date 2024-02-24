import { FC } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { UploadStackParamList } from "src/@types/navigation";
import colors from "@utils/colors";

export type IconName =
  | "blood-bag"
  | "hospital-box"
  | "pill"
  | "file-image"
  | "calendar-clock"
  | "file-document-edit-outline"
  | "upload-outline";

interface Props {
  name: string;
  icon: IconName;
}

const Folder: FC<Props> = ({ name, icon }) => {
  const navigation = useNavigation<NavigationProp<UploadStackParamList>>();

  return (
    <TouchableOpacity
      style={styles.folder}
      onPress={() => navigation.navigate("FolderDetails", { folderName: name })}
    >
      <MaterialCommunityIcons name={icon} size={50} color={colors.LIGHT_BLUE} />
      <Text style={styles.folderText}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  folder: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 150,
    backgroundColor: colors.LIGHT_GREEN,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  folderText: {
    marginTop: 8,
    fontWeight: "bold",
  },
});

export default Folder;
