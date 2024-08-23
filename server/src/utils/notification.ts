import cron from "node-cron";
import { Expo } from "expo-server-sdk";

import { UserDocument } from "../models/user";
import { timesPerDayToHours } from "./helper";
import { IAppointment, IMedication } from "#/models/Schedule";

const expo = new Expo();

const scheduledJobs = new Map(); // Store references to scheduled jobs

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
  const job = cron.schedule(cronExpression, async () => {
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

  scheduledJobs.set(appointment._id.toString(), job);

  // Resolve immediately after scheduling the cron job
  return Promise.resolve();
};

export const medicationNotification = async (
  medication: IMedication,
  user: UserDocument
): Promise<void> => {
  const { frequency, timesPerDay, specificDays } = medication;
  const { expoPushToken: pushToken } = user;

  if (!Expo.isExpoPushToken(pushToken)) {
    throw new Error("Invalid Expo push token.");
  }

  let cronExpressions: string[] = [];
  const timesArray = timesPerDayToHours(timesPerDay || "");

  const generateCronExpressions = (times: string[]): string[] => {
    return times.map((time) => {
      const [hour, minute] = time.split(":").map(Number);
      return `${minute} ${hour} * * *`; // For everyday frequency
    });
  };

  if (frequency === "Every day") {
    cronExpressions = generateCronExpressions(timesArray);
  } else if (frequency === "Specific days") {
    specificDays?.forEach((day) => {
      const dayOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ].indexOf(day);
      const dayCronExpressions = timesArray.map((time) => {
        const [hour, minute] = time.split(":").map(Number);
        return `${minute} ${hour} * * ${dayOfWeek}`;
      });
      cronExpressions = cronExpressions.concat(dayCronExpressions);
    });
  }

  // ****************  Test  **************** //
  // const reminderTime = new Date(Date.now() + 60 * 1000);
  // const minute = reminderTime.getMinutes();
  // const hour = reminderTime.getHours();
  // const dayOfMonth = reminderTime.getDate();
  // const month = reminderTime.getMonth() + 1; // getMonth() returns 0-indexed month
  // const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} *`;

  cronExpressions.forEach((cronExpression) => {
    console.log("cronExpression: ", cronExpression);

    const job = cron.schedule(cronExpression, async () => {
      try {
        await expo.sendPushNotificationsAsync([
          {
            to: pushToken,
            sound: "default",
            title: `Medication Reminder: ${medication.name}`,
            body: `It's time to take your medication !`,
            data: { medication },
          },
        ]);
        console.log("Medication reminder scheduled successfully.");
      } catch (error) {
        console.error("Error scheduling medication reminder: ", error);
        throw new Error(`Error scheduling medication reminder: ${error}`);
      }
    });

    scheduledJobs.set(medication._id.toString(), job);
  });
  // Resolve immediately after scheduling the cron jobs
  return Promise.resolve();
};

// Function to cancel scheduled notifications
export const cancelScheduledNotification = (id: string): void => {
  const job = scheduledJobs.get(id);
  if (job) {
    job.stop();
    scheduledJobs.delete(id);
  }
};
