import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet } from "react-native";

import colors from "@utils/colors";
import Settings from "@views/bottomTab/Settings";

const Tab = createMaterialTopTabNavigator();

const SocialNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabbarStyle,
        tabBarLabelStyle: styles.tabbarLabelStyle,
      }}
    >
      <Tab.Screen name="Main" component={Settings} />
      <Tab.Screen name="Posts" component={Settings} />
      <Tab.Screen name="Favorites" component={Settings} />
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

export default SocialNavigator;
