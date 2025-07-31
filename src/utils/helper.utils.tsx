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
