export interface IPharmacyInviteDTO {
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  fax?: string;
}

export interface IPharmacyRegistrationDTO {
  slug?: string;
  name?: string;
  contact_name?: string;
  fax?: string;
  logo?: string;
  address?: string;
  state?: string;
  city?: string;
  zip_code?: string;
  password?: string;
  confirm_password?: string;
}

export interface IPharmacyAddManuallyDTO {
  name?: string;
  contact_name?: string;
  fax?: string;
  logo?: string;
  address?: string;
  state?: string;
  city?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
}

export interface IPharmacyList {
  id?: number;
  unique_id?: string;
  name?: string;
  slug?: string;
  npi?: null;
  ncpdp?: null;
  dea?: null;
  phone?: string;
  fax?: string;
  website?: null;
  dispense_method?: null;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
  address1?: string;
  address2?: null;
  state?: string;
  city?: string;
  zipcode?: string;
  contact_name?: string;
  email?: string;
  logo?: string;
}

export interface IPharmacyPublicDetails {
  slug?: string;
  name?: string;
  phone?: string;
  fax?: string;
  status?: string;
  contact_name?: string;
  email?: string;
}

export interface IAssignClinicDTO {
  clinic_id?: string;
  medication_id?: 10;
  clinic_price?: 125.5;
}

export interface IAssignedClinic {
  clinic_price?: string;
  id?: number;
  name?: string;
  status?: string;
  isAvailable?: boolean;
}

export interface IAssignedClinicStatusChangeDTO {
  medication_id: string;
  clinic_id: string;
  status: string;
}
