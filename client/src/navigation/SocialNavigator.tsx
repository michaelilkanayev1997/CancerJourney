import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet } from "react-native";

import colors from "@utils/colors";
import Main from "@views/bottomTab/posts/Main";
import MyPosts from "@views/bottomTab/posts/MyPosts";

const Tab = createMaterialTopTabNavigator();

const SocialNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabbarStyle,
        tabBarLabelStyle: styles.tabbarLabelStyle,
      }}
    >
      <Tab.Screen name="Main" component={Main} />
      <Tab.Screen name="My Posts" component={MyPosts} />
      <Tab.Screen name="Favorites" component={MyPosts} />
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
