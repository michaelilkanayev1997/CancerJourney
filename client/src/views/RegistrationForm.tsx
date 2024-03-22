import { FC, useState } from "react";
import { Text, StyleSheet, ScrollView, View } from "react-native";
import { useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";

import InputSections, { NewProfile } from "@components/InputSections";
import AppButton from "@ui/AppButton";
import { getClient } from "src/api/client";
import catchAsyncError from "src/api/catchError";
import { ToastNotification } from "@utils/toastConfig";
import { updateProfile } from "src/store/auth";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
} from "react-native-reanimated";

interface Props {}

const RegistrationForm: FC<Props> = (props) => {
  const [newProfile, setNewProfile] = useState<NewProfile>({
    gender: "Male",
    birthDate: null,
    userType: "patient",
    cancerType: "other",
    diagnosisDate: null,
    stage: "",
    country: { cca2: "", name: "" },
  });
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    setLoadingUpdate(true);
    try {
      const client = await getClient();

      const { data } = await client.post("/auth/update-profile", newProfile);

      ToastNotification({
        message: data.message,
      });
      dispatch(updateProfile(data.profile));
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <>
      <Animated.Text
        entering={FadeInRight.duration(1000)}
        style={styles.header}
      >
        Registration
      </Animated.Text>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 8,
          padding: 8,
        }}
      >
        <InputSections
          newProfile={newProfile}
          setNewProfile={setNewProfile}
          Registration={true}
        />
      </ScrollView>

      <Animated.View
        entering={FadeInDown.delay(200).duration(1000).springify()}
        style={styles.button}
      >
        <AppButton
          title="Register"
          pressedColor={["#4285F4", "#3578E5", "#2A6ACF"]}
          defaultColor={["#4A90E2", "#4285F4", "#5B9EF4"]}
          onPress={handleSubmit}
          icon={
            <Feather
              name="check-square"
              size={24}
              color="white"
              style={{ marginRight: 10 }}
            />
          }
          busy={loadingUpdate}
        />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingLeft: 10,
    paddingTop: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    padding: 15,
    width: "100%",
    alignItems: "center",
  },
});

export default RegistrationForm;
