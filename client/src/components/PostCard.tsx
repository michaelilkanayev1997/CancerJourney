import React, { FC, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  LayoutChangeEvent,
  Vibration,
} from "react-native";

import colors from "../utils/colors";
import { calculateTimeDifference } from "@utils/helper";
import { Avatar, Like, Reply, User } from "src/@types/post";
import { getAuthState } from "src/store/auth";
import { useSelector } from "react-redux";
import BasicOptionsModal from "./BasicOptionsModal";

interface PostProps {
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

const PostCard: FC<PostProps> = ({
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
  const [isLiked, setIsLiked] = useState(false);
  const [isTextLong, setIsTextLong] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const MAX_LINES = 3;

  const handleTextLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setIsTextLong(height > 52); //Threshold for 3 lines of text
  };

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  const handleLikePost = () => {
    setIsLiked(!isLiked);
    onLike();
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
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              Vibration.vibrate(50);
            }}
          >
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
          // onPress={() => reactsHandler(item)}
          >
            {likes?.length > 0 ? (
              <>
                {likes.find((i: Like) => i.userId._id === profile?.id) ? (
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/512/2589/2589175.png",
                    }}
                    style={styles.icon}
                  />
                ) : (
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/512/2589/2589197.png",
                    }}
                    style={styles.icon}
                  />
                )}
              </>
            ) : (
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/2589/2589197.png",
                }}
                style={styles.icon}
              />
            )}
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
          <View style={styles.replyContainer}>
            <TouchableOpacity
            // onPress={() =>{
            //   // item.likes.length !== 0 &&
            //   // navigation.navigate('PostLikeCard', {
            //   //   item: item.likes,
            //   //   navigation: navigation,
            //   // })
            // }
            >
              <Text style={styles.replyText}>
                {likes.length}{" "}
                {likes.length > 1 || likes.length === 0 ? "likes ·" : "like ·"}
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
          </View>
        )}
      </View>

      <View style={styles.separator} />

      <BasicOptionsModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        postTitle={description.slice(0, 20)}
        // onUpdate={handleUpdate}
        // onReport={handleReport}
        // onDelete={handleDelete}
      />
    </View>
  );
};

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
    marginVertical: 8,
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
