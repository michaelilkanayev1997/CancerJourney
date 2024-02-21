import { FC, useEffect } from "react";

import Welcome from "@components/Welcome";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import colors from "@utils/colors";
import OnBoarding from "@views/OnBoarding";
import { AuthStackParamList } from "src/@types/navigation";

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface ChildProps {
  setSafeAreaColor: (color: string) => void;
}

const OnboardingNavigator: FC<ChildProps> = ({ setSafeAreaColor }) => {
  useEffect(() => {
    setSafeAreaColor(colors.PRIMARY_DARK2);
    return () => {
      setSafeAreaColor(colors.PRIMARY);
    };
  }, [setSafeAreaColor]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen name="Welcome" component={Welcome} />
    </Stack.Navigator>
  );
};

export default OnboardingNavigator;
