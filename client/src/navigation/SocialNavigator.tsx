import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import colors from "@utils/colors";
import Main from "@views/bottomTab/posts/Main";
import CustomDrawer from "@components/CustomDrawer";
import NewPost from "@views/bottomTab/posts/NewPost";
import PublicProfile from "@views/bottomTab/posts/PublicProfile";
import PostLikes from "@views/bottomTab/posts/PostLikes";
import PostReport from "@views/bottomTab/posts/PostReport";
import PostReplyAdd from "@views/bottomTab/posts/PostReplyAdd";
import PostReplies from "@views/bottomTab/posts/PostReplies";

const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const Forum = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="PostLikes" component={PostLikes} />
      <Stack.Screen name="PublicProfile" component={PublicProfile} />
      <Stack.Screen name="PostReport" component={PostReport} />
      <Stack.Screen name="PostReplyAdd" component={PostReplyAdd} />
      <Stack.Screen name="PostReplies" component={PostReplies} />
    </Stack.Navigator>
  );
};

const SocialTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Forum"
      screenOptions={{
        tabBarStyle: styles.tabbarStyle,
        tabBarLabelStyle: styles.tabbarLabelStyle,
        lazy: true, // Enable lazy rendering
        lazyPreloadDistance: 1, // Preload one adjacent screen
        lazyPlaceholder: () => (
          <View style={styles.lazyPlaceholder}>
            <ActivityIndicator size="large" color={colors.ICON} />
          </View>
        ),
        swipeEnabled: false,
      }}
    >
      <Tab.Screen name="Forum" component={Forum} />
      <Tab.Screen name="New Post" component={NewPost} />
      <Tab.Screen
        name="Social Profile"
        component={PublicProfile}
        initialParams={{ publicProfile: false }}
      />
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
    height: 40,
  },
  tabbarLabelStyle: {
    color: colors.CONTRAST,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "none",
    marginTop: -8,
  },
  lazyPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SocialNavigator;
