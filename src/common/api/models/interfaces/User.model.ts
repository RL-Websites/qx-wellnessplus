import { IAddress } from "./Address.model";
import { IClinicList } from "./Clinic.model";
import { IClientRef } from "./Patient.model";

export interface IUserData {
  id?: number | undefined;
  user_id?: any;
  first_name?: string;
  last_name?: string;
  phone?: any;
  email?: string;
  userable_type?: string;
  userable_id?: any;
  is_active?: number;
  remarks?: any;
  created_by?: any;
  email_verified_at?: any;
  created_at?: string;
  updated_at?: string;
  name?: string;
  u_id?: string | undefined;
  profile_image?: any;
  address?: string;
  addressable?: IAddress;
  city_id?: number;
  state_id?: number;
  zip_code?: number;
  country?: string;
  userable_uid?: string;
  insurance?: string;
  order_prefix?: string;
  dob?: string;
  client?: IClientRef;
  userable: IUserable;
  prescriber_clinic: IClinicList;
  userable_clinic?: IUserableClinicRef;
  can_prescribe?: number;
  clinic_id?: number;
  prescription_count?: number;
  user_enc_id: string;
}

export interface IUserable {
  dosespot_id: string;
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  cell_phone: string;
  dob: string;
  gender: string;
  address1: string;
  address2: string;
  state: string;
  city: string;
  zipcode: string;
  latitude: number;
  longitude: number;
  type: string;
  slug: string;
  signature?: string;
  phone: number;
  fax: number;
  payment_type: string;
  stripe_connect_id?: string;
  driving_license_front: string;
  driving_license_back: string;
  u_id: string;
}

export interface IAdminBasicInfoDto {
  u_id: string;
  _method: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city_id: string | null;
  state_id: string;
  zip_code: string;
  dob: string | null;
}

export interface IProfileImageDto {
  u_id: string;
  profile_image: any;
}

export interface IUsers {
  id?: number;
  u_id?: string;
  user_id?: null;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  dob?: Date;
  userable_type?: string;
  userable_id?: number;
  is_active?: number;
  remarks?: null;
  created_by?: null;
  email_verified_at?: null;
  profile_image?: string;
  created_at?: Date;
  updated_at?: Date;
  client_name?: null;
  name?: string;
  userable_uid?: string;
}

export interface ICreateUserDto {
  _method?: string;
  u_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  state_id?: string;
  city_id?: string;
  zip_code?: string;
  password?: string;
  confirm_password?: string;
  userable_type?: string;
  client_id?: string;
  is_active?: number;
}

export interface IUserableClinicRef {
  id?: number;
  parent_id?: null;
  type?: string;
  u_id?: string;
  email?: string;
  phone?: number;
  logo?: string;
  name?: string;
  contact_person_name?: string;
  fax_number?: number;
  status?: string;
  can_prescribe?: number;
  created_at?: Date;
  updated_at?: Date;
}
