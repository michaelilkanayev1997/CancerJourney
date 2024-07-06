import { FC, useCallback, useRef, useState } from "react";
import { FormikHelpers } from "formik";
import Animated, { FadeIn } from "react-native-reanimated";
import * as yup from "yup";
import { StyleSheet, Vibration, View, Text, Keyboard } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { useTranslation } from "react-i18next";

import AuthInputField from "@components/form/AuthInputField";
import Form from "@components/form";
import colors from "@utils/colors";
import SubmitBtn from "@components/form/SubmitBtn";
import PasswordVisibilityIcon from "@ui/PasswordVisibilityIcon";
import AppLink from "@ui/AppLink";
import LogoContainer from "@components/LogoContainer";
import { AuthStackParamList } from "src/@types/navigation";
import client from "src/api/client";
import catchAsyncError from "src/api/catchError";
import AppButton from "@ui/AppButton";
import useGoogleSignIn from "src/api/useGoogleSignIn";
import { useFadeInDown, useFadeInLeft } from "@utils/animated";
import { ToastNotification } from "@utils/toastConfig";

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
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const { promptGoogleSignIn, request } = useGoogleSignIn();

  const { t } = useTranslation();

  const signupSchema = yup.object({
    name: yup
      .string()
      .trim(t("name-is-missing!"))
      .min(3, t("invalid-name!"))
      .required(t("name-is-required!")),
    email: yup
      .string()
      .trim(t("email-is-missing!"))
      .email(t("invalid-email!"))
      .required(t("email-is-required!")),
    password: yup
      .string()
      .trim(t("password-is-missing!"))
      .min(8, t("password-is-too-short!"))
      .matches(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
        t("password-is-too-simple!")
      )
      .required(t("password-is-required!")),
  });

  const scrollViewRef = useRef<Animated.ScrollView>(null);

  const togglePasswordView = () => {
    Vibration.vibrate(30);
    setSecureEntry(!secureEntry);
  };

  const handleSubmit = async (
    values: NewUser,
    actions: FormikHelpers<NewUser>
  ) => {
    actions.setSubmitting(true); // Activate busy for loader

    try {
      const { data } = await client.post("/auth/create", {
        ...values,
      });

      navigation.navigate("Verification", { userInfo: data.user, ...values });
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
      // Toggle key to force remount and thus re-trigger animation
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        console.log("Keyboard hidden");
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
        }
      });

      // Reset Animations
      startNameAnimation();
      startEmailAnimation();
      startPasswordAnimation();
      startSignupAnimation();
      startLinkAnimation();
      startSignupWithGoogleAnimation();

      return () => {
        // Cleanup
        hideSubscription.remove();
      };
    }, [])
  );

  // Initialization of custom hooks for animations
  const {
    animatedStyle: nameAnimatedStyle,
    startAnimation: startNameAnimation,
  } = useFadeInDown(0);
  const {
    animatedStyle: emailAnimatedStyle,
    startAnimation: startEmailAnimation,
  } = useFadeInDown(200);
  const {
    animatedStyle: passwordAnimatedStyle,
    startAnimation: startPasswordAnimation,
  } = useFadeInDown(400);
  const {
    animatedStyle: SignupAnimatedStyle,
    startAnimation: startSignupAnimation,
  } = useFadeInDown(600);
  const {
    animatedStyle: LinkAnimatedStyle,
    startAnimation: startLinkAnimation,
  } = useFadeInLeft(600);
  const {
    animatedStyle: SignupWithGoogleAnimatedStyle,
    startAnimation: startSignupWithGoogleAnimation,
  } = useFadeInDown(800);

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      contentContainerStyle={[styles.scrollViewContent, { marginTop: -45 }]}
      keyboardShouldPersistTaps="handled"
      overScrollMode="never"
      entering={FadeIn}
    >
      <LogoContainer />
      <Form
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={signupSchema}
      >
        <View style={styles.formContainer}>
          <Animated.View style={nameAnimatedStyle}>
            <AuthInputField
              name="name"
              label={t("name")}
              placeholder="John Doe"
              containerStyle={styles.marginBottom}
            />
          </Animated.View>

          <Animated.View style={emailAnimatedStyle}>
            <AuthInputField
              name="email"
              label={t("email")}
              placeholder="john@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.marginBottom}
            />
          </Animated.View>
          <Animated.View style={passwordAnimatedStyle}>
            <AuthInputField
              name="password"
              label={t("password")}
              placeholder="********"
              autoCapitalize="none"
              secureTextEntry={secureEntry}
              containerStyle={styles.marginBottom}
              rightIcon={<PasswordVisibilityIcon privateIcon={secureEntry} />}
              onRightIconPress={togglePasswordView}
            />
          </Animated.View>
          <Animated.View style={SignupAnimatedStyle}>
            <SubmitBtn
              title={t("sign-up")}
              defaultColor={["#12C7E0", "#0FABCD", "#0E95B7"]}
              pressedColor={["#0DA2BE", "#0FBDD5", "#12C7E0"]}
            />
          </Animated.View>

          <Animated.View style={[styles.linkContainer, LinkAnimatedStyle]}>
            <Text>{t("already-have-an-account-?")}</Text>
            <AppLink
              title={t("sign-in")}
              onPress={() => {
                navigation.navigate("SignIn");
              }}
            />
          </Animated.View>
          <Animated.View style={[styles.separator, LinkAnimatedStyle]} />

          <Animated.View
            style={[
              { justifyContent: "center", alignItems: "center" },
              SignupWithGoogleAnimatedStyle,
            ]}
          >
            <AppButton
              title={t("sign-up-with-google")}
              pressedColor={["#4285F4", "#3578E5", "#2A6ACF"]}
              defaultColor={["#4A90E2", "#4285F4", "#5B9EF4"]}
              onPress={() => request && promptGoogleSignIn()}
              icon={
                <MaterialCommunityIcons
                  name="google"
                  size={24}
                  color="white"
                  style={{ marginRight: 10 }}
                />
              }
            />
          </Animated.View>
        </View>
      </Form>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    borderBottomColor: colors.LIGHT_GRAY,
    borderBottomWidth: 2,
    marginVertical: 16,
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
    justifyContent: "center",
    marginTop: 15,
    paddingHorizontal: 25,
  },
});

export default SignUp;
