import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInUp,
} from "react-native-reanimated";
import { AntDesign } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch } from "react-redux";

import AppLink from "@ui/AppLink";
import OTPField from "@ui/OTPField";
import AppButton from "@ui/AppButton";
import { AuthStackParamList } from "src/@types/navigation";
import client from "src/api/client";
import catchAsyncError from "src/api/catchError";
import { ToastNotification } from "@utils/toastConfig";
import { Keys, saveToAsyncStorage } from "@utils/asyncStorage";
import { updateLoggedInState, updateProfile } from "src/store/auth";
import { useTranslation } from "react-i18next";

type Props = NativeStackScreenProps<AuthStackParamList, "Verification">;

const otpFields = new Array(4).fill("");

const Verification: FC<Props> = ({ route }) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [coundDown, setCoundDown] = useState(60);
  const [canSendNewOtpRequest, setCanSendNewOtpRequest] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const dispatch = useDispatch();

  const { userInfo, password } = route.params;
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

  const isValidOtp = otp.every((value) => {
    return value.trim();
  });

  const handleSubmit = async () => {
    if (!isValidOtp) return;
    setSubmitting(true); // Activate busy for loader
    try {
      await client.post("/auth/verify-email", {
        userId: userInfo.id,
        token: otp.join(""),
      });

      ToastNotification({
        message: t("mailVerified"),
      });

      const email = userInfo.email;

      const { data: userData } = await client.post("/auth/sign-in", {
        password,
        email,
      });

      await saveToAsyncStorage(Keys.AUTH_TOKEN, userData.token);

      dispatch(updateProfile(userData.profile));
      dispatch(updateLoggedInState(true));
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    }
    setSubmitting(false); // Deactivate busy for loader
  };

  const requestForOTP = async () => {
    setCoundDown(60);
    setCanSendNewOtpRequest(false);
    try {
      await client.post("/auth/re-verify-email", { userId: userInfo.id });
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    if (canSendNewOtpRequest) return;

    const intervalId = setInterval(() => {
      setCoundDown((oldCountDown) => {
        if (oldCountDown <= 0) {
          setCanSendNewOtpRequest(true);
          clearInterval(intervalId);

          return 0;
        }
        return oldCountDown - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [canSendNewOtpRequest]);

  useFocusEffect(
    useCallback(() => {
      const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
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
          source={require("@assets/Authentication/VerificationLogo.png")}
          style={styles.logo}
        />

        <Animated.Image
          entering={FadeInUp.delay(700).duration(1000).springify().damping(3)}
          source={require("@assets/Authentication/AccountVerification.png")}
          style={styles.accountVerification}
        />
        <Animated.Text
          style={styles.instructionText}
          entering={FadeInLeft.delay(200).duration(1000).springify()}
        >
          {t("enterOtp")} <Text style={styles.boldText}>{userInfo.email}</Text>
        </Animated.Text>
      </View>

      <View style={styles.formContainer}>
        <View style={[styles.inputContainer, { flexDirection: "row-reverse" }]}>
          {otpFields.map((_, index) => {
            return (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(200 * (index + 1))
                  .duration(1000)
                  .springify()}
              >
                <OTPField
                  ref={activeOtpIndex === index ? inputRef : null}
                  placeholder="*"
                  onKeyPress={({ nativeEvent }) => {
                    handleChange(nativeEvent.key, index);
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                />
              </Animated.View>
            );
          })}
        </View>
      </View>

      <Animated.View
        style={styles.btnContainer}
        entering={FadeInDown.delay(400).duration(1000).springify()}
      >
        <AppButton
          title={t("verify")}
          onPress={handleSubmit}
          busy={submitting}
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
      </Animated.View>

      <Animated.View
        entering={FadeInLeft.delay(600).duration(1000).springify()}
        style={styles.linkContainer}
      >
        <Text>{t("didntReceiveEmail")} </Text>
        <AppLink
          active={canSendNewOtpRequest}
          title={t("resendOtp")}
          onPress={requestForOTP}
        />
      </Animated.View>
      {coundDown > 0 ? (
        <Animated.Text
          entering={FadeInLeft.delay(600).duration(1000).springify()}
        >
          {t("inSeconds", { count: coundDown })}
        </Animated.Text>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
