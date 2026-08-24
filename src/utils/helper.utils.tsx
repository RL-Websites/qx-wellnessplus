import { IMedicineListItem } from "@/common/api/models/interfaces/Medication.model";
import { ICustomer } from "@/common/api/models/interfaces/Prescription.model";
import { Locations } from "@/common/constants/locations";
import { ILocation } from "@/common/models/location";
import {} from "@/data/dosespot.json";
import { formatDate } from "./date.utils";

export const getFullName = (firstName: string | null = "", lastName: string | null = ""): string => {
  return (firstName ? firstName : "") + " " + (lastName ? lastName : "");
};

export const formatPhoneNumber = (number: string | number | null | undefined) => {
  if (!number) return "";
  const cleaned = number.toString().replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return number; // Return invalid if the input is not a 10-digit number
};

export const getLocName = (id: string | number | undefined) => {
  const find: any = Locations.find((item: any) => item.id == id);
  if (find && find != undefined) {
    return find?.name;
  }

  return "";
};

export const getLocId = (name: string | undefined, type: string | undefined) => {
  const find = Locations.find((item: ILocation) => item.name == name && item.type == type);
  if (find && find != undefined) {
    return find?.id.toString();
  } else {
    return "";
  }
};

export const getErrorMessage = (error) => {
  if (error) {
    // console.log(error);

    return typeof error.message === "string" ? error.message : error?.[0]?.message ? error?.[0]?.message : "Invalid input";
  }
  return null;
};

export const convertUserableTypeNames = (userable_type: string | undefined) => {
  let userTypeName = userable_type;
  switch (userable_type) {
    case "client_admin":
      userTypeName = "Client Admin";
      break;
    case "physician_assistant":
      userTypeName = "Physician Assistant";
      break;
    default:
      userTypeName = userable_type;
      break;
  }

  return userTypeName;
};

export const formatCardNumber = (cardNumber: string | undefined) => {
  if (cardNumber.length < 4) {
    throw new Error("Card number must have at least 4 digits.");
  }
  const lastFour = cardNumber.slice(-4);
  return `(****${lastFour})`;
};

export const capitalizeAfterSpace = (string: string) => {
  const value = string.replace(/_/g, " ");
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getDeaExpireData = (data) => {
  const today = new Date();
  const expireDate = new Date(data);
  console.log(data);
  if (data != null) {
    if (expireDate.getTime() >= today.getTime()) {
      return data ? formatDate(data, "MMM DD, YYYY") : "";
    } else {
      return (
        <div>
          <div>{data ? formatDate(data, "MMM DD, YYYY") : ""}</div> <div className="tags capitalize bg-tag-bg text-tag-bg-deep">Expired</div>
        </div>
      );
    }
  } else {
    return "";
  }
};

export const trimPrice = (price: string) => {
  // eslint-disable-next-line no-debugger
  // debugger;
  console.log(price?.replace(",", ""));
  return price?.replace(",", "") || "";
};

/**
 * A cart item can only be priced and ordered if it still carries its
 * customer_medication link — the order payload is built from
 * `customer_medication.id`. Stale items persisted in localStorage from an older
 * build (or a product since detached from the customer) do not, and used to crash
 * the order-summary render.
 */
export const isCartItemOrderable = (item: any): boolean => !!item?.customer_medication?.id;

export const calculatePrice = (item: IMedicineListItem) => {
  const customerMedication = item?.customer_medication;
  const fees =
    Number((item?.medication_category == "Testosterone" ? customerMedication?.testosterone_fee : customerMedication?.consultancy_fee) || 0) +
    Number(customerMedication?.platform_fee || 0);

  const qty = Number(item?.qty) || 0;
  const price = Number(item?.customer_price) || 0;

  return price * qty - fees * (qty - 1);
};
export const stateWiseLabFee = (medicine?: IMedicineListItem, patientState?: string) => {
  const states = ["Alaska", "Connecticut", "Massachusetts", "New Hampshire", "Rhode Island"];

  const customerLabPackage = medicine?.lab_package?.customer_lab_packages?.[0];
  const allStatesFee = Number(
    customerLabPackage?.price_all_state ??
    medicine?.lab_package?.price_all_state ??
    medicine?.lab_fee ??
    0
  );
  const selectedStateFee = Number(
    customerLabPackage?.price_selected_state ??
    medicine?.lab_package?.price_selected_state ??
    medicine?.lab_fee_selected_state ??
    allStatesFee
  );

  if (!patientState) return allStatesFee;
  const isStateMatched = states.some((state) => state.toLowerCase() === patientState?.toLowerCase());

  return isStateMatched ? selectedStateFee : allStatesFee;
};

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const dosevanaCostGenerate = (item: any, customer?: ICustomer) => {
  const price = Number(trimPrice(item?.price || 0));
  const doctorFee = Number(trimPrice(item?.doctor_fee || 0));
  const serviceFee = Number(trimPrice(item?.service_fee || 0));

  if (item?.is_packaged == 1) {
    return price + doctorFee + serviceFee;
  }

  let platformFee = serviceFee;
  if (customer && customer?.platform_fee !== undefined && customer?.platform_fee !== null) {
    platformFee = Number(customer?.platform_fee || 0);
  }

  if (!item?.is_required_intake) {
    return price + platformFee;
  }

  let consultancyFee = doctorFee;
  if (customer) {
    const hasTestosteroneOverride = isTestosterone(item?.medication_category || "") && customer?.testosterone_fee;
    consultancyFee = hasTestosteroneOverride ? Number(customer?.testosterone_fee || 0) : Number(customer?.consultancy_fee || item?.doctor_fee || 0);
  }

  return price + consultancyFee + platformFee;
};

export const isTestosterone = (medicine_name: string): boolean => {
  const lowerCaseName = medicine_name?.toLowerCase() || "";

  return lowerCaseName?.includes("testosterone");
};

export const imageUrl = (imagePath: string, defaultPath: string = "/images/image-placeholder.png") => {
  if (!imagePath) {
    return defaultPath;
  }

  if (imagePath.startsWith("blob:") || imagePath.startsWith("data:image")) {
    return imagePath;
  }

  try {
    const url = new URL(imagePath);
    if (url.hostname.includes("s3") || url.hostname.includes("amazonaws") || url.hostname.includes("cloudfront")) {
      return imagePath;
    }
    if (/\.(png|jpe?g|gif|webp|svg|ico|bmp|avif)(\?|#|$)/i.test(url.pathname)) {
      return imagePath;
    }
  } catch {
    // Not a full URL, construct one
  }

  if (imagePath.startsWith("/")) {
    return imagePath;
  }

  //const baseUrl = import.meta.env.VITE_AWS_IMAGE_BASE_URL || `${import.meta.env.VITE_BASE_PATH}/storage`;
  const baseUrl = import.meta.env.VITE_AWS_IMAGE_BASE_URL || "";
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return `${normalizedBase}/${normalizedPath}`;
};

export const generateMedName = (item: any) => {
  if (item?.program_name) {
    return item?.program_name;
  }
  let name = item?.name;
  if (item?.strength) {
    name += " " + item?.strength + "" + item?.unit;
  }
  return name;
};
