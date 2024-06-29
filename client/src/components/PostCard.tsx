import React, { FC, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  ImageSourcePropType,
  LayoutChangeEvent,
} from "react-native";
import {
  MaterialCommunityIcons,
  Ionicons,
  Entypo,
  Feather,
  FontAwesome,
  SimpleLineIcons,
  AntDesign,
} from "@expo/vector-icons";

import colors from "../utils/colors";

interface PostProps {
  title: string;
  description: string;
  likes: number;
  user: {
    profileImage: string;
    name: string;
  };
  createdAt: string;
  imageUrl: string;
  onLike: () => void;
  onComment: () => void;
}

const PostCard: FC<PostProps> = ({
  title,
  description,
  likes,
  user,
  createdAt,
  imageUrl,
  onLike,
  onComment,
}) => {
  const [showFullText, setShowFullText] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isTextLong, setIsTextLong] = useState(false);

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
            source={{ uri: user?.profileImage }}
          />
          <View style={{ flexDirection: "column", gap: 2 }}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.userTitle}
            >
              Engineer Graduate | LinkedIn Member
            </Text>
            <Text style={styles.date}>{createdAt?.toString()}</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <Entypo name="dots-three-vertical" size={20} color="black" />
          <Feather name="x" size={20} color="black" />
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

      {imageUrl ? (
        <Image
          style={styles.postImage}
          source={{
            uri: imageUrl,
          }}
        />
      ) : null}

      {likes?.length > 0 && (
        <View style={styles.likesContainer}>
          <SimpleLineIcons name="like" size={16} color={colors.PRIMARY_BTN} />
          <Text style={styles.likesText}>{likes}</Text>
        </View>
      )}

      <View style={styles.separator} />

      <View style={styles.footer}>
        <Pressable onPress={handleLikePost} style={styles.footerButton}>
          <AntDesign
            name="like2"
            size={24}
            color={isLiked ? colors.PRIMARY_BTN : "gray"}
          />
          <Text
            style={[
              styles.footerButtonText,
              { color: isLiked ? colors.PRIMARY_BTN : "gray" },
            ]}
          >
            Like
          </Text>
        </Pressable>
        <Pressable onPress={onComment} style={styles.footerButton}>
          <FontAwesome name="comment-o" size={20} color="gray" />
          <Text style={styles.footerButtonText}>Comment</Text>
        </Pressable>

        <Pressable style={styles.footerButton}>
          <Feather name="send" size={20} color="gray" />
          <Text style={styles.footerButtonText}>Send</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: colors.PRIMARY_LIGHT,
    padding: 16,
    margin: 8,
    borderRadius: 8,
    shadowColor: colors.CONTRAST,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
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
  userTitle: {
    width: 200,
    color: "gray",
    fontSize: 15,
    fontWeight: "400",
  },
  date: {
    color: "gray",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: -15,
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
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 6,
  },
  likesText: {
    color: "gray",
    marginLeft: 6,
  },
  separator: {
    height: 3,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 6,
  },
  footerButton: {
    alignItems: "center",
  },
  footerButtonText: {
    marginTop: 2,
    fontSize: 12,
    color: "gray",
  },
});

export default PostCard;
