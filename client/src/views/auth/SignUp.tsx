import AuthInputField from "@components/form/AuthInputField";
import Form from "@components/form";
import colors from "@utils/colors";
import { FC, useState } from "react";
import {
  Button,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Vibration,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as yup from "yup";
import SubmitBtn from "@components/form/SubmitBtn";
import PasswordVisibilityIcon from "@ui/PasswordVisibilityIcon";

const signupSchema = yup.object({
  name: yup
    .string()
    .trim("Name is missing!")
    .min(3, "Invalid name!")
    .required("Name is required!"),
  email: yup
    .string()
    .trim("Email is missing!")
    .email("Invalid email!")
    .required("Email is required!"),
  password: yup
    .string()
    .trim("Password is missing!")
    .min(8, "Password is too short!")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password is too simple!"
    )
    .required("Password is required!"),
});

interface Props {}

interface NewUser {
  name: string;
  email: string;
  password: string;
}

const initialValues = {
  name: "",
  email: "",
  password: "",
};

const SignUp: FC<Props> = (props) => {
  const [secureEntry, setSecureEntry] = useState(true);

  const togglePasswordView = () => {
    Vibration.vibrate(30);
    setSecureEntry(!secureEntry);
  };

  const entering = () => {
    "worklet";
    const animations = {
      //translateY: withTiming(-30, { duration: 600 }),
      translateY: withSpring(-30, {
        mass: 1,
        damping: 7,
        stiffness: 23,
      }),
      // opacity: withTiming(1, { duration: 300 }),
    };
    const initialValues = {
      translateY: 190,
      // opacity: 1,
    };
    return {
      initialValues,
      animations,
    };
  };

  return (
    <ImageBackground
      source={require("../../assets/4.jpeg")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            alignItems: "center",
            paddingTop: 30,
          }}
        >
          <Animated.Image
            entering={entering}
            source={require("@assets/Logo.png")}
            style={{
              resizeMode: "contain",
              width: "80%",
            }}
          />
        </View>
        <View style={{ height: 100, width: 150 }}>
          <Animated.Image
            entering={FadeInUp.delay(1000)
              .duration(1000)
              .springify()
              .damping(3)}
            style={{
              flex: 1,
              width: null,
              height: null,
              resizeMode: "contain",
            }}
            source={require("@assets/Welcome!.png")}
          />
        </View>
        <Form
          onSubmit={(values, helper) => {
            console.log(values);
          }}
          initialValues={initialValues}
          validationSchema={signupSchema}
        >
          <View style={styles.formContainer}>
            <AuthInputField
              name="name"
              label="Name"
              placeholder="John Doe"
              containerStyle={styles.marginBottom}
            />
            <AuthInputField
              name="email"
              label="Email"
              placeholder="john@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.marginBottom}
            />
            <AuthInputField
              name="password"
              label="Password"
              placeholder="********"
              autoCapitalize="none"
              secureTextEntry={secureEntry}
              containerStyle={styles.marginBottom}
              rightIcon={<PasswordVisibilityIcon privateIcon={secureEntry} />}
              onRightIconPress={togglePasswordView}
            />
            <SubmitBtn title="Sign up" />
          </View>
        </Form>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: colors.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    flex: 0.3,
    width: "100%",
    paddingHorizontal: 15, // padding in the x direction (left and the right)
  },
  marginBottom: {
    marginBottom: 15,
  },
});

export default SignUp;
