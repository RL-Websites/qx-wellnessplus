import dayjs from "dayjs";
import * as yup from "yup";

const DATE_FORMATS = ["MM-DD-YYYY", "MM/DD/YYYY", "YYYY-MM-DD"];

const parseDateValue = (value: unknown) => {
  if (!value) {
    return null;
  }

  let parsed;
  if (typeof value === "string") {
    parsed = dayjs(value, DATE_FORMATS, true);
    if (!parsed.isValid()) {
      parsed = dayjs(value);
    }
  } else if (value instanceof Date) {
    parsed = dayjs(value);
  } else if (dayjs.isDayjs(value)) {
    parsed = value;
  } else {
    parsed = dayjs(String(value));
  }

  return parsed.isValid() ? parsed.startOf("day") : null;
};

const getAgeFromDate = (date: dayjs.Dayjs) => {
  const today = dayjs().startOf("day");
  let age = today.year() - date.year();

  if (today.month() < date.month() || (today.month() === date.month() && today.date() < date.date())) {
    age -= 1;
  }

  return age;
};

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
    .required(({ label }) => `Please select your ${label}.`)
    .label("Gender"),
  dob: yup
    .array(yup.string().nullable())
    .typeError("Please provide a valid date of format MM/DD/YYYY.")
    .required("Please provide your date of birth")
    .test("is18plus", "You must be at least 18 years old", (value, validationContext) => {
      if (!value || value.length === 0) {
        return true;
      }

      const selectedDateValue = value[0];
      if (!selectedDateValue) {
        return true;
      }

      const parsedDate = parseDateValue(selectedDateValue);
      if (!parsedDate) {
        return validationContext.createError({ message: "Please provide a valid date of format MM/DD/YYYY." });
      }

      const age = getAgeFromDate(parsedDate);
      const isTestosterone = validationContext.options.context?.selectedCategory?.includes("Testosterone");
      const minimumAge = isTestosterone ? 22 : 18;
      const message = isTestosterone ? "You must be at least 22 years old." : "You must be at least 18 years old.";

      return age >= minimumAge || validationContext.createError({ message });
    }),
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
  driving_lic_front: yup.string().required("Please upload an image of the front side of your driving license."),
  driving_lic_back: yup.string().required("Please upload an image of the back side of your driving license."),
  driver_license_number: yup
    .string()
    .trim()
    .min(5, "Driver license number must be at least 5 characters")
    .max(20, "Driver license number must not exceed 20 characters")
    .required("Driver license number is required"),
  driver_license_state: yup.string().trim().required("Driver license issue state is required"),
});

export type BasicInfoFormFieldsType = yup.InferType<typeof basicInfoValidationSchema>;
