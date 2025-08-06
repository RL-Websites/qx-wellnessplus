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
    return this.$http.post<IBaseResponse<any>>("customer/create-payment-intent", payload);
  }

  patientBooking(payload: IPatientBookingPatientInfoDTO) {
    return this.$http.post<IBaseResponse<any>>("/customer/patient/intake-fillup-step1", payload);
  }

  patientIntakeFormSubmit(payload: IPatientIntakeFormDTO) {
    return this.$http.post<IBaseResponse<any>>("customer/patient/intake-fillup-step2", payload);
  }
}

const orderApiRepository = new OrderRepository($http);

export default orderApiRepository;
