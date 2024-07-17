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
import ImageCard from "@components/ImageCard";
import CustomImageZoomViewer from "@components/CustomImageZoomViewer";
import CustomPdfViewer from "@components/CustomPdfViewer";
import { useFetchFolderFiles } from "src/hooks/query";
import NoFilesDisplay from "@ui/NoFilesDisplay";
import Loader from "@ui/Loader";

type FolderDetailsProps = NativeStackScreenProps<
  UploadStackParamList,
  "FolderDetails"
>;

const FolderDetails: FC<FolderDetailsProps> = ({ route, navigation }) => {
  const { folderName, name } = route.params;
  const [numColumns, setNumColumns] = useState<number>(2);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<
    number | undefined
  >(undefined);
  const bottomSheetModalRef = useRef<BottomSheet>(null);

  const {
    data: folderFiles = [], // Default to an empty array if data is undefined
    isLoading,
  } = useFetchFolderFiles(name);

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
            onPress={folderFiles?.length > 2 ? toggleNumColumns : undefined}
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
  }, [navigation, numColumns, folderFiles]);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <Loader />
      </View>
    );
  }

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
            folderName={name}
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
        <NoFilesDisplay />
      )}

      <CustomBottomSheet ref={bottomSheetModalRef} folderName={name} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#FFF",
    paddingBottom: 76,
  },
  imagesContainer: {
    paddingHorizontal: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
});

export default FolderDetails;
