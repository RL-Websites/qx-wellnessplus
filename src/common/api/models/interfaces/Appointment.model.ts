import { IPhysicianAssistant } from "./Doctor.model";
import { ISlot } from "./Schedule.model";

export interface IAppointMentCreateDTO {
  prescription_u_id: string;
  note?: string;
  meeting_type: string;
}

export interface IAppointmentScheduleData {
  prescription: IPrescriptionRefData;
  schedules: ISchedulesRefData;
}

export interface IPrescriptionRefData {
  id: number;
  client_id: number;
  medication_id: number;
  patient_id: number;
  prescriber_id: number;
  u_id: string;
  doctor_details?: IDoctorDetailsRefData;
  pa?: IPhysicianAssistant;
  appointment: IAppointmentsRef;
  medication: any;
  patient: IPatientRefData;
  client: IClientRefData;
  appointment_schedules: IAppointmentScheduleRef;
}

export interface IAppointmentScheduleRef {
  id: number;
  slot_id?: number;
  doctor_id?: number;
  appointment_id?: number;
  appointment_date?: string;
  prescription_id?: number;
  comfortable_video?: number;
  note?: string;
  created_at?: string;
  updated_at?: string;
  slot?: ISlot;
}
export interface IDoctorDetailsRefData {
  id: number;
  userable_type: string;
  userable_id: number;
  name: string;
  userable_uid: string;
  dea: string;
}

export interface IAppointmentsRef {
  id: number;
  prescription_id: number;
  patient_id: number;
  meeting_type: string;
  meeting_link: any;
  sender_type: string;
  status: string;
  note: string;
  created_at: string;
  created_by: number;
  updated_at: string;
  u_id: string;
}

export interface IPatientRefData {
  id: number;
  u_id: string;
  first_name: string;
  last_name: string;
  email: string;
  cell_phone: any;
  name: string;
}

export interface IClientRefData {
  id: number;
  name: string;
  logo?: string;
}
export interface ISchedulesRefData {
  weekly: IWeeklyRef[];
  specific: any[];
}

export interface IWeeklyRef {
  id: number;
  day: string;
  slots: ISlot[];
  isActive: number;
}

export interface IConfirmAppointmentDTO {
  appointment_u_id: string;
  appointment_date: string;
  slot_id: number;
  comfortable_video: string;
  appointment_note: string;
}

export interface IDocAptSchedule {
  id: number;
  u_id: string;
  prescription_id: number;
  patient_id: number;
  meeting_type: string;
  meeting_link: string;
  sender_type: string;
  status: string;
  note: any;
  created_by: number;
  created_at: string;
  updated_at: string;
  prescription: IDocAptSchedule_Prescription;
  patient: IDocAptSchedule_Patient;
  appointment_schedule: IDocAptSchedule_Appointment;
}

export interface IDocAptSchedule_Prescription {
  id: number;
  order_id: string;
  medication_id: number;
  patient_id: number;
  medication: IDocAptSchedule_Medication;
}

export interface IDocAptSchedule_Medication {
  id: number;
  drug_name: string;
}
export interface IDocAptSchedule_Patient {
  id: number;
  first_name: string;
  last_name: string;
  client_id: number;
  name: string;
}
export interface IDocAptSchedule_Appointment {
  id: number;
  slot_id: number;
  doctor_id: number;
  appointment_id: number;
  appointment_date: string;
  prescription_id: number;
  comfortable_video: number;
  note: any;
  created_at: string;
  updated_at: string;
  slot: IDocAptSchedule_Slot;
}

export interface IDocAptSchedule_Slot {
  id: number;
  shift: string;
  start_time: string;
  end_time: string;
  note: any;
  status: number;
  created_at: any;
  updated_at: any;
}
