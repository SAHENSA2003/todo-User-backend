import * as yup from "yup";

const passwordRule = yup
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@$%^&*])/,
    "Must contain one uppercase, one lowercase, one number and one special character",
  )
  .required("Password is required");

const emailRule = yup
  .string()
  .trim()
  .lowercase()
  .email("this email is not valid")
  .required("Email is required");

export const userValidateSchema = yup.object({
  UserName: yup
    .string()
    .trim()
    .min(3, "UserName must be at least three character")
    .required(),
  email: emailRule,
  Password: passwordRule,
});

export const forgetPasswordSchema = yup.object({
  email: emailRule,
});

export const setNewPasswordSchema = yup.object({
  email: emailRule,
  otp: yup
    .string()
    .trim()
    .matches(/^\d{6}$/, "OTP must be 6 digits")
    .required("OTP is required"),
  password1: passwordRule,
  password2: yup
    .string()
    .oneOf([yup.ref("password1")], "Passwords must match")
    .required("Please confirm your password"),
});
