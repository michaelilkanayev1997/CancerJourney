import { FC, useCallback, useRef, useState } from "react";
import { FormikHelpers } from "formik";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
} from "react-native-reanimated";
import * as yup from "yup";
import {
  ScrollView,
  StyleSheet,
  Vibration,
  View,
  Text,
  Keyboard,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { useDispatch } from "react-redux";

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
import { updateNotification } from "src/store/notification";
import AppButton from "@ui/AppButton";

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
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const [focusKey, setFocusKey] = useState(0);
  const dispatch = useDispatch();
  const scrollViewRef = useRef<ScrollView>(null);

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

      navigation.navigate("Verification", { userInfo: data.user });
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(updateNotification({ message: errorMessage, type: "error" }));
    }

    actions.setSubmitting(false); // Deactivate busy for loader
  };

  useFocusEffect(
    useCallback(() => {
      // Toggle key to force remount and thus re-trigger animation
      setFocusKey((prevKey) => prevKey + 1);
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
    <Animated.View key={focusKey} entering={FadeIn.duration(400)}>
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
            <Animated.View entering={FadeInDown.duration(1000).springify()}>
              <AuthInputField
                name="name"
                label="Name"
                placeholder="John Doe"
                containerStyle={styles.marginBottom}
              />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(200).duration(1000).springify()}
            >
              <AuthInputField
                name="email"
                label="Email"
                placeholder="john@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={styles.marginBottom}
              />
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(400).duration(1000).springify()}
            >
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
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(600).duration(1000).springify()}
            >
              <SubmitBtn
                title="Sign up"
                defaultColor={["#12C7E0", "#0FABCD", "#0E95B7"]}
                pressedColor={["#0DA2BE", "#0FBDD5", "#12C7E0"]}
              />
            </Animated.View>

            <Animated.View
              entering={FadeInLeft.delay(600).duration(1000).springify()}
              style={styles.linkContainer}
            >
              <Text>Already have an account ? </Text>
              <AppLink
                title="Sign In"
                onPress={() => {
                  navigation.navigate("SignIn");
                }}
              />
            </Animated.View>
            <Animated.View
              entering={FadeInLeft.delay(600).duration(1000).springify()}
              style={styles.separator}
            />

            <Animated.View
              entering={FadeInDown.delay(800).duration(1000).springify()}
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <AppButton
                title="Sign up with Google"
                pressedColor={["#4285F4", "#3578E5", "#2A6ACF"]}
                defaultColor={["#4A90E2", "#4285F4", "#5B9EF4"]}
                onPress={() => {
                  navigation.navigate("OnBoarding");
                }}
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
    </Animated.View>
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
