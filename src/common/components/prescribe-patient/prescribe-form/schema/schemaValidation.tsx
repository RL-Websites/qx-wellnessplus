import * as yup from "yup";

const ssnRegex = /^(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/;
export const patientValidationSchema = yup.object({
  id: yup.number().nullable(),
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
  ssn: yup
    .string()
    .nullable()
    .test("ssn-validation", "SSN number must be valid or empty", (value) => {
      if (!value) return true;
      return ssnRegex.test(value);
    }),
  height: yup.string().nullable(),
  weight: yup.string().nullable(),
  allergy: yup
    .string()
    .required(({ label }) => `${label} is required`)
    .label("Allergy"),
  allergyType: yup.string().when("allergy", {
    is: "true",
    then: (schema) => schema.required("Please mention an allergy type"),
  }),
  symptoms: yup.string(),
});

export type PatientFormFieldsType = yup.InferType<typeof patientValidationSchema>;

export const shippingBillingSchema = yup.object().shape({
  payor: yup.string(),
  // patientCard: yup
  //   .object({
  //     card_name: yup.string(),
  //     card_number: yup.string(),
  //     expiration_date: yup.string(),
  //     cvv: yup.string(),
  //   })
  //   .when("payor", {
  //     is: "Patient",
  //     then: (schema) =>
  //       schema.shape({
  //         card_name: yup
  //           .string()
  //           .required(({ label }) => `${label} is required`)
  //           .label("Card name"),
  //         card_number: yup
  //           .string()
  //           .matches(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9][0-9])[0-9]{12})$/, "Invalid credit card number")
  //           .required("Credit card number is required")
  //           .label("Card Number"),
  //         expiration_date: yup
  //           .string()
  //           .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid expiration date")
  //           .test("expiration", "Card has expired", (value) => {
  //             if (!value) return false;
  //             const [month, year] = value.split("/");
  //             const expDate = new Date(parseInt(`20${year}`), parseInt(month) - 1);
  //             return expDate > new Date();
  //           })
  //           .required("Expiration date is required")
  //           .label("Expiration date"),
  //         cvv: yup
  //           .string()
  //           .required(({ label }) => `${label} is required`)
  //           .label("CVV"),
  //       }),
  //     otherwise: (schema) =>
  //       schema.shape({
  //         card_name: yup.string(),
  //         card_number: yup.string(),
  //         expiration_date: yup.string(),
  //         cvv: yup.string(),
  //       }),
  //   })
  //   .label("Patient card information"),
  shipping: yup.object().shape({
    name: yup.string().required("Shipping name is required"),
    address: yup.string().required("Shipping address is required"),
    state: yup.string().required("Shipping state is required"),
    city: yup.string().required("Shipping city is required"),
    zip_code: yup
      .string()
      .required(({ label }) => `${label} is required`)
      .label("Shipping zip code"),
    email: yup.string().email("Invalid shipping email address").required("Shipping email is required"),
  }),
  billing: yup.object().shape({
    name: yup.string().required("Billing name is required"),
    address: yup.string().required("Billing address is required"),
    state: yup.string().required("Billing state is required"),
    city: yup.string().required("Billing city is required"),
    zip_code: yup
      .string()
      .required(({ label }) => `${label} is required`)
      .label("Billing zip code"),
    email: yup.string().email("Invalid billing email address").required("Billing email is required"),
  }),
});

// .shape({
//   card_name: yup.string().when("payor", {
//     is: "Patient",
//     then: (schema) => schema.required(({ label }) => `${label} is required`).label("Card Name"),
//   }),
//   card_number: yup.string().when("payor", {
//     is: "Patient",
//     then: (schema) =>
//       schema
//         .matches(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9][0-9])[0-9]{12})$/, "Invalid credit card number")
//         .required("Credit card number is required")
//         .label("Card Number"),
//   }),
//   expiration_date: yup.string().when("payor", {
//     is: "Patient",
//     then: (schema) =>
//       schema
//         .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid expiration date")
//         .test("expiration", "Card has expired", (value) => {
//           if (!value) return false;
//           const [month, year] = value.split("/");
//           const expDate = new Date(parseInt(`20${year}`), parseInt(month) - 1);
//           return expDate > new Date();
//         })
//         .required("Expiration date is required")
//         .label("Expiration date"),
//   }),
//   cvv: yup.string().when("payor", {
//     is: "Patient",
//     then: (schema) => schema.required(({ label }) => `${label} is required`).label("CVV"),
//   }),
// })

export type ShippingBillingFieldTypes = yup.InferType<typeof shippingBillingSchema>;
