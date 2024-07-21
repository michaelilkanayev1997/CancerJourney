import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import LostPassword from "@views/auth/LostPassword";
import SignIn from "@views/auth/SignIn";
import SignUp from "@views/auth/SignUp";
import Verification from "@views/auth/Verification";
import RegistrationForm from "@views/RegistrationForm";
import { AuthStackParamList } from "src/@types/navigation";
import { getProfile } from "src/store/auth";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  const { t } = useTranslation();
  const profile = useSelector(getProfile);
  console.log(profile);
  console.log(profile?.userType === "");
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      {!profile && (
        <>
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="LostPassword" component={LostPassword} />
          <Stack.Screen name="Verification" component={Verification} />
        </>
      )}
      {/* If User dont have userType show RegistrationForm */}
      {profile?.userType === "" && profile && (
        <Stack.Screen
          name="RegistrationForm"
          component={RegistrationForm}
          options={{ title: t("registration-form") }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;
