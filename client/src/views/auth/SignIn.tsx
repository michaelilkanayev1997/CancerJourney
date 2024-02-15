import AuthInputField from "@components/form/AuthInputField";
import Form from "@components/form";
import colors from "@utils/colors";
import { FC, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Vibration,
  View,
} from "react-native";
import * as yup from "yup";
import SubmitBtn from "@components/form/SubmitBtn";
import PasswordVisibilityIcon from "@ui/PasswordVisibilityIcon";
import AppLink from "@ui/AppLink";
import LogoContainer from "@components/LogoContainer";

const signupSchema = yup.object({
  email: yup
    .string()
    .trim("Email is missing!")
    .email("Invalid email!")
    .required("Email is required!"),
  password: yup
    .string()
    .trim("Password is missing!")
    .min(8, "Password is too short!")
    .required("Password is required!"),
});

interface Props {
  navigation: any;
}

const initialValues = {
  email: "",
  password: "",
};

const SignIn: FC<Props> = (props) => {
  const [secureEntry, setSecureEntry] = useState(true);

  const togglePasswordView = () => {
    Vibration.vibrate(30);
    setSecureEntry(!secureEntry);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LogoContainer />

      <Form
        onSubmit={(values, helper) => {
          console.log(values);
        }}
        initialValues={initialValues}
        validationSchema={signupSchema}
      >
        <View style={styles.formContainer}>
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
          <SubmitBtn
            title="Sign In"
            defaultColor={["#12C7E0", "#0FABCD", "#0E95B7"]}
            pressedColor={["#0DA2BE", "#0FBDD5", "#12C7E0"]}
          />
          <View style={styles.linkContainer}>
            <AppLink
              title="Forgot Password"
              onPress={() => {
                //navigation.navigate("LostPassword");
              }}
            />
            <AppLink
              title="Sign Up"
              onPress={() => {
                //navigation.navigate("SignUp");
              }}
            />
          </View>
        </View>
      </Form>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 15,
  },
  marginBottom: {
    marginBottom: 12,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 8,
  },
});

export default SignIn;
