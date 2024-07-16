import { FC, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import colors from "@utils/colors";
import {
  getAuthState,
  getProfile,
  updateBusyState,
  updateLoggedInState,
  updateProfile,
} from "src/store/auth";
import { Keys, removeFromAsyncStorage } from "@utils/asyncStorage";
import catchAsyncError from "src/api/catchError";
import { getClient } from "src/api/client";
import { ToastNotification } from "@utils/toastConfig";
import { useQueryClient } from "react-query";
import LanguageSettingsModal from "@components/LanguageSettingsModal";

interface Props {}

const Settings: FC<Props> = (props) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  const queryClient = useQueryClient();
  const profile = useSelector(getProfile);

  const { t } = useTranslation();

  const handleLoggout = async (fromAll?: boolean) => {
    dispatch(updateBusyState(true));
    try {
      const endpoint = "/auth/log-out?fromAll=" + (fromAll ? "yes" : "");

      const client = await getClient();
      await client.post(endpoint);

      // Clear the React Query cache
      queryClient.clear(); // This removes all queries from the cache

      await removeFromAsyncStorage(Keys.AUTH_TOKEN);
      dispatch(updateProfile(null));
      dispatch(updateLoggedInState(false));
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    }
    dispatch(updateBusyState(false));
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t("profile-settings")}</Text>
      </View>

      <View style={styles.settingOptionsContainer}>
        <TouchableOpacity
          onPress={() => console.log("remove-all-posts")}
          style={styles.buttonContainer}
        >
          <AntDesign name="delete" size={20} color={colors.CONTRAST} />
          <Text style={styles.buttonTitle}>{t("remove-all-posts")}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t("app-preferences")}</Text>
      </View>

      <View style={styles.settingOptionsContainer}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.buttonContainer}
        >
          <Ionicons name="language-outline" size={20} color={colors.CONTRAST} />
          <Text style={styles.buttonTitle}>{t("change-language")}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{t("logout")}</Text>
      </View>
      <View style={styles.settingOptionsContainer}>
        <TouchableOpacity
          onPress={() => handleLoggout(true)}
          style={styles.buttonContainer}
        >
          <AntDesign name="logout" size={20} color={colors.CONTRAST} />
          <Text style={styles.buttonTitle}>{t("logout-from-all")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLoggout()}
          style={styles.buttonContainer}
        >
          <AntDesign name="logout" size={20} color={colors.CONTRAST} />
          <Text style={styles.buttonTitle}>{t("logout")}</Text>
        </TouchableOpacity>
      </View>
      <LanguageSettingsModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  titleContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.SECONDARY,
    paddingBottom: 5,
    marginTop: 15,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: colors.SECONDARY,
  },
  settingOptionsContainer: {
    marginTop: 15,
    paddingLeft: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  buttonTitle: {
    color: colors.CONTRAST,
    fontSize: 18,
    marginLeft: 5,
  },
});

export default Settings;
