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
    .transform((value) => (value ? value.replace(/\D/g, "") : ""))
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
  country: yup.string().label("Country"),
  address: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Address"),
  address2: yup.string().nullable().optional(),
  state: yup.string().required("Please select a state").label("State"),
  city: yup.string().required("Please select a city").label("City"),
  zip_code: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Zip code"),
  latitude: yup.number().nullable(),
  longitude: yup.number().nullable(),
  driving_lic_front: yup.mixed().nullable(),
  driving_lic_back: yup.mixed().nullable(),
});

export type BasicInfoFormFieldsType = yup.InferType<typeof basicInfoValidationSchema>;
