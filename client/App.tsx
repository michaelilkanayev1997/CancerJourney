import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { I18nManager, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import Animated from "react-native-reanimated";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";
import { I18nextProvider } from "react-i18next";
import * as Updates from "expo-updates";

import LottieAnimation from "@components/LottieAnimation";
import store from "./src/store";
import AppNavigator from "src/navigation";
import AppContainer from "@components/AppContainer";
import PreloadIcons from "@components/PreloadIcons";
import i18n from "src/i18n/i18n";
import {
  Keys,
  getFromAsyncStorage,
  saveToAsyncStorage,
} from "@utils/asyncStorage";

// Force LTR text direction
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

// Create a client
const queryClient = new QueryClient();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  async function onFetchUpdateAsync() {
    if (__DEV__) {
      console.log("Skipping update check in development mode");
      return;
    }
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      console.log(`Error fetching latest Expo update: ${error}`);
    }
  }

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        onFetchUpdateAsync();
        const userLanguage = await getFromAsyncStorage(Keys.USER_LANGUAGE);
        const isRTL = await getFromAsyncStorage(Keys.IS_RTL);
        if (isRTL === null) {
          // Initialize with the current RTL setting
          const currentIsRTL = I18nManager.isRTL;
          await saveToAsyncStorage(Keys.IS_RTL, currentIsRTL.toString());
        }

        if (userLanguage) {
          i18n.changeLanguage(userLanguage);
        }
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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
          <I18nextProvider i18n={i18n}>
            <Provider store={store}>
              <QueryClientProvider client={queryClient}>
                <AppContainer>
                  <AppNavigator />
                </AppContainer>
              </QueryClientProvider>
            </Provider>
          </I18nextProvider>
        )}
        <StatusBar style="auto" />
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
