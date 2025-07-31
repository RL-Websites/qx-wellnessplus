export interface IAddSoapNoteDTO {
  patient_id: string;
  prescription_id: string;
  cpd_codes?: string[];
  icd_codes?: string[];
  symptom: string;
  findings: string;
  assessment: string;
  plan_of_treatment: string;
}
