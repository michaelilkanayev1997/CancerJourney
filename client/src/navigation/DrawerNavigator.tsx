import { createDrawerNavigator } from "@react-navigation/drawer";
import { Entypo } from "@expo/vector-icons";

import Home from "@views/bottonTab/Home";
import Profile from "@views/bottonTab/Profile";
import TabNavigator from "./TabNavigator";
import Upload from "@views/bottonTab/Upload";
import CustomDrawer from "@components/CustomDrawer";
import colors from "@utils/colors";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: colors.PRIMARY,
        drawerActiveTintColor: colors.ICON,
        drawerInactiveTintColor: "#333",
        drawerLabelStyle: { marginLeft: -25, fontSize: 15 },
      }}
    >
      <Drawer.Screen
        name="Main"
        component={TabNavigator}
        options={{
          drawerIcon: (props) => (
            <Entypo name="home" size={22} color={props.color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerIcon: (props) => (
            <Entypo name="home" size={22} color={props.color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: (props) => (
            <Entypo name="home" size={22} color={props.color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Upload"
        component={Upload}
        options={{
          drawerIcon: (props) => (
            <Entypo name="home" size={22} color={props.color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Upload}
        options={{
          drawerIcon: (props) => (
            <Entypo name="home" size={22} color={props.color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
