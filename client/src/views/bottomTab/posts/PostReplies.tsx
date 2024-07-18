import { FC, useCallback, useEffect, useState } from "react";
import PostCard from "@components/PostCard";
import ReplyCard from "@components/ReplyCard";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  RefreshControl,
} from "react-native";
import { useQueryClient } from "react-query";

import colors from "@utils/colors";
import { generateObjectId } from "@utils/helper";
import { Reply } from "src/@types/post";
import { UserProfile } from "src/store/auth";

interface Props {}

const PostReplies: FC<Props> = ({ route }) => {
  const {
    _id,
    description,
    image,
    owner,
    createdAt,
    forumType,
    replies: initialReplies,
    publicProfile,
    publicUserId,
  } = route.params || {};

  const [replies, setReplies] = useState<Reply[]>(initialReplies);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();
  const navigation = useNavigation();

  // Update state when initialReplies change
  useEffect(() => {
    setReplies(initialReplies);
  }, [initialReplies]);

  const handleFavoriteReply = (reply: Reply, profile: UserProfile | null) => {
    setReplies((prevReplies) =>
      prevReplies.map((r) =>
        r._id === reply._id
          ? {
              ...r,
              likes: r.likes.some((like) => like.userId._id === profile?.id)
                ? r.likes.filter((like) => like.userId._id !== profile?.id)
                : [
                    ...r.likes,
                    {
                      _id: generateObjectId(),
                      userId: {
                        _id: profile.id,
                        avatar: {
                          url: profile?.avatar || "",
                          publicId: "",
                        },
                        name: profile?.name,
                        userType: profile?.userType,
                      },
                      createdAt: new Date().toISOString(),
                    },
                  ],
            }
          : r
      )
    );
  };

  const renderReply = useCallback(
    ({ item }: { item: Reply }) => (
      <ReplyCard
        reply={item}
        post={{ _id: _id, forumType: forumType }}
        onDeleteReply={(replyId: string) => {
          setReplies((prevReplies) =>
            prevReplies.filter((reply) => reply._id !== replyId)
          );
        }}
        onFavoriteReply={handleFavoriteReply}
        publicProfile={publicProfile}
        publicUserId={publicUserId}
      />
    ),
    [replies]
  );

  const keyExtractor = useCallback((item: Reply) => item._id.toString(), []);

  const handleOnRefresh = useCallback(() => {
    setIsLoading(true);

    if (publicProfile) {
      queryClient.invalidateQueries(["profile-posts", publicUserId]);
    } else {
      queryClient.invalidateQueries(["posts", forumType]);
    }

    setIsLoading(false);
  }, [queryClient, forumType, publicUserId]);

  const renderAddReplyButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("PostReplyAdd", {
            _id,
            description,
            image,
            owner,
            createdAt,
            forumType,
            publicProfile,
            publicUserId,
            replies,
          });
        }}
      >
        <Text style={styles.linkText}>Add Reply</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/2223/2223615.png",
            }}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Replies</Text>
      </View>

      <PostCard
        _id={_id}
        description={description}
        image={image}
        owner={owner}
        createdAt={createdAt}
        forumType={forumType}
        publicProfile={false}
        publicUserId={""}
      />

      <FlatList
        onEndReachedThreshold={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.flatListContainer]}
        data={replies}
        renderItem={renderReply}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleOnRefresh}
            colors={[colors.ICON]} // for android
            tintColor={colors.ICON} // for ios/>
            progressViewOffset={-15}
          />
        }
        ListFooterComponent={renderAddReplyButton}
        // onEndReached={handleOnEndReached}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No replies available</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.PRIMARY_LIGHT,
    borderRadius: 8,
  },
  flatListContainer: {
    backgroundColor: colors.PRIMARY_LIGHT,
    padding: 0,
    paddingBottom: 90,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: "15%",
  },
  header: {
    padding: 12,
    paddingTop: 0,
    paddingLeft: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    height: 25,
    width: 25,
  },
  headerTitle: {
    paddingLeft: 12,
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Ensure loader is above the overlay
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8, // Match Button's borderRadius
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 100,
    paddingBottom: "25%",
  },
  emptyText: {
    fontSize: 18,
    color: colors.CONTRAST,
  },
  linkText: {
    color: colors.LIGHT_BLUE,
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default PostReplies;
