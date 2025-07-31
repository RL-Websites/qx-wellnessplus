import { IDoctor } from "./Doctor.model";

interface Medication {
  id: number;
  drug_name: string;
}

export type IMessage = {
  id?: string;
  appointment_id?: string | number | null | undefined;
  uid: string | number | null | undefined;
  message: string;
  prescription_id?: string | number | null | undefined;
  patient_id?: string | number | null | undefined;
  created_at: string;
};

interface Userable {
  id: number;
  u_id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  dob: string;
  userable_type: string;
  userable_id: number;
  is_active: number;
  remarks: string | null;
  created_by: string | null;
  email_verified_at: string | null;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
  name: string;
  userable_uid: string;
}

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  type: string;
  name: string;
  dea: string;
  userable: Userable;
}

interface Prescription {
  id: number;
  medication_id: number;
  prescriber_id: number;
  created_at: string;
  medication: Medication;
  doctor: Doctor;
  client: Client;
}

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  name: string;
  cell_phone: string;
  dob: string;
}

interface Client {
  name: number;
  logo: string;
}

export interface Meeting {
  id: number;
  patient_id: number;
  prescription_id: number;
  meeting_link: string;
  patient: Patient;
  prescription: Prescription;
  docuspa_service: DocuspaService;
  messages?: IMessage;
  doctor_type?: string;
  doctorable?: IDoctor;
}

export interface ApiResponse<T> {
  status: string;
  status_code: number;
  message: string;
  data: T | null; // Allow data to be null
}

interface Clinic {
  id: number;
  name: string;
  logo: string;
}

interface DocuspaService {
  id: number;
  patient_id: number;
  u_id: string;
  clinic_id: number;
  doctor_id: number | null;
  service_id: number;
  signature: string;
  type: string;
  status: string;
  review_on: string | null;
  expires_at: string;
  note: string | null;
  history_circulatory_respiratory: string | null;
  history_nervous_system: string | null;
  history_digestive: string | null;
  history_urinary_system: string | null;
  history_other: string | null;
  history_skin: string | null;
  schedule_start: string | null;
  schedule_end: string | null;
  created_at: string;
  updated_at: string;
  schedule_json: string | null; // Can be parsed into ScheduleJSON
  decline_at: string | null;
  approved_at: string | null;
  clinic: Clinic;
}
