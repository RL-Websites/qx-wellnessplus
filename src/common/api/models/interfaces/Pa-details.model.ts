import { Addressable, IDocuments } from "./Doctor.model";

export interface IPaDetailsViewModel {
  id: number;
  u_id: string;
  doctor_id: number;
  first_name: string;
  profile_image: string;
  last_name: string;
  dob: null;
  physician_email: string;
  physician_phone: string;
  address: string;
  country_id: number;
  profession_country_id: number;
  city_id?: number;
  city?: string;
  state_id?: number;
  state?: string;
  status: string;
  state_license: string;
  zip_code: string;
  npi: number;
  current_position: string;
  current_inst: string;
  dea: string;
  last_edu_degree: string;
  last_edu_inst: string;
  profession_state_id?: number;
  profession_state?: string;
  profession_city_id?: number;
  profession_city?: string;
  profession_zip_code: string;
  join_date: string;
  reg_date: string;
  created_at: string;
  updated_at: string;
  name: string;
  type: string;
  doctor: Doctor;
  addressable: Addressable;
  eligible_states: EligibleState[];
  documents: IDocuments[];
}

export interface Doctor {
  id: number;
  u_id: string;
  first_name: string;
  email: string;
  phone: string;
  last_name: string;
  state_lic: string;
  profile_image: string;
  npi: number;
  address: string;
  country_id: number;
  state_id: number;
  city_id: number;
  dea: string;
  current_position: string;
  current_inst: string;
  last_edu_degree: string;
  last_edu_inst: string;
  profession_country_id: number;
  profession_state_id: number;
  profession_city_id: number;
  profession_zip_code: string;
  zip_code: string;
  join_date: string;
  reg_date: string;
  status: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  type: string;
  name: string;
  clients: Client[];
}

export interface Client {
  id: number;
  u_id: string;
  name: string;
  logo: string;
  logo_path: string;
  email: string;
  phone: string;
  insurance: string;
  order_prefix: string;
  is_active: number;
  created_by: number;
  updated_by: number;
  email_verified_at: string;
  remember_token: string;
  created_at: string;
  updated_at: string;
  pivot: Pivot;
}

export interface Pivot {
  doctor_id: number;
  client_id: number;
}

export interface EligibleState {
  id: number;
  doctor_id: number;
  name: string;
  physician_assistant_id: number;
  state_id: number;
  created_at: string;
  updated_at: string;
}
