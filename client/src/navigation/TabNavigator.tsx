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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
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
  const backgroundColor = useSharedValue("white");

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.value,
    };
  });

  useFocusEffect(
    useCallback(() => {
      // Animate background color when focused
      backgroundColor.value = withTiming(colors.PRIMARY_DARK2, {
        duration: 500,
      });
      return () => {
        // Reset background color when losing focus
        backgroundColor.value = withTiming("white", {
          duration: 600,
        });
      };
    }, [])
  );

  return (
    <View style={{ top: -30, justifyContent: "center", alignItems: "center" }}>
      <Animated.View
        style={[
          {
            width: 70,
            height: 70,
            borderRadius: 35,
            ...styles.shadow,
          },
          animatedStyle,
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

const AnimatedIcon = ({ label, icon, size, color }) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
    };
  });

  useFocusEffect(
    useCallback(() => {
      translateY.value = withTiming(-15, {
        duration: 500,
      });
      scale.value = withTiming(1.1, {
        duration: 500,
      });

      return () => {
        // Cleanup function to execute when component loses focus
        translateY.value = withTiming(0, {
          duration: 500,
        });
        scale.value = withTiming(1, {
          duration: 500,
        });
      };
    }, [])
  );

  return (
    <Animated.View
      style={[
        { alignItems: "center", justifyContent: "center", top: 10 },
        animatedStyle,
      ]}
    >
      <Feather name={icon} size={size} color={color} />
      <Text
        style={{
          color: color,
          fontSize: 12,
        }}
      >
        {label}
      </Text>
    </Animated.View>
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
          tabBarIcon: ({ size, color }) => (
            <AnimatedIcon label="Home" icon="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={Profile}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AnimatedIcon
              label="Profile"
              icon="user"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PostScreen"
        component={Profile}
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

          tabBarButton: (props) => <CustomPostTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="UploadScreen"
        component={Upload}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AnimatedIcon
              label="Upload"
              icon="upload"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsScreen"
        component={Upload}
        options={{
          tabBarIcon: ({ size, color }) => (
            <AnimatedIcon
              label="Settings"
              icon="settings"
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
