import { FC, useState } from "react";
import { Text, StyleSheet, ScrollView, View } from "react-native";

import InputSections from "@components/InputSections";
import AppButton from "@ui/AppButton";
import { Feather } from "@expo/vector-icons";

interface Props {}

const RegistrationForm: FC<Props> = (props) => {
  const [newProfile, setNewProfile] = useState({
    userType: "Fighter (Patient)",
    diagnosisDate: "",
    cancerType: "",
    subtype: "",
    stage: "",
    gender: "Male",
    birthDate: "",
    country: { cca2: "", name: "" },
  });

  const handleSubmit = () => {
    console.log("Form submitted:", newProfile);
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
            busy={false}
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
