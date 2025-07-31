import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import {
  IClinicAddressUpdateDTO,
  IClinicDetails,
  IClinicImageDTO,
  IClinicInviteDTO,
  IClinicList,
  IClinicListFilterParams,
  IClinicRegistrationDTO,
  ISpaClinic,
} from "../models/interfaces/Clinic.model";
import { IDoctorRefUser } from "../models/interfaces/Doctor.model";
import { IClinicSummery } from "../models/interfaces/Summery.model";
import { IUserData } from "../models/interfaces/User.model";

interface IProfileImageUpdateResponse {
  profileImageUrl: string;
  user: IUserData;
}

class ClinicRepository {
  constructor(private $http: AxiosInstance) {}

  getClinicSummery() {
    return this.$http.get<IBaseResponse<IClinicSummery>>(`clinics/dashboard-summary`);
  }

  getClinicPrescriberSummery() {
    return this.$http.get<IBaseResponse<IClinicSummery>>(`clinics/dashboard-summary`);
  }

  getMedicineList(params?: any) {
    return this.$http.get<IBasePaginationResponse<any[]>>("clinics/medicine-list", { params: params });
  }

  getClinicMedicineList(params?: any) {
    return this.$http.get<IBasePaginationResponse<any[]>>("clinics/medicine-list", { params: params });
  }

  getClinicList(params?: IClinicListFilterParams) {
    return this.$http.get<IBasePaginationResponse<IClinicList[]>>("clinic", { params: params });
  }

  getClinicWithOutPagination(params?: IClinicListFilterParams) {
    return this.$http.get<IBaseResponse<IClinicList[]>>("clinic", { params: params });
  }

  getClinicPatients(params: any = null) {
    return this.$http.get<IBasePaginationResponse<any>>("clinics/all-patients", { params: params });
  }

  getClinicDetails(id: string | undefined) {
    return this.$http.get<IBaseResponse<IClinicDetails>>("clinic/" + id);
  }

  getClinicAsPrescriber() {
    return this.$http.get<IBaseResponse<IDoctorRefUser>>(`clinics/as-prescriber-profile`);
  }

  inviteClinic(payload: IClinicInviteDTO) {
    return this.$http.post<IBaseResponse<any>>("clinic-invite", payload);
  }

  addClinicManually(payload) {
    return this.$http.post<IBaseResponse<any>>("clinic-add-manually", payload);
  }

  clinicRegistration(payload: IClinicRegistrationDTO) {
    return this.$http.post<IBaseResponse<any>>("clinic", payload);
  }

  clinicPasswordUpdate(payload) {
    return this.$http.post<IBaseResponse<any>>("clinic-user-update", payload);
  }

  changeClinicStatus(payload) {
    return this.$http.post<IBaseResponse<any>>("clinic-status-update", payload);
  }

  clinicLogoUpdate(payload: IClinicImageDTO) {
    return this.$http.post<IBaseResponse<IProfileImageUpdateResponse>>("clinic-logo-update", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  clinicBasicInfoUpdate(payload) {
    return this.$http.post<IBaseResponse<any>>("clinic-basic-info-update", payload);
  }

  clinicAddressUpdate(payload: IClinicAddressUpdateDTO) {
    return this.$http.post<IBaseResponse<any>>("clinic-address-store-update", payload);
  }

  clinicAddressRemove(id: number) {
    return this.$http.post<IBaseResponse<any>>(
      "clinic-address-remove",
      { address_id: id },
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  }
  clinicResendLink(u_id: string) {
    const payload = {
      u_id,
    };
    return this.$http.post<IBaseResponse<any>>("clinic-resend-link", payload);
  }

  spaClinicResendLink(u_id: string) {
    const payload = {
      u_id,
    };

    return this.$http.post("spa/clinic-resend-link", payload);
  }

  getClinicalSpaDetailsNoAuth(clinic_id: string) {
    return this.$http.get<IBaseResponse<ISpaClinic>>(`spa/clinic/get-spa-clinic-detail?clinic_id=${clinic_id}`);
  }

  removeSpaClinic(u_id: string) {
    return this.$http.delete<IBaseResponse<any>>("spa/delete", { params: { u_id } });
  }
}

const clinicRepository = new ClinicRepository($http);

export default clinicRepository;
