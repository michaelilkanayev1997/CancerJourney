import PostCard from "@components/PostCard";
import colors from "@utils/colors";
import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Loader from "@ui/Loader";
import { Post } from "src/@types/post";
import { fetchPosts, useFetchPosts } from "src/hooks/query";
import { useQueryClient } from "react-query";
import catchAsyncError from "src/api/catchError";
import { ToastNotification } from "@utils/toastConfig";

type Props = {};

let pageNo = 0;
const limit = 6;

const Main = () => {
  const { data, isFetching, isLoading } = useFetchPosts();
  const queryClient = useQueryClient();

  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  // console.log(data?.length);
  // console.log("isFetchingMore", isFetchingMore);
  // console.log("hasMore", hasMore);

  const handleOnEndReached = async () => {
    if (isFetchingMore || !hasMore) return;
    if (!data) return;
    setIsFetchingMore(true);
    try {
      pageNo += 1;
      const posts = await fetchPosts(limit, pageNo);
      // console.log("pageNo", pageNo);
      // console.log("posts", posts);
      if (!posts || !posts.length || posts.length < limit) {
        setHasMore(false);
      }

      const newList = [...data, ...posts];
      queryClient.setQueryData(["posts"], newList);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    }
    setIsFetchingMore(false);
  };

  const handleOnRefresh = () => {
    pageNo = 0;
    setHasMore(true);
    queryClient.invalidateQueries(["posts"]);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      description={item.description}
      image={item.image}
      likes={item.likes}
      replies={item.replies}
      createdAt={item.createdAt}
      onLike={() => {}}
      onComment={() => {}}
      owner={item.owner}
    />
  );

  const renderHeader = () => (
    <Text style={styles.sectionTitle}>Popular Posts</Text>
  );

  const renderFooter = () => {
    return isFetchingMore ? (
      <View style={styles.loaderStyle}>
        <Loader loaderStyle={{ marginTop: -20 }} />
      </View>
    ) : null;
  };

  return (
    <>
      {isLoading ? (
        <View style={styles.loader}>
          <Loader />
        </View>
      ) : data?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No posts available</Text>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <Pressable onPress={() => {}}>
              <Image
                style={styles.profileImage}
                source={{
                  uri: "https://lh3.googleusercontent.com/a/ACg8ocLedYC3JvvFb_cuJLfPLpCDFBKnck-pB3DMXDkFRRxUfe-kfAQY=s418-c-no",
                }}
              />
            </Pressable>

            <Pressable style={styles.searchContainer}>
              <AntDesign
                style={styles.searchIcon}
                name="search1"
                size={20}
                color="black"
              />
              <TextInput placeholder="Search" style={styles.searchInput} />
            </Pressable>

            <Pressable
              onPress={() => {
                /* Functionality for search */
              }}
              style={styles.button}
            >
              <Ionicons name="search" size={24} color="white" />
            </Pressable>
          </View>

          <FlatList
            onEndReachedThreshold={1}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.container]}
            data={data}
            renderItem={renderPost}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl
                refreshing={!isLoading && isFetching}
                onRefresh={handleOnRefresh}
                colors={[colors.ICON]} // for android
                tintColor={colors.ICON} // for ios/>
                progressViewOffset={-15}
              />
            }
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            onEndReached={handleOnEndReached}
          />
        </View>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.PRIMARY_LIGHT,
  },
  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.LIGHT_GREEN,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 7,
    gap: 10,
    backgroundColor: "white",
    borderRadius: 3,
    height: 30,
    flex: 1,
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
  },
  container: {
    backgroundColor: colors.PRIMARY_LIGHT, //inactive contrast ?
    padding: 8,
    paddingBottom: 125,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.CONTRAST,
    marginVertical: 4,
  },
  loaderStyle: {
    marginVertical: 0,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: colors.CONTRAST,
  },
  loader: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
  button: {
    backgroundColor: colors.LIGHT_GRAY,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Main;
