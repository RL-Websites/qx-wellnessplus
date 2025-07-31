import { IUserData } from "./User.model";

export interface IPartnerInviteDto {
  contact_person_name: string;
  account_name: string;
  email: string;
  phone: string;
  fax_number: string | undefined;
  address: string;
  state: string;
  city: string;
  zip_code: string;
  medication_ids: any[];
  logo: any;
  stripe_connect_id: string;
  payment_type: string;
}

export interface IAssignedPartner {
  id: number;
  client_id: number;
  account_name: string;
  contact_person_name: string;
  slug: string;
  email: string;
  phone: string;
  fax_number: string;
  logo: string;
  status: string;
  address: string;
  state: string;
  city: string;
  zip_code: string;
  token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  partner_status: string;
  pivot?: IAssignedPartnerPivotRef;
}

export interface IMedicine {
  id: number;
  drug_name: string;
  total_price: string;
}

export interface IPartner {
  id: number;
  account_name: string;
  email: string;
  profile_image: string | null;
  userable: IUserData; // Adjust if you know the actual type of `userable`
}

export interface IAssignPartnerMedication {
  id: number;
  medication_id: number;
  partner_id: number;
  customer_id: number;
  status: string;
  price: string;
  created_at: string | null;
  updated_at: string | null;
  medicine: IMedicine;
  customer: IPartner;
  is_active: number;
}

export interface IAssignedPartnerPivotRef {
  medication_id: number;
  partner_id: number;
  status: string;
}

export interface IAssignedPartnerStatusChangeDTO {
  medication_id: number;
  customer_id: number;
  status: string;
}

export interface IUpdatePartnerMedicationsDTO {
  customer_id: number;
  medications: IAssignMedicationRef[];
}

export interface IAssignMedicationRef {
  medication_id: number;
  price: number;
}

export interface ICreatePaymentIntentDTO {
  amount: string;
  prescription_id: number;
}
