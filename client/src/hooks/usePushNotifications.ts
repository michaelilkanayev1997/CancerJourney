import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import Constants from "expo-constants";

import { Platform } from "react-native";
import { getClient } from "src/api/client";
import { useNavigation } from "@react-navigation/native";

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

  // const navigation = useNavigation();

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
      alert("Must be using a physical device for Push notifications");
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
        const appointment =
          response.notification.request.content.data.appointment;

        if (appointment) {
          console.log("appointment", appointment);
          // Navigate to the appointment card screen
          // navigation.navigate("Appointments");
        }
      });

    // Check if the app was opened by a notification
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const dataString = response.notification?.request?.content?.dataString;
        if (dataString) {
          try {
            const data = JSON.parse(dataString);
            const appointment = data.appointment;
            if (appointment) {
              console.log("Appointment data :", appointment);
              // Navigate to the appointment screen
              // navigation.navigate("Appointments", { appointment });
            }
          } catch (error) {
            console.error("Failed to parse notification data:", error);
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
