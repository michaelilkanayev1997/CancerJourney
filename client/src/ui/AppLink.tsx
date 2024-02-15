import { useState } from "react";
import {
  StyleSheet,
  Pressable,
  Text,
  Vibration,
  StyleProp,
  TextStyle,
} from "react-native";
import colors from "@utils/colors";

interface Props {
  title: string;
  onPress?(): void;
  active?: boolean;
  style?: StyleProp<TextStyle>;
}

const AppLink: React.FC<Props> = ({ title, active = true, onPress, style }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
    // Vibrate for 50ms when the link is pressed
    Vibration.vibrate(40);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  return (
    <Pressable
      onPress={active ? onPress : null}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ opacity: active ? 1 : 0.4 }}
    >
      <Text
        style={[
          styles.title,
          style,
          active && isPressed && styles.titlePressed,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.SECONDARY,
    fontWeight: "bold",
  },
  titlePressed: {
    color: colors.OVERLAY,
    textDecorationLine: "underline",
  },
});

export default AppLink;
