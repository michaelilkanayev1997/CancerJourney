import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet } from "react-native";

import colors from "@utils/colors";
import Posts from "@views/bottomTab/posts/Posts";

const Tab = createMaterialTopTabNavigator();

const SocialNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabbarStyle,
        tabBarLabelStyle: styles.tabbarLabelStyle,
      }}
    >
      <Tab.Screen name="Main" component={Posts} />
      <Tab.Screen name="Posts" component={Posts} />
      <Tab.Screen name="Favorites" component={Posts} />
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

export default SocialNavigator;
