import { FC, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Vibration,
  Keyboard,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Animated from "react-native-reanimated";

import colors from "@utils/colors";
import { getAuthState } from "src/store/auth";
import ProfilePhotoModal from "@components/ProfilePhotoModal";
import { useFadeInRight } from "@utils/animated";
import ProfileHeader from "@ui/ProfileHeader";
import InputRowContainer from "@ui/InputRowContainer";

interface Props {}

const Profile: FC<Props> = (props) => {
  const navigation = useNavigation();
  const [PhotoModalVisible, setPhotoModalVisible] = useState(false);
  const [keyboardIsShown, setKeyboardIsShown] = useState(false);
  const { profile } = useSelector(getAuthState);
  const [newProfile, setNewProfile] = useState({
    userType: "Family member",
    diagnosisDate: "",
    cancerType: "Melanoma",
    subtype: "Lentigo Maligna",
    stage: "",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    activeSince: "Jan, 2023",
    gender: "Male",
    birthDate: "",
    country: "",
  });

  const toggleModalVisible = useCallback(() => {
    setPhotoModalVisible((prevVisible) => !prevVisible);
    Vibration.vibrate(50);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => setKeyboardIsShown(true)
      );
      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => setKeyboardIsShown(false)
      );

      // Reset Animations
      startSaveBtnAnimation();

      navigation.setOptions({
        headerRight: () => (
          <Animated.View style={SaveBtnAnimatedStyle}>
            <TouchableOpacity
              onPress={() => {
                Vibration.vibrate(50);
                // Handle the save action here
              }}
              style={styles.saveButtonContainer}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </Animated.View>
        ),
      });

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
        navigation.setOptions({
          headerRight: () => null, // Removing the button
        });
      };
    }, [navigation])
  );

  const {
    animatedStyle: SaveBtnAnimatedStyle,
    startAnimation: startSaveBtnAnimation,
  } = useFadeInRight(0);

  return (
    <View
      style={[styles.container, { marginBottom: keyboardIsShown ? 15 : 105 }]}
    >
      <ScrollView style={styles.container}>
        <ProfileHeader
          profile={profile}
          toggleModalVisible={toggleModalVisible}
        />

        <InputRowContainer
          title={"Name"}
          children={
            <TextInput
              style={styles.rowInput}
              onChangeText={(text) =>
                setNewProfile({ ...newProfile, name: text })
              }
              value={newProfile.name}
              placeholder="Enter your name"
            />
          }
        />

        <InputRowContainer
          title={"Gender"}
          children={
            <Picker
              selectedValue={newProfile.cancerType}
              onValueChange={(itemValue, itemIndex) =>
                setNewProfile({ ...newProfile, stage: itemValue })
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
            <TextInput
              style={styles.rowInput}
              onChangeText={(text) =>
                setNewProfile({ ...newProfile, birthDate: text })
              }
              value={newProfile.birthDate}
              placeholder="DD/MM/YYYY"
            />
          }
        />

        <InputRowContainer
          title={"Diagnosis Date"}
          children={
            <TextInput
              style={styles.rowInput}
              onChangeText={(text) =>
                setNewProfile({ ...newProfile, diagnosisDate: text })
              }
              value={newProfile.diagnosisDate}
              placeholder="DD/MM/YYYY"
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
            <Picker
              selectedValue={newProfile.cancerType}
              onValueChange={(itemValue, itemIndex) =>
                setNewProfile({ ...newProfile, stage: itemValue })
              }
              style={styles.rowInput}
            >
              <Picker.Item label="Breasts cancer" value="breasts" />
              <Picker.Item label="Family member" value="family" />
              <Picker.Item label="Supporter (Friend)" value="friend" />
              <Picker.Item label="Health care pro" value="professional" />
              <Picker.Item label="Caregiver" value="caregiver" />
              <Picker.Item label="Other" value="other" />
            </Picker>
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
            <TextInput
              style={styles.rowInput}
              onChangeText={(text) =>
                setNewProfile({ ...newProfile, country: text })
              }
              value={newProfile.country}
              placeholder="Enter your Country"
            />
          }
        />
      </ScrollView>
      <ProfilePhotoModal
        isVisible={PhotoModalVisible}
        toggleModalVisible={toggleModalVisible}
        profile={profile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY_LIGHT,
  },
  rowInput: {
    flex: 2, // Take up 2/3 of the space
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 5,
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
  },
  saveButtonContainer: {
    marginRight: 28,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: "600",
  },
});

export default Profile;
