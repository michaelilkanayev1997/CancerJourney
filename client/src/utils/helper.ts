import * as Updates from "expo-updates";
import { ObjectId } from "bson";
import { useTranslation } from "react-i18next";

// Calculate the compression level
export const calculateCompression = (size: number) => {
  if (size > 4000000) {
    // Greater than 5MB
    return 0.2;
  } else if (size > 3000000) {
    // Greater than 3MB
    return 0.3;
  } else if (size > 2000000) {
    // Greater than 2MB
    return 0.5;
  } else if (size > 1000000) {
    // Greater than 1MB
    return 0.7;
  } else {
    return 0.8; // Default compression
  }
};

export const convertDateFormat = (dateInput: Date | string | undefined) => {
  if (dateInput === undefined) return;
  // Ensure dateInput is a Date object
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  // Convert Date to DD/MM/YYYY format
  const formattedDate = `${("0" + date.getDate()).slice(-2)}/${(
    "0" +
    (date.getMonth() + 1)
  ).slice(-2)}/${date.getFullYear()}`;

  return formattedDate;
};

export const formatParagraph = (
  text: string,
  maxLineLength: number,
  maxTotalLength: number
): string => {
  if (text.length > maxTotalLength) {
    text = text.slice(0, maxTotalLength) + "...";
  }

  const regex = new RegExp(`.{1,${maxLineLength}}`, "g");
  return text.match(regex)?.join("\n") ?? text;
};

export const formatText = (text: string, length: number) =>
  text.length > length ? `${text.slice(0, length)} ...` : text;

// Function to calculate the time difference
export const calculateTimeDifference = (date: string) => {
  const { t } = useTranslation();
  const now = new Date();
  const diffInMs = now.getTime() - new Date(date).getTime();

  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSecs < 60) {
    return diffInSecs + "s";
  } else if (diffInMins < 60) {
    return diffInMins + " min";
  } else if (diffInHours < 24) {
    return diffInHours + "h";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else {
    return diffInDays + " " + t("time.days");
  }
};

export const restartApp = async () => {
  if (__DEV__) {
    console.log("Skipping reloadAsync in development mode");
    return;
  }
  await Updates.reloadAsync();
};

// Function to generate a unique ObjectId
export const generateObjectId = () => new ObjectId().toString();
