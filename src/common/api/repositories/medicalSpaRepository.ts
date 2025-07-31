import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { IClinicDetails, IClinicInviteDTO, IClinicRegistrationDTO } from "../models/interfaces/Clinic.model";
import { IMedicalSpaList, IMedicalSpaListFilterParams } from "../models/interfaces/Medical.model";
import { IPatientInviteDto } from "../models/interfaces/Patient.model";
import { IUserData } from "../models/interfaces/User.model";

interface IProfileImageUpdateResponse {
  profileImageUrl: string;
  user: IUserData;
}

class MedicalSpaRepository {
  constructor(private $http: AxiosInstance) {}

  inviteMedicalSpa(payload: IClinicInviteDTO) {
    return this.$http.post<IBaseResponse<any>>("spa-store", payload);
  }

  invitePatient(payload: IPatientInviteDto) {
    return this.$http.post<IBaseResponse<any>>("spa/clinic/invite-patient", payload);
  }

  getMedicalSpaList(params?: IMedicalSpaListFilterParams) {
    return this.$http.get<IBasePaginationResponse<IMedicalSpaList[]>>("spa/list", { params: params });
  }

  getMedicalSPaDetails(u_id: string | undefined, params: any = {}) {
    return this.$http.get<IBaseResponse<IClinicDetails>>(`spa/details?u_id=${u_id}`, { params: params });
  }

  medicalSpaRegistration(payload: IClinicRegistrationDTO) {
    return this.$http.post<IBaseResponse<any>>("spa-store", payload);
  }

  changeMedicalSpaStatus(payload) {
    return this.$http.post<IBaseResponse<any>>("spa/medical-clinic-status-update", payload);
  }

  medicalSpaPasswordUpdate(payload) {
    return this.$http.post<IBaseResponse<any>>("spa-medical-user-update", payload);
  }

  medicalSpaBasicInfoUpdate(payload) {
    return this.$http.post<IBaseResponse<any>>("spa/basic-info-update", payload);
  }

  paymentAgreementUpdate(payload) {
    return this.$http.put<IBaseResponse<any>>("spa/clinic-payment-agreement-update", payload);
  }

  manageService(payload) {
    return this.$http.put<IBaseResponse<any>>("spa/clinic-service-update", payload);
  }
}

const medicalSpaRepository = new MedicalSpaRepository($http);

export default medicalSpaRepository;
