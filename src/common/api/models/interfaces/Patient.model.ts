import { IClinicBasicInfo } from "./Clinic.model";
import { IDoctor } from "./Doctor.model";
import { IPrescriptionDetails } from "./Prescription.model";

export interface IManageStatusDTO {
  id: string;
  treatment_status: string;
  note?: string;
}

export interface IPatientDetails {
  id: number;
  u_id: string;
  client_id: number | null;
  patient_id: number | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  gender: string;
  dob: string;
  signature: string | null;
  cell_phone: string;
  fax_number: string | null;
  social_security_number: string | null;
  address1: string;
  address2: string | null;
  state: string;
  city: string;
  zipcode: string;
  country: string | null;
  height: string;
  weight: string;
  status: string;
  driving_license_front: string | null;
  driving_license_back: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  deleted_by: number | null;
  name: string;
  prescriptions: IPrescriptionDetails[];
  ordered_prescription__details_count: number;
}

export interface IPatientHistory {
  id: number;
  order_id: string;
  medication_id: number;
  patient_id: number;
  prescriber_id: number;
  created_at: string;
  medication: IMedicationRef;
  send_pharmacy?: {
    id: number;
    name: string;
  };
  u_id: string;
}

export interface IMedicationRef {
  id?: number;
  drug_ndc?: string;
  drug_name?: string;
  drug_shape?: string;
  drug_schedule?: string;
  quantity?: number;
}

export interface IClientRef {
  id: number;
  name: string;
  u_id: string;
}

export interface IPatientInviteDto {
  first_name: string;
  cell_phone: string;
  email: string;
}

export interface ISpaPatientInProgressDetails {
  id?: number;
  patient_id?: number;
  u_id?: string;
  clinic_id?: number;
  doctor_id?: null;
  service_id?: number;
  signature?: null;
  source?: string;
  status?: string;
  note?: null;
  review_date?: null;
  history_circulatory_respiratory?: null;
  history_nervous_system?: null;
  history_digestive?: null;
  history_urinary_system?: null;
  history_other?: null;
  history_skin?: null;
  schedule_start?: Date;
  schedule_end?: Date;
  created_at?: Date;
  updated_at?: Date;
  decline_note?: string;
  decline_at?: Date;
  approved_note?: string;
  approved_at?: Date;
  patient?: IPatientDetails;
  messages: IMessage[];
  service?: {
    id?: number;
    name?: string;
  };
  multiple_services: IMultipleServicesRef[];
  schedule_json?: {
    date?: string;
    end?: string;
    start?: string;
  };
  clinic?: IClinicBasicInfo;
  doctor?: IDoctor;
  type?: string;
}

export interface IMultipleServicesRef {
  id?: number;
  name?: string;
}

export type IMessage = {
  id?: string;
  appointment_id?: string | number | null | undefined;
  uid: string | number | null | undefined;
  message: string;
  prescription_id?: string | number | null | undefined;
  created_at: string;
};

export interface ISetSpaPatientStatusDTO {
  u_id: string;
  status: string;
  note?: string;
}

export interface UpdatePatientInfoDTO {
  dob: string;
  gender: string;
  address1: string;
  first_name: string;
  email: string;
  cell_phone: string;
  state: string;
  city: string;
  zipcode: string;
}

export interface IPatientPhoto {
  direction?: string;
  file?: string;
}
