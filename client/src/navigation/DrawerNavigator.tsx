import { createDrawerNavigator } from "@react-navigation/drawer";
import { Entypo } from "@expo/vector-icons";

import Upload from "@views/bottomTab/upload/Upload";
import CustomDrawer from "@components/CustomDrawer";
import colors from "@utils/colors";
import TabNavigator from "./TabNavigator";
import RegistrationForm from "@views/RegistrationForm";
import { useSelector } from "react-redux";
import { getAuthState } from "src/store/auth";
import { usePushNotifications } from "src/hooks/usePushNotifications";
import Profile from "@views/bottomTab/profile/Profile";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { profile } = useSelector(getAuthState);

  // Register for push notifications and update token if necessary
  usePushNotifications(profile?.expoPushToken || "", profile?.id || null);
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
      {/* If User dont have userType show RegistrationForm */}
      {profile?.userType === "" && (
        <Drawer.Screen name="RegistrationForm" component={RegistrationForm} />
      )}
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
