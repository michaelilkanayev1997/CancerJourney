import React, { FC, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import colors from "@utils/colors";
import { ToastNotification } from "@utils/toastConfig";
import catchAsyncError from "src/api/catchError";
import { getClient } from "src/api/client";
import Loader from "@ui/Loader";

type Props = {
  route: any;
};

const PostReport: FC<Props> = ({ route }) => {
  const { postId } = route.params;
  const [reportText, setReportText] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!reportText.trim()) {
      ToastNotification({
        type: "Error",
        message: "Please enter a report before submitting.",
      });
      return;
    } else if (reportText.trim().length < 15) {
      ToastNotification({
        type: "Error",
        message: "Your report is too short. Please describe the issue better.",
      });
      return;
    }

    setSubmitLoading(true);
    let isSuccessful = false;
    try {
      const client = await getClient();

      const { data } = await client.post("/post-report/add-post-report", {
        description: reportText,
        postId,
      });

      if (!data?.success) {
        throw new Error("Failed to add the Post Report");
      }

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
        setReportText("");
        ToastNotification({
          type: "Success",
          message: "Thank you! Your report has been successfully submitted.",
        });
      }
    }
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
        <Text style={styles.headerTitle}>Post Report </Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.label}>Why are you reporting this post?</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={6}
            maxLength={1400}
            placeholder="Enter your reason..."
            value={reportText}
            onChangeText={setReportText}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={submitLoading}
          >
            {submitLoading ? (
              <View style={styles.loaderOverlay}>
                <Loader loaderStyle={{ height: 100, width: 100 }} />
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Submit Report</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  header: {
    padding: 12,
    paddingLeft: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  form: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    borderWidth: 0.2,
    borderColor: colors.LIGHT_GRAY,
    overflow: "hidden",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.CONTRAST,
  },
  textInput: {
    borderColor: colors.LIGHT_GRAY,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: "top",
    height: 140,
    margin: 8,
  },
  submitButton: {
    backgroundColor: colors.LIGHT_BLUE,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    height: 50,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8, // Match Button's borderRadius
  },
});

export default PostReport;
