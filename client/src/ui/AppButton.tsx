import colors from "@utils/colors";
import { FC, useState } from "react";
import { Pressable, StyleSheet, Text, Vibration } from "react-native";
import Loader from "./Loader";
import { LinearGradient } from "expo-linear-gradient";

interface Props {
  title: string;
  onPress?(): void;
  busy?: boolean;
  borderRadius?: number;
}

const AppButton: FC<Props> = ({ title, busy, onPress, borderRadius }) => {
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
          ? ["#0DA2BE", "#0FBDD5", "#12C7E0"] // Pressed State Gradient
          : ["#12C7E0", "#0FABCD", "#0E95B7"] // Default State Gradient
      }
      style={{ borderRadius: borderRadius || 5 }}
    >
      <Pressable
        disabled={busy}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.container, { borderRadius: borderRadius || 5 }]}
      >
        {!busy ? <Text style={styles.title}>{title}</Text> : <Loader />}
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.INACTIVE_CONTRAST,
    fontSize: 20,
    fontWeight: "600",
  },
});

export default AppButton;
