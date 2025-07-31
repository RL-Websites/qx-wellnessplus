import * as yup from "yup";
export const basicInfoValidationSchema = yup.object({
  first_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("First name"),
  last_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Last name"),
  email: yup
    .string()
    .email("Please provide a valid email address")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Please provide a valid email address")
    .required(({ label }) => `${label} is required`)
    .label("Email address"),
  phone: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .length(10, "Phone number must be 10 digits long")
    .label("Phone number"),
  gender: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Gender"),
  dob: yup
    .array(yup.string().nonNullable(() => "Please provide a valid date of format MM/DD/YYYY."))
    .typeError("Please provide a valid date of format MM/DD/YYYY.")
    .required("Please provide your date of birth"),
  // weight: yup.string().required("Weight is required"),
  // height: yup.string().required("Height is required"),
  address: yup.string().required("Address is required").min(5, "Address must be at least 5 characters long"),
  country: yup.string().label("Country"),
  state: yup.string().required("Please select a state").label("State"),
  city: yup.string().required("Please select a city").label("City"),
  zip_code: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Zip code"),
  driving_lic_front: yup.mixed().nullable(),
  driving_lic_back: yup.mixed().nullable(),
});

export type BasicInfoFormFieldsType = yup.InferType<typeof basicInfoValidationSchema>;

export const step1Schema = yup.object({
  familyHistory: yup.string().required("Family history is required"),
  thyroidType: yup.string().required("Thyroid cancer type is required"),
  hasReport: yup.string().required("Report question is required"),
  reportFile: yup.string().when("hasReport", {
    is: "yes",
    then: (schema) => schema.required("Upload required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export type stepSchemaType = yup.InferType<typeof step1Schema>;

export const patientBasicInfoValidationSchema = yup.object({
  first_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("First name"),
  last_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Last name"),
  phone: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .length(10, "Phone number must be 10 digits long")
    .label("Phone number"),
  gender: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Gender"),
  dob: yup
    .array(yup.string().nonNullable(() => "Please provide a valid date of format MM/DD/YYYY."))
    .typeError("Please provide a valid date of format MM/DD/YYYY.")
    .required("Please provide your date of birth"),
  weight: yup.string().required("Weight is required"),
  height: yup.string().required("Height is required"),
  address: yup.string().required("Address is required").min(5, "Address must be at least 5 characters long"),
  country: yup.string().label("Country"),
  state: yup.string().required("Please select a state").label("State"),
  city: yup.string().required("Please select a city").label("City"),
  zip_code: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Zip code"),
  driving_lic_front: yup.mixed().nullable(),
  driving_lic_back: yup.mixed().nullable(),
});

export type PatientBasicInfoFormFieldsType = yup.InferType<typeof patientBasicInfoValidationSchema>;
