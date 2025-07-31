import { IUserData } from "./User.model";

export interface IClientDto {
  // id?: number;
  name: string;
  email: string;
  phone: string;
  logo: string;
}

export interface IClientList {
  id: number;
  name: string;
  logo: string;
  logo_path: string;
  email: string;
  phone: string;
  // insurance: string;
  ins_code: string;
  // order_prefix: string;
  order_id_prefix: string;
  is_active: number;
  created_by: number;
  updated_by: any;
  email_verified_at: any;
  remember_token: any;
  created_at: string;
  updated_at: string;
  u_id: string;
}

export interface IClientDetails {
  id?: number;
  name: string;
  logo?: string;
  logo_path?: string;
  email: string;
  phone: string;
  ins_code: string;
  order_id_prefix: string;
  is_active?: number;
  created_by?: number;
  updated_by?: any;
  email_verified_at?: any;
  remember_token?: any;
  created_at?: string;
  updated_at?: string;
  u_id?: string;
  prescriptions_count?: number;
  completed_prescriptions?: number;
  country?: string;
  assign_pharmacy?: string[] | undefined;
  pharmacies?: { value: string; label: string }[];
}
export interface IClientLogoUpdateResponse {
  profileImageUrl: string;
  user: IUserData;
}

export interface ILogoImageDto {
  u_id: string;
  logo: any;
}

export interface IClientCore {
  id?: number;
  name?: string;
  logo?: string;
}

export interface IPartnerClientUpdateDTO {
  slug: string;
  name?: string;
  phone?: string;
  fax?: string;
  logo?: string;
}
