import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import colors from "@utils/colors";
import Main from "@views/bottomTab/posts/Main";
import CustomDrawer from "@components/CustomDrawer";
import NewPost from "@views/bottomTab/posts/NewPost";

const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

const SocialTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabbarStyle,
        tabBarLabelStyle: styles.tabbarLabelStyle,
      }}
    >
      <Tab.Screen name="Main" component={Main} />
      <Tab.Screen name="New Post" component={NewPost} />
      <Tab.Screen name="Favorites" component={NewPost} />
    </Tab.Navigator>
  );
};

const SocialNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: colors.PRIMARY,
        drawerActiveTintColor: colors.INFO,
        drawerInactiveTintColor: "#333",
        drawerLabelStyle: { marginLeft: -25, fontSize: 15 },
        swipeEnabled: false,
        drawerStyle: {
          width: 240, // Width of the drawer
        },
      }}
    >
      <Drawer.Screen name="SocialTabs" component={SocialTabs} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  tabbarStyle: {
    backgroundColor: "white",
    height: 42,
  },
  tabbarLabelStyle: {
    color: colors.CONTRAST,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "none",
  },
});

export default SocialNavigator;
