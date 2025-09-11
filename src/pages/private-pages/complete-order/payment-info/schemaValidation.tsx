import * as yup from "yup";

export const shippingBillingSchema = yup.object().shape({
  shipping: yup.object().shape({
    name: yup.string().required("Shipping name is required"),
    address: yup.string().required("Shipping address is required"),
    address2: yup.string().optional(),
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
    address2: yup.string().optional(),
    state: yup.string().required("Billing state is required"),
    city: yup.string().required("Billing city is required"),
    zip_code: yup
      .string()
      .required(({ label }) => `${label} is required`)
      .label("Billing zip code"),
    email: yup.string().email("Invalid billing email address").required("Billing email is required"),
  }),
});

export type ShippingBillingFieldTypes = yup.InferType<typeof shippingBillingSchema>;
