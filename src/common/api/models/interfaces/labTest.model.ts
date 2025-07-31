import { ICommonParams } from "./Common.model";

export interface ILabTestParams extends ICommonParams {
  type?: string;
  status?: number;
}

export interface IRequestReportToPatientDTO {
  prescription_u_id: string;
  doctor_id: number;
  lab_test_ids: string[];
}

export interface IPARequestReportToPatientDTO {
  prescription_u_id: string;
  lab_test_ids: string[];
}

export interface ILabTestRequested {
  client?: ILabTestRequestedByClient;
  lab_tests?: IRequestedLabTest[];
}

export interface ILabTestRequestedByClient {
  id: number;
  name: string;
  logo: string;
}
export interface IRequestedLabTest {
  lab_test_id: number;
  lab_test_name: string;
  lab_test_file_status: string;
  prescription_doc_id: number;
}

export interface ILabTestReportUploadDTO {
  u_id?: string | null;
  prescription_doc_ids: (string | undefined)[];
  files: any[];
}
