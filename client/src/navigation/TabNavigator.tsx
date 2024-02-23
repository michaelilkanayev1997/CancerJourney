import { FC, ReactNode, useCallback, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import colors from "@utils/colors";
import Home from "@views/bottonTab/Home";
import Profile from "@views/bottonTab/Profile";
import Upload from "@views/bottonTab/Upload";
import Animated from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

interface CustomPostTabBarButtonProps {
  children: ReactNode;
  onPress?: (event: GestureResponderEvent | any) => void;
}

const CustomPostTabBarButton: FC<CustomPostTabBarButtonProps> = ({
  children,
  onPress,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Set button as focused when screen is focused
      setIsFocused(true);
      return () => {
        // Reset focus state when screen is no longer focused
        setIsFocused(false);
      };
    }, [])
  );

  const backgroundColor = isFocused ? colors.PRIMARY_DARK2 : "white";
  return (
    <View style={{ top: -30, justifyContent: "center", alignItems: "center" }}>
      <Animated.View
        style={[
          {
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor,
            ...styles.shadow,
          },
        ]}
      >
        <TouchableOpacity
          onPress={onPress}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {children}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          position: "absolute",
          bottom: 5,
          left: 5,
          right: 5,
          borderRadius: 15,
          height: 80,
          ...styles.shadow,
        },
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={Home}
        options={{
          tabBarIcon: ({ focused, size, color }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Feather name="home" size={size} color={color} />
              <Text
                style={{
                  color: focused ? color : "#748c94",
                  fontSize: 12,
                }}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={Profile}
        options={{
          tabBarIcon: (props) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Feather name="user" size={props.size} color={props.color} />
              <Text
                style={{
                  color: props.focused ? props.color : "#748c94",
                  fontSize: 12,
                }}
              >
                Profile
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="PostScreen"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("@assets/Icons/icon-color.png")}
              resizeMode="contain"
              style={{ width: 70, height: 70 }}
            />
          ),
          tabBarButton: (props) => <CustomPostTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="UploadScreen"
        component={Upload}
        options={{
          tabBarIcon: (props) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Feather name="upload" size={props.size} color={props.color} />
              <Text
                style={{
                  color: props.focused ? props.color : "#748c94",
                  fontSize: 12,
                }}
              >
                Upload
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="SettingsScreen"
        component={Upload}
        options={{
          tabBarIcon: (props) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Feather name="settings" size={props.size} color={props.color} />
              <Text
                style={{
                  color: props.focused ? props.color : "#748c94",
                  fontSize: 12,
                }}
              >
                Settings
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
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
