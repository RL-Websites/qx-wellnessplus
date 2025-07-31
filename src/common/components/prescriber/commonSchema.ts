import * as yup from "yup";

const doctorBasic = yup.object({
  email: yup
    .string()
    .email("Please provide a valid email address")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Email address is required")
    .required(({ label }) => `${label} is required`)
    .label("Email address"),
  phone: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Phone number"),
  first_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("First name"),
  last_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Last name"),
  address: yup.string().required("Address is required").min(5, "Address must be at least 5 characters long"),
  state: yup.string().required("Please select a state").label("State"),
  city: yup.string().required("Please select a city").label("City"),
  state_lic: yup
    .string()
    // .required(({ label }) => `${label} is required`)
    .label("State LIC"),
  dob: yup
    .array(yup.string().nonNullable(() => "Please provide a valid date of format MM/DD/YYYY."))
    .typeError("Please provide a valid date of format MM/DD/YYYY.")
    .required("Please provide your date of birth"),
  zip_code: yup
    .string()
    // .typeError("Must be a number")
    .required(({ label }) => `${label} is required`)
    .label("Zip code"),
  npi: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .length(10, "NPI must be 10 digits")
    .label("NPI"),
  signature: yup.mixed().nullable(),
});
const deaRegex = /^[A-Za-z]{2}[0-9]{7}$|^[A-Za-z]{1}9[0-9]{7}$|^[A-Za-z]{2}[0-9]{7}-[A-Za-z0-9]{1,7}$/;
const doctorProfessional = yup.object({
  current_position: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Current position"),
  current_inst: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Current practice institute"),
  profession_state: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("State"),
  profession_city: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("City"),
  profession_zip_code: yup
    .string()
    // .typeError("Must be a number")
    .required(({ label }) => `${label} is required`)
    .label("Zip code"),
  dea: yup
    .string()
    .nullable()

    .test("dea-or-na", "DEA must be valid or empty", (value) => {
      if (!value) return true; // Allow empty/null values
      return deaRegex.test(value);
    }),
  dea_expired_date: yup.array().when("dea", {
    is: (value) => !!value,
    then: (schema) =>
      schema
        .of(yup.string().nonNullable(() => "Please provide a valid date of format MM/DD/YYYY."))
        .typeError("Please provide a valid date of format MM/DD/YYYY.")
        .required("Please provide your DEA expired date"),
  }),

  last_edu_degree: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Recent educational degree"),
  last_edu_inst: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Recent educational institute"),
  eligible_states: yup.array(yup.string()).typeError("At least one state must be selected").min(1, "At least one state must be selected").required(),
});

const createPassSchema = yup.object({
  password: yup.string().when("isRegistration", {
    is: true,
    then: (schema) =>
      schema
        .required("You need to provide a password")
        .min(8, "Password must have at least 8 characters")
        .matches(/^(?=.*\d).*$/, "Password must contain at least one numerical value")
        .matches(/^((?=.*[a-z]){1}).*$/, "Password must contain at least one lower case alphabetical character")
        .matches(/^((?=.*[A-Z]){1}).*$/, "Password must contain at least one upper case alphabetical character")
        .matches(/^(?=.*[!@#$%^&()\-+=\{\};:,<.>]).*$/, "Password must contain at least one special character"),
  }),
  confirm_password: yup.string().when("isRegistration", {
    is: true,
    then: (schema) => schema.oneOf([yup.ref("password")], "Passwords must match").required("You need to confirm your Password"),
  }),
  terms: yup.boolean().when("isRegistration", {
    is: true,
    then: (schema) => schema.oneOf([true], "You must agree to the terms and conditions to proceed."),
  }),
  isRegistration: yup.boolean(),
  signature: yup.mixed().nullable(),
});

const createManualPassSchema = yup.object({
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
  terms: yup.boolean().oneOf([true], "You must agree to the terms and conditions to proceed."),
  signature: yup.mixed().nullable(),
});

export { createManualPassSchema, createPassSchema, doctorBasic, doctorProfessional };

export type CreatePasswordFormFieldTypes = yup.InferType<typeof createPassSchema>;

export type CreateManualPassFormFieldTypes = yup.InferType<typeof createManualPassSchema>;
