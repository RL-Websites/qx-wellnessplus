import { IMedicationRef } from "./Patient.model";

export interface IStoreMedicineDTO {
  request_type: string;
  medication_id?: string;
  drug_name: string;
  type: string;
  price: number;
  states?: string[] | null | undefined;
  is_researched: string;
  category_id: string;
  control_medicine: string;
  product_image?: string | null;
  sku: string;
  drug_strength: number;
  unit: string;
  side_effects: string;
  dosage_directions?: Array<{ title?: string | null; details?: string | null }>;
}

export interface IMedicineStatusUpdateDTO {
  medication_id: string;
  status: number;
  module?: string;
}

export interface IMedicineCategory {
  id: number;
  title: string;
  slug: string | null;
  status: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface IMedicineListItem {
  u_id: number;
  id: number;
  client_id: number | null;
  name: string;
  sku: string;
  dose: string;
  strength: string;
  unit: string;
  pharmacy_id: number;
  medication_category: string;
  medicine_type: string;
  medicine_group: string; // Adjust the type as needed
  price: string;
  doctor_fee: string;
  service_fee: string;
  shipping_fee: string;
  customer_price?: string;
  lab_fee?: string;
  lab_fee_selected_state?: string;
  is_research_only: string;
  image: string;
  lab_required?: string;
  total_price?: string;
  direction: string | null;
  is_active: number;
  dosage_directions: IDosageDirection[];
  customer_count: number;
  customer_medication: ICustomerMedicationRef;
  qty: number;
  pharmacy?: {
    id: number;
    name: string;
  };
}

export interface ICustomerMedicationRef {
  id: number;
  medication_id: number;
  customer_id: number;
  price: string;
  platform_fee: any;
  consultancy_fee: any;
  testosterone_fee: any;
  price_for_customer: any;
  is_active: number;
  assign_by: null;
  created_at: Date;
  updated_at: Date;
}

export interface IDosageDirection {
  title: string;
  details: string;
}

export interface IPartnerMedicineListItem {
  id: number;
  medication_id: number;
  partner_id?: number;
  price: string;
  lab_required?: string;
  medicine?: IMedicineListItem;
  status?: string;
}

export interface IPrescribedMedicine extends IMedicineListItem {
  note?: string;
  prescription_id?: string[];
  refills_required?: string;
  refill_interval?: string;
  refill_start_date?: string;
  refill_end_date?: string;
}

export interface IAssignMedToPartner {
  customer_id: string;
  medication_id: string;
}

export interface IPriceUpdateListItem {
  id: number;
  medication_id: number;
  partner_id: number;
  medication_partner_id: number;
  old_price: string;
  new_price: string;
  user_name: string;
  medication: IMedicationRef;
  created_at: string;
}

export interface IPrevGlpMedDetails {
  lastDoseDate?: string | undefined;
  lastDose?: string;
  currentMedType?: string;
  preferredMedType?: string;
}
