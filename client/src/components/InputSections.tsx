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
import { useTranslation } from "react-i18next";

import CustomPicker from "./CustomPicker";
import InputRowContainer from "@ui/InputRowContainer";
import DatePicker from "@ui/DatePicker";
import CountryPickerCustom from "./CountryPickerCustom";
import { cancerTypeRibbon } from "@utils/enums";

export interface NewProfile {
  userType: string;
  diagnosisDate: Date | null;
  cancerType: string;
  stage: string;
  name?: string;
  gender: string;
  birthDate: Date | null;
  country: { cca2: string; name: string; flag: string };
}

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

  const { t } = useTranslation();

  return (
    <>
      {!Registration ? (
        <InputRowContainer
          title={t("name")}
          children={
            <TextInput
              style={[styles.rowInput, styles.nameInput]}
              onChangeText={(text) =>
                setNewProfile({ ...newProfile, name: text })
              }
              value={newProfile.name}
              placeholder={t("enter-your-name")}
            />
          }
        />
      ) : (
        <></>
      )}

      <InputRowContainer
        title={t("gender")}
        children={
          <Picker
            selectedValue={newProfile.gender}
            onValueChange={(itemValue, itemIndex) =>
              setNewProfile({ ...newProfile, gender: itemValue })
            }
            style={styles.rowInput}
          >
            <Picker.Item label={t("male")} value="Male" />
            <Picker.Item label={t("female")} value="Female" />
          </Picker>
        }
      />

      <InputRowContainer
        title={t("birth-date")}
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
        title={t("user-type")}
        children={
          <Picker
            selectedValue={newProfile.userType}
            onValueChange={(itemValue, itemIndex) =>
              setNewProfile({ ...newProfile, userType: itemValue })
            }
            style={styles.rowInput}
          >
            <Picker.Item label={t("fighter-(patient)")} value="patient" />
            <Picker.Item label={t("family-member")} value="family" />
            <Picker.Item label={t("supporter-(friend)")} value="friend" />
            <Picker.Item label={t("health-care-pro")} value="professional" />
            <Picker.Item label={t("caregiver")} value="caregiver" />
            <Picker.Item label={t("other")} value="other" />
          </Picker>
        }
      />

      <InputRowContainer
        title={t("cancer-type")}
        children={
          <>
            <TouchableOpacity
              onPress={() => setPickerVisible(true)}
              style={[styles.rowInput, { paddingVertical: 15 }]}
            >
              <Text
                style={styles.cancerTypeButtonText}
                numberOfLines={1} // Ensure text is on one line
                ellipsizeMode="tail" // Add ellipsis at the end if text is too long
              >
                {newProfile.cancerType !== ""
                  ? t(newProfile.cancerType)
                  : t("other-cancer")}
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
          {t("optional-you-can-add-this-later")}
        </Text>
      ) : (
        <></>
      )}

      <InputRowContainer
        title={t("diagnosis-date")}
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
        title={t("cancer-stage")}
        children={
          <Picker
            selectedValue={newProfile.stage}
            onValueChange={(itemValue, itemIndex) =>
              setNewProfile({ ...newProfile, stage: itemValue })
            }
            style={styles.rowInput}
          >
            <Picker.Item label={t("no-stage")} value="no" />
            <Picker.Item label={t("stage-0")} value="0" />
            <Picker.Item label={t("stage-1")} value="1" />
            <Picker.Item label={t("stage-2")} value="2" />
            <Picker.Item label={t("stage-3")} value="3" />
            <Picker.Item label={t("stage-4")} value="4" />
            <Picker.Item label={t("i-don't-know")} value="" />
          </Picker>
        }
      />

      <InputRowContainer
        title={t("country")}
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
                style={styles.countryButtonText}
                numberOfLines={1} // Ensure text is on one line
                ellipsizeMode="tail" // Add ellipsis at the end if text is too long
              >
                {newProfile?.country.name !== ""
                  ? `${newProfile.country.name}    ${newProfile.country.flag}`
                  : t("pick-your-location")}
              </Text>

              <View style={{ marginLeft: -25 }}>
                <CountryPickerCustom
                  countryPickerVisible={countryPickerVisible}
                  setCountryPickerVisible={setCountryPickerVisible}
                  setCountry={({ cca2, name, flag }) => {
                    setNewProfile({
                      ...newProfile,
                      country: { ...newProfile.country, cca2, name, flag },
                    });
                  }}
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
  cancerTypeButtonText: {
    width: "69%",
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
    textAlign: "left",
  },
  countryButtonText: {
    width: "80%",
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
    textAlign: "left",
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
