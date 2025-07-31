export interface IPartnerClientDetails {
  id?: number;
  type?: string;
  u_id?: string;
  name?: string;
  last_name?: any;
  slug?: string;
  logo?: string;
  email?: string;
  phone?: string;
  fax?: string;
  ins_code?: any;
  order_id_prefix?: any;
  is_active?: number;
  web_url?: any;
  base_url?: any;
  status?: string;
  unique_id?: any;
  created_by?: any;
  updated_by?: any;
  created_at?: string;
  updated_at?: string;
  deleted_at?: any;
  assign_pharmacy?: any[];
  full_name?: string;
  pharmacies?: any[];
  partners?: IPartnerRef[];
}

export interface IPartnerRef {
  id?: number;
  client_id?: number;
  account_name?: string;
  contact_person_name?: string;
  slug?: string;
  email?: string;
  phone?: string;
  fax_number?: string;
  logo?: string;
  status?: string;
  address?: string;
  state?: string;
  city?: string;
  zip_code?: string;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
}
