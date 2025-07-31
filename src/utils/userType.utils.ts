import { IUserData } from "@/common/api/models/interfaces/User.model";

export const getUserTypeText = (userData: IUserData | null) => {
  if (userData !== null && userData?.userable_type !== undefined) {
    switch (userData?.userable_type) {
      case "admin":
        return "Admin";
      case "doctor":
        return "Doctor";
      case "physician":
        return "Physician Assistant";
      case "client":
        return "Client Admin";
      case "clinic":
        if (userData?.can_prescribe == 1) {
          return "Clinic Admin & Prescriber";
        } else {
          return "Clinic Admin";
        }
      case "spa_clinic_standard":
        return "Spa Clinic Standard";
      case "clinic_admin":
        return "Clinic Admin";
      case "clinic_prescriber":
        return "Prescriber";
      case "spa_medical":
        return "DocuSpa Admin";
      case "spa_clinic":
        return "Clinical Spa Admin";
      case "spa_medical_prescriber":
        return "DocuSpa Prescriber";
      case "pharmacy":
        return "Pharmacy Admin";
      case "client_partner":
        return "Client";
      case "customer":
        return "Customer Account";
      case "customer_standard_user":
        return "Customer Standard Account";
      case "partner_patient":
        return "Patient";
      default:
        return "";
    }
  } else {
    return "";
  }
};
