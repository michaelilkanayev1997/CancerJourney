import React, { FC, memo, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  LayoutChangeEvent,
  Vibration,
  Alert,
  Dimensions,
} from "react-native";

import colors from "../utils/colors";
import { calculateTimeDifference } from "@utils/helper";
import { Like, Reply, User } from "src/@types/post";
import { getAuthState } from "src/store/auth";
import { useSelector } from "react-redux";
import { usePostMutations } from "src/hooks/mutations";
import PopupMenu from "./PopupMenu";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ForumStackParamList } from "src/@types/navigation";
import { faker } from "@faker-js/faker";

interface PostProps {
  _id: string;
  description: string;
  image: {
    public_id: string;
    url: string;
  };
  likes: Like[];
  owner: User;
  createdAt: string;
  replies: Reply[];
  onLike: () => void;
  onComment: () => void;
}
const DATA = [...Array(10).keys()].map((_, i) => {
  const userId = i;
  const userType = faker.helpers.arrayElement([
    "patient",
    "family",
    "friend",
    "professional",
    "caregiver",
    "other",
  ]);
  const avatarGender = faker.helpers.arrayElement(["men", "women"]);
  const avatarIndex = faker.number.int({ min: 1, max: 50 });

  return {
    _id: i.toString(),
    userId: {
      _id: userId,
      name: faker.person.fullName(),
      avatar: {
        url: `https://randomuser.me/api/portraits/thumb/${avatarGender}/${avatarIndex}.jpg`,
        publicId: `avatar_${userId}`,
      },
      userType: userType,
    },
    createdAt: faker.date.past().toISOString(),
  };
});
const PostCard: FC<PostProps> = memo(
  ({
    _id,
    description,
    image,
    likes,
    owner,
    createdAt,
    onLike,
    onComment,
    replies,
  }) => {
    const { profile } = useSelector(getAuthState);
    const [showFullText, setShowFullText] = useState(false);
    const [isTextLong, setIsTextLong] = useState(false);
    const [PopupMenuVisible, setPopupMenuVisible] = useState(false);

    const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });

    const navigation =
      useNavigation<NativeStackNavigationProp<ForumStackParamList>>();

    const navigateToPostLikesPage = useCallback(() => {
      navigation.navigate("PostLikes", { likes: DATA });
    }, []);

    // Check if the current post belongs to the logged-in user
    const isOwnPost = profile?.id === owner?._id.toString();

    const handleOptionsPress = (event: { nativeEvent: { pageY: any } }) => {
      const yPosition = event.nativeEvent.pageY;
      const popupHeight = 150; // Estimated height of the popup menu
      const windowHeight = Dimensions.get("window").height;
      const adjustedTop =
        yPosition + popupHeight > windowHeight
          ? windowHeight - popupHeight
          : yPosition;

      setPopupMenuVisible(true);
      setPopupPosition({
        top: adjustedTop - 10,
        right: 20,
      });
      Vibration.vibrate(50);
    };

    const MAX_LINES = 3;

    const {
      deletePostMutation,
      deleteLoading,
      updatePostMutation,
      updateLoading,
      favoritePostMutation,
    } = usePostMutations();

    const handleCloseMoreOptionsPress = useCallback(() => {
      setPopupMenuVisible(false);
      Vibration.vibrate(40);
    }, [PopupMenuVisible]);

    const handleTextLayout = (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      setIsTextLong(height > 52); //Threshold for 3 lines of text
    };

    const toggleShowFullText = () => {
      setShowFullText(!showFullText);
    };

    const handleUpdate = () => {};

    const handleReport = () => {};

    // Delete button is pressed
    const handleDelete = () => {
      if (!_id) return;

      Alert.alert(
        "Confirm Deletion",
        "Are you sure you want to delete this post?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => {
              deletePostMutation({
                postId: _id.toString(),
                ownerId: owner?._id,
                handleCloseMoreOptionsPress,
              });
            },
          },
        ],
        { cancelable: false }
      );
    };

    return (
      <View>
        <View style={styles.header}>
          <View style={styles.userDetails}>
            <Image
              style={styles.profileImage}
              source={
                owner?.avatar?.url
                  ? { uri: owner?.avatar?.url }
                  : require("@assets/user_profile.png")
              }
            />
            <View style={{ flexDirection: "column", gap: 2 }}>
              <Text style={styles.userName}>{owner?.name}</Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.userType}
              >
                {owner?.userType}
              </Text>
            </View>
          </View>

          <View style={styles.TimeAndOptions}>
            <Text style={styles.durationText}>
              {calculateTimeDifference(createdAt)}
            </Text>
            <TouchableOpacity onPress={handleOptionsPress}>
              <Text style={styles.ellipsisText}>...</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text
            style={styles.contentText}
            numberOfLines={showFullText ? undefined : MAX_LINES}
            onLayout={handleTextLayout}
          >
            {description}
          </Text>
          {isTextLong && (
            <Pressable onPress={toggleShowFullText}>
              <Text style={styles.seeMoreText}>
                {showFullText ? "See less" : "See more"}
              </Text>
            </Pressable>
          )}
        </View>

        {image?.url ? (
          <Image
            style={styles.postImage}
            source={{
              uri: image.url,
            }}
          />
        ) : null}

        <View style={styles.footer}>
          <View style={styles.socialActivity}>
            <TouchableOpacity
              onPress={() =>
                favoritePostMutation({
                  postId: _id.toString(),
                  profile,
                })
              }
            >
              <Image
                source={{
                  uri: likes.find((like) => like.userId?._id === profile?.id)
                    ? "https://cdn-icons-png.flaticon.com/512/2589/2589175.png"
                    : "https://cdn-icons-png.flaticon.com/512/2589/2589197.png",
                }}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
            // onPress={() => {
            //   navigation.navigate("CreateReplies", {
            //     item: item,
            //     navigation: navigation,
            //     postId: postId,
            //   });
            // }}
            >
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/5948/5948565.png",
                }}
                style={[styles.icon, styles.smallIcon, styles.marginLeft]}
              />
            </TouchableOpacity>

            <TouchableOpacity>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/10863/10863770.png",
                }}
                style={[styles.icon, styles.mediumIcon, styles.marginLeft]}
              />
            </TouchableOpacity>
          </View>

          {(likes.length !== 0 || replies.length !== 0) && (
            <Animated.View
              style={styles.replyContainer}
              entering={FadeIn.duration(500)}
              exiting={FadeOut.duration(200)}
            >
              <TouchableOpacity onPress={navigateToPostLikesPage}>
                <Text style={styles.replyText}>
                  {likes.length}{" "}
                  {likes.length > 1 || likes.length === 0
                    ? "likes ·"
                    : "like ·"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
              // onPress={() =>{
              //   // navigation.navigate('PostDetails', {
              //   //   data: item,
              //   // })
              // }
              >
                <Text style={styles.replyText}>
                  {`${replies?.length} replies`}{" "}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        <View style={styles.separator} />

        {PopupMenuVisible && (
          <PopupMenu
            visible={PopupMenuVisible}
            onRequestClose={() => setPopupMenuVisible(false)}
            deleteLoading={isOwnPost && deleteLoading}
            onUpdate={isOwnPost ? handleUpdate : undefined}
            onReport={!isOwnPost ? handleReport : undefined}
            onDelete={isOwnPost ? handleDelete : undefined}
            position={popupPosition}
          />
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  userDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
  },
  userType: {
    width: 200,
    color: "gray",
    fontSize: 15,
    fontWeight: "400",
  },
  TimeAndOptions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: "-10%",
  },
  durationText: {
    color: "#000000b6",
  },
  ellipsisText: {
    color: "#000",
    paddingLeft: 16,
    fontWeight: "900",
    fontSize: 18,
    marginBottom: 8,
  },
  date: {
    color: "gray",
  },
  contentContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 12,
  },
  contentText: {
    fontSize: 15,
  },
  seeMoreText: {
    color: colors.PRIMARY_BTN,
  },
  postImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  separator: {
    height: 2,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginTop: 8,
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 2,
  },
  smallIcon: {
    width: 22,
    height: 22,
  },
  mediumIcon: {
    width: 25,
    height: 25,
  },
  marginLeft: {
    marginLeft: 20,
  },
  replyContainer: {
    flexDirection: "row",
    marginRight: -10,
  },
  socialActivity: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  replyText: {
    fontSize: 16,
    color: "#0000009b",
    marginRight: 8,
  },
});

export default PostCard;
