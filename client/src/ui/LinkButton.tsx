import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "@utils/colors";

export interface LinkButtonProps {
  onPress: () => void;
  iconName: string;
  buttonText: string;
  disabled: boolean;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  onPress,
  iconName,
  buttonText,
  disabled,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.iconButton, disabled && styles.disabledButton]}
      disabled={disabled}
    >
      <MaterialCommunityIcons
        name={iconName as any}
        size={24}
        color={colors.LIGHT_BLUE}
      />
      <Text style={styles.iconButtonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginHorizontal: 5,
  },
  iconButtonText: {
    color: colors.LIGHT_BLUE,
    marginLeft: 5,
    textDecorationLine: "underline",
  },
  disabledButton: {
    opacity: 0.3,
  },
});

export default LinkButton;
