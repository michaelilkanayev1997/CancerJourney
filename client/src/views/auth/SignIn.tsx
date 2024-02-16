import AuthInputField from "@components/form/AuthInputField";
import Form from "@components/form";
import colors from "@utils/colors";
import { FC, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import * as yup from "yup";
import SubmitBtn from "@components/form/SubmitBtn";
import PasswordVisibilityIcon from "@ui/PasswordVisibilityIcon";
import AppLink from "@ui/AppLink";
import LogoContainer from "@components/LogoContainer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "src/@types/navigation";

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
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const togglePasswordView = () => {
    Vibration.vibrate(30);
    setSecureEntry(!secureEntry);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
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
            <View style={styles.forgotPasswordLink}>
              <AppLink
                title="Forgot Password ?"
                onPress={() => {
                  navigation.navigate("LostPassword");
                }}
              />
            </View>
            <SubmitBtn
              title="Sign In"
              defaultColor={["#12C7E0", "#0FABCD", "#0E95B7"]}
              pressedColor={["#0DA2BE", "#0FBDD5", "#12C7E0"]}
            />
            <View style={styles.linkContainer}>
              <Text>Don't have an account ? </Text>
              <AppLink
                title="Sign Up"
                onPress={() => {
                  navigation.navigate("SignUp");
                }}
              />
            </View>
            <View style={styles.separator} />

            <SubmitBtn
              title="Sign up with Google"
              pressedColor={["#4285F4", "#3578E5", "#2A6ACF"]}
              defaultColor={["#4A90E2", "#4285F4", "#5B9EF4"]}
              icon={
                <MaterialCommunityIcons
                  name="google"
                  size={24}
                  color="white"
                  style={{ marginRight: 10 }}
                />
              }
            />
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
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    borderBottomColor: "#D3D3D3", // Light gray color
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
  forgotPasswordLink: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 55,
    paddingBottom: 15,
  },
});

export default SignIn;
