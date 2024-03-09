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
import Avatar from "@ui/Avatar";
import { useFadeInRight } from "@utils/animated";

interface Props {}

const Profile: FC<Props> = (props) => {
  const navigation = useNavigation();
  const [newProfile, setNewProfile] = useState({
    userType: "Family member",
    diagnosisDate: "",
    cancerType: "Melanoma",
    subtype: "Lentigo Maligna",
    mutation: "",
    stage: "",
    treatmentHistory: "",
    clinicalTrials: false,
    story: "",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    activeSince: "Jan, 2023",
    gender: "Male",
    birthDate: "",
    country: "",
  });
  const [PhotoModalVisible, setPhotoModalVisible] = useState(false);
  const [keyboardIsShown, setKeyboardIsShown] = useState(false);
  const { profile } = useSelector(getAuthState);

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

  let formattedDate = "";
  if (profile?.createdAt) {
    // Check if `createdAt` is defined
    const date = new Date(profile.createdAt); // Now it's safe to create the Date object

    // Format the date
    formattedDate = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <View
      style={[styles.container, { paddingBottom: keyboardIsShown ? 0 : 85 }]}
    >
      <View style={styles.profileHeader}>
        <Avatar
          onButtonPress={toggleModalVisible}
          uri={profile?.avatar || ""}
        />
        <Text style={styles.profileName}>{profile?.name}</Text>
        <Text style={styles.profileEmail}>{profile?.email}</Text>
        <Text style={styles.activeSince}>Active since - {formattedDate}</Text>
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.inputRowContainer}>
          <Text style={styles.rowLabel}>Name</Text>
          <TextInput
            style={styles.rowInput}
            onChangeText={(text) =>
              setNewProfile({ ...newProfile, name: text })
            }
            value={newProfile.name}
            placeholder="Enter your name"
          />
        </View>

        <View style={styles.inputRowContainer}>
          <Text style={styles.rowLabel}>Gender</Text>
          <TextInput
            style={styles.rowInput}
            onChangeText={(text) =>
              setNewProfile({ ...newProfile, gender: text })
            }
            value={newProfile.gender}
            placeholder="Enter your Gender"
          />
        </View>

        <View style={styles.inputRowContainer}>
          <Text style={styles.rowLabel}>Country</Text>
          <TextInput
            style={styles.rowInput}
            onChangeText={(text) =>
              setNewProfile({ ...newProfile, country: text })
            }
            value={newProfile.country}
            placeholder="Enter your Country"
          />
        </View>

        <View style={styles.inputRowContainer}>
          <Text style={styles.rowLabel}>Birth Date</Text>
          <TextInput
            style={styles.rowInput}
            onChangeText={(text) =>
              setNewProfile({ ...newProfile, birthDate: text })
            }
            value={newProfile.birthDate}
            placeholder="DD/MM/YYYY"
          />
        </View>

        <View style={styles.inputRowContainer}>
          <Text style={styles.rowLabel}>Diagnosis Date</Text>
          <TextInput
            style={styles.rowInput}
            onChangeText={(text) =>
              setNewProfile({ ...newProfile, diagnosisDate: text })
            }
            value={newProfile.diagnosisDate}
            placeholder="DD/MM/YYYY"
          />
        </View>

        <View style={styles.inputRowContainer}>
          <Text style={styles.rowLabel}>User Type</Text>

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
        </View>

        <View style={styles.inputRowContainer}>
          <Text style={styles.rowLabel}>Cancer Type</Text>

          <Picker
            selectedValue={newProfile.cancerType}
            onValueChange={(itemValue, itemIndex) =>
              setNewProfile({ ...newProfile, stage: itemValue })
            }
            style={styles.rowInput}
          >
            <Picker.Item label="Breast Cancer" value="breast" />
            <Picker.Item label="Family member" value="family" />
            <Picker.Item label="Supporter (Friend)" value="friend" />
            <Picker.Item label="Health care pro" value="professional" />
            <Picker.Item label="Caregiver" value="caregiver" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        <View style={styles.inputRowContainer}>
          <Text style={styles.rowLabel}>Cancer Stage</Text>

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
        </View>
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
  profileHeader: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 1,
  },
  activeSince: {
    fontSize: 14,
    color: "#bdc3c7",
    marginTop: 5,
  },
  inputRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.PRIMARY,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  rowLabel: {
    flex: 1, // Take up 1/3 of the space
    fontSize: 16,
    color: "#000",
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
