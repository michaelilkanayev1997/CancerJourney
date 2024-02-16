import colors from "@utils/colors";
import { FC, useState } from "react";
import { TextInputProps, StyleSheet, TextInput } from "react-native";

interface Props extends TextInputProps {}

const AppInput: FC<Props> = (props) => {
  const [isFocused, setFocused] = useState(false);

  return (
    <TextInput
      {...props}
      style={[styles.input, isFocused && styles.focusedInput, props.style]}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderColor: colors.PRIMARY_DARK3,
    backgroundColor: "white",
    height: 45,
    borderRadius: 25,
    color: colors.CONTRAST,
    padding: 10,
  },
  focusedInput: {
    borderWidth: 2,
    borderColor: colors.PRIMARY_BTN,
  },
});

export default AppInput;
