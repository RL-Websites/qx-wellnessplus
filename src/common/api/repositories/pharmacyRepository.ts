import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { ICommonParams } from "../models/interfaces/Common.model";
import {
  IAssignClinicDTO,
  IAssignedClinic,
  IAssignedClinicStatusChangeDTO,
  IPharmacyAddManuallyDTO,
  IPharmacyInviteDTO,
  IPharmacyList,
  IPharmacyRegistrationDTO,
} from "../models/interfaces/Pharmacy.model";
import { IUserData } from "../models/interfaces/User.model";

interface IProfileImageUpdateResponse {
  profileImageUrl: string;
  user: IUserData;
}

class PharmacyRepository {
  constructor(private $http: AxiosInstance) {}

  getPharmacyListWithoutPaginate(params?: any) {
    return this.$http.get<IBaseResponse<IPharmacyList[]>>("pharmacy/list", { params: params });
  }

  getPharmacyList(params?: ICommonParams) {
    return this.$http.get<IBasePaginationResponse<IPharmacyList[]>>("pharmacy/list", { params: params });
  }

  getPharmacyDetailsPublic(slug: string) {
    return this.$http.get<IBaseResponse<any>>("get-public-pharmacy", { params: { slug } });
  }

  getPharmacyDetails(slug: string | undefined) {
    return this.$http.get<IBaseResponse<any>>("pharmacy/details", { params: { slug } });
  }

  changePharmacyStatus(payload) {
    return this.$http.post<IBaseResponse<any>>("pharmacy/status-update", payload);
  }

  pharmacyBasicInfoUpdate(payload) {
    return this.$http.post<IBaseResponse<any>>("pharmacy/basic-information-update", payload);
  }

  pharmacyAddressUpdate(payload: any) {
    return this.$http.post<IBaseResponse<any>>("pharmacy/address-update", payload);
  }

  invitePharmacy(payload: IPharmacyInviteDTO) {
    return this.$http.post<IBaseResponse<any>>("pharmacy/send-invite", payload);
  }

  pharmacyRegistration(payload: IPharmacyRegistrationDTO) {
    return this.$http.post<IBaseResponse<any>>("pharmacy/registration", payload);
  }

  pharmacyAddManually(payload: IPharmacyAddManuallyDTO) {
    return this.$http.post<IBaseResponse<any>>("pharmacy/add-manually", payload);
  }

  pharmacyPasswordUpdate(payload) {
    return this.$http.post<IBaseResponse<any>>("pharmacy/set-password", payload);
  }

  pharmacyResendLink(slug: string) {
    const payload = {
      slug,
    };
    return this.$http.post<IBaseResponse<any>>("pharmacy/resend-link", payload);
  }

  // clinicLogoUpdate(payload: IClinicImageDTO) {
  //   return this.$http.post<IBaseResponse<IProfileImageUpdateResponse>>("clinic-logo-update", payload, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   });
  // }

  getAttachedClinics(params: ICommonParams) {
    return this.$http.get<IBasePaginationResponse<IAssignedClinic[]>>("medications/attached-clinics", { params: params });
  }

  assignClinicToMed(payload: IAssignClinicDTO) {
    return this.$http.post<IBaseResponse<any>>("medications/assign-new-clinic", payload);
  }

  changeAssignedClinicStatus(payload: IAssignedClinicStatusChangeDTO) {
    return this.$http.post<IBaseResponse<any>>("medications/assign-clinic-status-change", payload);
  }
}

const pharmacyRepository = new PharmacyRepository($http);

export default pharmacyRepository;
