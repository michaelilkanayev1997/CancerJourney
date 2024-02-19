import { NavigationContainer } from "@react-navigation/native";
import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getAuthState,
  updateBusyState,
  updateLoggedInState,
  updateProfile,
} from "src/store/auth";
import AuthNavigator from "./AuthNavigator";
import TabNavigator from "./TabNavigator";
import {
  Keys,
  clearAsyncStorage,
  getFromAsyncStorage,
} from "@utils/asyncStorage";
import client from "src/api/client";
import { StyleSheet, View } from "react-native";
import Loader from "@ui/Loader";
import colors from "@utils/colors";

interface Props {}

const AppNavigator: FC<Props> = (props) => {
  const { loggedIn, busy } = useSelector(getAuthState);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuthInfo = async () => {
      dispatch(updateBusyState(true));
      try {
        const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
        if (!token) {
          return dispatch(updateBusyState(false));
        }

        const { data } = await client.get("/auth/is-auth", {
          headers: { Authorization: "Bearer " + token },
        });

        dispatch(updateProfile(data.profile));
        dispatch(updateLoggedInState(true));

        console.log("my auth : ", data);
      } catch (error) {
        console.log(error);
      }

      setTimeout(() => {
        dispatch(updateBusyState(false));
      }, 4000);
    };

    fetchAuthInfo();
  }, []);

  return (
    <NavigationContainer>
      {busy ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : null}

      {loggedIn ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
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
