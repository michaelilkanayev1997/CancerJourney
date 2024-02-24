import React, { FC, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

// Placeholder images for demonstration
const images = [
  {
    id: "1",
    uri: "https://via.placeholder.com/150",
    title: "Image 1",
    date: "2023-01-01",
  },
  {
    id: "2",
    uri: "https://via.placeholder.com/150",
    title: "Image 2",
    date: "2023-01-02",
  },
  {
    id: "3",
    uri: "https://via.placeholder.com/150",
    title: "Image 3",
    date: "2023-01-03",
  },
  {
    id: "4",
    uri: "https://via.placeholder.com/150",
    title: "Image 4",
    date: "2023-01-04",
  },
  {
    id: "5",
    uri: "https://via.placeholder.com/150",
    title: "Image 5",
    date: "2023-01-05",
  },
  {
    id: "6",
    uri: "https://via.placeholder.com/150",
    title: "Image 6",
    date: "2023-01-06",
  },
];

interface Props {
  route: {
    params: {
      folderName: string;
    };
  };
}

const renderItem = ({ item }) => (
  <View style={styles.imageContainer}>
    <Image source={{ uri: item.uri }} style={styles.image} />
    <Text style={styles.imageTitle}>{item.title}</Text>
    <Text style={styles.imageDate}>{item.date}</Text>
  </View>
);

const FolderDetails: FC<Props> = ({ route }) => {
  const { folderName } = route.params;
  const [numColumns, setNumColumns] = useState(2); // Default to 2 columns
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Function to toggle grid layout
  const toggleGridLayout = () => {
    setNumColumns((current) => (current === 2 ? 3 : 2));
  };

  const handleUploadPress = () => {
    // Placeholder for your upload logic
    console.log("Upload functionality to be implemented");
  };

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{folderName}</Text>
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={toggleGridLayout}>
          <Text style={styles.actionText}>Change Layout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleUploadPress}>
          <Text style={styles.actionText}>Upload</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.imagesContainer}
        key={numColumns}
      />
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
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  actionText: {
    fontSize: 18,
    color: "#007BFF",
    fontWeight: "500",
  },
  imagesContainer: {
    paddingHorizontal: 10,
  },
  imageContainer: {
    flex: 1,
    margin: 10,
    alignItems: "center",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    marginBottom: 5,
  },
  imageTitle: {
    fontWeight: "bold",
  },
  imageDate: {
    color: "grey",
  },
});

export default FolderDetails;
