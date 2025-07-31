export interface ICheckIfPatientExistsDTO {
  cell_phone: string;
  email: string;
}

export interface IPrescribeNowDTO {
  prescription_ids?: number[];
  payment_customer_id?: number;
  payment_method_id: number;
  amount: number;
  payor: string;
  patient?: any;
  medication?: any;
  soap_note: any;
  // patient?: IPrescribeNowPatientRef;
  // medication_id?: string;
  // qty?: number;
  // refill_date?: Date;
  // interval?: number;
  // direction?: string;
  // statement?: string;
  // instruction?: string;
  // dispensation?: string;
  // side_effect?: string;
  // card_id?: string;
  shipping?: IPrescribeNowAddressRef;
  billing?: IPrescribeNowAddressRef;
  card_data?: ICard;
}

export interface IPrescribePatientNowDTO {
  prescription_ids: number[];
  payment_customer_id?: number;
  payment_method_id: string;
  amount: number;
  patient?: any;
  medication?: any;
  soap_note: any;
  payor: string;
  shipping?: IPrescribeNowAddressRef;
  billing?: IPrescribeNowAddressRef;
  card_data?: ICard;
}

export interface ICard {
  country: string | null | undefined;
  display_brand: string | null | undefined;
  exp_month: number | undefined;
  exp_year: number | undefined;
  last4: string | null | undefined;
}

export interface IPaymentCollect {
  prescription_ids: number[];
  payment_customer_id: number;
  payment_method_id: number;
  amount: number;
  shipping?: IPrescribeNowAddressRef;
  billing?: IPrescribeNowAddressRef;
  card?: ICard;
}

// export interface IMedication {
//   id?: number;
//   client_id?: null;
//   drug_name?: string;
//   drug_ndc?: string;
//   drug_gpi?: null;
//   drug_strength?: null;
//   drug_schedule?: string;
//   drug_is_generic?: string;
//   drug_brand_name?: null;
//   drug_package_size?: string;
//   drug_form?: string;
//   drug_color?: string;
//   drug_shape?: string;
//   drug_front_imprint?: string;
//   drug_back_imprint?: string;
//   drug_misc_info?: string;
//   drug_therapeutic_class?: null;
//   quantity?: null;
//   quantity_unit?: null;
//   refills?: null;
//   directions?: null;
//   delivery_method?: null;
//   allow_substitution?: null;
//   is_active?: number;
//   created_at?: Date;
//   updated_at?: Date;
//   deleted_at?: null;
//   control_medicine?: number;
// }

export interface IPrescribeNowPatientRef {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  gender?: string;
  dob?: Date;
  cell_phone?: string;
  address1?: string;
  address2?: string;
  state?: string;
  city?: string;
  zipcode?: string;
  is_active?: boolean;
}

export interface IPrescribeNowAddressRef {
  name?: string;
  email?: string;
  address?: string;
  state?: string;
  city?: string;
  zip_code?: string;
}

export interface IDirectPrescribe {
  patient: Patient;
  symptoms: string;
  medication_id: string;
  subjective_symptom: string;
  objective_finding: string;
  assessment_goal: string;
  plan_of_treatment: string;
  icd_codes: number[];
  cpd_codes: number[];
  refill_number: string;
  refill_exp_date: string;
  prescribe_note: string;
}

export interface Patient {
  id: any;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  dob: string;
  cell_phone: string;
  address: string;
  state: string;
  city: string;
  zip_code: string;
  height: number;
  height_unit: string;
  weight: number;
  allergy: boolean;
  allergy_information: string;
  social_security_number: string;
}
