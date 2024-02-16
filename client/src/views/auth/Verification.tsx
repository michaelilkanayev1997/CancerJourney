import { FC, useEffect, useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AppLink from "@ui/AppLink";
import OTPField from "@ui/OTPField";
import AppButton from "@ui/AppButton";
import colors from "@utils/colors";
import { AntDesign } from "@expo/vector-icons";
interface Props {}

const otpFields = new Array(4).fill("");

const Verification: FC<Props> = (props) => {
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const inputRef = useRef<TextInput>(null);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];

    if (value === "Backspace") {
      // moves to the previews only if the field is empty
      if (!newOtp[index]) setActiveOtpIndex(index - 1);
      newOtp[index] = "";
    } else {
      // update otp and move to the next
      setActiveOtpIndex(index + 1);

      newOtp[index] = value;
    }

    setOtp([...newOtp]);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("@assets/VerificationLogo.png")}
            style={styles.logo}
          />

          <Image
            source={require("@assets/AccountVerification.png")}
            style={styles.accountVerification}
          />
          <Text style={styles.instructionText}>
            Please enter the 4-digit code sent to{" "}
            <Text style={styles.boldText}>michael@gmail.com</Text>
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            {otpFields.map((_, index) => {
              return (
                <OTPField
                  ref={activeOtpIndex === index ? inputRef : null}
                  key={index}
                  placeholder="*"
                  onKeyPress={({ nativeEvent }) => {
                    handleChange(nativeEvent.key, index);
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.btnContainer}>
          <AppButton
            title="Verify"
            icon={
              <AntDesign
                name="checkcircle"
                size={20}
                color="white"
                style={{ marginRight: 10 }}
              />
            }
            defaultColor={["#12C7E0", "#0FABCD", "#0E95B7"]}
            pressedColor={["#0DA2BE", "#0FBDD5", "#12C7E0"]}
          />
        </View>

        <View style={styles.linkContainer}>
          <Text>Didn’t receive the email ? </Text>
          <AppLink
            title="Resend OTP"
            onPress={() => {
              //navigation.navigate("SignUp");
            }}
          />
        </View>
        <Text>in 14 second(s) </Text>
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
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    width: "100%",
    paddingTop: 60,
    paddingBottom: 10,
  },
  logo: {
    resizeMode: "contain",
    width: "60%",
    height: 260,
  },
  accountVerification: {
    resizeMode: "contain",
    width: "60%",
    marginTop: 20,
  },
  formContainer: {
    paddingTop: 10,
    paddingBottom: 18,
    paddingHorizontal: 15,
  },
  instructionText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 20,
    marginHorizontal: 20,
  },
  boldText: {
    fontWeight: "bold",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 25,
  },
  btnContainer: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  linkContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginTop: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Verification;
