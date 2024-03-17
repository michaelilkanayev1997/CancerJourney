import { FC, useState } from "react";
import { Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CountryPickerCustom from "@components/CountryPickerCustom";

const userTypes = [
  "Contender (Patient)",
  "Family Member",
  "Supporter (Friend)",
  "Health Field",
  "Caretaker",
  "Other",
];

const cancerTypes = [
  "Breast Cancer",
  "Lung Cancer",
  "Prostate Cancer",
  "Colorectal Cancer",
  "Other",
];

interface Props {}

const RegistrationForm: FC<Props> = (props) => {
  const [formState, setFormState] = useState({
    userType: "",
    cancerType: "",
    cancerSubtype: "",
    diagnosisDate: "",
    cancerStage: "",
    sex: "",
    location: null,
  });

  const handleChange = (name, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formState);
    // Here you'd typically send the form data to your backend
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Registration</Text>

      <Text style={styles.label}>User Type</Text>
      <Picker
        selectedValue={formState.userType}
        onValueChange={(itemValue) => handleChange("userType", itemValue)}
        style={styles.input}
      >
        {userTypes.map((type) => (
          <Picker.Item key={type} label={type} value={type} />
        ))}
      </Picker>

      {/* Similar setup for cancerType, sex, etc. */}
      {/* For simplicity, demonstrating with userType and cancerType */}

      <Text style={styles.label}>Cancer Type</Text>
      <Picker
        selectedValue={formState.cancerType}
        onValueChange={(itemValue) => handleChange("cancerType", itemValue)}
        style={styles.input}
      >
        {cancerTypes.map((type) => (
          <Picker.Item key={type} label={type} value={type} />
        ))}
      </Picker>

      <Text style={styles.label}>Cancer Subtype</Text>
      <TextInput
        style={styles.input}
        onChangeText={(value) => handleChange("cancerSubtype", value)}
        value={formState.cancerSubtype}
      />

      {/* Add other fields here following the same pattern */}

      <CountryPickerCustom />

      <Button title="Register" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
});

export default RegistrationForm;
