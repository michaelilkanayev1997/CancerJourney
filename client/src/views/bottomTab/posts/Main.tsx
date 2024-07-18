import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { useQueryClient } from "react-query";
import { Entypo } from "@expo/vector-icons";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useSelector } from "react-redux";

import Loader from "@ui/Loader";
import { Post } from "src/@types/post";
import {
  fetchPopulalrPosts,
  fetchPosts,
  fetchPostsByReplies,
  fetchProfilePosts,
  useFetchPopulalrPosts,
  useFetchPosts,
  useFetchPostsByReplies,
  useFetchProfilePosts,
} from "src/hooks/query";
import catchAsyncError from "src/api/catchError";
import { ToastNotification } from "@utils/toastConfig";
import PostCard from "@components/PostCard";
import colors from "@utils/colors";
import { DrawerParamList } from "src/@types/navigation";
import { getProfile } from "src/store/auth";

type Props = {
  route: any;
};

let pageNo = 0;
const limit = 6;

const Main = ({ route }: Props) => {
  const { name: routeName } = useRoute();
  const profile = useSelector(getProfile);

  const [params, setParams] = useState(route.params || {});

  useFocusEffect(
    useCallback(() => {
      setParams(route.params);
    }, [route.params])
  );

  const {
    popularPosts = false,
    publicProfile = false,
    cancerType = profile?.cancerType,
    publicUserId = profile?.id,
    postsByReplies = false,
  } = params || {};

  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const queryClient = useQueryClient();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);

  const { data, isFetching, isLoading } =
    publicProfile && !postsByReplies
      ? useFetchProfilePosts(publicUserId)
      : publicProfile && postsByReplies
      ? useFetchPostsByReplies(publicUserId)
      : popularPosts
      ? useFetchPopulalrPosts()
      : useFetchPosts(cancerType);

  // console.log(`[${routeName}] data--->`, data?.length);
  // console.log(`[${routeName}] publicProfile--->`, publicProfile);
  // console.log(`[${routeName}] publicUserId--->`, publicUserId);

  // console.log("route", publicProfile, cancerType);
  // console.log(data?.length);
  // console.log("isFetchingMore", isFetchingMore);
  // console.log("hasMore", hasMore);
  // console.log("pageNo", pageNo);

  useEffect(() => {
    setHasMore(true);
    pageNo = 0;
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false }); // Scrolls to the top of the ScrollView
    }
  }, [cancerType, publicProfile, popularPosts, postsByReplies]);

  const handleOnEndReached = async () => {
    if (!data || isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);
    try {
      pageNo += 1;

      let posts;
      if (publicProfile && !postsByReplies) {
        posts = await fetchProfilePosts(publicUserId, limit, pageNo);
      } else if (publicProfile && postsByReplies) {
        posts = await fetchPostsByReplies(publicUserId, limit, pageNo);
      } else if (popularPosts) {
        posts = await fetchPopulalrPosts(limit, pageNo);
      } else {
        posts = await fetchPosts(cancerType, limit, pageNo);
      }

      // console.log("pageNo", pageNo);
      // console.log("posts", posts);
      if (!posts || !posts.length || posts.length < limit) {
        setHasMore(false);
      }

      const newList = [...data, ...posts];

      if (publicProfile && !postsByReplies) {
        queryClient.setQueryData(["profile-posts", publicUserId], newList);
      } else if (publicProfile && postsByReplies) {
        queryClient.setQueryData(["posts-by-replies", publicUserId], newList);
      } else if (popularPosts) {
        queryClient.setQueryData(["popular-posts"], newList);
      } else {
        queryClient.setQueryData(["posts", cancerType], newList);
      }
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    }
    setIsFetchingMore(false);
  };

  const handleOnRefresh = useCallback(() => {
    pageNo = 0;
    setHasMore(true);

    if (publicProfile && !postsByReplies) {
      queryClient.invalidateQueries(["profile-posts", publicUserId]);
    } else if (publicProfile && postsByReplies) {
      queryClient.invalidateQueries(["posts-by-replies", publicUserId]);
    } else if (popularPosts) {
      queryClient.invalidateQueries(["popular-posts"]);
    } else {
      queryClient.invalidateQueries(["posts", cancerType]);
    }
  }, [
    queryClient,
    publicProfile,
    publicUserId,
    popularPosts,
    cancerType,
    postsByReplies,
  ]);

  const renderPost = useCallback(
    ({ item }: { item: Post }) => (
      <PostCard
        _id={item._id}
        description={item.description}
        image={item.image}
        likes={item.likes}
        replies={item.replies}
        createdAt={item.createdAt}
        forumType={item.forumType}
        owner={item.owner}
        publicProfile={publicProfile}
        publicUserId={publicUserId}
      />
    ),
    [data]
  );

  const renderFooter = () => {
    return isFetchingMore ? (
      <View style={styles.loaderStyle}>
        <Loader loaderStyle={{ marginTop: -20 }} />
      </View>
    ) : null;
  };

  const keyExtractor = useCallback((item: Post) => item._id.toString(), []);

  return (
    <>
      {isLoading ? (
        <View style={styles.loader}>
          <Loader />
        </View>
      ) : (
        <View style={styles.mainContainer}>
          {!publicProfile && (
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  Vibration.vibrate(50);
                  navigation.openDrawer();
                }}
                style={styles.menuButton}
              >
                <Entypo name="menu" size={24} color={colors.ICON} />
                <Text style={styles.menuButtonText}>Type</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>
                {cancerType.charAt(0).toUpperCase() +
                  cancerType.slice(1) +
                  " Cancer"}
              </Text>
            </View>
          )}

          <FlatList
            onEndReachedThreshold={1}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.container]}
            data={data}
            renderItem={renderPost}
            keyExtractor={keyExtractor}
            refreshControl={
              <RefreshControl
                refreshing={!isLoading && isFetching}
                onRefresh={handleOnRefresh}
                colors={[colors.ICON]} // for android
                tintColor={colors.ICON} // for ios/>
                progressViewOffset={-15}
              />
            }
            ListFooterComponent={renderFooter}
            onEndReached={handleOnEndReached}
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No posts available</Text>
              </View>
            }
          />
        </View>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.PRIMARY_LIGHT,
    flex: 1,
  },
  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    backgroundColor: colors.PRIMARY_LIGHT,
    padding: 8,
    paddingBottom: 125,
  },
  sectionTitle: {
    textAlign: "center",
    color: colors.LIGHT_BLUE,
    fontSize: 17,
    fontWeight: "bold",
    paddingRight: 15,
    textDecorationLine: "underline",
    maxWidth: "80%",
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
    paddingTop: 100,
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
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.PRIMARY_LIGHT,
    padding: 8,
    borderRadius: 5,
  },
  menuButtonText: {
    marginLeft: 5,
    color: colors.ICON,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Main;
