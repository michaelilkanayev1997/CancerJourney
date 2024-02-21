import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import colors from "@utils/colors";
import Home from "@views/bottonTab/Home";
import Profile from "@views/bottonTab/Profile";
import Upload from "@views/bottonTab/Upload";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.PRIMARY,
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={Home}
        options={{
          tabBarIcon: (props) => {
            return (
              <Feather name="home" size={props.size} color={props.color} />
            );
          },
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={Profile}
        options={{
          tabBarIcon: (props) => {
            return (
              <Feather name="user" size={props.size} color={props.color} />
            );
          },
          tabBarLabel: "Profile",
        }}
      />
      <Tab.Screen
        name="UploadScreen"
        component={Upload}
        options={{
          tabBarIcon: (props) => {
            return (
              <Feather name="upload" size={props.size} color={props.color} />
            );
          },
          tabBarLabel: "Upload",
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
