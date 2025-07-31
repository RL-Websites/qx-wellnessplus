export interface ISpaIntakeForm {
  id?: number;
  patient_id?: number;
  service_id?: number | null;
  service_ids?: string[];
  docu_spa_service_id?: number;
  "1_service_info"?: {
    height_feet?: string;
    height_inch?: string;
    weight?: string;
    bmi?: string;
    ideal_weight?: string;
  };
  n2past_treatment?: {
    answer?: string;
    additional?: {
      prevResult?: string;
      furtherNeed?: string;
      reqTreatment?: string;
    };
  };
  n3physician_care?: {
    answer?: string;
  };
  "4_dependent_provider_name"?: string;
  n5last_yr_derma_care?: {
    answer?: string;
  };
  n6dependent_data?: string;
  prescribed_medicines?: {
    answer?: string;
    medicines?: Array<{
      name?: string;
      dosage_unknown?: string;
      dosage?: string;
      unit?: string;
      dosage_how_long?: string;
    }>;
  };
  prescribed_allergy_medicines?: {
    allergy?: string;
    allergy_details?: string;
    answer?: string;
    medicines?: Array<{
      name?: string;
      dosage_unknown?: string;
      dosage?: string;
      unit?: string;
      dosage_how_long?: string;
    }>;
  };
  circulatory_respiratory?: {
    checkValues?: string[];
    others?: string;
  };
  nervous_system?: {
    checkValues?: string[];
    others?: string;
  };
  digestive?: {
    checkValues?: string[];
    others?: string;
  };
  urinary_system?: {
    checkValues?: string[];
    others?: string;
  };
  n13history_other?: {
    checkValues?: string[];
    others?: string;
  };
  skin?: {
    checkValues?: string[];
    others?: string;
  };
  female_questions?: {
    pregnant?: string;
    want_to_be_pregnant?: string;
    breastfeeding?: string;
    taking_contraceptive?: string;
  };
  stress_items?: {
    answer?: string;
    smoke_vape?: string;
    alcohol?: string;
    recreational_drugs?: string;
    caffeinated_product?: string;
    do_u_follow_specific_diet?: string;
    specific_diet?: string[];
    daily_water_qty?: string;
    surgical_history?: string;
  };
  hygiene_cosmetics?: {
    permanent_cosmetics?: string;
    sun_block?: string;
    tanning_bed?: string;
    tanning_cream?: string;
    aha_bha_scrub?: string;
    isotretinoin_last_year?: string;
    cold_sores?: string;
  };
  usa_govt_identity?: {
    selected_state?: string;
    id_number?: string;
  };
  signature?: string;
  // Additional fields from your data
  n23dependent_data?: any;
  created_at?: string;
  updated_at?: string;
  multiple_services?: Array<{
    id?: number;
    name?: string;
    slug?: string;
    type?: string | null;
    status?: number;
    created_at?: string | null;
    updated_at?: string | null;
  }>;
  docu_spa_service?: {
    id?: number;
    patient_id?: number;
    u_id?: string;
    clinic_id?: number;
    doctor_id?: number | null;
    service_id?: number | null;
    service_ids?: string;
    signature?: string;
    schedule_start?: string;
    schedule_end?: string;
    type?: string;
    status?: string;
    review_on?: string | null;
    expires_at?: string;
    note?: string | null;
    created_at?: string;
    updated_at?: string;
    schedule_json?: {
      end?: string;
      date?: string;
      start?: string;
    };
    decline_at?: string | null;
    approved_at?: string | null;
  };
  captured_images?: any[];
  service?: any;
}
