import Welcome from "@components/Welcome";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnBoarding from "@views/OnBoarding";
import LostPassword from "@views/auth/LostPassword";
import SignIn from "@views/auth/SignIn";
import SignUp from "@views/auth/SignUp";
import Verification from "@views/auth/Verification";
import { useSelector } from "react-redux";
import { AuthStackParamList } from "src/@types/navigation";
import { getAuthState } from "src/store/auth";

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  const authState = useSelector(getAuthState);
  //console.log(authState);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="LostPassword" component={LostPassword} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen name="Welcome" component={Welcome} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
