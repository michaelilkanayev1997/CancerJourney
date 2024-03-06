import { FC, ReactNode, useState } from "react";
import { Pressable, StyleSheet, Text, Vibration, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import Loader from "./Loader";
import colors from "@utils/colors";

interface Props {
  title: string;
  onPress?(): void;
  busy?: boolean;
  borderRadius?: number;
  pressedColor: [string, string, string];
  defaultColor: [string, string, string];
  icon?: ReactNode;
  disabled?: boolean;
}

const AppButton: FC<Props> = ({
  title,
  busy,
  disabled = false,
  onPress,
  borderRadius,
  pressedColor,
  defaultColor,
  icon,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
    // Vibrate for 50ms when the Button is pressed
    Vibration.vibrate(50);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  return (
    <LinearGradient
      colors={
        isPressed
          ? pressedColor // Pressed State Gradient
          : defaultColor // Default State Gradient
      }
      style={{
        borderRadius: borderRadius || 5,
        width: "90%",
      }}
    >
      <Pressable
        disabled={busy || disabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.container, { borderRadius: borderRadius || 5 }]}
      >
        <View style={styles.btnContainer}>
          {icon && !busy ? icon : null}

          {!busy ? <Text style={styles.title}>{title}</Text> : <Loader />}
        </View>
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.INACTIVE_CONTRAST,
    fontSize: 20,
    fontWeight: "600",
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});

export default AppButton;
