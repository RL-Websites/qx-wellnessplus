import { IEligibleState } from "./EligibleStates.model";
import { ISchedule } from "./Schedule.model";
import { IClientList } from "./client.model";

export interface IDoctorBasicInfoDTO {
  first_name?: string;
  dosespot_id?: number;
  last_name?: string;
  email?: string;
  dob?: string;
  phone?: string;
  address?: string;
  state?: string;
  state_id?: string;
  city_id?: string;
  city?: string;
  state_lic?: string;
  zip_code?: string;
  npi?: string;
  type: string;
}

export interface IDoctorProfessionalInfoDTO {
  userable_uid?: string;
  current_position?: string;
  last_edu_inst?: string;
  last_edu_degree?: string;
  current_inst?: string;
  profession_city_id?: string;
  profession_state_id?: string;
  profession_city?: string;
  profession_state?: string;
  eligible_states?: string[];
  profession_zip_code?: number | string;
  dea?: string;
  dea_expired_date?: string;
  documents?: any[];
  type: string;
}

export interface IDoctor {
  id: number;
  dosespot_id: string;
  first_name: string;
  email: string;
  phone: string;
  last_name: string;
  dob: null;
  name: string;
  state_lic: string;
  npi: number;
  dea: string;
  dea_expired_date?: string;
  current_position: any;
  current_inst: any;
  last_edu_degree: any;
  last_edu_inst: any;
  profession_state_id: number;
  profession_city_id: number;
  profession_zip_code: any;
  zip_code: string;
  join_date: string;
  reg_date: string;
  status: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  eligible_states_count: number;
  clients_count: number;
  u_id: string;
  type: string;
  documents: IDocuments[];
  clients: IClientList[];
  physician_assistants: IPhysicianAssistant[];
  eligible_states: IEligibleState[];
  profession_city: string;
  profession_state: string;
  profile_image?: string;
  address?: string;
  addressable: Addressable;
  city?: string;
  state?: string;
  city_id?: number;
  state_id?: number;
  country_id?: number;
  physician_assistants_count?: number;
  invited_physician_assistants_count?: number;
  prescription_count?: number;
  prescriptions_count?: number;
  completed_prescriptions_count?: number;
  userable?: IUserable;
  clinic?: IClinic;
  schedules?: ISchedule;
  signature?: string;
  docu_spa_reviews_count?: number;
}

export interface IDoctorPasswordUpdateDTO {
  u_id: string;
  password: string;
  confirm_password: string;
  signature: any;
}

export interface IPhysicianAssistant {
  id: number;
  doctor_id: number;
  dosespot_id: number;
  first_name: string;
  last_name: string;
  physician_email: string;
  email: string;
  physician_phone: string;
  phone: string;
  address: string;
  country: ICountry;
  city_id: number;
  city: IWorkingCity;
  state_id: number;
  state: IWorkingState;
  status: string;
  state_license: string;
  npi: number;
  current_position: string;
  current_inst: string;
  dea: string;
  last_edu_degree: string;
  last_edu_inst: string;
  profession_state_id?: number;
  profession_city_id?: number;
  profession_state?: string;
  profession_city?: string;
  profession_zip_code: string;
  zip_code: string;
  join_date: string;
  reg_date: string;
  created_at: string;
  updated_at: string;
  u_id: string;
  name: string;
  documents?: any[];
  doctor?: IDoctorInPA;
  working_state?: IWorkingState;
  working_city?: IWorkingCity;
  profile_image?: string;
  type: string;
  userable?: IUserable;
  prescription_count: number;
  addressable: Addressable;
}

interface IUserable {
  first_name: string;
  last_name: string;
  profile_image?: string;
}

interface IClinic {
  id: number;
  name: string;
}

export interface IDoctorInPA {
  id: number;
  first_name: string;
  email: string;
  phone: string;
  last_name: string;
  name: string;
  state_lic: string;
  npi: number;
  dea: string;
  current_position: string;
  current_inst: string;
  last_edu_degree: string;
  last_edu_inst: string;
  profession_state_id: number;
  profession_city_id: number;
  profession_zip_code: string;
  zip_code: string;
  join_date: any;
  reg_date: string;
  status: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  u_id: string;
  userable: IUserable;
}

export interface IWorkingState {
  id: number;
  parent_id: number;
  name: string;
  code: string;
  short_name: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface IWorkingCity {
  id: number;
  parent_id: number;
  name: string;
  code: string;
  short_name: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface Addressable {
  id: number;
  addressable_type: string;
  addressable_id: number;
  type: any;
  address1: string;
  address2: any;
  zip_code: number;
  state_id?: number;
  state?: string;
  city_id?: number;
  city?: string;
  country_id: number;
  created_at: string;
  updated_at: string;
}

export interface ICountry {
  id: IId;
  name: string;
}

export interface IId {
  id: number;
  parent_id: number;
  name: string;
  code: number | string;
  short_name: string;
  type: string;
  created_at: string;
  updated_at: string;
}
export interface IDocuments extends File {
  id: number;
  documentable_type: string;
  documentable_id: number;
  type: string;
  display_name: string;
  file_full_path: any;
  created_at: string;
  updated_at: string;
  path?: string;
  document_id?: number;
  file_name?: string;
  original_name?: string;
}

export interface IDoctorReference {
  id?: number;
  type?: string;
  clinic_id?: null;
  u_id?: string;
  dosespot_id?: string;
  first_name?: string;
  email?: string;
  dob?: Date;
  phone?: string;
  last_name?: string;
  state_lic?: string;
  profile_image?: string;
  npi?: number;
  dea?: string;
  current_position?: string;
  current_inst?: string;
  last_edu_degree?: string;
  last_edu_inst?: string;
  profession_country_id?: null;
  profession_state_id?: null;
  profession_state?: string;
  profession_city?: string;
  profession_city_id?: null;
  profession_zip_code?: string;
  join_date?: Date;
  reg_date?: Date;
  status?: string;
  created_by?: number;
  updated_by?: number;
  created_at?: Date;
  updated_at?: Date;
  name?: string;
  userable?: IDoctorRefUser;
}

export interface IDoctorRefUser {
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
  can_prescribe?: number;
  remarks?: null;
  created_by?: null;
  email_verified_at?: null;
  profile_image?: string;
  created_at?: Date;
  updated_at?: Date;
  clinic_id?: null;
  client_id?: null;
  name?: string;
  userable_uid?: string;
  prescriber_clinic?: null;
  doctor: IDoctor;
}
