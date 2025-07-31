import { ClientStatusEnum, ClinicalSpaPaymentEnum, DoctorStatusEnum } from "@/enums/status.enum";

export const getDoctorStatusText = (status: number | string | undefined): string => {
  switch (status) {
    case DoctorStatusEnum.Invited:
      return "Invited";
    case DoctorStatusEnum.Accepted:
      return "Accepted";
    case DoctorStatusEnum.Active:
      return "Active";
    case DoctorStatusEnum.Declined:
      return "Declined";
    case DoctorStatusEnum.Pending:
      return "Pending";
    case DoctorStatusEnum.Inactive:
      return "Inactive";
    default:
      return "Unknown status.";
  }
};

export const getDoctorStatusTheme = (status: number | string | undefined): string => {
  switch (status) {
    case DoctorStatusEnum.Invited:
      return "text-yellow-deep bg-yellow-light";
    case DoctorStatusEnum.Accepted:
      return "text-green bg-green-low";
    case DoctorStatusEnum.Active:
      return "text-green bg-green-low";
    case DoctorStatusEnum.Declined:
      return "text-danger bg-danger-light";
    case DoctorStatusEnum.Pending:
      return "bg-tag-bg text-tag-bg-deep";
    case DoctorStatusEnum.Inactive:
      return "text-danger-deep bg-danger-light";
    default:
      return "bg-tag-bg text-tag-bg-deep";
  }
};

export const getClientStatusText = (status: number | string | undefined): string => {
  switch (status) {
    case ClientStatusEnum.Deactivated:
      return "Deactivated";
    default:
      return "Activated";
  }
};

export const getPAStatusClassName = (status: string | undefined): string => {
  switch (status) {
    case "accepted":
      return "bg-green-low text-green-middle";
    case "inactive":
      return "bg-danger-light text-danger-deep";
    case "removed":
      return "bg-danger-light text-danger-deep";
    default:
      return "bg-tag-bg text-tag-bg-deep";
  }
};

export const getPaStatusText = (status: string) => {
  switch (status) {
    case "accepted":
      return "Available";
    case "inactive":
      return "Deactivated";
    case "removed":
      return "Removed";
    default:
      return "";
  }
};

export const getApiLogStatusClassName = (status: number | undefined): string => {
  switch (status) {
    case 1:
      return "bg-green-low text-green-middle";
    case 0:
      return "bg-danger-light text-danger-deep";
    default:
      return "bg-danger-light text-danger-deep";
  }
};
export const getApiLogStatusText = (status: number) => {
  switch (status) {
    case 1:
      return "Success";
    case 0:
      return "Error";
    default:
      return "Error";
  }
};

export const getBillingStatusClassName = (status: string) => {
  switch (status) {
    case "Received":
      return "text-green bg-green-low";
    case "Delivered":
      return "text-primary bg-primary-light";
    case "Cancelled":
      return "text-danger-deep bg-danger-light";
    case "Shipped | UPS":
      return "text-green bg-green-low";
    case "Processing":
      return "text-tag-bg-deep bg-tag-bg ";
    default:
      return "bg-tag-bg text-tag-bg-deep";
  }
};

export const getBillingStatusText = (status: string) => {
  switch (status) {
    case "Received":
      return "Received";
    case "Delivered":
      return "Delivered";
    case "Cancelled":
      return "Cancelled";
    case "Shipped | UPS":
      return "Shipped | UPS";
    default:
      return status;
  }
};

export const prescriberType = (type: string | undefined) => {
  if (type != "doctor") {
    return "Prescriber";
  } else if (type == "doctor") {
    return "Doctor";
  }
  return "Doctor";
};

export const getMedicineStatusClassName = (status: number) => {
  switch (status) {
    case 1:
      return "bg-green-low text-green-middle";
    case 0:
      return "bg-danger-light text-danger-deep";
    default:
      return "bg-tag-bg text-tag-bg-deep";
  }
};

export const getPaymentStatusClassName = (status: string) => {
  switch (status) {
    case "intake_submitted":
      return "bg-tag-bg text-tag-bg-deep";
    case "succeeded":
      return "text-primary bg-primary-light";
  }
};

export const getPaymentStatus = (status: string) => {
  switch (status) {
    case "requires_capture":
      return "Pending";
    case "succeeded":
      return "Completed";
  }
};

export const getSpaPaymentClassName = (status: number | string | undefined): string => {
  switch (status) {
    case ClinicalSpaPaymentEnum.Paid:
      return "text-green bg-green-low";
    case ClinicalSpaPaymentEnum.Due:
      return "text-danger bg-danger-light";
    case ClinicalSpaPaymentEnum.Pending:
      return "bg-tag-bg text-tag-bg-deep";
    default:
      return "bg-tag-bg text-tag-bg-deep";
  }
};
export const getSpaPaymentStatus = (status: string) => {
  switch (status) {
    case "paid":
      return "Paid";
    case "pending":
      return "Pending";
    case "due":
      return "due";
    default:
      return status;
  }
};

export const getStatusClassName = (status: string) => {
  switch (status) {
    case "invited":
      return "bg-yellow-light text-yellow-deep";
    case "active":
      return "bg-green-low text-green-middle";
    case "accepted":
      return "bg-green-low text-green-middle";
    case "inactive":
      return "bg-danger-light text-danger-deep";
    case "pending":
      return "bg-tag-bg text-tag-bg-deep";
    default:
      return "";
  }
};

export const getStatusName = (status: string) => {
  switch (status) {
    case "active":
      return "Active";
    case "accepted":
      return "Active";
    default:
      return status;
  }
};

export const getOrderStatusClassName = (status: string) => {
  switch (status) {
    case "intake_submitted":
      return "bg-green-low text-green-middle";
    case "accepted":
      return "bg-green-low text-green-middle";
    case "in_queue":
      return "bg-tag-bg text-tag-bg-deep";
    case "received":
      return "bg-green-low text-green";
    case "completed":
      return "bg-primary-light text-primary";
    case "precessing":
      return "bg-grey-low text-grey";
    case "shipped":
      return "bg-green-low text-green-middle";
    case "delivered":
      return "bg-primary-light text-primary";
    case "waiting":
      return "bg-tag-bg text-yellow-deep";
    case "invited":
      return "bg-tag-bg text-yellow-deep";
    case "pending":
      return "bg-tag-bg text-tag-bg-deep";
    case "intake_pending":
      return "bg-tag-bg text-tag-bg-deep w-[100px]";
    case "declined":
      return "bg-danger-light text-danger-deep";
    case "canceled":
      return "bg-danger-light text-danger-deep";
    default:
      return "bg-tag-bg text-tag-bg-deep";
  }
};

export const getOrderStatusName = (status: string) => {
  switch (status) {
    case "intake_submitted":
      return "Submitted";
    case "intake_pending":
      return "Intake Pending";
    case "in_queue":
      return "In queue";
    default:
      return status;
  }
};
