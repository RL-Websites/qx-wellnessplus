import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { IManageStatusDTO, IPatientDetails, UpdatePatientInfoDTO } from "../models/interfaces/Patient.model";
import { patientRequestList } from "../models/interfaces/Prescription.model";

class PatientRepository {
  constructor(private $http: AxiosInstance) {}

  manageStatus({ id, ...payload }: IManageStatusDTO) {
    return this.$http.post<IBaseResponse<any>>(`patients/manage-status/${id}`, payload);
  }

  getPatientDetails(id: string) {
    return this.$http.get<IBaseResponse<IPatientDetails>>(`customer/patient/details/${id}`);
  }

  getPatientHistory(params: any = null) {
    return this.$http.get<IBasePaginationResponse<patientRequestList[]>>(`patients/prescription-history`, { params: params });
  }

  updatePatient(id: string, payload: UpdatePatientInfoDTO) {
    return this.$http.put<IBaseResponse<any>>(`patients/update/${id}`, payload);
  }
}

const patientApiRepository = new PatientRepository($http);

export default patientApiRepository;
