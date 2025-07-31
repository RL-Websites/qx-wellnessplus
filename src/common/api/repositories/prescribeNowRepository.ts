import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { ICheckIfPatientExistsDTO, IPaymentCollect, IPrescribeNowDTO } from "../models/interfaces/PrescribeNow.model";

class PrescribeNow {
  constructor(private $http: AxiosInstance) {}

  checkIfPatientExists(payload: ICheckIfPatientExistsDTO) {
    return this.$http.post<IBaseResponse<any>>("patients/patient-check", payload);
  }

  // getMedications() {
  //   return this.$http.get<IBaseResponse<IMedication[]>>("medications");
  // }

  prescribeNow(payload: IPrescribeNowDTO) {
    return this.$http.post<IBaseResponse<any>>("prescriptions/prescribed-now", payload);
  }
  paymentCollect(payload: IPaymentCollect) {
    return this.$http.post<IBaseResponse<any>>("clinic-prescription/prescribe-payment-collect", payload);
  }

  prescribeDirect(payload: any) {
    return this.$http.post<IBaseResponse<any>>("clinic-prescription/direct-prescribe", payload);
  }
}

const prescribeNowRepository = new PrescribeNow($http);

export default prescribeNowRepository;
