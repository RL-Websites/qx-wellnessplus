import { default as dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const formatDate = (dateString: string | Date | undefined | null, format: string = "DD MMM, YYYY") => {
  // console.log(dateString, format);
  // console.log(dateString);
  if (!dateString) return "";
  // console.log(dateString);

  // If it's a Date object, format directly
  if (dateString instanceof Date) {
    // console.log(dayjs(dateString).format(format));
    return dayjs(dateString).format(format);
  }

  // Try parsing with known formats
  let parsed = dayjs(
    dateString,
    [
      "YYYY-MM-DD",
      "YYYY-MM-DDTHH:mm:ss",
      "YYYY-MM-DDTHH:mm:ssZ",
      "YYYY-MM-DDTHH:mm:ss.SSSZ",
      "MM/DD/YYYY",
      "DD/MM/YYYY",
      "MM-DD-YYYY",
      "DD-MM-YYYY",
      "MMM DD, YYYY",
      "MMMM DD, YYYY",
    ],
    true
  );

  // If strict parsing fails, try non-strict (for JS Date strings)
  if (!parsed.isValid()) {
    parsed = dayjs(dateString);
  }

  return parsed.isValid() ? parsed.format(format) : "";

  // return dateString ? dayjs(dateString).format(format) : "";
};

export const getAge = (dateString: string | number) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age || "N/A";
};
