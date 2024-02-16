import SignUp from "@views/auth/SignUp";
import { StatusBar } from "expo-status-bar";
import { I18nManager, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import LottieAnimation from "@components/LottieAnimation";
import Animated from "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";
import SignIn from "@views/auth/SignIn";
import LostPassword from "@views/auth/LostPassword";
import Verification from "@views/auth/Verification";

// Force LTR text direction
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render

        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const showAnimatedSplash = !appIsReady || !splashAnimationFinished;

  return (
    <Animated.View style={styles.container}>
      {showAnimatedSplash ? (
        <LottieAnimation
          onAnimationFinish={(isCancelled) => {
            if (!isCancelled) {
              setSplashAnimationFinished(true);
            }
          }}
        />
      ) : (
        <Verification />
      )}
      <StatusBar style="auto" />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
