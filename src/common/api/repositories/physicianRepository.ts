import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { IPhysicianAssistant } from "../models/interfaces/Doctor.model";

class PhysicianApiRepository {
  constructor(private $http: AxiosInstance) {}

  getPA(params: any = null) {
    return this.$http.get<IBasePaginationResponse<IPhysicianAssistant[]>>("physician-assistant", { params: params, validateStatus: () => true });
  }

  getDoctorPaDetails(uid: string | null, params: object = {}) {
    return this.$http.get<IBaseResponse<any>>(`doctor/pa/details/` + uid, { params: params });
  }

  registerPhysician(u_id: string | null, payload: any) {
    return this.$http.put("physician-assistant/" + u_id, payload);
  }

  resendRegistrationLink(u_id: string) {
    return this.$http.post<IBaseResponse<null>>("physician-invite-resend/" + u_id);
  }
}

const physicianApiRepository = new PhysicianApiRepository($http);

export default physicianApiRepository;
