import { FC, useState } from "react";
import { Text, StyleSheet, ScrollView, View } from "react-native";

import InputSections, { NewProfile } from "@components/InputSections";
import AppButton from "@ui/AppButton";
import { Feather } from "@expo/vector-icons";
import { getClient } from "src/api/client";
import catchAsyncError from "src/api/catchError";
import { ToastNotification } from "@utils/toastConfig";
import { getAuthState, updateProfile } from "src/store/auth";
import { useDispatch, useSelector } from "react-redux";

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
      <Text style={styles.header}>Registration</Text>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40, flex: 1, padding: 10 }}
      >
        <InputSections
          newProfile={newProfile}
          setNewProfile={setNewProfile}
          Registration={true}
        />

        <View style={styles.button}>
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
        </View>
      </ScrollView>
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
    padding: 5,
    width: "100%",
    alignItems: "center",
  },
});

export default RegistrationForm;
