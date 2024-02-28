import React, { FC, useEffect, useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Vibration,
} from "react-native";
import ImageZoomViewer from "react-native-image-zoom-viewer";
import BottomSheet from "@gorhom/bottom-sheet";

import { UploadStackParamList } from "src/@types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ImageCard from "@components/ImageCard";
import ImageZoomCustomHeader from "@ui/ImageZoomCustomHeader";
import CustomBottomSheet from "@components/CustomBottomSheet";

// Placeholder images for demonstration
const images = [
  {
    id: "1",
    uri: "https://images.template.net/115163/acknowledgement-for-school-project-report-a6i6u.png",
    title: "Image 1 asdas asd asdas dasd asdsa d asdas",
    description:
      "this is my medication for my blood pressare asdasdas dasd asda sdas asd asda sdas das das dasd asd asda sd afwertg retekmerjnghoerog ergfdnbkfdm wrfwjbef skmdvc fbewkfn lrkwgokerh gnsdvf mklsdbhthenklfn",
    date: "2023-01-01",
  },
  {
    id: "2",
    uri: "https://assets-global.website-files.com/5ebb0930dd82631397ddca92/61bb9a7943343e03bb9fcd1b_documents-product-template-software.png",
    title: "Image 2",
    date: "2023-01-02",
  },
  {
    id: "3",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Image 3",
    date: "2023-01-03",
  },
  {
    id: "4",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Image 4",
    date: "2023-01-04",
  },
  {
    id: "5",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Image 5",
    date: "2023-01-05",
  },
  {
    id: "6",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Image 6",
    date: "2023-01-06",
  },
  {
    id: "7",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Image 1",
    date: "2023-01-01",
  },
  {
    id: "8",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Image 2",
    date: "2023-01-02",
  },
  {
    id: "9",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Image 3",
    date: "2023-01-03",
  },
  {
    id: "10",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Image 4",
    date: "2023-01-04",
  },
  {
    id: "11",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Image 5",
    date: "2023-01-05",
  },
  {
    id: "12",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Image 6",
    date: "2023-01-06",
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
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const bottomSheetModalRef = useRef<BottomSheet>(null);

  const handleUploadPress = () => {
    Vibration.vibrate(50);
    bottomSheetModalRef.current?.expand();
  };

  //i have to add loading logic + animation

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <TouchableOpacity
            onPress={handleUploadPress}
            style={{ marginRight: 20 }}
          >
            <MaterialCommunityIcons name="plus" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setNumColumns((currentColumns) => (currentColumns === 2 ? 3 : 2));
              Vibration.vibrate(50);
            }}
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{folderName}</Text>
      <FlatList
        data={images}
        renderItem={({ item, index }) => (
          <ImageCard
            item={item}
            index={index}
            setSelectedImageIndex={setSelectedImageIndex}
            setModalVisible={setModalVisible}
            numColumns={numColumns}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.imagesContainer}
        key={numColumns}
      />
      {selectedImageIndex !== null && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
          hardwareAccelerated={true}
          animationType="fade"
        >
          <ImageZoomViewer
            imageUrls={images.map((img) => ({ url: img.uri }))}
            index={selectedImageIndex}
            onSwipeDown={() => setModalVisible(false)}
            enableSwipeDown={true}
            backgroundColor="white"
            renderHeader={(index) => (
              <ImageZoomCustomHeader
                currentIndex={index || 0}
                setModalVisible={setModalVisible}
                images={images}
              />
            )}
            useNativeDriver={true}
          />
        </Modal>
      )}
      <CustomBottomSheet ref={bottomSheetModalRef} title="So cool much sheet" />
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
  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  imagesContainer: {
    paddingHorizontal: 10,
  },
});

export default FolderDetails;
