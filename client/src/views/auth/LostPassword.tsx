import AuthInputField from "@components/form/AuthInputField";
import Form from "@components/form";
import { FC } from "react";
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image source={require("@assets/lock 1.png")} style={styles.logo} />

          <Image
            source={require("@assets/Forgot Password.png")}
            style={styles.forgotPassword}
          />

          <Text style={styles.instructionText}>
            Don’t worry! It happens, please enter the address associated with
            your account
          </Text>
        </View>

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
              placeholder="michael@example.com"
              label="Enter Your Email"
              keyboardType="email-address"
              autoCapitalize="none"
              containerStyle={styles.marginBottom}
            />

            <SubmitBtn
              title="Submit"
              defaultColor={["#12C7E0", "#0FABCD", "#0E95B7"]}
              pressedColor={["#0DA2BE", "#0FBDD5", "#12C7E0"]}
            />

            <View style={styles.linkContainer}>
              <AppLink
                title="Sign in"
                onPress={() => {
                  navigation.navigate("SignIn");
                }}
              />
              <AppLink
                title="Sign Up"
                onPress={() => {
                  navigation.navigate("SignUp");
                }}
              />
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
