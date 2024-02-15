import AppButton from "@ui/AppButton";
import { useFormikContext } from "formik";
import { FC, ReactNode } from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  title: string;
  pressedColor: [string, string, string];
  defaultColor: [string, string, string];
  icon?: ReactNode;
}

const SubmitBtn: FC<Props> = (props) => {
  const { handleSubmit, isSubmitting } = useFormikContext();

  return (
    <View style={styles.container}>
      <AppButton
        busy={isSubmitting}
        onPress={handleSubmit}
        title={props.title}
        defaultColor={props.defaultColor}
        pressedColor={props.pressedColor}
        icon={props.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SubmitBtn;
