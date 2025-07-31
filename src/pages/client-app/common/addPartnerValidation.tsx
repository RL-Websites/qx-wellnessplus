import * as yup from "yup";
export const addPartnerValidationSchema = yup.object({
  account_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Customer account name"),
  contact_person_name: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Customer contact person name"),
  email: yup
    .string()
    .email("Please provide a valid email address")
    .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Email address is required")
    .required(({ label }) => `${label} is required`)
    .label("Email address"),
  phone: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .length(10, "Phone number must be 10 digits")
    .required()
    .label("Phone Number"),
  fax_number: yup.string().test("fax-length", "Fax number must be exactly 10 digits long", (value) => !value || value.length === 10),
  logo: yup.mixed().nullable(),
  address: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Address"),
  state: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("State"),
  city: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("City"),
  zip_code: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Zip Code"),
  paymentType: yup.string().required("Please select at least one value."),
  stripe_connect_id: yup.string().when("paymentType", {
    is: (value) => value == "stripe",
    then: (schema) => schema.required("Customer ID in required"),
  }),
});

export type invitePartnerType = yup.InferType<typeof addPartnerValidationSchema>;
