import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { ICommonParams } from "../models/interfaces/Common.model";
import { ISpaIntakeForm } from "../models/interfaces/IntakeForm.model";
import { IManageStatusDTO, IPatientDetails, UpdatePatientInfoDTO } from "../models/interfaces/Patient.model";
import { patientRequestList } from "../models/interfaces/Prescription.model";

class PatientRepository {
  constructor(private $http: AxiosInstance) {}

  getPatients(params: any = null) {
    return this.$http.get<IBasePaginationResponse<any>>("patients", { params: params });
  }

  getPrescriberPatients = (params: any = null) => {
    return this.$http.get<IBasePaginationResponse<any>>("clinic-prescriber/patients", { params: params });
  };

  getPaPatients(params: any = null) {
    return this.$http.get<IBasePaginationResponse<any>>("physician/prescription/prescribed-patients", { params: params });
  }

  manageStatus({ id, ...payload }: IManageStatusDTO) {
    return this.$http.post<IBaseResponse<any>>(`patients/manage-status/${id}`, payload);
  }

  getPatientDetails(id: string) {
    return this.$http.get<IBaseResponse<IPatientDetails>>(`customer/patient/details/${id}`);
  }

  getPatientHistory(params: any = null) {
    return this.$http.get<IBasePaginationResponse<patientRequestList[]>>(`patients/prescription-history`, { params: params });
  }

  setSpaPatientStatus(payload: any) {
    return this.$http.put<IBaseResponse<any>>(`spa/doctor/manage-review`, payload);
  }

  getSpaPatientReviews(params: ICommonParams) {
    return this.$http.get<IBasePaginationResponse<any>>(`spa/clinic/patients-reviews`, { params: params });
  }

  getSpaIntakeFormData(params: { id: string; patientId: string }) {
    return this.$http.get<IBaseResponse<ISpaIntakeForm>>(`spa/clinic/patient-intake-form-data`, { params: params });
  }

  updatePatient(id: string, payload: UpdatePatientInfoDTO) {
    return this.$http.put<IBaseResponse<any>>(`patients/update/${id}`, payload);
  }
}

const patientApiRepository = new PatientRepository($http);

export default patientApiRepository;
