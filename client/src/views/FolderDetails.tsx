import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Vibration,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { UploadStackParamList } from "src/@types/navigation";
import CustomBottomSheet from "@components/CustomBottomSheet";
import ImageCard, { ImageType } from "@components/ImageCard";
import CustomImageZoomViewer from "@components/CustomImageZoomViewer";
import CustomPdfViewer from "@components/CustomPdfViewer";
import { getClient } from "src/api/client";
import catchAsyncError from "src/api/catchError";
import { ToastNotification } from "@utils/toastConfig";

// Placeholder images for demonstration
const images = [
  {
    id: "1",
    uri: "https://images.template.net/115163/acknowledgement-for-school-project-report-a6i6u.png",
    title: "Doctor Avi Appointment",
    description:
      "this is my medication for my blood pressare asdasdas dasd asda sdas asd asda sdas das das dasd asd asda sd afwertg retekmerjnghoerog ergfdnbkfdm wrfwjbef skmdvc fbewkfn lrkwgokerh gnsdvf mklsdbhthenklfn",
    date: "2023-01-01",
    type: "image/png",
  },
  {
    id: "2",
    uri: "https://assets-global.website-files.com/5ebb0930dd82631397ddca92/61bb9a7943343e03bb9fcd1b_documents-product-template-software.png",
    title: "Radiation Therapy Appointment",
    date: "2023-01-02",
    type: "image/png",
  },
  {
    id: "3",
    uri: "https://blog.idrsolutions.com/app/uploads/2020/10/pdf-1.png",
    pdf_file: "http://samples.leanpub.com/thereactnativebook-sample.pdf",
    title: "Chemotherapy Session",
    date: "2023-01-03",
    type: "application/pdf",
  },
  {
    id: "4",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Follow-up with Oncologist",
    date: "2023-01-04",
    type: "image/jpg",
  },
  {
    id: "5",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Targeted Therapy Meeting",
    date: "2023-01-05",
    type: "image/jpg",
  },
  {
    id: "6",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Tumor Board Review Meeting",
    date: "2023-01-06",
    type: "image/jpg",
  },
  {
    id: "7",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Pain Management Consultation",
    date: "2023-01-01",
    type: "image/jpg",
  },
  {
    id: "8",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Lung Cancer Assessment",
    date: "2023-01-02",
    type: "image/jpg",
  },
  {
    id: "9",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Pain Management Consultation",
    date: "2023-01-03",
    type: "image/jpg",
  },
  {
    id: "10",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Image 4",
    date: "2023-01-04",
    type: "image/jpg",
  },
  {
    id: "11",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Image 5",
    date: "2023-01-05",
    type: "image/jpg",
  },
  {
    id: "12",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Image 6",
    date: "2023-01-06",
    type: "image/jpg",
  },
];

type FolderDetailsProps = NativeStackScreenProps<
  UploadStackParamList,
  "FolderDetails"
>;

const FolderDetails: FC<FolderDetailsProps> = ({ route, navigation }) => {
  const { folderName } = route.params;
  const [numColumns, setNumColumns] = useState<number>(2);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<
    number | undefined
  >(undefined);
  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const [folderFiles, setFolderFiles] = useState<ImageType[]>([]);

  const toggleModalVisible = useCallback(() => {
    setModalVisible((prevVisible) => !prevVisible);
    Vibration.vibrate(50);
  }, []);

  const handleUploadPress = useCallback(() => {
    Vibration.vibrate(50);
    bottomSheetModalRef.current?.expand();
  }, []);

  const toggleNumColumns = useCallback(() => {
    setNumColumns((currentColumns) => (currentColumns === 2 ? 3 : 2));
    Vibration.vibrate(50);
  }, []);

  //i have to add loading logic + animation

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ marginLeft: -25 }}>
          <Text style={{ fontSize: 20 }}>{folderName}</Text>
        </View>
      ),
      headerRight: () => (
        <>
          <TouchableOpacity
            onPress={handleUploadPress}
            style={{ marginRight: 20 }}
          >
            <MaterialCommunityIcons name="plus" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleNumColumns}
            style={{ marginRight: 10 }}
          >
            <MaterialCommunityIcons
              name={numColumns === 2 ? "view-grid-outline" : "grid"}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </>
      ),
    });
  }, [navigation, numColumns]);

  const fetchNewSignedUrl = async () => {
    // Fetch the new signed URL

    try {
      const client = await getClient();

      const { data } = await client.get(`/file/${folderName}`);

      console.log(data);
      setFolderFiles(data);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    }
  };

  useEffect(() => {
    // Define a function to initiate the fetching process
    const initiateFetch = () => {
      fetchNewSignedUrl();

      // Set the interval to refresh the signed URL every 59 minutes
      const intervalId = setInterval(fetchNewSignedUrl, 3540000); // 3540000 milliseconds = 59 minutes

      // Return a cleanup function that clears the interval
      return () => clearInterval(intervalId);
    };

    // Call the function to start fetching
    const cleanup = initiateFetch();

    // Return the cleanup function to be called on component unmount
    return cleanup;
  }, [folderName]); // Only re-run the effect if folderName changes

  return (
    <View style={styles.container}>
      <FlatList
        removeClippedSubviews={false} // Fixing InputText Bug
        data={folderFiles}
        renderItem={({ item, index }) => (
          <ImageCard
            item={item}
            index={index}
            setSelectedImageIndex={setSelectedImageIndex}
            setModalVisible={toggleModalVisible}
            numColumns={numColumns}
            folderName={folderName}
          />
        )}
        keyExtractor={(item) => item._id}
        numColumns={numColumns}
        contentContainerStyle={styles.imagesContainer}
        key={numColumns}
      />

      {folderFiles.length > 0 ? (
        folderFiles[selectedImageIndex || 0]?.type === "image" ? (
          <CustomImageZoomViewer
            modalVisible={modalVisible}
            toggleModalVisible={toggleModalVisible}
            selectedImageIndex={selectedImageIndex}
            images={folderFiles}
          />
        ) : (
          <CustomPdfViewer
            modalVisible={modalVisible}
            toggleModalVisible={toggleModalVisible}
            item={folderFiles[selectedImageIndex || 0]}
          />
        )
      ) : (
        // Fallback content if folderFiles is empty
        <Text>No files to display</Text>
      )}

      <CustomBottomSheet ref={bottomSheetModalRef} folderName={folderName} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#FFF",
    paddingBottom: 80,
  },
  imagesContainer: {
    paddingHorizontal: 10,
  },
});

export default FolderDetails;
