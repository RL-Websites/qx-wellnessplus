import { ICommonParams } from "./Common.model";
import { IUserData } from "./User.model";

export interface IMedicalSpaListFilterParams extends ICommonParams {
  status?: string[];
  type?: string;
}

export interface IMedicalSpaList {
  id: number;
  parent_id: any;
  type: string;
  u_id: string;
  email: string;
  phone: number;
  logo: string;
  name: string;
  contact_person_name: string;
  fax_number: number;
  status: string;
  created_at: string;
  updated_at: string;
  spa_medical_count: number;
  spa_clinics_count: number;
  spa_prescriber_count: number;
  spa_doctors_count?: number;
  addresses: Address[];
  spa_medical: any;
  spa_clinic: any[];
  userable?: IUserData;
}

export interface Address {
  id: number;
  clinic_id: number;
  contact_person_name: string;
  phone: number;
  email: string;
  fax_number: number;
  address1: string;
  address2: string;
  zip_code: string;
  state_id: number;
  city_id: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface IPaymentAgreementDTO {
  clinic_id: number | undefined;
  payment_per_review: number;
  payment_per_prescription: number;
  payment_interval: string;
}

export interface IClinicalSpaPatientDetails {
  id: number;
  patient_id: number;
  clinic_id: number;
  service_id: number;
  history_circulatory_respiratory: HistoryCirculatoryRespiratory;
  schedule_start: string;
  schedule_end: string;
  status: string;
}

export interface HistoryCirculatoryRespiratory {
  asthma: string;
  dizziness: string;
}
