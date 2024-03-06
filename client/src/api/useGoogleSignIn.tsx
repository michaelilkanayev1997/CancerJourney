import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useDispatch } from "react-redux";

import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from "@env";
import { Keys, saveToAsyncStorage } from "@utils/asyncStorage";
import {
  updateBusyState,
  updateLoggedInState,
  updateProfile,
} from "src/store/auth";
import client from "./client";
import catchAsyncError from "./catchError";
import { ToastNotification } from "@utils/toastConfig";

WebBrowser.maybeCompleteAuthSession();

// Google Client IDs
const androidClientId = ANDROID_CLIENT_ID;
const iosClientId = IOS_CLIENT_ID;

const useGoogleSignIn = () => {
  const dispatch = useDispatch();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId,
    iosClientId,
  });

  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  const getUserInfo = async (googleToken: string) => {
    if (!googleToken) return;

    try {
      const { data } = await client.post("/auth/google-sign-in", {
        googleToken,
      });

      if (data) {
        await saveToAsyncStorage(Keys.AUTH_TOKEN, data.token);
        return data.profile;
      }
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    }
  };

  const handleSignInWithGoogle = async () => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      dispatch(updateBusyState(true));
      const accessToken = response.authentication.accessToken;
      const profile = await getUserInfo(accessToken);

      if (profile) {
        dispatch(updateProfile(profile));
        dispatch(updateLoggedInState(true));
      }
      dispatch(updateBusyState(false));
    }
  };

  return {
    promptGoogleSignIn: promptAsync,
    request,
  };
};

export default useGoogleSignIn;
