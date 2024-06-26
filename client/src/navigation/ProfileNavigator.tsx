import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Profile from "@views/bottomTab/profile/Profile";
import Settings from "@views/bottomTab/profile/Settings";
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
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerTransparent: false,
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
