import colors from "@utils/colors";
import { FC } from "react";
import { TextInputProps, StyleSheet, TextInput } from "react-native";

interface Props extends TextInputProps {}

const AppInput: FC<Props> = (props) => {
  return <TextInput {...props} style={[styles.input, props.style]} />;
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.SECONDARY,
    height: 45,
    borderRadius: 25,
    color: colors.CONTRAST,
    padding: 10,
  },
});

export default AppInput;
