import { FC } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { UploadStackParamList } from "src/@types/navigation";
import colors from "@utils/colors";
import { FoldersLength } from "src/@types/file";

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
  folderLength?: FoldersLength;
}

export const Folder: FC<Props> = ({ folderLength, name, icon }) => {
  const navigation = useNavigation<NavigationProp<UploadStackParamList>>();

  return (
    <TouchableOpacity
      style={styles.folder}
      onPress={() => navigation.navigate("FolderDetails", { folderName: name })}
    >
      <MaterialCommunityIcons name={icon} size={50} color={colors.LIGHT_BLUE} />
      <Text style={styles.folderText}>{name}</Text>
      <View style={styles.fileInfoContainer}>
        <MaterialCommunityIcons name="file-outline" size={16} color="#003366" />
        <Text style={styles.fileInfoText}>
          {folderLength ? `${folderLength[name]} Files` : `0 Files`}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const FolderList: FC<Props> = ({ folderLength, name, icon }) => {
  const navigation = useNavigation<NavigationProp<UploadStackParamList>>();

  return (
    <TouchableOpacity
      style={styles.folderList}
      onPress={() => navigation.navigate("FolderDetails", { folderName: name })}
    >
      <MaterialCommunityIcons name={icon} size={30} color="#003366" />
      <View style={styles.centerContainer}>
        <Text style={styles.folderListText}>{name}</Text>
      </View>
      <Text style={styles.fileInfoText}>
        {folderLength ? `${folderLength[name]} Files` : `0 Files`}
      </Text>
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
    color: "#003366",
  },
  folderList: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.LIGHT_GREEN,
    borderRadius: 10,
    margin: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
  },
  folderListText: {
    fontWeight: "bold",
    color: "#003366",
    fontSize: 16,
  },
  fileCountText: {
    marginLeft: 20,
    color: "#003366",
    fontSize: 14,
  },
  fileInfoContainer: {
    flexDirection: "row",
    marginTop: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  fileInfoText: {
    marginLeft: 5,
    color: "#003366",
    fontSize: 12,
  },
});
