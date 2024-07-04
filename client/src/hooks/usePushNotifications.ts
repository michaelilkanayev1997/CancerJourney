import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

import { getClient } from "src/api/client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabParamList } from "src/@types/navigation";
import {
  Keys,
  getFromAsyncStorage,
  saveToAsyncStorage,
} from "@utils/asyncStorage";

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notification?: Notifications.Notification;
}

export const usePushNotifications = (
  currentExpoPushToken: string,
  userId: string | null
): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();

  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const navigation =
    useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification");
        return;
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
    } else {
      console.log("Must be using a physical device for Push notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    if (!userId) {
      return;
    }

    const updatePushToken = async (newToken: string) => {
      try {
        const client = await getClient();

        await client.post("/auth/update-push-token", {
          newToken,
        });
      } catch (error) {
        console.error("Failed to update push token:", error);
      }
    };

    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);

        if (token.data !== currentExpoPushToken) {
          updatePushToken(token.data);
        }
      }
    });

    // Handle incoming notifications
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // Handle notification responses
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const { appointment, medication } =
          response.notification.request.content.data;

        if (medication) {
          console.log("Medication data :", medication);
          // Navigate to the nested Medications screen
          navigation.navigate("Schedule", {
            screen: "Medications",
            params: { medication },
          });
        } else if (appointment) {
          console.log("Appointment data :", appointment);
          // Navigate to the nested Appointment screen
          navigation.navigate("Schedule", {
            screen: "Appointments",
            params: { appointment },
          });
        }
      });

    // Check if the app was opened by a notification
    Notifications.getLastNotificationResponseAsync().then(async (response) => {
      if (response) {
        const notificationId = response.notification?.request.identifier;
        const lastHandledNotificationId = await getFromAsyncStorage(
          Keys.LAST_HANDLED_NOTIFICATION_ID
        );
        const dataString = (response.notification?.request?.content as any)
          ?.dataString;

        if (notificationId !== lastHandledNotificationId) {
          if (dataString) {
            try {
              const data = JSON.parse(dataString);

              const { appointment, medication } = data;

              if (appointment) {
                console.log("Appointment data :", appointment);
                // Navigate to the nested screen
                navigation.navigate("Schedule", {
                  screen: "Appointments",
                  params: { appointment },
                });
              } else if (medication) {
                console.log("Medication data :", medication);
                // Navigate to the nested screen
                navigation.navigate("Schedule", {
                  screen: "Medications",
                  params: { medication },
                });
              }

              await saveToAsyncStorage(
                Keys.LAST_HANDLED_NOTIFICATION_ID,
                notificationId
              ); // Save to AsyncStorage
            } catch (error) {
              console.error("Failed to parse notification data:", error);
            }
          }
        }
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );

      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, [currentExpoPushToken, userId]);

  return {
    expoPushToken,
    notification,
  };
};
