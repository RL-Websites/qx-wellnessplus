import { IClientCore } from "./client.model";
import { IClinicBasicInfo } from "./Clinic.model";
import { IDoctor } from "./Doctor.model";
import { IPartnerMedicineListItem } from "./Medication.model";
import { IMessage } from "./MeetingInformation";
import { IServiceItem } from "./Service.model";
import { IUserData } from "./User.model";

export interface IIntakeFormData {
  id: number;
  u_id: string;
  first_name: string;
  middle_name: any;
  last_name: string;
  dob: string;
  cell_phone: string;
  gender: string;
  messages?: IMessage[];
  email: string;
  name: string;
  questionnaires: IQuestionnaire[];
}

export interface IQuestionnaire {
  id: number;
  patient_id: number;
  prescription_id: number;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  is_document?: boolean;
}

export interface patientRequestList {
  id: number;
  medication_id: number;
  rx_number: string;
  prescription_id: number;
  customer_medication_id: number;
  medication_name: string;
  medication_strength: string;
  medication_price: string;
  selling_price: string;
  doctor_name: string | null;
  doctor_npi: string | null;
  created_at: string;
  updated_at: string;
  prescription: IPrescription;
  medication: IMedication;
  customer_medicaton?: IPartnerMedicineListItem;
  u_id: string;
}

export interface IMedication {
  id: number;
  client_id: number;
  name: string;
  sku: string;
  strength: string;
  unit: string | null;
  medicine_type: string;
  medicine_group: string | null;
  price: string;
  doctor_fee: string;
  service_fee: string;
  shipping_fee: string;
  is_research_only: number;
  image: string | null;
  direction: string | null;
  is_active: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  deleted_by: number | null;
  total_price: string;
}

export interface IPrescription {
  id: number;
  u_id: string;
  order_id: string;
  client_id: number;
  pharmacy_id: number | null;
  patient_id: number;
  customer_id: number;
  status: string;
  payment_method: string | null;
  note: string | null;
  total_bill_amount: string;
  created_by: number;
  deleted_at: string | null;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  patient: IPatient;
  customer: ICustomer;
  pharmacy: IPharmacy;
  send_pharmacy: IPharmacy;
}

export interface IPharmacy {
  id: number;
  name: string;
}

export interface ICustomer {
  id: number;
  account_name: string;
}

export interface IPatient {
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
}

export interface IPrescriptionDetailsPartnerRef {
  account_name: string;
  id: number;
}
export interface IServicePrescription {
  uid: string;
  order_id: number | null;
  pharmacy_order_id: number | null;
  docu_spa_service_id: number | null;
  clinic_id: number;
  patient_id: number;
  doctor_id: number;
  service_id: number;
  created_by: number;
  quantity: number;
  direction: string;
  refill: number;
  days_supply: number;
  note: string;
  status: string;
  is_sent: boolean;
  created_at: string;

  // Relationships (can be more deeply typed if the related interfaces exist)
  docuSpaService?: IDocuSpaService;
  clinic?: IClinicBasicInfo;
  patient?: {
    first_name: string;
    last_name: string;
    email: string;
    dob: string;
    gender: string;
    name: string;
    cell_phone: string;
  };
  doctor?: IDoctor;
  service?: IServiceItem;
  creator?: IUserData;
}

export interface IDocuSpaService {
  u_id: string;
  patient_id: number;
  clinic_id: number;
  service_id: number;
  service_ids: number[]; // Assuming this is an array of service IDs
  services: string | any[]; // Depending on how services are stored (array or JSON string)
  doctor_id: number;
  signature: string;
  type: string;
  status: string;
  note: string;
  review_on: string | Date | null;
  schedule_start: string | Date | null;
  schedule_end: string | Date | null;
  schedule_json: string | object | null; // If it's stored as JSON
  expires_at: string | Date | null;
  decline_note: string | null;
  created_by: number;
  decline_at: string | Date | null;
  updated_by: number | null;
  approved_note: string | null;
  approved_at: string | Date | null;
}

export interface IPrescriptionDetails {
  id: number;
  u_id: string;
  medication_id: number;
  rx_number: string;
  prescription_id: number;
  customer_medication_id: number;
  medication_name: string;
  medication_strength: string;
  medication_price: string;
  selling_price: string;
  doctor_name: string | null;
  doctor_npi: string | null;
  created_at: string;
  updated_at: string;
  prescription: IPrescription;
  medication: IMedication;
}

export interface IMessageDetails {
  id?: number;
  u_id?: string;
  patient_id?: number;
  client_id?: number;
  messages?: IMessage[];
  patient?: IMessagePatientRef;
  client?: IClientCore;
}

export interface IMessage {
  id?: number;
  prescription_id?: number;
  appointment_id?: null;
  uid?: string;
  message?: string;
  status?: null;
  created_at?: Date;
  updated_at?: Date;
}

export interface IMessagePatientRef {
  id?: number;
  first_name?: string;
  last_name?: string;
  u_id?: string;
  name?: string;
}

export interface IDocumentsRef {
  id?: number;
  doctor_id?: null;
  prescription_id?: number;
  lab_test_id?: null;
  uploaded_file?: string;
  type?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IAppoinmentSchdules {
  appointment_date: string;
  slot: ISlot;
}

export interface ISlot {
  start_time: string;
  end_time: string;
  note: string;
}

export interface IPrescriptionDetails_Details {
  id: number;
  prescription_id: number;
  transaction_id: string;
  transaction_date: string;
  transaction_time: string;
  rx_number: string;
  fill_number: string;
  fill_date: string;
  fill_time: string;
  picked_up: string;
  delivered: string;
  qty_ordered: string;
  qty_filled: string;
  days_supply: string;
  filled_by: string;
  refills_authorized: string;
  refills_remaining: string;
  refill_number: string;
  refill_exp_date: string;
  item_upc_code: string;
  lot_number: string;
  lot_exp_date: string;
  retail: string;
  billed: string;
  is340b: string;
  dispense_as_written: string;
  daw_code: string;
  signature: string;
  rx_source: string;
  rph_initials: string;
  tech_initials: string;
  rx_serial_number: string;
  submission_clear_code: string;
  other_coverage_code: string;
  horizon_graveyard_code: string;
  dispense_using: string;
  is_medicine_short_fill: number;
  rx_remark: string;
  subjective_symptom: any;
  objective_finding: any;
  assessment_goal: any;
  plan_of_treatment: any;
  created_at: any;
  updated_at: any;
  deleted_at: any;
}

export interface IPrescriptionDetails_Patient {
  id: number;
  client_id: number;
  u_id: string;
  dosespot_id: string;
  first_name: string;
  middle_name: any;
  last_name: string;
  name_prefix: string;
  name_suffix: string;
  email: string;
  gender: any;
  source: string;
  dob: string;
  allow_duplicate: number;
  relates_to_patient_id: number;
  home_phone: any;
  work_phone: any;
  cell_phone: any;
  fax_number: any;
  family_email: string;
  marital_status: any;
  patient_id_qualifier: string;
  social_security_number: any;
  smoker: string;
  loyalty_number: string;
  address1: any;
  address2: any;
  state: any;
  city: any;
  zipcode: any;
  country: any;
  short_remartk: any;
  long_remark: any;
  family_remark: any;
  is_active: number;
  status: string;
  allergy_information: any;
  created_at: string;
  updated_at: string;
  name: string;
  signature: string;
  driving_license_front: string;
  driving_license_back: string;
}

export interface IPrescriptionDetails_Client {
  id: number;
  name: string;
  pharmacies?: {
    id: string;
    name: string;
  }[];
}

export interface IPrescriptionDetails_prescriber {
  first_name: string;
  last_name: string;
  name: string;
  dea: string;
  npi: number;
  current_position: string;
  dosespot_id: string;
}

export interface IPrescriptionDetails_medication {
  drug_name: string;
  drug_ndc: string;
  drug_gpi: string;
  drug_strength: string;
  drug_schedule: string;
  drug_is_generic: string;
  drug_brand_name: string;
  quantity_unit: string;
  drug_package_size: string;
  drug_form: string;
  drug_color: string;
  drug_shape: string;
  drug_front_imprint: string;
  drug_back_imprint: string;
  drug_misc_info: string;
  drug_therapeutic_class: string;
  price?: number;
  total_price?: number | string;
  doctor_fees?: number | string;
  service_fees?: number | string;
  shipping_fee?: number | string;
  pharmacy?: {
    id?: string;
    name?: string;
  };
}

export interface IPrescriptionDetails_Lab_Test_Files {
  id: number;
  lab_test_id: number;
  uploaded_file: any;
  type: any;
  status: string;
  created_at: string;
  updated_at: string;
  doctor_id: number;
  prescription_id: number;
  lab_test: any;
}

export interface IRequestRefillDTO {
  prescription_uid: string;
}
