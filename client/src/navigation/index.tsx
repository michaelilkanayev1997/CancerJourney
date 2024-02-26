import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { FC, useEffect } from "react";
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
  const { loggedIn, busy, viewedOnBoarding } = useSelector(getAuthState);
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
  notification: {
    width: "80%",
    margin: 20,
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageContainer: {
    flexShrink: 1,
    marginLeft: 15,
  },
  messageTitle: {
    color: colors.INACTIVE_CONTRAST,
    fontWeight: "bold",
    fontSize: 16,
  },
  messageText: {
    color: colors.INACTIVE_CONTRAST,
    fontWeight: "500",
    fontSize: 14,
    flexWrap: "wrap",
  },
});

export default AppNavigator;
