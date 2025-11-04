import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { ICommonParams } from "../models/interfaces/Common.model";
import { IPatientPaymentAuthorizeConfirmDTO } from "../models/interfaces/PartnerPatient.model";
import { ICardRef, ISaveCardDTO, IUpdateCardDoTo, IVerifyCardDTO } from "../models/interfaces/Payment.model";

class PaymentRepository {
  constructor(private $http: AxiosInstance) {}

  verifyCard(payload: IVerifyCardDTO) {
    return this.$http.post("/payments/card-verify", payload);
  }

  card(payload: ISaveCardDTO) {
    return this.$http.post("/card", payload);
  }

  cardUpdate(payload: IUpdateCardDoTo) {
    return this.$http.post("/spa/clinic/card-update", payload);
  }

  patientPaymentAuthorizeConfirm(payload: IPatientPaymentAuthorizeConfirmDTO) {
    return this.$http.post<IBaseResponse<any>>("/customer/patient/payment-authorized-confirmation", { payment: payload });
  }

  getCardList(params: ICommonParams) {
    return this.$http.get<IBasePaginationResponse<ICardRef[]>>("/card", { params: params });
  }

  deleteCard({ id }: { id: string }) {
    return this.$http.delete(`/card/${id}`);
  }
}

const paymentRepository = new PaymentRepository($http);

export default paymentRepository;
