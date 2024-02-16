import colors from "@utils/colors";
import { forwardRef, useState } from "react";
import { Platform, StyleSheet, TextInput, TextInputProps } from "react-native";

interface Props extends TextInputProps {
  ref: any;
}

const OTPField = forwardRef<TextInput, Props>((props, ref) => {
  const [isFocused, setFocused] = useState(false);

  return (
    <TextInput
      {...props}
      ref={ref}
      style={[styles.input, isFocused && styles.focusedInput, props.style]}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    width: 42,
    height: 50,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    textAlign: "center",
    color: colors.CONTRAST,
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 0,
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 7,
      },
    }),
  },
  focusedInput: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
  },
});

export default OTPField;
