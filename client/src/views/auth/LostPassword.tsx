import AuthInputField from "@components/form/AuthInputField";
import Form from "@components/form";
import { FC } from "react";
import { ImageBackground, SafeAreaView, StyleSheet, View } from "react-native";
import * as yup from "yup";
import SubmitBtn from "@components/form/SubmitBtn";
import AppLink from "@ui/AppLink";
import { FormikHelpers } from "formik";
import LogoContainer from "@components/LogoContainer";
import colors from "@utils/colors";

const lostPasswordSchema = yup.object({
  email: yup
    .string()
    .trim("Email is missing!")
    .email("Invalid email!")
    .required("Email is required!"),
});

interface Props {}

interface InitialValue {
  email: string;
}

const initialValues = {
  email: "",
};

const LostPassword: FC<Props> = (props) => {
  return (
    <SafeAreaView style={styles.container}>
      <LogoContainer />
      <Form
        onSubmit={() => {
          console.log("lol");
        }}
        initialValues={initialValues}
        validationSchema={lostPasswordSchema}
      >
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            placeholder="Enter"
            label="Enter Your Email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />

          <SubmitBtn title="Send link" />

          <View style={styles.linkContainer}>
            <AppLink
              title="Sign in"
              onPress={() => {
                //navigation.navigate("SignIn");
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
    flex: 0.2,
    width: "100%",
    paddingHorizontal: 15,
  },
  marginBottom: {
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 8,
  },
});

export default LostPassword;
