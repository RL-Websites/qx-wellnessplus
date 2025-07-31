export interface IBaseResponse<T> {
  status?: string;
  status_code?: number;
  message: string;
  data: T | null;
}

export interface IBasePaginationResponse<T> {
  status: string;
  status_code: number;
  message: string;
  data: IPaginatedData<T>;
}

export interface IPaginatedData<T> {
  current_page: number;
  per_page?: number;
  to?: number;
  total?: number;
  data: T | null;
  search: string;

  first_page_url?: string;
  from?: number;
  last_page?: number;
  last_page_url?: string;
  links?: ILink[];
  next_page_url?: string;
  path?: string;
}

export interface ILink {
  url?: string;
  label: string;
  active: boolean;
}

export interface IServerErrorResponse {
  message: string;
  status: string;
  status_code: number;
  errors?: Array<{ [key: string]: string[] }>;
}

export interface IServerErrorResponseWithData<T> {
  data: T;
  message: string;
  status: string;
  status_code: number;
  errors?: Array<{ [key: string]: string[] }>;
}
