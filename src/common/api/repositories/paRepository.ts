import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { IPhysicianAssistant } from "../models/interfaces/Doctor.model";
import { IStatusUpdateDTO } from "../models/interfaces/InviteDoctor.model";
import { IPaDetailsViewModel } from "../models/interfaces/Pa-details.model";
import { IInvitePADTO, IPABasicInfoDTO, IPAProfessionalInfoDTO } from "../models/interfaces/physician-assistant.model";

class PhysicianAssistantsApiRepository {
  constructor(private $http: AxiosInstance) {}

  getPhysicianAssistants(params: any = null) {
    return this.$http.get<IBasePaginationResponse<IPhysicianAssistant[]>>("/physician-assistant", { params: params, validateStatus: () => true });
  }

  getPaDetails(paId?: string) {
    return this.$http.get<IBaseResponse<IPaDetailsViewModel>>(`/doctor/pa/details/${paId}`);
  }

  updateStatus(payload: IStatusUpdateDTO) {
    return this.$http.post<IBaseResponse<IPhysicianAssistant>>("/physician-assistant-status-update", payload);
  }

  invitePa(payload: IInvitePADTO) {
    return this.$http.post<IBaseResponse<any>>("/doctor-pa/add", payload);
  }

  paBasicInfoUpdate(payload: IPABasicInfoDTO) {
    return this.$http.post<IBaseResponse<any>>("/physician/basic-info-update", payload);
  }

  paProfessionalInfoUpdate(payload: IPAProfessionalInfoDTO) {
    return this.$http.post<IBaseResponse<any>>("/physician/professional-info-update", payload);
  }
}

const paApiRepository = new PhysicianAssistantsApiRepository($http);

export default paApiRepository;
