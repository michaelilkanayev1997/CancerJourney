import { createDrawerNavigator } from "@react-navigation/drawer";
import { Entypo } from "@expo/vector-icons";

import Profile from "@views/bottomTab/Profile";
import Upload from "@views/bottomTab/Upload";
import CustomDrawer from "@components/CustomDrawer";
import colors from "@utils/colors";
import TabNavigator from "./TabNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
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
      }}
    >
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
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
      <Drawer.Screen
        name="sd"
        component={Upload}
        options={{
          drawerIcon: (props) => (
            <Entypo name="home" size={22} color={props.color} />
          ),
        }}
      />
      <Drawer.Screen
        name="gs"
        component={Upload}
        options={{
          drawerIcon: (props) => (
            <Entypo name="home" size={22} color={props.color} />
          ),
        }}
      />
      <Drawer.Screen
        name="as"
        component={Upload}
        options={{
          drawerIcon: (props) => (
            <Entypo name="home" size={22} color={props.color} />
          ),
        }}
      />
      <Drawer.Screen
        name="asd"
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
