import cron from "node-cron";
import { Expo } from "expo-server-sdk";
import { IAppointment } from "#/models/Schedule";
import { UserDocument } from "#/models/user";

const expo = new Expo();

export const appointmentNotification = async (
  appointment: IAppointment,
  user: UserDocument
): Promise<void> => {
  const { date: dateString, reminder } = appointment;
  const { expoPushToken: pushToken } = user;

  // Convert date string to Date object
  const date = new Date(dateString);

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
    default:
      throw new Error("Invalid reminder type. Notification not scheduled.");
  }

  // Test :
  // reminderTime = new Date(Date.now() + 60 * 1000);

  if (!(reminderTime instanceof Date) || isNaN(reminderTime.getTime())) {
    throw new Error("Invalid reminder Time. Appointment not scheduled.");
  }

  if (reminderTime <= new Date()) {
    throw new Error("Reminder time is in the past. Appointment not scheduled.");
  }

  // Convert reminderTime to cron expression
  const minute = reminderTime.getMinutes();
  const hour = reminderTime.getHours();
  const dayOfMonth = reminderTime.getDate();
  const month = reminderTime.getMonth() + 1; // getMonth() returns 0-indexed month
  const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} *`;

  console.log("cronExpression: ", cronExpression);

  // Format the date without seconds
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedDate = date.toLocaleString(undefined, options);

  // Schedule the cron job and return immediately
  cron.schedule(cronExpression, async () => {
    try {
      if (Expo.isExpoPushToken(pushToken)) {
        await expo.sendPushNotificationsAsync([
          {
            to: pushToken,
            sound: "default",
            title: `Appointment Reminder: ${appointment.title}`,
            body: `Don't forget your appointment at ${appointment.location} on ${formattedDate}.`,
            data: { appointment },
          },
        ]);
        console.log("Appointment scheduled successfully.");
      } else {
        console.error("Invalid Expo push token.");
        throw new Error("Invalid Expo push token.");
      }
    } catch (error) {
      console.error("Error scheduling Appointment: ", error);
      throw new Error(`Error scheduling Appointment:  ${error}`);
    }
  });

  // Resolve immediately after scheduling the cron job
  return Promise.resolve();
};
