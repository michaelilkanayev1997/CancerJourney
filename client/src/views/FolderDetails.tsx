import React, { FC, useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Vibration,
} from "react-native";
import ImageZoomViewer from "react-native-image-zoom-viewer";

import { UploadStackParamList } from "src/@types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import ImageCard from "@components/ImageCard";

// Placeholder images for demonstration
const images = [
  {
    id: "1",
    uri: "https://images.template.net/115163/acknowledgement-for-school-project-report-a6i6u.png",
    title: "Image 1 asdas asd asdas dasd asdsa d asdas",
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

  const handleUploadPress = () => {
    // Placeholder for your upload logic
    console.log("Upload functionality to be implemented");
  };

  //i have to add loading logic + animation

  // Custom Header
  const renderHeader = (currentIndex: number = 0) => (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.arrowLeftContainer}
        onPress={() => setModalVisible(false)}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerText} numberOfLines={1} ellipsizeMode="tail">
        {images[currentIndex].title.substring(0, 16)} -{" "}
        {images[currentIndex].date}
      </Text>
      <View style={styles.placeholderView}></View>
    </View>
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          <TouchableOpacity
            onPress={() => {
              console.log("lol");
              Vibration.vibrate(50);
            }}
            style={{ marginRight: 20 }}
          >
            <MaterialCommunityIcons
              name="upload-outline"
              size={24}
              color="black"
            />
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
            renderHeader={(index) => renderHeader(index)}
            useNativeDriver={true}
          />
        </Modal>
      )}
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
  headerContainer: {
    padding: 28,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  headerText: {
    color: "black",
    fontSize: 18,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  arrowLeftContainer: {
    position: "absolute",
    left: 6,
    zIndex: 1,
  },
  arrowText: {
    fontSize: 18,
    color: "black",
  },
  placeholderView: {
    position: "absolute",
    right: 0,
    width: 50,
    height: "100%",
  },
});

export default FolderDetails;
