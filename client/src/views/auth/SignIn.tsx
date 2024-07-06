import { useDispatch } from "react-redux";
import { FC, useCallback, useRef, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import * as yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import Animated from "react-native-reanimated";
import { FormikHelpers } from "formik";
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
import { updateLoggedInState, updateProfile } from "src/store/auth";
import { Keys, saveToAsyncStorage } from "@utils/asyncStorage";
import catchAsyncError from "src/api/catchError";
import AppButton from "@ui/AppButton";
import useGoogleSignIn from "src/api/useGoogleSignIn";
import { ToastNotification } from "@utils/toastConfig";
import { useFadeInDown, useFadeInLeft } from "@utils/animated";

interface Props {
  navigation: any;
}

interface SignInUserInfo {
  email: string;
  password: string;
}

const initialValues = {
  email: "",
  password: "",
};

const SignIn: FC<Props> = (props) => {
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch();
  const { promptGoogleSignIn, request } = useGoogleSignIn();

  const { t } = useTranslation();

  const signupSchema = yup.object({
    email: yup
      .string()
      .trim(t("email-is-missing!"))
      .email(t("invalid-email!"))
      .required(t("email-is-required!")),
    password: yup
      .string()
      .trim(t("password-is-missing!"))
      .min(8, t("password-is-too-short!"))
      .required(t("password-is-required!")),
  });

  const scrollViewRef = useRef<ScrollView>(null);

  const togglePasswordView = () => {
    Vibration.vibrate(30);
    setSecureEntry(!secureEntry);
  };

  useFocusEffect(
    useCallback(() => {
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
        console.log("Keyboard hidden");
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
        }
      });

      // Reset Animations
      startEmailAnimation();
      startPasswordAnimation();
      startForgotPasswordAnimatedStyleAnimation();
      startSignupAnimation();
      startLinkAnimation();
      startSignupWithGoogleAnimation();

      return () => {
        // Cleanup
        hideSubscription.remove();
      };
    }, [])
  );

  const handleSubmit = async (
    values: SignInUserInfo,
    actions: FormikHelpers<SignInUserInfo>
  ) => {
    try {
      actions.setSubmitting(true); // Activate busy for loader

      const { data } = await client.post("/auth/sign-in", {
        ...values,
      });

      await saveToAsyncStorage(Keys.AUTH_TOKEN, data.token);

      dispatch(updateProfile(data.profile));
      dispatch(updateLoggedInState(true));
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    }

    actions.setSubmitting(false); // Deactivate busy for loader
  };

  // Initialization of custom hooks for animations
  const {
    animatedStyle: emailAnimatedStyle,
    startAnimation: startEmailAnimation,
  } = useFadeInDown(0);
  const {
    animatedStyle: passwordAnimatedStyle,
    startAnimation: startPasswordAnimation,
  } = useFadeInDown(200);
  const {
    animatedStyle: ForgotPasswordAnimatedStyle,
    startAnimation: startForgotPasswordAnimatedStyleAnimation,
  } = useFadeInLeft(400);
  const {
    animatedStyle: SignupAnimatedStyle,
    startAnimation: startSignupAnimation,
  } = useFadeInDown(600);
  const {
    animatedStyle: LinkAnimatedStyle,
    startAnimation: startLinkAnimation,
  } = useFadeInLeft(700);
  const {
    animatedStyle: SignupWithGoogleAnimatedStyle,
    startAnimation: startSignupWithGoogleAnimation,
  } = useFadeInDown(800);

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={[styles.scrollViewContent, { marginTop: -25 }]}
      keyboardShouldPersistTaps="handled"
      overScrollMode="never"
    >
      <LogoContainer />

      <Form
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={signupSchema}
      >
        <View style={styles.formContainer}>
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

          <Animated.View
            style={[styles.forgotPasswordLink, ForgotPasswordAnimatedStyle]}
          >
            <AppLink
              title={t("forgot-password-?")}
              onPress={() => {
                navigation.navigate("LostPassword");
              }}
            />
          </Animated.View>

          <Animated.View style={SignupAnimatedStyle}>
            <SubmitBtn
              title={t("sign-in")}
              defaultColor={["#12C7E0", "#0FABCD", "#0E95B7"]}
              pressedColor={["#0DA2BE", "#0FBDD5", "#12C7E0"]}
            />
          </Animated.View>

          <Animated.View style={LinkAnimatedStyle}>
            <View style={styles.linkContainer}>
              <Text> {t("don't-have-an-account-?")} </Text>
              <AppLink
                title={t("sign-up")}
                onPress={() => {
                  navigation.navigate("SignUp");
                }}
              />
            </View>
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
    </ScrollView>
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
    marginBottom: 25,
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
  forgotPasswordLink: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 15,
  },
});

export default SignIn;
