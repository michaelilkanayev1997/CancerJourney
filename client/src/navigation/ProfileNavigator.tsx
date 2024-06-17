import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Settings from "@views/bottomTab/Settings";
import Profile from "@views/bottomTab/Profile";
import { ProfileStackParamList } from "src/@types/navigation";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
