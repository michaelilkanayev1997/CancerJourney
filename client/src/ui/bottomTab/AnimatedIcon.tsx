import { FC, useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import { Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";

interface AnimatedIconProps {
  label: string;
  icon: "home" | "user" | "upload" | "settings";
  size: number;
  color: string;
}

const AnimatedIcon: FC<AnimatedIconProps> = ({ label, icon, size, color }) => {
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

export default AnimatedIcon;
