import { useNavigation } from "@react-navigation/native";
import { FC, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  Platform,
} from "react-native";

import colors from "@utils/colors";
import PostCard from "@components/PostCard";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { UserTypeKey, userTypes } from "@utils/enums";
import { useSelector } from "react-redux";
import { getAuthState } from "src/store/auth";
import Loader from "@ui/Loader";
import { ToastNotification } from "@utils/toastConfig";
import catchAsyncError from "src/api/catchError";
import { getClient } from "src/api/client";
import { useQueryClient } from "react-query";
import { Post } from "src/@types/post";
import { generateObjectId } from "@utils/helper";

interface Props {}

const PostReplyAdd: FC<Props> = ({ route }) => {
  const { _id, description, image, owner, createdAt, forumType } =
    route.params || null;
  const { profile } = useSelector(getAuthState);
  const [isProfileImageLoading, setIsProfileImageLoading] =
    useState<boolean>(true);
  const [replyDescription, setReplyDescription] = useState<string>("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const handleDescriptionChange = useCallback((text: string) => {
    setReplyDescription(text);
  }, []);

  const handleAddPost = async () => {
    if (!replyDescription.trim()) {
      ToastNotification({
        type: "Error",
        message: "Please enter a reply before submitting.",
      });
      return;
    }

    setSubmitLoading(true);
    let isSuccessful = false;
    try {
      const client = await getClient();

      const { data } = await client.post(`post/add-reply?postId=${_id}`, {
        description: replyDescription,
      });

      if (!data?.success) {
        throw new Error("Failed to add the Post Reply");
      }

      // Construct the new reply object from the replyDescription and current user profile
      const newReply = {
        _id: generateObjectId(), // Assign a temporary ID
        owner: {
          _id: profile?.id,
          avatar: {
            publicId: "stam",
            url: profile?.avatar,
            name: profile?.name,
            userType: profile?.userType,
          },
        },
        description: replyDescription,
        likes: [],
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Post[]>(["posts", forumType], (oldData) => {
        if (!oldData) return [];
        const updatedPosts = oldData.map((post) => {
          if (post._id === _id) {
            return {
              ...post,
              replies: [...post.replies, newReply],
            };
          }
          return post;
        });
        return updatedPosts;
      });

      isSuccessful = true;
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    } finally {
      navigation.goBack();
      setSubmitLoading(false);
      if (isSuccessful) {
        setReplyDescription("");
        ToastNotification({
          type: "Success",
          message: "Your reply has been successfully added.",
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/2223/2223615.png",
                  }}
                  style={styles.backIcon}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Add Reply</Text>
            </View>

            <PostCard
              _id={_id}
              description={description}
              image={image}
              owner={owner}
              createdAt={createdAt}
              forumType={forumType}
            />

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
                  <Image
                    style={styles.profileImage}
                    source={
                      profile?.avatar
                        ? { uri: profile.avatar }
                        : require("@assets/user_profile.png")
                    }
                  />
                )}
              </View>

              <View style={{ flexDirection: "column", gap: 2 }}>
                <Text style={styles.userName}>{profile?.name}</Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.userType}
                >
                  {userTypes[profile?.userType as UserTypeKey]}
                </Text>
              </View>
            </View>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              onChangeText={handleDescriptionChange}
              value={replyDescription}
              placeholder={`Reply to ${owner.name}`}
              multiline
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleAddPost}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <View style={styles.loaderOverlay}>
                  <Loader loaderStyle={{ height: 100, width: 100 }} />
                </View>
              ) : (
                <Text style={styles.submitButtonText}>Post</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.PRIMARY_LIGHT,
    borderRadius: 8,
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
  profileImageContainer: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "column",
    overflow: "hidden",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: "center",
  },
  userDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    fontSize: 14,
    fontWeight: "500",
  },
  userType: {
    width: 200,
    color: "gray",
    fontSize: 14,
    fontWeight: "400",
  },
  input: {
    height: 40,
    margin: 8,
    borderWidth: 1,
    padding: 10,
    width: "90%",
    borderRadius: 5,
    borderColor: "#ddd",
    alignSelf: "center",
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: colors.LIGHT_BLUE,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    height: 40,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    alignSelf: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default PostReplyAdd;
