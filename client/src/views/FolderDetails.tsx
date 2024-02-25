import colors from "@utils/colors";
import React, { FC, useState } from "react";
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

// Placeholder images for demonstration
const images = [
  {
    id: "1",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
    title: "Image 1",
    date: "2023-01-01",
  },
  {
    id: "2",
    uri: "https://signaturely.com/wp-content/uploads/2022/08/non-disclosure-agreement-uplead.jpg",
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
];

interface Props {
  route: {
    params: {
      folderName: string;
    };
  };
}

const FolderDetails: FC<Props> = ({ route }) => {
  const { folderName } = route.params;
  const [numColumns, setNumColumns] = useState(2); // Default to 2 columns
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Function to toggle grid layout
  const toggleGridLayout = () => {
    setNumColumns((current) => (current === 2 ? 3 : 2));
  };

  const handleUploadPress = () => {
    // Placeholder for your upload logic
    console.log("Upload functionality to be implemented");
  };

  //i have to add loading logic + animation

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedImageIndex(index);
          setModalVisible(true);
        }}
        style={{
          width: `${100 / numColumns}%`, // Calculate width dynamically based on numColumns
          alignItems: "center", // Center content
        }}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.uri }} style={styles.image} />
          <Text style={styles.imageTitle}>{item.title}</Text>
          <Text style={styles.imageDate}>{item.date}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  // Custom Header
  const renderHeader = (currentIndex) => (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.arrowLeftContainer}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.arrowText}>{"< Back"}</Text>
      </TouchableOpacity>
      <Text style={styles.headerText}>
        {images[currentIndex].title} - {images[currentIndex].date}
      </Text>
      {/* Placeholder view to balance the header and make the text truly centered */}
      <View style={styles.placeholderView}></View>
    </View>
  );

  // Custom Footer
  const renderFooter = (currentIndex) => (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>
        {images[currentIndex].title} - {images[currentIndex].date}
      </Text>
    </View>
  );

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
      {selectedImageIndex !== null && (
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
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
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              // Logic to delete the image goes here
              console.log("Delete Image:", images[selectedImageIndex].id);
              setModalVisible(false);
            }}
          >
            <Text style={styles.deleteButtonText}>Delete Image</Text>
          </TouchableOpacity>
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
  deleteButton: {
    position: "absolute",
    bottom: 50,
    left: "50%",
    marginLeft: -50, // Adjust based on the button's width to center it
    backgroundColor: "red",
    padding: 10,
    borderRadius: 20,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  headerContainer: {
    padding: 28,
    backgroundColor: "gray",
    flexDirection: "row",
    justifyContent: "center", // Ensure the children are centered
    alignItems: "center", // Vertically center the content
    position: "relative", // Required for absolute positioning of children
  },
  headerText: {
    color: "black",
    fontSize: 18,
    position: "absolute", // Position the text absolutely to ensure it's centered
    left: 0,
    right: 0,
    textAlign: "center", // Ensure the text itself is centered within its space
  },
  arrowLeftContainer: {
    position: "absolute", // Position the arrow absolutely
    left: 6, // Align it to the left
    zIndex: 1, // Ensure it's above the centered text
  },
  arrowText: {
    fontSize: 18,
    color: "black",
  },
  placeholderView: {
    position: "absolute",
    right: 0, // Align it to the right to balance the arrow on the left
    width: 50, // The approximate width of the arrow container
    height: "100%",
  },
});

export default FolderDetails;
