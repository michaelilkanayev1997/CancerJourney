import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

import colors from "@utils/colors";
import Medications from "@views/bottomTab/schedule/Medications";
import Appointments from "@views/bottomTab/schedule/Appointments";

const Tab = createMaterialTopTabNavigator();

const ScheduleNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabbarStyle,
        tabBarLabelStyle: styles.tabbarLabelStyle,
      }}
    >
      <Tab.Screen
        name="Appointments"
        component={Appointments}
        options={{ title: t("appointments") }}
      />
      <Tab.Screen
        name="Medications"
        component={Medications}
        options={{ title: t("medications") }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabbarStyle: {
    backgroundColor: "white",
  },
  tabbarLabelStyle: {
    color: colors.CONTRAST,
    fontSize: 12,
    fontWeight: "600",
  },
});

export default ScheduleNavigator;
