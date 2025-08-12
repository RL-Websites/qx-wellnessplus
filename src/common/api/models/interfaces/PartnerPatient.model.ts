import { PaymentMethod } from "@stripe/stripe-js";

export interface IInvitePartnerPatientDTO extends IPartnerOnlyPatientInviteDTO {
  medication_id?: number[];
}

export interface IPartnerOnlyPatientInviteDTO {
  first_name?: string;
  last_name?: string;
  email?: string;
  cell_phone?: string;
  patient_id?: string | null;
}

export interface IPublicPatientDetailsParams {
  u_id: string;
  detail_uid?: string;
}

export interface IPartnerPatientInviteResponse {
  patient_id: number;
  medication_id: number;
  patient_amount_due: number;
  cost: number;
  type: string;
  status: string;
  is_research: number;
  order_id: string;
  partner_id: number;
  client_id: number;
  u_id: string;
  updated_at: string;
  created_at: string;
  id: number;
  patient: IPrescriptionPatientRef;
  medication: IPrescriptionMedicationRef;
  partner: IPrescriptionPartnerRef;
}

export interface IPrescriptionPatientRef {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  cell_phone: string;
  name: string;
}

export interface IPrescriptionMedicationRef {
  id: number;
  drug_name: string;
}

export interface IPrescriptionPartnerRef {
  id: number;
  account_name: string;
  slug: string;
}

export interface IPartnerPatientListItem {
  id: number;
  u_id: string;
  first_name: string;
  last_name: string;
  email: string;
  cell_phone: string;
  dob?: string;
  status?: string;
  created_at: string;
  prescriptions_count?: number;
  name: string;
}

export interface IPublicPartnerPrescriptionDetails {
  id: number;
  order_id: string;
  client_id: number;
  medication_id: number;
  partner_id: number;
  patient_id: number;
  status: string;
  is_prescription_required: number;
  is_active: number;
  payment_status: number;
  type: string;
  is_deactivated: number;
  cost: number;
  patient_amount_due: number;
  total_paid: number;
  margin_percent: number;
  created_at: string;
  updated_at: string;
  u_id: string;
  treatment_status: string;
  is_research: number;
  patient: IPublicPartnerPatientRef;
  medication: IPublicPartnerMedicationRef;
  client: IPublicPartnerClientRef;
  customer: IPublicPartnerRef;
  prescription_details: IPublicPartnerDetailsRef[];
  total_bill_amount: string;
  is_refill: number;
  questionnaires: IIntakeFormQuestionItem[];
}

export interface IPublicPartnerDetailsRef {
  id: number;
  u_id: string;
  medication_id: number;
  rx_number: string;
  prescription_id: number;
  customer_medication_id: number;
  medication_name: string;
  medication_strength: string;
  medication_price: string;
  qty_ordered: string;
  selling_price: string;
  doctor_name: any;
  doctor_npi: any;
  created_at: string;
  updated_at: string;
  medication: IPublicPartnerDetailsMedicationRef;
}
export interface IPublicPartnerDetailsMedicationRef {
  id: number;
  client_id: number;
  name: string;
  sku: string;
  strength: string;
  unit: any;
  medicine_type: string;
  medication_category: any;
  medicine_group: any;
  price: string;
  doctor_fee: string;
  service_fee: string;
  shipping_fee: string;
  is_research_only: number;
  qty?: number;
  customer_price?: string;
  image: any;
  direction: any;
  is_active: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  deleted_by: any;
  total_price: string;
}

export interface IPublicPartnerPatientRef {
  id: number;
  type: string;
  u_id: string;
  first_name: string;
  last_name: string;
  email: string;
  allow_duplicate: number;
  cell_phone: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  name: string;
  gender: string;
  dob: string;
  weight: string;
  height: string;
  address1: string;
  city: string;
  state: string;
  zipcode: string;
  latitude: number;
  longitude: number;
  driving_license_front: string;
  driving_license_back: string;
  last_intake_submit_date: string;
}

export interface IPublicPartnerMedicationRef {
  id: number;
  client_id: number;
  whose_medicine: string;
  drug_name: string;
  drug_gpi: string;
  drug_strength: string;
  price: string;
  is_active: number;
  created_at: string;
  updated_at: string;
  control_medicine: number;
  doctor_fees: string;
  service_fees: string;
  shipping_fee: number;
  is_researched: number;
  is_acknowledged: number;
}

export interface IPublicPartnerClientRef {
  id: number;
  name: string;
  full_name: string;
}

export interface IPublicPartnerRef {
  id: number;
  client_id: number;
  account_name: string;
  contact_person_name: string;
  slug: string;
  email: string;
  phone: string;
  fax_number: string;
  logo: string;
  profile_image: string;
  status: string;
  address: string;
  state: string;
  city: string;
  zip_code: string;
  token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  payment_type: string;
  stripe_connect_id: string;
  stripe_enabled?: boolean;
}

export interface IPatientBookingPatientInfoDTO {
  slug: string;
  cart_total: number;
  is_refill?: boolean;
  refill_type?: string;
  patient: IPatientInfoDTO;
  shipping?: IShippingBillingRef;
  billing?: IShippingBillingRef;
  signature?: string;
  payment?: IPatientBookingPaymentRef;
  medications?: any[];
}

export interface IPatientBookingPaymentRef {
  amount: number;
  client_secret: string;
  payment_method_id: string | PaymentMethod;
  payment_intent_id: string;
}
export interface IShippingBillingRef {
  name: string;
  address: string;
  state: string;
  city: string;
  zip_code: string;
  email: string;
}
export interface IPatientInfoDTO {
  first_name?: string;
  last_name?: string;
  email: string;
  cell_phone: string;
  dob: string;
  gender: string;
  address: string;
  state: string;
  city: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  // weight: string;
  // height: string;
  driving_lic_front?: string;
  driving_lic_back?: string;
}

export interface IPatientIntakeFormDTO {
  prescription_u_id: string;
  signature: string;
  measurement: IMeasurementObj;
  questionnaires?: (IIntakeFormQuestionItem | undefined)[];
}

export interface IMeasurementObj {
  height: string;
  weight: string;
  full_body_image: string;
}

export interface IIntakeFormQuestionItem {
  question: string;
  key: string;
  answer: string[];
}

export interface IPatientOrderList {
  id: number;
  order_id: string;
  medication_id: number;
  partner_id: number;
  patient_id: number;
  status: string;
  is_prescription_required: number;
  is_active: number;
  payment_status: number;
  type: string;
  is_deactivated: number;
  transferred_out: number;
  cost: number;
  patient_amount_due: number;
  due_from_insurance: number;
  total_paid: number;
  margin_percent: number;
  created_at: string;
  updated_at: string;
  u_id: string;
  treatment_status: string;
  is_research: number;
  patient: Patient;
  medication: Medication;
  lab_test_files: any[];
}

export interface Patient {
  id: number;
  first_name: string;
  middle_name: any;
  last_name: string;
  client_id: any;
  u_id: string;
  status: string;
  dob: string;
  cell_phone: string;
  driving_license_front: string;
  driving_license_back: string;
  name: string;
}

export interface Medication {
  id: number;
  client_id: number;
  drug_name: string;
  drug_strength: string;
}
