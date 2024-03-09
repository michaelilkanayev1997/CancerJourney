import { FC, useCallback, useRef, useState } from "react";
import {
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  Keyboard,
  Vibration,
} from "react-native";
import * as Linking from "expo-linking";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { UploadStackParamList } from "src/@types/navigation";
import AppButton from "@ui/AppButton";
import CustomPdfViewer from "@components/CustomPdfViewer";

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
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [pdf, setPdf] = useState("");

  const toggleModalVisible = useCallback(() => {
    setModalVisible((prevVisible) => !prevVisible);
    Vibration.vibrate(50);
  }, []);

  const handleSave = async () => {
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
    <>
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
          <>
            <Image
              source={{
                uri: "https://blog.idrsolutions.com/app/uploads/2020/10/pdf-1.png",
              }}
              style={styles.pdfPreview}
              resizeMode="contain"
            />
            <Text
              style={styles.link}
              onPress={() => {
                setPdf(fileUri);
                toggleModalVisible();
              }}
            >
              Open PDF
            </Text>
          </>
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
      {modalVisible && (
        <CustomPdfViewer
          modalVisible={modalVisible}
          toggleModalVisible={toggleModalVisible}
          item={{ pdf_file: pdf, title: "Pdf File" }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  pdfPreview: {
    width: 250,
    height: 150,
    marginBottom: 20,
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
