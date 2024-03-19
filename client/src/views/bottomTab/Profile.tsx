import { FC, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Vibration,
  Keyboard,
} from "react-native";
import { useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Animated from "react-native-reanimated";

import colors from "@utils/colors";
import { getAuthState } from "src/store/auth";
import ProfilePhotoModal from "@components/ProfilePhotoModal";
import { useFadeInRight } from "@utils/animated";
import ProfileHeader from "@ui/ProfileHeader";
import InputSections, { NewProfile } from "@components/InputSections";

interface Props {}

const Profile: FC<Props> = (props) => {
  const navigation = useNavigation();
  const [PhotoModalVisible, setPhotoModalVisible] = useState(false);
  const [keyboardIsShown, setKeyboardIsShown] = useState(false);
  const { profile } = useSelector(getAuthState);
  const [newProfile, setNewProfile] = useState<NewProfile>({
    userType: "Family member",
    diagnosisDate: null,
    cancerType: "bone",
    stage: "",
    name: profile?.name || "",
    gender: "Male",
    birthDate: null,
    country: { cca2: "US", name: "" },
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

        <InputSections newProfile={newProfile} setNewProfile={setNewProfile} />
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
  saveButtonContainer: {
    marginRight: 28,
  },
  saveButtonText: {
    fontSize: 17,
    fontWeight: "600",
  },
});

export default Profile;
