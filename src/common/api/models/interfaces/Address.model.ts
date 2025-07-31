export interface IAddress {
  id: number;
  addressable_type: string;
  addressable_id: number;
  type: string;
  address1: string;
  address2: any;
  state_id: number;
  city_id: number;
  country_id: number;
  created_at: string;
  updated_at: string;
}

export interface IAddress2 {
  id: number;
  addressable_type: string;
  addressable_id: number;
  type: string;
  address1: string;
  address2: any;
  state: string;
  city: string;
  country_id: number;
  created_at: string;
  updated_at: string;
  zip_code?: string;
}

export interface IAutoCompleteAddrOutput {
  address: string;
  state: string;
  city: string;
  zip_code?: string;
}
