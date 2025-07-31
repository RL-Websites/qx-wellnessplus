import { ICommonParams } from "./Common.model";
import { ICardRef } from "./Payment.model";
import { IUserData } from "./User.model";

export interface IClinicListFilterParams extends ICommonParams {
  status?: string[];
  noPaginate?: boolean;
  module?: string;
}

export interface IClinicInviteDTO {
  clinic_create_mode?: string;
  name?: string;
  email?: string;
  phone?: string;
  contact_person_name?: string;
  fax_number?: string;
  entity_type?: string;
  spa_medical_id?: number;
  medicines: any;

  payment_agreement?: {
    payment_per_review?: string;
    payment_per_prescription?: string;
    payment_interval?: string;
  };
  services?: IServiceITems[] | string[];
}

interface IServiceITems {
  value?: string;
  label?: string;
}

export interface IClinicPasswordUpdateDTO {
  u_id: string;
  password: string;
  confirm_password: string;
}

export interface IClinicAddressUpdateDTO {
  type?: string;
  address_id?: number;
  clinic_uid?: number;
  contact_person_name?: string;
  phone?: string;
  email?: string;
  fax?: string;
  address1?: string;
  address2?: string;
  state_id?: string;
  city_id?: string;
  zip_code?: string;
}

export interface IClinicList {
  id?: number;
  u_id?: string;
  email?: string;
  phone?: number;
  logo?: null;
  name?: string;
  contact_person_name?: string;
  fax_number?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  addresses: IClinicAddress[];
  address?: IClinicAddress;
  pharmacy?: {
    id: number;
    name: string;
  };
}

export interface IClinicDetails {
  id?: number;
  u_id?: string;
  email?: string;
  phone?: number;
  logo?: null;
  name?: string;
  contact_person_name?: string;
  fax_number?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  address: IClinicAddress;
  addresses: IClinicAddress[];
  card: ICardRef[];
  userable?: IUserData;
  userable_uid?: string;
  spa_medical?: IDocuSpa;
  services?: IClinicServices[];
  spa_clinics?: ISpaClinic[];
  payment_agreements?: IPaymentAgreement[];
}

export interface ISpaClinic {
  parent_id: string;
  id: string;
  name: string;
  type: string;
}
export interface IDocuSpa {
  id: string;
  name: string;
  type: string;
}

export interface IPaymentAgreement {
  payment_per_review?: number;
  payment_per_prescription?: number;
  payment_interval?: string;
}

export interface IClinicServices {
  id?: number;
  name?: string;
  slug?: string;
  type?: any;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

export interface IClinicAddress {
  id?: number;
  clinic_id?: number;
  contact_person_name?: string;
  phone?: number;
  email?: string;
  fax_number?: number;
  address?: string;
  full_address?: string;
  address1?: string;
  address2?: string;
  zip_code?: string;
  state?: string;
  state_id?: number;
  city?: string;
  city_id?: number;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

export interface IClinicBasicInfo {
  u_id: string;
  name: string;
  contact_person_name: string;
  phone: string;
  fax_number: string;
  can_prescribe: number;
}

export interface AddressDataTypes {
  contact_person_name: string;
  email: string;
  phone: string;
  fax: string;
  address1: string;
  address2: string;
  state_id?: string;
  city_id?: string;
  state?: string;
  city?: string;
  zip_code: string;
}

export interface IClinicRegistrationDTO {
  u_id?: string;
  clinic_create_mode: string;
  name: string;
  email: string;
  phone: string;
  contact_person_name: string;
  fax_number: string;
  logo: File;
  card_name: string;
  card_number: string;
  expiration_date: string;
  cvv: string;
  password?: string;
  confirm_password?: string;
  addresses: AddressDataTypes[];
  payment_agreement: IPaymentAgreement;
}

export interface IClinicImageDTO {
  u_id: string;
  logo: any;
}
