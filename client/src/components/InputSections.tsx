import { Picker } from "@react-native-picker/picker";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import CustomPicker from "./CustomPicker";
import InputRowContainer from "@ui/InputRowContainer";
import DatePicker from "@ui/DatePicker";
import CountryPickerCustom from "./CountryPickerCustom";

export interface NewProfile {
  userType: string;
  diagnosisDate: Date | null;
  cancerType: string;
  stage: string;
  name?: string;
  gender: string;
  birthDate: Date | null;
  country: { cca2: string; name: string };
}

interface CancerTypeRibbon {
  [key: string]: number; // Use `number` since `require()` returns a number for local assets
}

const cancerTypeRibbon: CancerTypeRibbon = {
  bone: require("@assets/CancerType/bone-cancer.png"),
  breast: require("@assets/CancerType/breast-cancer.png"),
  lung: require("@assets/CancerType/lung-cancer.png"),
  appendix: require("@assets/CancerType/appendix-cancer.png"),
  brain: require("@assets/CancerType/brain-cancer.png"),
  bladder: require("@assets/CancerType/bladder-cancer.png"),
  blood: require("@assets/CancerType/blood-cancer.png"),
  kidney: require("@assets/CancerType/kidney-cancer.png"),
  childhood: require("@assets/CancerType/childhood-cancer.png"),
  colorectal: require("@assets/CancerType/colorectal-cancer.png"),
  "gallbladder-and-bile-duct": require("@assets/CancerType/gallbladder-and-bile-duct-cancer.png"),
  gastric: require("@assets/CancerType/gastric-cancer.png"),
  gynecological: require("@assets/CancerType/gynecological-cancer.png"),
  "head-and-neck": require("@assets/CancerType/head-and-neck-cancer.png"),
  liver: require("@assets/CancerType/liver-cancer.png"),
  pancreatic: require("@assets/CancerType/pancreatic-cancer.png"),
  prostate: require("@assets/CancerType/prostate-cancer.png"),
  skin: require("@assets/CancerType/skin-cancer.png"),
  testicular: require("@assets/CancerType/testicular-cancer.png"),
  thyroid: require("@assets/CancerType/thyroid-cancer.png"),
  other: require("@assets/CancerType/other-cancer.png"),
};

interface Props {
  newProfile: NewProfile;
  Registration?: boolean;
  setNewProfile: Dispatch<SetStateAction<NewProfile>>;
}

const InputSections: FC<Props> = ({
  newProfile,
  setNewProfile,
  Registration = false,
}) => {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(false);
  const [showDiagnosisDatePicker, setShowDiagnosisDatePicker] = useState(false);
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);

  return (
    <>
      {!Registration ? (
        <InputRowContainer
          title={"Name"}
          children={
            <TextInput
              style={[styles.rowInput, styles.nameInput]}
              onChangeText={(text) =>
                setNewProfile({ ...newProfile, name: text })
              }
              value={newProfile.name}
              placeholder="Enter your name"
            />
          }
        />
      ) : (
        <></>
      )}

      <InputRowContainer
        title={"Gender"}
        children={
          <Picker
            selectedValue={newProfile.gender}
            onValueChange={(itemValue, itemIndex) =>
              setNewProfile({ ...newProfile, gender: itemValue })
            }
            style={styles.rowInput}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        }
      />

      <InputRowContainer
        title={"Birth Date"}
        children={
          <DatePicker
            setShowDateModal={setShowBirthDatePicker}
            showDateModal={showBirthDatePicker}
            setDate={(selectedDate) =>
              setNewProfile({ ...newProfile, birthDate: selectedDate })
            }
            date={newProfile.birthDate || "DD/MM/YYYY"}
          />
        }
      />

      <InputRowContainer
        title={"User Type"}
        children={
          <Picker
            selectedValue={newProfile.userType}
            onValueChange={(itemValue, itemIndex) =>
              setNewProfile({ ...newProfile, userType: itemValue })
            }
            style={styles.rowInput}
          >
            <Picker.Item label="Fighter (Patient)" value="patient" />
            <Picker.Item label="Family member" value="family" />
            <Picker.Item label="Supporter (Friend)" value="friend" />
            <Picker.Item label="Health care pro" value="professional" />
            <Picker.Item label="Caregiver" value="caregiver" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        }
      />

      <InputRowContainer
        title={"Cancer Type"}
        children={
          <>
            <TouchableOpacity
              onPress={() => setPickerVisible(true)}
              style={[styles.rowInput, { paddingVertical: 15 }]}
            >
              <Text
                style={styles.buttonText}
                numberOfLines={1} // Ensure text is on one line
                ellipsizeMode="tail" // Add ellipsis at the end if text is too long
              >
                {newProfile.cancerType !== ""
                  ? newProfile.cancerType.charAt(0).toUpperCase() +
                    newProfile.cancerType.slice(1) +
                    " Cancer"
                  : "Other Cancer"}
              </Text>
              <Image
                source={
                  cancerTypeRibbon[newProfile.cancerType] ||
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
              setNewProfile={setNewProfile}
              setPickerVisible={setPickerVisible}
              newProfile={newProfile}
            />
          </>
        }
      />

      {Registration ? (
        <Text style={styles.optionalLabel}>
          Optional - you can add this later
        </Text>
      ) : (
        <></>
      )}

      <InputRowContainer
        title={"Diagnosis Date"}
        children={
          <DatePicker
            setShowDateModal={setShowDiagnosisDatePicker}
            showDateModal={showDiagnosisDatePicker}
            setDate={(selectedDate) =>
              setNewProfile({ ...newProfile, diagnosisDate: selectedDate })
            }
            date={newProfile.diagnosisDate || "DD/MM/YYYY"}
          />
        }
      />

      <InputRowContainer
        title={"Cancer Stage"}
        children={
          <Picker
            selectedValue={newProfile.stage}
            onValueChange={(itemValue, itemIndex) =>
              setNewProfile({ ...newProfile, stage: itemValue })
            }
            style={styles.rowInput}
          >
            <Picker.Item label="No stage" value="no" />
            <Picker.Item label="Stage 0" value="0" />
            <Picker.Item label="Stage 1" value="1" />
            <Picker.Item label="Stage 2" value="2" />
            <Picker.Item label="Stage 3" value="3" />
            <Picker.Item label="Stage 4" value="4" />
            <Picker.Item label="I don't know" value="" />
          </Picker>
        }
      />

      <InputRowContainer
        title={"Country"}
        children={
          <>
            <TouchableOpacity
              onPress={() => setCountryPickerVisible(true)}
              style={[
                styles.rowInput,
                { paddingVertical: 12, alignItems: "center" },
              ]}
            >
              <Text
                style={styles.buttonText}
                numberOfLines={1} // Ensure text is on one line
                ellipsizeMode="tail" // Add ellipsis at the end if text is too long
              >
                {newProfile?.country.name !== ""
                  ? newProfile.country.name
                  : "Pick your location"}
              </Text>

              <View style={{ marginLeft: -25 }}>
                <CountryPickerCustom
                  countryPickerVisible={countryPickerVisible}
                  setCountryPickerVisible={setCountryPickerVisible}
                  setCountry={({ cca2, name }) => {
                    setNewProfile({
                      ...newProfile,
                      country: { ...newProfile.country, cca2, name },
                    });
                  }}
                  country={newProfile.country}
                />
              </View>
              <MaterialIcons
                name="arrow-drop-down"
                size={24}
                color="gray"
                style={{ paddingRight: 6 }}
              />
            </TouchableOpacity>
          </>
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
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
  },
  buttonText: {
    width: "69%",
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
  },
  nameInput: {
    flex: 1.91,
    paddingLeft: 14,
  },
  optionalLabel: {
    padding: 5,
    paddingLeft: 5,
    paddingTop: 10,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#e1e1e1",
    borderTopWidth: 1.2,
    borderTopColor: "#e1e1e1",
  },
});

export default InputSections;
