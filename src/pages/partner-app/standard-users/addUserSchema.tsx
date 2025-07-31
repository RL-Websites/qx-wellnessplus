import * as yup from "yup";

// schema declaration with yup resolver
export const addUserSchema = yup.object({
  first_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Client's Name"),
  email: yup
    .string()
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Please provide a valid email address")
    .email("Please enter a valid email address")
    .required(({ label }) => `${label} is required`)
    .label("Email"),
  phone: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .length(10, "Mobile number must be 10 digits")
    .required()
    .label("Mobile Number"),
  password: yup
    .string()
    .required("You need to provide a password")
    .min(8, "Password must have at least 8 characters")
    .matches(/^(?=.*\d).*$/, "Password must contain at least one numerical value")
    .matches(/^((?=.*[a-z]){1}).*$/, "Password must contain at least one lower case alphabetical character")
    .matches(/^((?=.*[A-Z]){1}).*$/, "Password must contain at least one upper case alphabetical character")
    .matches(/^(?=.*[!@#$%^&()\-+=\{\};:,<.>]).*$/, "Password must contain at least one special character")
    .label("Password"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("You need to confirm your Password"),
});
