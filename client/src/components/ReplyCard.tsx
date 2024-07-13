import colors from "@utils/colors";
import { UserTypeKey, userTypes } from "@utils/enums";
import { calculateTimeDifference } from "@utils/helper";
import LottieView from "lottie-react-native";
import { FC, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Pressable,
  LayoutChangeEvent,
  Vibration,
  Dimensions,
  Alert,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useSelector } from "react-redux";
import { Reply } from "src/@types/post";
import { getAuthState } from "src/store/auth";
import PopupMenu from "./PopupMenu";
import { useReplyMutations } from "src/hooks/mutations";

interface Props {
  reply: Reply;
  post: { _id: string; forumType: string };
  onDeleteReply: (replyId: string) => void;
}

const ReplyCard: FC<Props> = ({ reply, post, onDeleteReply }) => {
  const { profile } = useSelector(getAuthState);
  const [isProfileImageLoading, setIsProfileImageLoading] =
    useState<boolean>(true);
  const [showFullText, setShowFullText] = useState(false);
  const [isTextLong, setIsTextLong] = useState(false);
  const [PopupMenuVisible, setPopupMenuVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });

  const MAX_LINES = 3;

  // Check if the current reply belongs to the  user
  const isOwnReply = profile?.id === reply.owner._id.toString();

  const { deleteReplyMutation, deleteLoading, favoriteReplyMutation } =
    useReplyMutations();

  const handleCloseMoreOptionsPress = useCallback(() => {
    setPopupMenuVisible(false);
    Vibration.vibrate(40);
  }, [PopupMenuVisible]);

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

  const handleTextLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setIsTextLong(height > 52); //Threshold for 3 lines of text
  };

  const toggleShowFullText = () => {
    setShowFullText(!showFullText);
  };

  // Delete button is pressed
  const handleDelete = () => {
    if (!reply?._id) return;

    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this reply?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            deleteReplyMutation({
              postId: post?._id.toString(),
              replyId: reply?._id,
              cancerType: post?.forumType,
              handleCloseMoreOptionsPress,
              onDeleteReply,
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.userDetails}>
        <View style={styles.profileImageContainer}>
          {isProfileImageLoading ? (
            <View>
              <Animated.View entering={FadeIn} exiting={FadeOut.duration(500)}>
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
                  reply?.owner?.avatar?.url
                    ? { uri: reply?.owner?.avatar?.url }
                    : require("@assets/user_profile.png")
                }
                onLoad={() => setIsProfileImageLoading(false)} // Image loaded successfully
                onError={() => setIsProfileImageLoading(false)} // Image failed to load
              />
            </View>
          ) : (
            <Image
              style={styles.profileImage}
              source={
                reply?.owner?.avatar?.url
                  ? { uri: reply?.owner?.avatar?.url }
                  : require("@assets/user_profile.png")
              }
            />
          )}
        </View>

        <View
          style={{
            flexDirection: "column",
            gap: 0,
            justifyContent: "flex-start",
          }}
        >
          <Text style={styles.userName}>{reply?.owner?.name}</Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.userType}>
            {userTypes[reply?.owner?.userType as UserTypeKey]}
          </Text>
        </View>
        <View style={styles.TimeAndOptions}>
          <Text style={styles.durationText}>
            {calculateTimeDifference(reply?.createdAt)}
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
          {reply?.description}
        </Text>
        {isTextLong && (
          <Pressable onPress={toggleShowFullText}>
            <Text style={styles.seeMoreText}>
              {showFullText ? "See less" : "See more"}
            </Text>
          </Pressable>
        )}
      </View>

      {PopupMenuVisible && (
        <PopupMenu
          visible={PopupMenuVisible}
          onRequestClose={() => setPopupMenuVisible(false)}
          deleteLoading={isOwnReply && deleteLoading}
          onUpdate={undefined}
          // onReport={!isOwnReply ? handleReport : undefined}
          onDelete={isOwnReply ? handleDelete : undefined}
          position={popupPosition}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: "#e0e0e0", // light gray border
    borderWidth: 0.5,
    borderRadius: 12,
    padding: 5,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    margin: 4,
    width: "97%",
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
    width: 32,
    height: 32,
    borderRadius: 16,
    alignSelf: "center",
  },
  userDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "space-between",
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userName: {
    fontSize: 13,
    fontWeight: "500",
  },
  userType: {
    width: "100%",
    color: "gray",
    fontSize: 12,
    fontWeight: "400",
  },
  TimeAndOptions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: "auto",
  },
  durationText: {
    color: "#000000b6",
    fontSize: 12,
  },
  ellipsisText: {
    color: "#000",
    paddingLeft: 16,
    fontWeight: "900",
    fontSize: 15,
    marginBottom: 8,
  },
  contentContainer: {
    marginTop: 8,
    marginHorizontal: 10,
    marginBottom: 12,
  },
  contentText: {
    textAlign: "left",
    fontSize: 13,
  },
  seeMoreText: {
    color: colors.PRIMARY_BTN,
  },
});

export default ReplyCard;
