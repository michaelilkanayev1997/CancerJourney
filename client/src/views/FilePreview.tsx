import { FC, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import * as Linking from "expo-linking";
import { useRoute, useNavigation } from "@react-navigation/native";

interface Props {}

const FilePreview: FC<Props> = (props) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { fileUri, fileType } = route.params;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    // Process the title, description, and fileUri as needed
    console.log({ title, description, fileUri });
    navigation.goBack(); // Or navigate elsewhere
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {fileType.includes("image/") && (
        <Image
          source={{ uri: fileUri }}
          style={styles.preview}
          resizeMode="contain"
        />
      )}
      {fileType.includes("application/pdf") && (
        <Text style={styles.link} onPress={() => Linking.openURL(fileUri)}>
          Open PDF
        </Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Save" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  preview: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  link: {
    color: "blue",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
});

export default FilePreview;
