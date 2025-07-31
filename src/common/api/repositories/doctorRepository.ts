import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { IDoctor, IDoctorProfessionalInfoDTO } from "../models/interfaces/Doctor.model";
import { IInviteDoctorPayload, IResendLinkDTO, IStatusUpdateDTO } from "../models/interfaces/InviteDoctor.model";
import { IScheduleDTO } from "../models/interfaces/Schedule.model";

class DoctorApiRepository {
  constructor(private $http: AxiosInstance) {}

  getDoctors(params: any = null) {
    return this.$http.get<IBasePaginationResponse<IDoctor[]>>("doctor", { params: params });
  }

  getDoctor(doctorId: string | undefined) {
    return this.$http.get<IBaseResponse<IDoctor>>(`doctor/details?u_id=${doctorId}`);
  }

  getDoctorDetails(uid: string | null, payload: any = {}) {
    return this.$http.get<IBaseResponse<IDoctor>>(`doctor/details?u_id=${uid}`, {
      params: payload,
    });
  }

  inviteDoctor(payload: IInviteDoctorPayload) {
    return this.$http.post<IBaseResponse<any>>("/doctor", payload);
  }

  registerDoctor(u_id: string | null | undefined, payload: any) {
    return this.$http.put<IBaseResponse<IDoctor>>("doctor/update/" + u_id, payload);
  }

  prescriberPasswordUpdate(payload) {
    return this.$http.post<IBaseResponse<any>>("auth/prescriber-password-set", payload, { headers: { "Content-Type": "multipart/form-data" } });
  }

  doctorDetailsUpdate(u_id: string | null | undefined, payload: any) {
    return this.$http.post<IBaseResponse<IDoctor>>("doctor/profile-details-update/" + u_id, payload);
  }

  doctorProfInfoUpdate(payload: IDoctorProfessionalInfoDTO) {
    return this.$http.post<IBaseResponse<IDoctor>>("doctor/professional-info-update", payload);
  }

  resendRegistrationLink(payload: IResendLinkDTO) {
    return this.$http.post<IBaseResponse<null>>("doctor/resend-link", payload);
  }

  updateStatus(payload: IStatusUpdateDTO) {
    return this.$http.post<IBaseResponse<IDoctor>>("doctor/status-update", payload);
  }

  getSchedule(doctorId: string) {
    return this.$http.get<IBaseResponse<any>>(`doctor/get-schedules?doctorId=${doctorId}`);
  }

  setSchedule(payload: IScheduleDTO) {
    return this.$http.post<IBaseResponse<any>>("doctor/set-schedule", payload);
  }

  checkNpi(npi: string) {
    return this.$http.get<IBaseResponse<any>>(`doctor-npi-check/${npi}`);
  }
}

const doctorApiRepository = new DoctorApiRepository($http);

export default doctorApiRepository;
