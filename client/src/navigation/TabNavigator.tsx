import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "@views/Home";
import Profile from "@views/Profile";
import Upload from "@views/Upload";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeScreen" component={Home} />
      <Tab.Screen name="ProfileScreen" component={Profile} />
      <Tab.Screen name="UploadScreen" component={Upload} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
