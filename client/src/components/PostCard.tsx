import React, { FC, memo, useCallback, useEffect, useState } from "react";
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
  I18nManager,
} from "react-native";
import { useSelector } from "react-redux";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LottieView from "lottie-react-native";
import { useTranslation } from "react-i18next";

import colors from "../utils/colors";
import { calculateTimeDifference } from "@utils/helper";
import { Like, Reply, User } from "src/@types/post";
import { getProfile } from "src/store/auth";
import { usePostMutations } from "src/hooks/mutations";
import PopupMenu from "./PopupMenu";
import { DrawerParamList } from "src/@types/navigation";
import { UserTypeKey, useTranslatedUserTypes } from "@utils/enums";

interface PostProps {
  _id: string;
  description: string;
  image: {
    public_id: string;
    url: string;
  } | null;
  likes?: Like[];
  owner: User;
  createdAt: string;
  replies?: Reply[];
  forumType: string;
  publicProfile: boolean;
  publicUserId: string;
}

const PostCard: FC<PostProps> = memo(
  ({
    _id,
    description,
    image,
    likes,
    owner,
    createdAt,
    forumType,
    replies,
    publicProfile,
    publicUserId,
  }) => {
    const { t } = useTranslation();
    const userTypes = useTranslatedUserTypes();

    const profile = useSelector(getProfile);
    const [showFullText, setShowFullText] = useState(false);
    const [isTextLong, setIsTextLong] = useState(false);
    const [PopupMenuVisible, setPopupMenuVisible] = useState(false);
    const [isProfileImageLoading, setIsProfileImageLoading] =
      useState<boolean>(true);
    const [isPostImageLoading, setIsPostImageLoading] = useState<boolean>(true);
    const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });

    const navigation =
      useNavigation<NativeStackNavigationProp<DrawerParamList>>();

    // Ensure image loading state is reset when the user Updates Post Image
    useEffect(() => {
      setTimeout(() => {
        setIsPostImageLoading(false);
      }, 1000);
    }, [image?.url]);

    const navigateToPostLikesPage = useCallback(() => {
      navigation.navigate("PostLikes", { likes });
    }, [likes]);

    // Check if the current post belongs to the logged-in user
    const isOwnPost = profile?.id === owner?._id.toString();

    const handleOptionsPress = (event: { nativeEvent: { pageY: any } }) => {
      Vibration.vibrate(50);
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
    };

    const MAX_LINES = 3;

    const { deletePostMutation, deleteLoading, favoritePostMutation } =
      usePostMutations();

    const handleCloseMoreOptionsPress = useCallback(() => {
      setPopupMenuVisible(false);
      Vibration.vibrate(40);
    }, [PopupMenuVisible]);

    const handleTextLayout = (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;

      setIsTextLong(height > 54); //Threshold for 3 lines of text
    };

    const toggleShowFullText = () => {
      setShowFullText(!showFullText);
    };

    const handleUpdate = () => {
      if (!_id) return;
      handleCloseMoreOptionsPress();
      navigation.navigate("New Post", {
        description,
        image,
        forumType,
        owner,
        postId: _id.toString(),
        update: true,
      });
    };

    const handleReport = () => {
      handleCloseMoreOptionsPress();
      navigation.navigate("PostReport", { postId: _id });
    };

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
                cancerType: forumType,
                handleCloseMoreOptionsPress,
              });
            },
          },
        ],
        { cancelable: false }
      );
    };

    const navigateToProfile = useCallback(() => {
      navigation.navigate("PublicProfile", {
        publicUser: owner,
        publicProfile: true,
      });
    }, []);

    return (
      <View>
        <View style={styles.header}>
          <View style={styles.userDetails}>
            <View style={styles.profileImageContainer}>
              {isProfileImageLoading ? (
                <View>
                  <Animated.View
                    entering={FadeIn}
                    exiting={FadeOut.duration(500)}
                  >
                    <LottieView
                      source={require("@assets/Animations/ImageLoadingAnimation.json")}
                      autoPlay
                      loop
                      resizeMode="cover"
                      style={{
                        width: "150%",
                        height: "100%",
                        alignSelf: "center",
                        justifyContent: "center",
                      }}
                    />
                  </Animated.View>
                  <Image
                    source={
                      owner?.avatar?.url
                        ? { uri: owner?.avatar?.url }
                        : require("@assets/user_profile.png")
                    }
                    onLoad={() => setIsProfileImageLoading(false)} // Image loaded successfully
                    onError={() => setIsProfileImageLoading(false)} // Image failed to load
                  />
                </View>
              ) : (
                <TouchableOpacity onPress={() => navigateToProfile()}>
                  <Image
                    style={styles.profileImage}
                    source={
                      owner?.avatar?.url
                        ? { uri: owner?.avatar?.url }
                        : require("@assets/user_profile.png")
                    }
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={{ flexDirection: "column", gap: 2 }}>
              <TouchableOpacity onPress={() => navigateToProfile()}>
                <Text style={styles.userName}>{owner?.name}</Text>
              </TouchableOpacity>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.userType}
              >
                {userTypes[owner?.userType as UserTypeKey]}
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
                {showFullText ? t("see-less") : t("see-more")}
              </Text>
            </Pressable>
          )}
        </View>

        {image?.url ? (
          <View style={styles.postImageContainer}>
            {isPostImageLoading ? (
              <View>
                <Animated.View
                  entering={FadeIn}
                  exiting={FadeOut.duration(500)}
                >
                  <LottieView
                    source={require("@assets/Animations/ImageLoadingAnimation.json")}
                    autoPlay
                    loop
                    resizeMode="cover"
                    style={{
                      width: "100%",
                      height: "100%",
                      alignSelf: "center",
                      justifyContent: "center",
                    }}
                  />
                </Animated.View>
                <Image
                  source={{
                    uri: image.url,
                  }}
                  onLoad={() => setIsPostImageLoading(false)} // Image loaded successfully
                  onError={() => setIsPostImageLoading(false)} // Image failed to load
                />
              </View>
            ) : (
              <Image
                style={styles.postImage}
                source={{
                  uri: image.url,
                }}
              />
            )}
          </View>
        ) : null}

        {likes && replies && (
          <View style={styles.footer}>
            <View style={styles.socialActivity}>
              <TouchableOpacity
                onPress={() =>
                  favoritePostMutation({
                    postId: _id.toString(),
                    profile,
                    cancerType: forumType,
                    publicProfile,
                    publicUserId,
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
                      ? `${t("likes")} ·`
                      : `${t("like")} ·`}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("PostReplies", {
                      _id,
                      description,
                      image,
                      owner,
                      createdAt,
                      forumType,
                      replies,
                      publicProfile,
                      publicUserId,
                    });
                  }}
                >
                  <Text style={styles.replyText}>
                    {`${replies?.length} ${t("replies")}`}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        )}

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
    textDecorationLine: "underline",
    textAlign: I18nManager.isRTL ? "left" : "left",
  },
  userType: {
    width: 200,
    color: "gray",
    fontSize: 15,
    fontWeight: "400",
    textAlign: I18nManager.isRTL ? "left" : "left",
  },
  TimeAndOptions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: I18nManager.isRTL ? "-5%" : "-10%",
  },
  durationText: {
    color: "#000000b6",
    marginRight: I18nManager.isRTL ? "10%" : 0,
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
  profileImageContainer: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "column",
    overflow: "hidden",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: "center",
  },
  postImageContainer: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "column",
    overflow: "hidden",
    width: "100%",
    height: 150,
    borderRadius: 8,
    alignSelf: "center",
  },
});

export default PostCard;
