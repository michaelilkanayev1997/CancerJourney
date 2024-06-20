import { isValidObjectId } from "mongoose";
import * as yup from "yup";

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is missing!")
    .min(1, "Name is too short!")
    .max(20, "Name is too long!"),
  email: yup.string().required("Email is missing!").email("Invalid email!"),
  password: yup
    .string()
    .trim()
    .required("Password is missing!")
    .min(8, "Password is too short!")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password must contain at least one letter, one number, and one special character (!@#$%^&*)."
    ),
});

export const TokenAndIdValidation = yup.object().shape({
  token: yup.string().trim().required("Invalid token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }

      return "";
    })
    .required("Invalid userId!"),
});

export const UpdatePasswordSchema = yup.object().shape({
  token: yup.string().trim().required("Invalid token!"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }

      return "";
    })
    .required("Invalid userId!"),
  password: yup
    .string()
    .trim()
    .required("Password is missing!")
    .min(8, "Password is too short!")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password must contain at least one letter, one number, and one special character (!@#$%^&*)."
    ),
});

export const SignInValidationSchema = yup.object().shape({
  email: yup.string().required("Email is missing!").email("Invalid email !"),
  password: yup.string().trim().required("Password is missing!"),
});

export const FileTitleAndDescSchema = yup.object().shape({
  title: yup.string().required("Title is missing!"),
  description: yup.string().trim(),
});

export const ProfileUpdateSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(1, "Name is too short!")
    .max(20, "Name is too long!"),
  userType: yup
    .string()
    .required("userType is missing!")
    .oneOf(
      ["patient", "family", "friend", "professional", "caregiver", "other"],
      "Invalid userType"
    ),
  cancerType: yup.string().required("cancerType is missing!"),
  gender: yup
    .string()
    .required("gender is missing!")
    .oneOf(["Male", "Female", "Other"], "Invalid gender"),
  birthDate: yup
    .date()
    .required("Birth Date is missing!")
    .max(new Date(), "birthDate cannot be in the future"),
  diagnosisDate: yup.date().nullable().notRequired(),
  stage: yup.string(),
  country: yup
    .object()
    .shape({
      cca2: yup.string(),
      name: yup.string(),
    })
    .notRequired(),
});

export const AppointmentSchema = yup.object().shape({
  title: yup.string().required("title is missing!"),
  location: yup
    .string()
    .min(3, "location is too short!")
    .max(30, "location is too long!")
    .required("location is missing!"),
  date: yup.date().required("date is missing!"),
  reminder: yup
    .string()
    .oneOf(
      ["No Reminder", "1 hour before", "2 hours before", "The day before"],
      "Invalid reminder"
    )
    .required("Reminder is missing!"),
  notes: yup.string().notRequired(),
});

export const MedicationSchema = yup.object().shape({
  name: yup.string().required("Name and strength is missing!"),
  frequency: yup
    .string()
    .oneOf(["As needed", "Every day", "Specific days"], "Invalid frequency")
    .required("Frequency is missing!"),
  timesPerDay: yup
    .string()
    .oneOf(
      [
        "Once a day",
        "2 times a day",
        "3 times a day",
        "4 times a day",
        "5 times a day",
        "6 times a day",
        "7 times a day",
        "8 times a day",
        "9 times a day",
        "10 times a day",
      ],
      "Invalid times per day"
    ),
  specificDays: yup
    .array()
    .of(
      yup
        .string()
        .oneOf(
          [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          "Invalid specific day"
        )
    ),
  prescriber: yup
    .string()
    .max(30, "Prescriber name is too long!")
    .notRequired(),
  notes: yup.string().notRequired(),
  date: yup.date().required("date is missing!"),
});
