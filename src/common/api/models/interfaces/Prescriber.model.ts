export interface IAddPrescriberManuallyDTO {
  first_name?: string;
  last_name?: string;
  email?: string;
  npi?: string;
  dob?: string;
  address?: string;
  state_id?: string;
  city_id?: string;
  phone?: string;
  signature?: any;
  state_lic?: string;
  last_edu_inst?: string;
  last_edu_degree?: string;
  dea: string;
  profession_zip_code: string;
  profession_state_id: string;
  profession_city_id: string;
  current_inst: string;
  current_position?: string;
  eligible_states?: string[];
  uploadedFiles?: any[];
  zip_code?: string;
}

export interface IPrescriberRegistrationDTO extends IAddPrescriberManuallyDTO {
  u_id: string;
}

export interface IFileWithCustomProperties {
  file: File;
  id?: string;
}

export interface ISetClinicAsPrescriberDTO {
  npi?: string;
  dea: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  state_lic?: string;
  dob?: string;
  current_position?: string;
  current_inst: string;
  last_edu_degree?: string;
  profession_state: string;
  profession_city: string;
  profession_zip_code: string;
  state?: string;
  city?: string;
  zip_code?: string;
  address?: string;
  eligible_states?: string[];
  upload_files?: any[];
  last_edu_inst?: string;
}
