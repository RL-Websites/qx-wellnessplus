import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { ICommonParams } from "../models/interfaces/Common.model";
import {
  IInvitePartnerPatientDTO,
  IPartnerPatientInviteResponse,
  IPartnerPatientListItem,
  IPatientBookingPatientInfoDTO,
  IPatientIntakeFormDTO,
  IPublicPartnerPrescriptionDetails,
  IPublicPatientDetailsParams,
} from "../models/interfaces/PartnerPatient.model";
import { IRequestRefillDTO } from "../models/interfaces/Prescription.model";

class PartnerPatientRepository {
  constructor(private $http: AxiosInstance) {}

  invitePartnerPatient(payload: IInvitePartnerPatientDTO) {
    return this.$http.post<IBaseResponse<IPartnerPatientInviteResponse>>("customer/prescription/store", payload);
  }
  getPatientList = (params: ICommonParams) => {
    return this.$http.get<IBasePaginationResponse<IPartnerPatientListItem[]>>("customer/patient/list", { params: params });
  };

  publicGetPatientDetails(params: IPublicPatientDetailsParams) {
    return this.$http.get<IBaseResponse<IPublicPartnerPrescriptionDetails>>("customer/public-prescription-details", { params: params });
  }

  patientBooking(payload: IPatientBookingPatientInfoDTO) {
    return this.$http.post<IBaseResponse<any>>("/customer/patient/intake-fillup-step1", payload);
  }

  patientIntakeFormSubmit(payload: IPatientIntakeFormDTO) {
    return this.$http.post<IBaseResponse<any>>("customer/patient/intake-fillup-step2", payload);
  }

  patientPasswordSetup(payload) {
    return this.$http.post<IBaseResponse<any>>("customer/patient/password/setup", payload);
  }

  requestRefill(payload: IRequestRefillDTO) {
    return this.$http.post<IBaseResponse<any>>("customer/prescription/refill-request", payload);
  }
}

const partnerPatientRepository = new PartnerPatientRepository($http);

export default partnerPatientRepository;
