import { useFormikContext } from "formik";
import { FC, ReactNode, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInputProps,
  StyleProp,
  ViewStyle,
  Vibration,
  Pressable,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import AppInput from "@ui/AppInput";
import colors from "@utils/colors";

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  secureTextEntry?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  rightIcon?: ReactNode;
  onRightIconPress?(): void;
}

const AuthInputField: FC<Props> = ({
  placeholder,
  label,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
  containerStyle,
  name,
  rightIcon,
  onRightIconPress,
}) => {
  const inputTransformValue = useSharedValue(0);
  const inputOpacityValue = useSharedValue(1);

  const { handleChange, values, errors, handleBlur, touched } =
    useFormikContext<{
      [key: string]: string;
    }>();

  const errorMsg = touched[name] && errors[name] ? errors[name] : "";

  const shakeUI = () => {
    inputTransformValue.value = withSequence(
      withTiming(-6, { duration: 50 }),
      withSpring(0, {
        damping: 8,
        mass: 0.5,
        stiffness: 1000,
        restDisplacementThreshold: 0.1,
      })
    );
    inputOpacityValue.value = withSequence(
      withTiming(0.5, { duration: 50 }),
      withTiming(1, { duration: 100 })
    );
  };

  const inputStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: inputTransformValue.value }],
      opacity: inputOpacityValue.value,
    };
  });

  const errorMessageStyle = useAnimatedStyle(() => {
    return {
      opacity: errorMsg
        ? withTiming(1, { duration: 300 })
        : withTiming(0, { duration: 300 }),
      transform: [
        {
          translateY: errorMsg
            ? withTiming(0, { duration: 300 })
            : withTiming(-10, { duration: 300 }),
        },
      ],
    };
  });

  useEffect(() => {
    if (errorMsg) {
      shakeUI();
      // Vibrate for 40ms when the Button is pressed
      Vibration.vibrate(40);
    }
  }, [errorMsg]);

  return (
    <Animated.View style={[containerStyle, inputStyle]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Animated.View style={[errorMessageStyle]}>
          <Text style={styles.errorMsg}>{errorMsg}</Text>
        </Animated.View>
      </View>
      <View>
        <AppInput
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          onChangeText={handleChange(name)}
          value={values[name]}
          onBlur={handleBlur(name)}
        />

        {rightIcon ? (
          <Pressable onPress={onRightIconPress} style={styles.rightIcon}>
            {rightIcon}
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
  label: {
    color: colors.CONTRAST,
  },
  errorMsg: {
    color: colors.ERROR,
  },
  rightIcon: {
    width: 45,
    height: 45,
    position: "absolute",
    top: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AuthInputField;
