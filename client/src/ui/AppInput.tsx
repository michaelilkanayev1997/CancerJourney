import colors from "@utils/colors";
import { FC, useState } from "react";
import {
  TextInputProps,
  StyleSheet,
  TextInput,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Platform,
} from "react-native";

interface Props extends TextInputProps {}

const AppInput: FC<Props> = (props) => {
  const [isFocused, setFocused] = useState(false);

  // Wrapper function for onBlur
  const handleOnBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(false); // Update local state
    if (props.onBlur) props.onBlur(e); // Call props onBlur if it exists
  };

  return (
    <TextInput
      {...props}
      style={[styles.input, isFocused && styles.focusedInput, props.style]}
      onFocus={() => setFocused(true)}
      onBlur={handleOnBlur}
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
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  focusedInput: {
    borderWidth: 2,
    borderColor: colors.PRIMARY_BTN,
  },
});

export default AppInput;
