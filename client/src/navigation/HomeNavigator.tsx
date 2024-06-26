import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "@views/bottomTab/home/Home";
import StudyDetails from "@views/bottomTab/home/StudyDetails";
import Settings from "@views/bottomTab/profile/Settings";
import { HomeStackParamList } from "src/@types/navigation";

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="StudyDetails"
        component={StudyDetails}
        options={{
          title: "Study Details",
          headerTransparent: false,
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerTransparent: false,
          headerShown: true,
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
