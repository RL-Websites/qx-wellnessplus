export interface ISummery {
  doctor_total_count?: number;
  available_doctor_count?: number;
  approved_doctor_count?: number;
  total_pa_count?: number;
  available_pa_count?: number;
  issued_prescription_count?: number;
  declined_patient_count?: number;
  total_patient_count?: number;
  declined_prescription_count?: number;
  client_total_count?: number;
  count_new_prescription?: number;
  count_pending_prescription?: number;
  count_upcoming_schedule?: number;
  count_accepted_prescription?: number;
  total_prescription_count?: number;
  pending_prescription_count?: number;
  on_hold_prescription_count?: number;
  total_new_prescription_request?: number;
  clinic_total_count?: number;
  pharmacy_total_count?: number;
  clinic_shipping_pending_count?: number;
  clinic_total_bill_amount?: number;
  clinic_total_successful_prescription_count?: number;
}

export interface IClinicSummery {
  successful_prescriptions_count?: number;
  patient_count?: number;
  patient_pending_payment?: number;
  total_successful_prescription?: number;
  total_patient_count?: number;
}

export interface ITopSellingDrug {
  medication_id: number;
  state: any;
  total_sales: number;
  total_qty_ordered: number;
  medication: Medication;
}
export interface ITopSellingStates {
  state: string;
  sales_count: number;
}

export interface Medication {
  id: number;
  drug_name: string;
}
