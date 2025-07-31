import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { IGetSystemCodesParams, ISystemCodes } from "../models/interfaces/SystemCodes.model";

class SystemCodesRepository {
  constructor(private $http: AxiosInstance) {}

  getAllCodes(params: IGetSystemCodesParams) {
    return this.$http.get<IBasePaginationResponse<ISystemCodes[]>>("code", { params: params });
  }
  getAllCodesNoPaginate(params: IGetSystemCodesParams) {
    return this.$http.get<IBaseResponse<ISystemCodes[]>>("code", { params: params });
  }

  createIcdCodes(payload: ISystemCodes) {
    return this.$http.post<IBaseResponse<any>>("code/icd-code", payload);
  }

  updateIcdCodes(id: number, payload: ISystemCodes) {
    return this.$http.put<IBaseResponse<any>>(`code/icd-code/${id}`, payload);
  }

  createCpdCodes(payload: ISystemCodes) {
    return this.$http.post<IBaseResponse<any>>("code/cpd-code", payload);
  }

  updateCpdCodes(id: number, payload: ISystemCodes) {
    return this.$http.put<IBaseResponse<any>>(`code/cpd-code/${id}`, payload);
  }
}

const systemCodesRepository = new SystemCodesRepository($http);

export default systemCodesRepository;
