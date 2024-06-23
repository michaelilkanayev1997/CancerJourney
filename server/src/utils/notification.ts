import cron from "node-cron";
import { Expo } from "expo-server-sdk";

const expo = new Expo();

// Function to schedule notification
export const scheduleNotification = (appointment) => {
  const { date, reminder, pushToken } = appointment;

  let reminderTime;
  switch (reminder) {
    case "1 hour before":
      reminderTime = new Date(date.getTime() - 60 * 60 * 1000);
      break;
    case "2 hours before":
      reminderTime = new Date(date.getTime() - 2 * 60 * 60 * 1000);
      break;
    case "The day before":
      reminderTime = new Date(date.getTime() - 24 * 60 * 60 * 1000);
      break;
  }

  cron.schedule(reminderTime, () => {
    if (Expo.isExpoPushToken(pushToken)) {
      expo.sendPushNotificationsAsync([
        {
          to: pushToken,
          sound: "default",
          title: appointment.title,
          body: `Reminder: ${appointment.title} at ${appointment.location}`,
          data: { appointment },
        },
      ]);
    }
  });
};
