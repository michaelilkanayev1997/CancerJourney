import { FC, ReactNode, useCallback } from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";

import colors from "@utils/colors";

interface CustomPostTabBarButtonProps {
  children: ReactNode;
  onPress?: (event: GestureResponderEvent | any) => void;
}

const CustomPostButton: FC<CustomPostTabBarButtonProps> = ({
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

export default CustomPostButton;

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
