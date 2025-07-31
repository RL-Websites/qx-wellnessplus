export interface IInvitePADTO {
  first_name: string;
  physician_email: string;
  physician_phone: string;
  // inviteMethod: string;
}

export interface IPABasicInfoDTO {
  u_id?: string;
  first_name?: string;
  dosespot_id?: number;
  last_name?: string;
  dob?: string;
  phone?: string;
  address?: string;
  state?: string;
  state_id?: string;
  city_id?: string;
  city?: string;
  state_lic?: string;
  zip_code?: string;
  npi?: string;
  type: string;
}

export interface IPAProfessionalInfoDTO {
  u_id?: string;
  current_position?: string;
  last_edu_inst?: string;
  last_edu_degree?: string;
  current_inst?: string;
  profession_city?: string;
  profession_state?: string;
  eligible_states?: string[];
  profession_zip_code?: number | string;
  dea?: string;
  documents?: any[];
  type: string;
}
