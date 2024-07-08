import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import Profile from "@views/bottomTab/profile/Profile";
import Settings from "@views/bottomTab/profile/Settings";
import { ProfileStackParamList } from "src/@types/navigation";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator = () => {
  const { t } = useTranslation();

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
          title: t("settings"),
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
