import React, { FC } from "react";
import { View, StyleSheet, FlatList } from "react-native";

import Folder, { IconName } from "@ui/Folder";

const folders: Array<{ name: string; icon: IconName; key: string }> = [
  { name: "Blood Tests", icon: "blood-bag", key: "1" },
  { name: "Treatments", icon: "hospital-box", key: "2" },
  { name: "Medications", icon: "pill", key: "3" },
  { name: "Reports", icon: "file-document-edit-outline", key: "4" },
  { name: "Scans", icon: "file-image", key: "5" },
  { name: "Appointments", icon: "calendar-clock", key: "6" },
  { name: "Other", icon: "upload-outline", key: "7" },
];

interface Props {}

const Upload: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={folders}
        renderItem={({ item }) => <Folder name={item.name} icon={item.icon} />}
        keyExtractor={(item) => item.key}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F5FCFF",
    paddingBottom: 80,
  },
});

export default Upload;
