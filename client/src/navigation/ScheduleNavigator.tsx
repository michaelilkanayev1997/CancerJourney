import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet } from "react-native";

import colors from "@utils/colors";
import Appointments from "@views/Appointments";
import Medications from "@views/Medications";

const Tab = createMaterialTopTabNavigator();

const ScheduleNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabbarStyle,
        tabBarLabelStyle: styles.tabbarLabelStyle,
      }}
    >
      <Tab.Screen name="Appointments" component={Appointments} />
      <Tab.Screen name="Medications" component={Medications} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabbarStyle: {
    backgroundColor: colors.LIGHT_GREEN,
  },
  tabbarLabelStyle: {
    color: colors.CONTRAST,
    fontSize: 12,
  },
});

export default ScheduleNavigator;
