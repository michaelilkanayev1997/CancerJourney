import Post from "@components/Post";
import colors from "@utils/colors";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

export const dummyPosts = [
  {
    _id: "1",
    title: "Understanding Breast Cancer",
    content:
      "Breast cancer is one of the most common cancers in women. Here are some important facts...",
    likes: 10,
    cancerType: "breast",
  },
  {
    _id: "2",
    title: "Living with Lung Cancer",
    content:
      "Lung cancer can be challenging. Here are some tips for managing symptoms...",
    likes: 5,
    cancerType: "general",
  },
  {
    _id: "3",
    title: "Prostate Cancer Awareness",
    content:
      "Prostate cancer is common in men over 50. Early detection is key...",
    likes: 8,
    cancerType: "general",
  },
  {
    _id: "4",
    title: "Diet and Nutrition for Cancer Patients",
    content: "Nutrition plays a vital role in cancer treatment and recovery...",
    likes: 15,
    cancerType: "general",
  },
  {
    _id: "5",
    title: "Diet and Nutrition for Cancer Patients",
    content: "Nutrition plays a vital role in cancer treatment and recovery...",
    likes: 15,
    cancerType: "general",
  },
  {
    _id: "6",
    title: "Diet and Nutrition for Cancer Patients",
    content: "Nutrition plays a vital role in cancer treatment and recovery...",
    likes: 15,
    cancerType: "general",
  },
  {
    _id: "7",
    title: "Diet and Nutrition for Cancer Patients",
    content: "Nutrition plays a vital role in cancer treatment and recovery...",
    likes: 15,
    cancerType: "general",
  },
  {
    _id: "8",
    title: "Diet and Nutrition for Cancer Patients",
    content: "Nutrition plays a vital role in cancer treatment and recovery...",
    likes: 15,
    cancerType: "general",
  },
];

type Props = {};

const Main = () => {
  const [popularPosts, setPopularPosts] = useState([]);

  const renderPost = ({ item }) => (
    <Post
      title={item.title}
      content={item.content}
      likes={item.likes}
      onLike={() => {}}
      onComment={() => {}}
    />
  );

  const renderHeader = () => (
    <>
      <Text style={styles.sectionTitle}>Popular Posts</Text>
    </>
  );

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={dummyPosts}
      renderItem={renderPost}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={renderHeader}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.PRIMARY_LIGHT, //inactive contrast ?
    padding: 16,
    paddingBottom: 90,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.CONTRAST,
    marginVertical: 8,
  },
});

export default Main;
