import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from "@env";
import { Keys, saveToAsyncStorage } from "@utils/asyncStorage";
import {
  updateBusyState,
  updateLoggedInState,
  updateProfile,
} from "src/store/auth";
import { useDispatch } from "react-redux";

WebBrowser.maybeCompleteAuthSession();

// Google Client IDs
const androidClientId = ANDROID_CLIENT_ID;
const iosClientId = IOS_CLIENT_ID;

export const getUserInfo = async (token: string) => {
  if (!token) return;
  try {
    const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = await response.json();

    if (user) {
      await saveToAsyncStorage(Keys.GOOGLE_AUTH_TOKEN, token);
      return user;
    }
  } catch (error) {
    // error handler here
  }
};

const useGoogleSignIn = () => {
  const dispatch = useDispatch();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId,
    iosClientId,
  });

  useEffect(() => {
    handleSignInWithGoogle();
  }, [response]);

  const handleSignInWithGoogle = async () => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      dispatch(updateBusyState(true));
      const accessToken = response.authentication.accessToken;
      const user = await getUserInfo(accessToken);

      if (user) {
        dispatch(updateProfile(user));
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
