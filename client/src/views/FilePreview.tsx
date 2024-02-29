import { FC, useCallback, useRef, useState } from "react";
import {
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Keyboard,
} from "react-native";
import * as Linking from "expo-linking";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { UploadStackParamList } from "src/@types/navigation";
import AppButton from "@ui/AppButton";
import { insertFile } from "@utils/localDatabase";

interface Props {}

type FilePreviewRouteType = NativeStackScreenProps<
  UploadStackParamList,
  "FilePreview"
>;

const FilePreview: FC<FilePreviewRouteType> = ({ route }) => {
  const navigation = useNavigation();
  const { fileUri, fileType } = route.params;
  const scrollViewRef = useRef<ScrollView>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = async () => {
    const result = await insertFile({ title, fileUri });
    console.log(result);
    //navigation.goBack(); // Or navigate elsewhere
  };

  useFocusEffect(
    useCallback(() => {
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        console.log("Keyboard hidden");
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
        }
      });

      return () => {
        // Cleanup
        hideSubscription.remove();
      };
    }, [])
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      overScrollMode="never"
    >
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
        placeholder="Title*"
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

      <AppButton
        title="Save"
        pressedColor={["#4285F4", "#3578E5", "#2A6ACF"]}
        defaultColor={["#4A90E2", "#4285F4", "#5B9EF4"]}
        onPress={handleSave}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  preview: {
    width: 250,
    height: 250,
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
    marginBottom: 15,
  },
});

export default FilePreview;
