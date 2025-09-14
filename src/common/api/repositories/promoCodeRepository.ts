import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBaseResponse } from "../models/interfaces/ApiResponse.model";

class PromoCodesRepository {
  constructor(private $http: AxiosInstance) {}

  // getAllPromoCodes(params: any = null) {
  //   return this.$http.get<IBasePaginationResponse<IPromoCodes[]>>("promo/codes", { params: params });
  // }

  getApplyPromoCode(params: any) {
    return this.$http.get<IBaseResponse<any>>("promo/code/apply", { params: params });
  }
}

const promoCodesApiRepository = new PromoCodesRepository($http);

export default promoCodesApiRepository;
