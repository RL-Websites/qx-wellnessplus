import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { IDoctor, IDoctorProfessionalInfoDTO } from "../models/interfaces/Doctor.model";
import { IInviteDoctorPayload } from "../models/interfaces/InviteDoctor.model";
import { ISpaPatientInProgressDetails } from "../models/interfaces/Patient.model";
import { IAddPrescriberManuallyDTO } from "../models/interfaces/Prescriber.model";
import { patientRequestList } from "../models/interfaces/Prescription.model";
import { IProfileImageDto } from "../models/interfaces/User.model";
import { IProfileImageUpdateResponse } from "./userRepository";

class SpaPrescriberApiRepository {
  constructor(private $http: AxiosInstance) {}

  invitePrescriber(payload: IInviteDoctorPayload) {
    return this.$http.post<IBaseResponse<any>>("/spa/doctor/invite", payload);
  }

  addPrescriberManually = (payload: IAddPrescriberManuallyDTO) => {
    return this.$http.post("/spa/doctor/add-manually", payload, { headers: { "Content-Type": "multipart/form-data" } });
  };

  prescriberRegistration = (payload: IAddPrescriberManuallyDTO) => {
    return this.$http.post("/docu-spa-prescriber-update", payload, { headers: { "Content-Type": "multipart/form-data" } });
  };

  getDoctorDetails(u_id: string | undefined, payload: any = {}) {
    return this.$http.get<IBaseResponse<IDoctor>>(`spa/doctor/details?u_id=${u_id}`, {
      params: payload,
    });
  }
  spaDoctorBasicInfoUpdate(u_id: string | null | undefined, payload: any) {
    return this.$http.post<IBaseResponse<IDoctor>>("/spa/doctor/basic-information-update/" + u_id, payload);
  }
  spaDoctorProfInfoUpdate(payload: IDoctorProfessionalInfoDTO) {
    return this.$http.post<IBaseResponse<IDoctor>>("/spa/doctor/professional-information-update", payload);
  }
  spaProfileImageUpdate(payload: IProfileImageDto) {
    return this.$http.post<IBaseResponse<IProfileImageUpdateResponse>>("/spa/doctor/profile-image-update/", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  spaSignatureUpdate(payload: any) {
    return this.$http.post<IBaseResponse<any>>("/doctor/signature-update", payload);
  }

  getSpaPrescriptions(params: any = null) {
    return this.$http.get<IBasePaginationResponse<patientRequestList[]>>("/spa/clinic/patients-in-progress/", { params: params });
  }

  deletePrescription(docuspa_ing_prog_patient_u_id: string) {
    return this.$http.delete<IBaseResponse<any>>(`/spa/clinic/patient-in-progress-delete`, { data: { docuspa_ing_prog_patient_u_id } });
  }

  getActivityLogs(params: any = null) {
    return this.$http.get<IBasePaginationResponse<any[]>>("/spa/user-activities", { params: params });
  }

  getSpaPatientDetails(u_id: string | undefined) {
    return this.$http.get<IBaseResponse<ISpaPatientInProgressDetails>>(`spa/clinic/patient-details?docu_spa_service_u_id=${u_id}`);
  }

  getInvitedPatient(u_id: string | null) {
    return this.$http.get<IBaseResponse<any>>(`spa/clinic/invited-patient?u_id=${u_id}`);
  }

  bookMeeting(payload: any) {
    return this.$http.post<IBaseResponse<any>>(`spa/clinic/book-meeting`, payload);
  }

  updateBookMeeting(payload: any) {
    return this.$http.patch<IBaseResponse<any>>("spa/update-intake", payload);
  }

  getSpaBills(params: any) {
    return this.$http.get<IBasePaginationResponse<any[]>>(`spa/bills`, { params: params });
  }

  getDoctorSummaryReport(params: any) {
    console.log(params, "params");
    return this.$http.get<IBaseResponse<any[]>>(`report/download/doctor-review-summary-count`, { params: params });
  }
}

const spaPrescriberApiRepository = new SpaPrescriberApiRepository($http);
export default spaPrescriberApiRepository;
