import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { I18nManager, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import Animated from "react-native-reanimated";
import { Provider } from "react-redux";

import LottieAnimation from "@components/LottieAnimation";
import store from "./src/store";
import AppNavigator from "src/navigation";
import AppContainer from "@components/AppContainer";
import PreloadIcons from "@components/PreloadIcons";
import { dropTable, init } from "@utils/localDatabase";

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
        // const res = await dropTable();
        const res1 = await init();
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
      <PreloadIcons />
      {showAnimatedSplash ? (
        <LottieAnimation
          onAnimationFinish={(isCancelled) => {
            if (!isCancelled) {
              setSplashAnimationFinished(true);
            }
          }}
        />
      ) : (
        <Provider store={store}>
          <AppContainer>
            <AppNavigator />
          </AppContainer>
        </Provider>
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
