import colors from "@utils/colors";
import { FC, ReactNode } from "react";
import { View, StyleSheet, Text, ViewStyle, StyleProp } from "react-native";

export interface Props {
  title: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const InputRowContainer: FC<Props> = ({ title, children, style }) => {
  return (
    <View style={[styles.inputRowContainer, style]}>
      <Text style={styles.rowLabel}>{title}</Text>

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  inputRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.PRIMARY,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  rowLabel: {
    flex: 1, // Take up 1/3 of the space
    fontSize: 16,
    color: "#000",
  },
});

export default InputRowContainer;
