import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { ANDROID_CLIENT_ID, IOS_CLIENT_ID } from "@env";

WebBrowser.maybeCompleteAuthSession();

// Google Client IDs
const androidClientId = ANDROID_CLIENT_ID;
const iosClientId = IOS_CLIENT_ID;
const useGoogleSignIn = () => {
  const [googleUserInfo, setGoogleUserInfo] = useState(null);
  const [token, setToken] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId,
    iosClientId,
  });

  console.log("token", token);
  console.log("user", googleUserInfo);

  useEffect(() => {
    handleSignInWithGoogle();
  }, [response, token]);

  const handleSignInWithGoogle = async () => {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success") {
        setToken(response.authentication.accessToken);
        getUserInfo(response.authentication.accessToken);
      }
    } else {
      setGoogleUserInfo(JSON.parse(user));
      console.log("loaded locally");
    }
  };

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setGoogleUserInfo(user);
    } catch (error) {
      // Add your own error handler here
    }
  };

  return { googleUserInfo, promptGoogleSignIn: promptAsync, request };
};

export default useGoogleSignIn;
