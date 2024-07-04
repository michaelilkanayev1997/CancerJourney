import { FC } from "react";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";

import colors from "@utils/colors";
import CustomPicker, { cancerTypes } from "@components/CustomPicker";
import { getAuthState } from "src/store/auth";
import InputRowContainer from "@ui/InputRowContainer";
import { MaterialIcons } from "@expo/vector-icons";
import { cancerTypeRibbon } from "@components/InputSections";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";

interface Props {}

const NewPost: FC<Props> = (props) => {
  const { profile } = useSelector(getAuthState);
  const [pickerVisible, setPickerVisible] = useState(false);

  const [newPost, setNewPost] = useState({
    cancerType: profile?.cancerType || "other",
    description: "",
    image: null,
  });

  const dispatch = useDispatch();

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewPost({ ...newPost, image: result.assets[0].uri });
    }
  };

  const handleSubmit = () => {
    //   if (!description || !selectedCancerType || !image) {
    //     Alert.alert("Error", "Please fill all the fields");
    //     return;
    //   }

    // Reset form fields
    setNewPost({
      cancerType: profile?.cancerType || "other",
      description: "",
      image: null,
    });

    //   Alert.alert("Success", "Post added successfully!");
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
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
          {newPost.description.length <= 10 ? (
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
        />
        {/* <Text style={styles.label}>Forum Type</Text> */}
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
        />

        <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>Pick an image</Text>
        </TouchableOpacity>

        {newPost.image && (
          <Image source={{ uri: newPost.image }} style={styles.imagePreview} />
        )}

        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Add Post</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // backgroundColor: "#fff",
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
    marginTop: 0,
    marginBottom: 5,
    textAlignVertical: "top",
  },
  imagePicker: {
    backgroundColor: colors.ICON,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  imagePickerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePreview: {
    alignSelf: "center",
    width: "90%",
    height: 150,
    borderRadius: 8,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: colors.ICON,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
});

export default NewPost;
