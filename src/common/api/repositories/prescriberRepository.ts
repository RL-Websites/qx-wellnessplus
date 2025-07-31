import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { ICommonParams } from "../models/interfaces/Common.model";
import { IDoctor } from "../models/interfaces/Doctor.model";
import { IResendLinkDTO } from "../models/interfaces/InviteDoctor.model";
import { IAddPrescriberManuallyDTO, IPrescriberRegistrationDTO, ISetClinicAsPrescriberDTO } from "../models/interfaces/Prescriber.model";

class PrescriberRepository {
  constructor(private $http: AxiosInstance) {}

  addPrescriberManually = (payload: IAddPrescriberManuallyDTO) => {
    return this.$http.post("add-prescriber", payload, { headers: { "Content-Type": "multipart/form-data" } });
  };

  prescriberRegistration = (payload: IPrescriberRegistrationDTO) => {
    return this.$http.post("prescriber-registration", payload, { headers: { "Content-Type": "multipart/form-data" } });
  };

  resendRegistrationLink(payload: IResendLinkDTO) {
    return this.$http.post<IBaseResponse<null>>("clinic-prescriber/resend-link", payload);
  }

  setClinicAsPrescriber(payload: ISetClinicAsPrescriberDTO) {
    return this.$http.post<IBaseResponse<any>>("clinics/set-as-prescriber", payload, { headers: { "Content-Type": "multipart/form-data" } });
  }

  // DocuSpa Super Admin portal Prescriber list
  getSpaPrescriberList(params: ICommonParams) {
    return this.$http.get<IBasePaginationResponse<IDoctor[]>>("spa/doctor/list", { params: params });
  }

  getNoPaginatedSpaPrescriberList(params: ICommonParams) {
    return this.$http.get<IBaseResponse<IDoctor[]>>("spa/doctor/list", { params: params });
  }
}

const prescriberRepository = new PrescriberRepository($http);

export default prescriberRepository;
