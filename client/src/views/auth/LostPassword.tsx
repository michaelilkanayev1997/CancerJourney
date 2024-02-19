import AuthInputField from "@components/form/AuthInputField";
import Form from "@components/form";
import { FC, useEffect } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as yup from "yup";
import SubmitBtn from "@components/form/SubmitBtn";
import AppLink from "@ui/AppLink";
import colors from "@utils/colors";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "src/@types/navigation";
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
} from "react-native-reanimated";
import { FormikHelpers } from "formik";
import client from "src/api/client";

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
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const handleSubmit = async (
    values: InitialValue,
    actions: FormikHelpers<InitialValue>
  ) => {
    try {
      actions.setSubmitting(true); // Activate busy for loader

      const { data } = await client.post("/auth/forget-password", {
        ...values,
      });

      console.log(data);
    } catch (error) {
      console.log(error);
    }

    actions.setSubmitting(false); // Deactivate busy for loader
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Animated.Image
            entering={FadeInUp.delay(200).duration(1000).springify()}
            source={require("@assets/lock.png")}
            style={styles.logo}
          />

          <Animated.Image
            entering={FadeInUp.delay(700).duration(1000).springify().damping(3)}
            source={require("@assets/Forgot Password.png")}
            style={styles.forgotPassword}
          />

          <Animated.Text
            entering={FadeInLeft.delay(200).duration(1000).springify()}
            style={styles.instructionText}
          >
            Don’t worry! It happens, please enter the address associated with
            your account
          </Animated.Text>
        </View>

        <Form
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={lostPasswordSchema}
        >
          <View style={styles.formContainer}>
            <Animated.View
              entering={FadeInDown.delay(200).duration(1000).springify()}
            >
              <AuthInputField
                name="email"
                placeholder="michael@example.com"
                label="Enter Your Email"
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={styles.marginBottom}
              />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(400).duration(1000).springify()}
            >
              <SubmitBtn
                title="Submit"
                defaultColor={["#12C7E0", "#0FABCD", "#0E95B7"]}
                pressedColor={["#0DA2BE", "#0FBDD5", "#12C7E0"]}
              />
            </Animated.View>

            <View style={styles.linkContainer}>
              <Animated.View
                entering={FadeInLeft.delay(600).duration(1000).springify()}
              >
                <AppLink
                  title="Sign in"
                  onPress={() => {
                    navigation.navigate("SignIn");
                  }}
                />
              </Animated.View>

              <Animated.View
                entering={FadeInRight.delay(600).duration(1000).springify()}
              >
                <AppLink
                  title="Sign Up"
                  onPress={() => {
                    navigation.navigate("SignUp");
                  }}
                />
              </Animated.View>
            </View>
          </View>
        </Form>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: "center",
    width: "100%",
    paddingTop: 60,
    paddingBottom: 10,
  },
  formContainer: {
    paddingHorizontal: 15,
  },
  logo: {
    resizeMode: "contain",
    width: "60%",
  },
  forgotPassword: {
    resizeMode: "contain",
    width: "60%",
    marginTop: 20,
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
  instructionText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 20,
    marginHorizontal: 20,
  },
});

export default LostPassword;
