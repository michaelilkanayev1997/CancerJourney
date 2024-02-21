import AppButton from "@ui/AppButton";
import { Keys, saveToAsyncStorage } from "@utils/asyncStorage";
import colors from "@utils/colors";
import { FC } from "react";
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  Text,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useDispatch } from "react-redux";
import { updateViewedOnBoardingState } from "src/store/auth";

interface Props {}

const Welcome: FC<Props> = (props) => {
  const { width } = useWindowDimensions();

  const dispatch = useDispatch();

  const handleLetsGetStarted = async () => {
    try {
      await saveToAsyncStorage(Keys.VIEWED_ON_BOARDING, "true");
      dispatch(updateViewedOnBoardingState(true));
    } catch (error) {
      console.log("Error @setItem: ", error);
    }
  };

  return (
    <View style={[styles.container, { width }]}>
      <Animated.View
        entering={FadeInUp.delay(200).duration(1000).springify()}
        style={styles.imageContainer}
      >
        <Image source={require("../assets/Logo.png")} style={styles.image} />
        <Text style={styles.Logotitle}>Putting you in control</Text>
      </Animated.View>

      <View style={styles.infoContainer}>
        <Animated.Text
          entering={FadeInDown.delay(200).duration(1000).springify()}
          style={styles.title}
        >
          Support For Cancer Patients
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(400).duration(1000).springify()}
          style={styles.description}
        >
          CancerJourney simplifies cancer management, offering control over
          care, appointments, medications, and contacts. Our goal is to ease the
          challenges of living with cancer.
        </Animated.Text>
      </View>

      <Animated.View
        entering={FadeInDown.delay(600).duration(1000).springify()}
        style={{
          paddingTop: 35,
          width: "80%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AppButton
          title="Let’s Get Started!"
          defaultColor={["#12C7E0", "#0FABCD", "#0E95B7"]}
          pressedColor={["#0DA2BE", "#0FBDD5", "#12C7E0"]}
          onPress={handleLetsGetStarted}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.PRIMARY_DARK2,
  },
  imageContainer: {
    width: "80%",
    height: undefined,
    aspectRatio: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  Logotitle: {
    fontWeight: "500",
    fontSize: 18,
    marginTop: -70,
    marginBottom: 10,
    color: colors.PRIMARY_BTN,
    textAlign: "center",
  },
  infoContainer: {},
  title: {
    fontWeight: "600",
    fontSize: 20,
    marginBottom: 8,
    color: "black",
    textAlign: "center",
  },
  description: {
    fontWeight: "400",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 26,
  },
});

export default Welcome;
