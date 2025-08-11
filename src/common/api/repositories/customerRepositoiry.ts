import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { IQXCustomerDetails } from "../models/interfaces/Customer.model";

class CustomerRepository {
  constructor(private $http: AxiosInstance) {}

  // getPartnerList(params?: ICommonParams) {
  //   return this.$http.get<IBasePaginationResponse<any[]>>("customer/index", { params: params });
  // }

  // getPartnerListWithoutPagination(params?: ICommonParams) {
  //   return this.$http.get<IBaseResponse<any[]>>("customer/index", { params: params });
  // }

  // getNonPaginatedPartnerList(params?: ICommonParams) {
  //   return this.$http.get<IBaseResponse<IPublicPartnerRef[]>>("customer/index", { params: params });
  // }
  // getPartnerDetails(slug: string | undefined | null) {
  //   return this.$http.get<IBaseResponse<any>>("customer/details", { params: { slug } });
  // }

  // getPartnerDetailsPublic(slug: string | undefined | null) {
  //   return this.$http.get<IBaseResponse<any>>("customer/public-details", { params: { slug } });
  // }
  // changePartnerStatus(payload) {
  //   return this.$http.post<IBaseResponse<any>>("customer/status-update", payload);
  // }
  // getPrescriptions(params: any = null) {
  //   return this.$http.get<IBasePaginationResponse<patientRequestList[]>>("customer/prescription/list", { params: params });
  // }
  // getReportList(params?: any) {
  //   return this.$http.get<IBasePaginationResponse<any[]>>("customer/report/index", { params: params });
  // }

  // getOrderList(params: any = null) {
  //   return this.$http.get<IBasePaginationResponse<IPatientOrderList[]>>("partner/patient/orders/list", { params: params });
  // }

  // partnerPasswordSetup(payload) {
  //   return this.$http.post<IBaseResponse<any>>("customer/password-setup", payload);
  // }
  // getAllPartnerMedicines(params: ICommonParams) {
  //   return $http.get<IBasePaginationResponse<IPartnerMedicineListItem[]>>("customer/product/list", { params: params });
  // }
  // getAllPatients(params: any = null) {
  //   return this.$http.get<IBasePaginationResponse<patientRequestList[]>>("customer/patient/list", { params: params });
  // }
  // updatePartnerBasicInfo(payload: any) {
  //   return this.$http.post<IBaseResponse<any>>("partner/basic-information-update", payload);
  // }

  // // client portal
  // storeMedicine(payload: any) {
  //   return $http.post<IBaseResponse<any>>("client/customer/product/store-update", payload);
  // }
  // getAllMedicines(params: ICommonParams) {
  //   return $http.get<IBasePaginationResponse<IMedicineListItem[]> | IBaseResponse<IMedicineListItem[]>>("client/customer/product/index", { params: params });
  // }

  // assignMedicine(payload: IAssignMedToPartner) {
  //   return this.$http.post<IBaseResponse<null>>("client/customer/product/attach", payload);
  // }
  // partnerResendLink(slug: string) {
  //   const payload = {
  //     slug,
  //   };
  //   return this.$http.post<IBaseResponse<any>>("customer/resend-link", payload);
  // }

  // getAllClientPatients(params: any = null) {
  //   return this.$http.get<IBasePaginationResponse<patientRequestList[]>>("client/customer/patient/list", { params: params });
  // }

  // // partner patient
  // updatePartnerPatientBasicInfo(payload: any) {
  //   return this.$http.post<IBaseResponse<any>>("partner/patient/update", payload);
  // }

  // getPartnerUsers(params: ICommonParams) {
  //   return this.$http.get<IBasePaginationResponse<null>>("customer/users", { params: params });
  // }

  // Cuatomer Details
  getCustomerDetails(slug: string | undefined | null) {
    return this.$http.get<IBaseResponse<IQXCustomerDetails>>("wellness-plus-qx/customer-details", { params: { customer_slug: slug } });
  }
}

const CustomerApiRepository = new CustomerRepository($http);

export default CustomerApiRepository;
