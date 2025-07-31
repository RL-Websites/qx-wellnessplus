export interface IAPILogs {
  id: number;
  type: string;
  source: string;
  request_from: string;
  status: number;
  created_at: Date;
  updated_at: Date;
}

export interface IAPILogDetail {
  id: number;
  type: string;
  source: string;
  request_from: string;
  request_data: string;
  message: null;
  status: number;
  created_at: Date;
  updated_at: Date;
}
