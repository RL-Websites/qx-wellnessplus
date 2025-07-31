import * as yup from "yup";
export const patientValidationSchema = yup.object({
  first_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("First Name"),
  last_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Last Name"),
  dob: yup
    .array(yup.string().nonNullable(() => "Please provide a valid date of format MM/DD/YYYY."))
    .typeError("Please provide a valid date of format MM/DD/YYYY.")
    .required("Please provide your date of birth"),
  gender: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Gender"),
  cell_phone: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .length(10, "Phone number must be 10 digits long")
    .label("Phone number"),
  email: yup
    .string()
    .email("Please provide a valid email address")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Please provide a valid email address")
    .required(({ label }) => `${label} is required`)
    .label("Email address"),
  address: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Address"),
  state: yup.string().required("Please select a state").label("State"),
  city: yup.string().required("Please select a city").label("City"),
  zip_code: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Zip code"),
  height: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Height"),
  weight: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Weight"),
  allergy: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Allergy"),
  allergyType: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Allergy Type"),
  symptoms: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Symptoms"),
});

export type PatientFormFieldsType = yup.InferType<typeof patientValidationSchema>;

export const shippingBillingSchema = yup.object().shape({
  shipping: yup.object().shape({
    name: yup.string().required("Shipping name is required"),
    address1: yup.string().required("Shipping address is required"),
    state_id: yup.string().required("Shipping state is required"),
    city_id: yup.string().required("Shipping city is required"),
    zip_code: yup
      .string()
      .required(({ label }) => `${label} is required`)
      .label("Shipping zip code"),
    email: yup.string().email("Invalid shipping email address").required("Shipping email is required"),
  }),
  billing: yup.object().shape({
    name: yup.string().required("Billing name is required"),
    address1: yup.string().required("Billing address is required"),
    state_id: yup.string().required("Billing state is required"),
    city_id: yup.string().required("Billing city is required"),
    zip_code: yup
      .string()
      .required(({ label }) => `${label} is required`)
      .label("Billing zip code"),
    email: yup.string().email("Invalid billing email address").required("Billing email is required"),
  }),
});

export type ShippingBillingFieldTypes = yup.InferType<typeof shippingBillingSchema>;
