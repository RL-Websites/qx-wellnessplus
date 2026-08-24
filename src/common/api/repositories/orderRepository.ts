import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { IPatientBookingPatientInfoDTO, IPatientIntakeFormDTO, IPublicPartnerPrescriptionDetails, IPublicPatientDetailsParams } from "../models/interfaces/PartnerPatient.model";
import { ICreatePaymentIntentDTO } from "../models/interfaces/Payment.model";

class OrderRepository {
  constructor(private $http: AxiosInstance) {}

  publicGetPatientDetails(params: IPublicPatientDetailsParams) {
    return this.$http.get<IBaseResponse<IPublicPartnerPrescriptionDetails>>("customer/public-prescription-details", { params: params });
  }

  createPaymentIntent(payload: ICreatePaymentIntentDTO) {
    // QX has its own checkout endpoints (WellnessQXPaymentController) so the partner
    // flow's payment controller is never touched by QX-specific changes.
    return this.$http.post<IBaseResponse<any>>("wellness-plus-qx/create-payment-intent", payload);
  }

  patientBooking(payload: IPatientBookingPatientInfoDTO) {
    return this.$http.post<IBaseResponse<any>>("wellness-plus-qx/patient-data-fill-up", payload);
  }

  patientIntakeFormSubmit(payload: IPatientIntakeFormDTO) {
    return this.$http.post<IBaseResponse<any>>("wellness-plus-qx/patient-data-fill-up-step-2", payload);
  }

  labReportUploadRequest(payload: any) {
    return this.$http.post<IBaseResponse<any>>("customer/patient/report/upload", payload);
  }
}

const orderApiRepository = new OrderRepository($http);

export default orderApiRepository;
