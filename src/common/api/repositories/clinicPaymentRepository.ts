import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { IPayments } from "../models/interfaces/Payment.model";

class ClinicPaymentRepository {
  constructor(private $http: AxiosInstance) {}

  getPaymentList(params?: any) {
    return this.$http.get<IBasePaginationResponse<IPayments[]>>("payments", { params: params });
  }

  getPaymentDetails(payment_id: string | undefined) {
    return this.$http.get<IBaseResponse<IPayments>>(`payments/details?payment_id=${payment_id}`);
  }

  getStripeSetupIntent() {
    return this.$http.get<any>(`stripe-setup-intent`);
  }

  getPaymentMethodDetails(paymentMethodId: any) {
    return this.$http.get<any>(`fetch-payment-method-details?payment_method_id=${paymentMethodId}`);
  }
}

const clinicPaymentRepository = new ClinicPaymentRepository($http);

export default clinicPaymentRepository;
