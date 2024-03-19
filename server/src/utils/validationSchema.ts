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

export const profileUpdateSchema = yup.object().shape({
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
