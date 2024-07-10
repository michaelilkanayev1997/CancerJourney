import { Dispatch, FC, SetStateAction, useCallback, useEffect } from "react";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Vibration,
  BackHandler,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import colors from "@utils/colors";
import CustomPicker from "@components/CustomPicker";
import { getAuthState } from "src/store/auth";
import InputRowContainer from "@ui/InputRowContainer";

import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";

import { cancerTypeRibbon } from "@utils/enums";
import PhotoModal from "@components/PhotoModal";
import { ToastNotification } from "@utils/toastConfig";
import { getClient } from "src/api/client";
import catchAsyncError from "src/api/catchError";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Loader from "@ui/Loader";

interface Props {}

export interface NewPost {
  description: string;
  cancerType: string;
  image: any;
}

const NewPost: FC<Props> = ({ route }) => {
  const { profile } = useSelector(getAuthState);
  let { description, image, forumType, update } = route.params || {
    forumType: profile?.cancerType || "other",
    description: "",
    image: null,
    update: false,
  };

  const [pickerVisible, setPickerVisible] = useState(false);
  const [PhotoModalVisible, setPhotoModalVisible] = useState(false);
  const [addPostLoading, setAddPostLoading] = useState(false);
  const [newPost, setNewPost] = useState<NewPost>({
    cancerType: forumType,
    description: description,
    image: image,
  });
  console.log(update);
  const navigation = useNavigation();

  //  Set state based on route params
  useEffect(() => {
    setNewPost((prevPost) => ({
      ...prevPost,
      description: description || "",
      image: image || null,
      cancerType: profile?.cancerType || "other",
    }));
  }, [description, image, forumType, update]);

  const resetPostFields = () => {
    setNewPost({
      description: "",
      image: null,
      cancerType: forumType,
    });
    update = false;
  };

  const setImage: Dispatch<
    SetStateAction<ImagePicker.ImagePickerAsset | null>
  > = (image) => {
    setNewPost((prevPost) => ({
      ...prevPost,
      image: image as ImagePicker.ImagePickerAsset,
    }));
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (addPostLoading) {
          return true; // Block back button
        }
        return false; // Allow back button
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [addPostLoading])
  );

  const toggleModalVisible = useCallback(() => {
    setPhotoModalVisible((prevVisible) => !prevVisible);
    Vibration.vibrate(50);
  }, []);

  const resetFields = () => {
    setNewPost({
      cancerType: profile?.cancerType || "other",
      description: "",
      image: null,
    });
  };

  const handleAddPost = async () => {
    if (newPost.description === "") {
      ToastNotification({
        type: "ModalError",
        message: "Description is required!",
      });
      return;
    } else if (newPost.description.length < 10) {
      ToastNotification({
        type: "ModalError",
        message: "Description should be at least 10 characters long!",
      });
      return;
    }
    let isSuccessful = false;

    try {
      setAddPostLoading(true);

      const formData = new FormData();

      // Append the Body fields to the form
      formData.append("description", newPost.description);
      formData.append("forumType", newPost.cancerType);

      if (newPost.image) {
        formData.append("image", {
          uri: newPost.image.uri,
          type: newPost.image.mimeType,
          name: "image.jpg",
        } as any);
      }

      const client = await getClient({
        "Content-Type": "multipart/form-data;",
      });

      const { data } = await client.post("/post/add-post", formData);

      if (!data?.success) {
        throw new Error("Failed to add the Post");
      }

      //queryClient.invalidateQueries(["schedules", "medications"]);

      isSuccessful = true;
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    } finally {
      setAddPostLoading(false);

      if (isSuccessful) {
        //handleCloseMoreOptionsPress();
        resetFields();
        ToastNotification({
          message: "Post uploaded successfully!",
        });
      }
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        style={styles.container}
        overScrollMode="never"
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>New Post</Text>
        <View style={styles.userDetails}>
          <Image
            style={styles.profileImage}
            source={
              profile?.avatar
                ? { uri: profile?.avatar }
                : require("@assets/user_profile.png")
            }
          />
          <View style={{ flexDirection: "column", gap: 2 }}>
            <Text style={styles.userName}>{profile?.name}</Text>
          </View>
        </View>

        <View style={styles.titleWithError}>
          <Text style={styles.label}></Text>
          {newPost.description.length < 10 ? (
            <Animated.Text
              entering={FadeInLeft.duration(500)}
              exiting={FadeOutRight.duration(500)}
              style={styles.errorMessage}
            >
              Description is Required!
            </Animated.Text>
          ) : null}
        </View>
        <TextInput
          placeholder="Hi everyone..."
          style={styles.input}
          value={newPost.description}
          onChangeText={(text) => setNewPost({ ...newPost, description: text })}
          multiline
          editable={!addPostLoading}
          keyboardType="default"
          removeClippedSubviews={false}
        />

        {/* Photo Upload Icon */}
        <Text style={styles.rowLabel}>Photo (optional)</Text>
        <View style={styles.photoUploadContainer}>
          <TouchableOpacity
            onPress={toggleModalVisible}
            style={styles.photoUploadButton}
          >
            <MaterialCommunityIcons
              name="camera-outline"
              size={20}
              color="white"
            />
          </TouchableOpacity>
          {newPost.image ? (
            <Image
              source={{ uri: newPost.image.uri || newPost.image.url }}
              style={styles.photoPreview}
            />
          ) : (
            <Image
              source={require("@assets/newPost.png")}
              style={styles.photoPreview}
            />
          )}
        </View>

        <InputRowContainer
          title={"Forum Type"}
          children={
            <>
              <TouchableOpacity
                onPress={() => setPickerVisible(true)}
                style={[styles.rowInput, { paddingVertical: 12 }]}
              >
                <Text
                  style={styles.cancerTypeButtonText}
                  numberOfLines={1} // Ensure text is on one line
                  ellipsizeMode="tail" // Add ellipsis at the end if text is too long
                >
                  {newPost.cancerType !== ""
                    ? newPost.cancerType.charAt(0).toUpperCase() +
                      newPost.cancerType.slice(1) +
                      " Cancer"
                    : "Other Cancer"}
                </Text>
                <Image
                  source={
                    cancerTypeRibbon[newPost.cancerType] ||
                    require("@assets/CancerType/other-cancer.png")
                  }
                  style={{ width: 25, height: 25, marginRight: 0 }}
                />
                <MaterialIcons
                  name="arrow-drop-down"
                  size={24}
                  color="gray"
                  style={{ paddingRight: 7 }}
                />
              </TouchableOpacity>
              <CustomPicker
                visible={pickerVisible}
                setNewProfile={setNewPost}
                setPickerVisible={setPickerVisible}
                newProfile={newPost}
              />
            </>
          }
          style={{ backgroundColor: colors.PRIMARY_LIGHT }}
        />

        {update ? (
          <>
            <TouchableOpacity
              // onPress={handleAddPost}
              style={[
                styles.submitButton,
                addPostLoading && styles.disabledButton,
              ]}
              disabled={addPostLoading}
            >
              <Text style={styles.submitButtonText}>Update Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.newPostButton}
              onPress={resetPostFields}
            >
              <Text style={styles.newPostButtonText}>New Post</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={handleAddPost}
            style={[
              styles.submitButton,
              addPostLoading && styles.disabledButton,
            ]}
            disabled={addPostLoading}
          >
            <Text style={styles.submitButtonText}>Add Post</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <PhotoModal
        isVisible={PhotoModalVisible}
        toggleModalVisible={toggleModalVisible}
        setPhoto={setImage}
        photo={newPost.image}
        title={"Post Image"}
      />

      {/* Loader Component */}
      {addPostLoading && (
        <View style={styles.loaderOverlay}>
          <Loader
            loaderStyle={{
              width: 150,
              height: 150,
            }}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.PRIMARY_LIGHT,
  },
  rowLabel: {
    fontSize: 16,
    color: "#000",
    paddingTop: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.ICON,
    marginBottom: 10,
  },
  input: {
    height: 100,
    borderColor: colors.SECONDARY,
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginTop: -2,
    marginBottom: 0,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: colors.ICON,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  rowInput: {
    flex: 2, // Take up 2/3 of the space
    borderWidth: 1,
    borderColor: "#e1e1e1",
    padding: 5,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    overflow: "hidden", // This is necessary for iOS to clip the shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3, // This is for Android
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancerTypeButtonText: {
    width: "69%",
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
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
    fontSize: 18,
    fontWeight: "300",
    marginBottom: 25,
  },
  titleWithError: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: -15,
  },
  errorMessage: {
    color: colors.ERROR,
    paddingRight: 12,
    fontWeight: "400",
  },
  photoUploadContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    padding: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
    width: "100%",
  },
  photoUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.LIGHT_BLUE,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    elevation: 3,
  },
  photoPreview: {
    marginLeft: 15,
    width: 200,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  disabledButton: {
    backgroundColor: colors.OVERLAY,
  },
  disabledInput: {
    backgroundColor: colors.LIGHT_GRAY,
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Ensure loader is above the overlay
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20, // Match modalContent's borderRadius
  },
  newPostButton: {
    backgroundColor: colors.LIGHT_BLUE,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  newPostButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default NewPost;
