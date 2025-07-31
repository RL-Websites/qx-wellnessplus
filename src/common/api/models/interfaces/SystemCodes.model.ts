export interface IGetSystemCodesParams {
  code_type: string;
  page?: number;
  per_page?: number;
  status?: 0 | 1;
  sort_column?: string;
  search?: string;
  noPaginate?: boolean;
  sort_direction?: "asc" | "desc";
}

export interface ISystemCodes {
  id: number;
  code?: string;
  value?: number;
  note: string;
  status?: number;
  deleted_at?: any;
  code_category?: string;
  cpd_code?: string;
  code_status?: string;
  created_at?: string;
  updated_at?: string;
}
