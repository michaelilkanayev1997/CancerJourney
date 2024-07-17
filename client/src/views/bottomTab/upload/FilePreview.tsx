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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQueryClient } from "react-query";
import LottieView from "lottie-react-native";
import { useTranslation } from "react-i18next";

import { UploadStackParamList } from "src/@types/navigation";
import AppButton from "@ui/AppButton";
import CustomPdfViewer from "@components/CustomPdfViewer";
import { ToastNotification } from "@utils/toastConfig";
import { getClient } from "src/api/client";
import catchAsyncError from "src/api/catchError";

interface Props {}

type FilePreviewRouteType = NativeStackScreenProps<
  UploadStackParamList,
  "FilePreview"
>;

const FilePreview: FC<FilePreviewRouteType> = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { fileUri, fileType, folderName } = route.params;
  const scrollViewRef = useRef<ScrollView>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [pdf, setPdf] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const [imageLoading, setImageLoading] = useState(true);

  const toggleModalVisible = useCallback(() => {
    setModalVisible((prevVisible) => !prevVisible);
    Vibration.vibrate(50);
  }, []);

  const handleUpload = async (formData: FormData) => {
    try {
      const client = await getClient({
        "Content-Type": "multipart/form-data;",
      });

      const { data } = await client.post("/file/file-upload", formData);

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (title.length === 0) {
      ToastNotification({
        type: "Info",
        message: t("title-required"),
      });
      return;
    } else if (!fileUri) {
      ToastNotification({
        type: "Info",
        message: t("file-required"),
      });
      return;
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        type: fileType,
        name: folderName,
      } as any);

      // Append the title and description
      formData.append("title", title);
      formData.append("description", description);

      const data = await handleUpload(formData);

      if (!data?.success) {
        throw new Error("Failed to upload file");
      }

      queryClient.invalidateQueries(["folder-files", folderName]);
      queryClient.invalidateQueries(["folders-length"]);

      ToastNotification({
        type: "Success",
        message: t("file-upload-success"),
      });
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
      navigation.goBack(); // navigate back
    }
  };

  useFocusEffect(
    useCallback(() => {
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
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
          <>
            {imageLoading ? (
              <>
                <LottieView
                  source={require("@assets/Animations/ImageLoadingAnimation.json")}
                  autoPlay
                  loop
                  style={{
                    width: 150,
                    height: 250,
                  }}
                />
                <Image
                  source={{ uri: fileUri }}
                  style={styles.preview}
                  resizeMode="contain"
                  onLoad={() => setImageLoading(false)} // Image loaded successfully
                  onError={() => setImageLoading(false)} // Image failed to load
                />
              </>
            ) : (
              <Image
                source={{ uri: fileUri }}
                style={styles.preview}
                resizeMode="contain"
              />
            )}
          </>
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
              {t("open-pdf")}
            </Text>
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder={t("title-placeholder")}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder={t("description-placeholder")}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <AppButton
          title={t("save")}
          busy={isLoading}
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
