import { FC, useCallback, useRef } from "react";
import { Keyboard, ScrollView, StyleSheet, View } from "react-native";
import * as yup from "yup";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
} from "react-native-reanimated";
import { FormikHelpers } from "formik";

import AuthInputField from "@components/form/AuthInputField";
import Form from "@components/form";
import SubmitBtn from "@components/form/SubmitBtn";
import AppLink from "@ui/AppLink";
import { AuthStackParamList } from "src/@types/navigation";
import client from "src/api/client";
import catchAsyncError from "src/api/catchError";
import { ToastNotification } from "@utils/toastConfig";

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
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSubmit = async (
    values: InitialValue,
    actions: FormikHelpers<InitialValue>
  ) => {
    try {
      actions.setSubmitting(true); // Activate busy for loader

      const { data } = await client.post("/auth/forget-password", {
        ...values,
      });

      ToastNotification({
        type: "Info",
        message: data.message,
      });
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    }

    actions.setSubmitting(false); // Deactivate busy for loader
  };

  useFocusEffect(
    useCallback(() => {
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        console.log("Keyboard hidden");
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
        }
      });

      return () => {
        // Cleanup
        hideSubscription.remove();
      };
    }, [])
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={[styles.scrollViewContent, { marginTop: -25 }]}
      keyboardShouldPersistTaps="handled"
      overScrollMode="never"
    >
      <View style={styles.logoContainer}>
        <Animated.Image
          entering={FadeInUp.delay(200).duration(1000).springify()}
          source={require("@assets/Authentication/Lock.png")}
          style={styles.logo}
        />

        <Animated.Image
          entering={FadeInUp.delay(700).duration(1000).springify().damping(3)}
          source={require("@assets/Authentication/Forgot-Password.png")}
          style={styles.forgotPassword}
        />

        <Animated.Text
          entering={FadeInLeft.delay(200).duration(1000).springify()}
          style={styles.instructionText}
        >
          Don’t worry! It happens, please enter the address associated with your
          account
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
  );
};

const styles = StyleSheet.create({
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
