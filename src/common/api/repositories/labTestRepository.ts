import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import {
  ILabTestParams,
  ILabTestReportUploadDTO,
  ILabTestRequested,
  IPARequestReportToPatientDTO,
  IRequestReportToPatientDTO,
} from "../models/interfaces/labTest.model";

class LabTestRepository {
  constructor(private $http: AxiosInstance) {}

  getLabTestLists(params: ILabTestParams) {
    return this.$http.get<IBasePaginationResponse<any[]>>("lab-tests", { params: params });
  }

  requestReportToPatient(payload: IRequestReportToPatientDTO) {
    return this.$http.post<IBaseResponse<any>>("prescriptions/report-requests", payload);
  }

  paRequestReportToPatient(payload: IPARequestReportToPatientDTO) {
    return this.$http.post<IBaseResponse<any>>("physician/prescription/report-requests", payload);
  }

  testReportRequestedForPatient(prescription_u_id: string) {
    return this.$http.get<IBaseResponse<ILabTestRequested>>("test-requests", { params: { prescription_u_id: prescription_u_id } });
  }

  uploadRequestedLabTestsByPatient(payload: ILabTestReportUploadDTO) {
    return this.$http.post<IBaseResponse<any>>("upload-test-files", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

const labTestApiRepository = new LabTestRepository($http);

export default labTestApiRepository;
