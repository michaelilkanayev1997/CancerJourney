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
} from "react-native";
import ImageZoomViewer from "react-native-image-zoom-viewer";

import { UploadStackParamList } from "src/@types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

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

type ImageType = {
  id: string;
  uri: string;
  title: string;
  date: string;
};

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

  // Function to toggle grid layout
  const toggleGridLayout = () => {
    setNumColumns((current) => (current === 2 ? 3 : 2));
  };

  const handleUploadPress = () => {
    // Placeholder for your upload logic
    console.log("Upload functionality to be implemented");
  };

  //i have to add loading logic + animation

  const renderItem = ({ item, index }: { item: ImageType; index: number }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedImageIndex(index);
          setModalVisible(true);
        }}
        activeOpacity={0.7}
        style={styles.cardContainer}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.uri }} style={styles.image} />
          <View style={styles.textContainer}>
            <Text
              style={styles.imageTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
            <Text style={styles.imageDate}>{item.date}</Text>
          </View>
          <TouchableOpacity
            style={styles.moreIcon}
            onPress={() => {
              /* Handle more options */
            }}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={numColumns === 3 ? 24 : 30}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

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
    if (route.params?.toggleLayout) {
      setNumColumns((currentColumns) => (currentColumns === 2 ? 3 : 2));
      // Reset the parameter after handling
      navigation.setParams({ toggleLayout: false });
    }
  }, [route.params?.toggleLayout, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{folderName}</Text>

      <FlatList
        data={images}
        renderItem={renderItem}
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
  cardContainer: {
    flex: 1,
    padding: 8,
    paddingBottom: 20,
    width: "100%",
  },
  imageContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // for Android
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
  },
  textContainer: {
    padding: 8,
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  imageDate: {
    fontSize: 14,
    color: "gray",
  },
  moreIcon: {
    position: "absolute",
    right: 0,
    top: 5,
  },
});

export default FolderDetails;
