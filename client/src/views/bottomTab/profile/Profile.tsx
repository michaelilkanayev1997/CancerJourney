import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Vibration,
  Keyboard,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Animated from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import colors from "@utils/colors";
import { getProfile, updateProfile } from "src/store/auth";
import ProfilePhotoModal from "@components/ProfilePhotoModal";
import { useFadeInRight } from "@utils/animated";
import ProfileHeader from "@ui/ProfileHeader";
import InputSections, { NewProfile } from "@components/InputSections";
import { getClient } from "src/api/client";
import { ToastNotification } from "@utils/toastConfig";
import catchAsyncError from "src/api/catchError";
import Loader from "@ui/Loader";

interface Props {}

const Profile: FC<Props> = (props) => {
  const navigation = useNavigation();
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const dispatch = useDispatch();
  const [PhotoModalVisible, setPhotoModalVisible] = useState(false);
  const [keyboardIsShown, setKeyboardIsShown] = useState(false);
  const profile = useSelector(getProfile);
  const [newProfile, setNewProfile] = useState<NewProfile>({
    userType: profile?.userType || "Family member",
    diagnosisDate: profile?.diagnosisDate || null,
    cancerType: profile?.cancerType || "other",
    stage: profile?.stage || "",
    name: profile?.name || "",
    gender: profile?.gender || "Male",
    birthDate: profile?.birthDate || null,
    country: profile?.country || { cca2: "US", name: "", flag: "" },
  });

  const newProfileRef = useRef(newProfile);

  const { t } = useTranslation();

  // Update the ref every time newProfile changes
  useEffect(() => {
    newProfileRef.current = newProfile;
  }, [newProfile]);

  const toggleModalVisible = useCallback(() => {
    setPhotoModalVisible((prevVisible) => !prevVisible);
    Vibration.vibrate(50);
  }, []);

  const handleSubmit = async () => {
    setLoadingUpdate(true);
    try {
      const client = await getClient();
      // Use newProfileRef.current to access the most up-to-date state
      const { data } = await client.post(
        "/auth/update-profile",
        newProfileRef.current
      );

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
                // Handle the save action
                handleSubmit();
              }}
              style={styles.saveButtonContainer}
            >
              <Text style={styles.saveButtonText}>{t("save")}</Text>
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

  // Save Button Animation Setup
  const {
    animatedStyle: SaveBtnAnimatedStyle,
    startAnimation: startSaveBtnAnimation,
  } = useFadeInRight(0);

  return (
    <View
      style={[
        styles.container,
        { marginBottom: loadingUpdate ? 0 : keyboardIsShown ? 15 : 100 },
      ]}
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

      {loadingUpdate && (
        <View style={styles.loaderOverlay}>
          <Loader
            loaderStyle={{
              width: 150,
              height: 150,
            }}
          />
        </View>
      )}
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
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Ensure loader is above the overlay
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Profile;
