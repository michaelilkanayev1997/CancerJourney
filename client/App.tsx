import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { I18nManager, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import Animated from "react-native-reanimated";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "react-query";

import LottieAnimation from "@components/LottieAnimation";
import store from "./src/store";
import AppNavigator from "src/navigation";
import AppContainer from "@components/AppContainer";
import PreloadIcons from "@components/PreloadIcons";
import { usePushNotifications } from "src/hooks/usePushNotifications";

// Force LTR text direction
I18nManager.allowRTL(false);
I18nManager.forceRTL(false);

// Create a client
const queryClient = new QueryClient();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  const { expoPushToken, notification } = usePushNotifications();

  console.log("notification", JSON.stringify(notification, undefined, 2));
  console.log("expoPushToken", expoPushToken?.data);

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
          <QueryClientProvider client={queryClient}>
            <AppContainer>
              <AppNavigator />
            </AppContainer>
          </QueryClientProvider>
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
