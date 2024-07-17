import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import CustomPostButton from "@ui/bottomTab/CustomPostButton";
import AnimatedIcon from "@ui/bottomTab/AnimatedIcon";
import UploadFileNavigator from "./UploadFileNavigator";
import SocialNavigator from "./SocialNavigator";
import ProfileNavigator from "./ProfileNavigator";
import ScheduleNavigator from "./ScheduleNavigator";
import HomeNavigator from "./HomeNavigator";
import { getProfile } from "src/store/auth";
import { usePushNotifications } from "src/hooks/usePushNotifications";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { t } = useTranslation();
  const profile = useSelector(getProfile);

  // Register for push notifications and update token if necessary
  usePushNotifications(profile?.expoPushToken || "", profile?.id || null);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          ...styles.tabBarStyle,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AnimatedIcon
              label={t("home")}
              icon="home"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AnimatedIcon
              label={t("profile")}
              icon="user"
              size={size}
              color={color}
            />
          ),
          headerStyle: {
            shadowColor: "#000", // Shadow color
            shadowOffset: { width: 0, height: 2 }, // Shadow offset
            shadowOpacity: 0.1, // Shadow opacity
            shadowRadius: 3.84, // Shadow radius
            elevation: 5, // Elevation for Android
          },
        }}
      />
      <Tab.Screen
        name="PostScreen"
        component={SocialNavigator}
        options={{
          tabBarIcon: (props) => {
            return (
              <Image
                source={require("@assets/Icons/icon-color.png")}
                resizeMode="contain"
                style={{ width: 70, height: 70 }}
              />
            );
          },

          tabBarButton: (props) => <CustomPostButton {...props} />,
        }}
      />
      <Tab.Screen
        name="UploadScreen"
        component={UploadFileNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AnimatedIcon
              label={t("upload")}
              icon="upload"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleNavigator}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AnimatedIcon
              label={t("schedule")}
              icon="calendar"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: "white",
    position: "absolute",
    bottom: -4,
    left: -4,
    right: -4,
    borderRadius: 15,
    height: 80,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default TabNavigator;
