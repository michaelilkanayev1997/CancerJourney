import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

import {
  getAuthState,
  updateBusyState,
  updateLoggedInState,
  updateProfile,
  updateViewedOnBoardingState,
} from "src/store/auth";
import AuthNavigator from "./AuthNavigator";
import {
  Keys,
  clearAsyncStorage,
  getFromAsyncStorage,
} from "@utils/asyncStorage";
import client from "src/api/client";
import Loader from "@ui/Loader";
import colors from "@utils/colors";
import OnboardingNavigator from "./OnboardingNavigator";
import { toastConfig } from "@utils/toastConfig";
import DrawerNavigator from "./DrawerNavigator";
import { usePushNotifications } from "src/hooks/usePushNotifications";

interface Props {
  setSafeAreaColor?: (color: string) => void;
}

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.PRIMARY,
    primary: colors.ICON,
  },
};

const AppNavigator: FC<Props> = ({ setSafeAreaColor }) => {
  const { loggedIn, busy, viewedOnBoarding, profile } =
    useSelector(getAuthState);

  const dispatch = useDispatch();

  //clearAsyncStorage();
  useEffect(() => {
    const fetchAuthInfo = async () => {
      dispatch(updateBusyState(true));
      try {
        const viewedOnBoarding = await getFromAsyncStorage(
          Keys.VIEWED_ON_BOARDING
        );
        if (viewedOnBoarding) {
          dispatch(updateViewedOnBoardingState(true));
        }

        const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
        if (token) {
          const { data } = await client.get("/auth/is-auth", {
            headers: { Authorization: "Bearer " + token },
          });

          dispatch(updateProfile(data.profile));
          dispatch(updateLoggedInState(true));
          console.log("my auth : ", data);
        }
      } catch (error) {
        console.log(error);
      }

      dispatch(updateBusyState(false));
    };

    fetchAuthInfo();
  }, []);

  // Register for push notifications and update token if necessary
  const { expoPushToken, notification } = usePushNotifications(
    profile?.expoPushToken || "",
    profile?.id || null
  );

  useEffect(() => {
    if (profile) {
      console.log("notification", JSON.stringify(notification, undefined, 2));
      console.log("expoPushToken", expoPushToken?.data);
    }
  }, [profile, notification, expoPushToken]);

  return (
    <>
      <NavigationContainer theme={AppTheme}>
        {busy ? (
          <View style={styles.loaderContainer}>
            <Loader />
          </View>
        ) : loggedIn ? (
          <DrawerNavigator />
        ) : !viewedOnBoarding ? (
          <OnboardingNavigator setSafeAreaColor={setSafeAreaColor} />
        ) : (
          <AuthNavigator />
        )}
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    transform: [{ scale: 1.5 }],
    backgroundColor: colors.PRIMARY_DARK2,
  },
});

export default AppNavigator;
