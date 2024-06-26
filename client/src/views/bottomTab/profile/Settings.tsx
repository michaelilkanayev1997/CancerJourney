import { FC } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import colors from "@utils/colors";
import {
  getAuthState,
  updateBusyState,
  updateLoggedInState,
  updateProfile,
} from "src/store/auth";
import { Keys, removeFromAsyncStorage } from "@utils/asyncStorage";
import catchAsyncError from "src/api/catchError";
import { getClient } from "src/api/client";
import { ToastNotification } from "@utils/toastConfig";
import { useQueryClient } from "react-query";

interface Props {}

const Settings: FC<Props> = (props) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { profile } = useSelector(getAuthState);

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
        <Text style={styles.title}>Profile Settings</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>History</Text>
      </View>

      <View style={styles.settingOptionsContainer}>
        <Pressable
          onPress={() => console.log("first")}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonTitle}>Clear All</Text>
        </Pressable>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Logout</Text>
      </View>

      <View style={styles.settingOptionsContainer}>
        <Pressable
          onPress={() => handleLoggout(true)}
          style={styles.buttonContainer}
        >
          <AntDesign name="logout" size={20} color={colors.CONTRAST} />
          <Text style={styles.buttonTitle}>Logout From All</Text>
        </Pressable>
        <Pressable
          onPress={() => handleLoggout()}
          style={styles.buttonContainer}
        >
          <AntDesign name="logout" size={20} color={colors.CONTRAST} />
          <Text style={styles.buttonTitle}>Logout</Text>
        </Pressable>
      </View>
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
