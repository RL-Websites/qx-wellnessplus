import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { ICommonParams, IGetPriceHistoryParams } from "../models/interfaces/Common.model";
import { IMedicineCategory, IMedicineListItem, IMedicineStatusUpdateDTO, IPriceUpdateListItem, IStoreMedicineDTO } from "../models/interfaces/Medication.model";

class MedicineRepository {
  constructor(private $http: AxiosInstance) {}

  storeMedicine(payload: IStoreMedicineDTO) {
    return $http.post<IBaseResponse<any>>("/medications/store-update", payload);
  }

  clone(id: number) {
    return $http.post<IBaseResponse<any>>("/medications/clone", { id: id });
  }

  getMedicineCategories() {
    return $http.get<IBaseResponse<IMedicineCategory[]>>("/medications/categories");
  }

  getAllMedicines(params: ICommonParams) {
    return $http.get<IBasePaginationResponse<IMedicineListItem[]>>("/medications", { params: params });
  }

  getMedicineDetails(id: string) {
    return $http.get<IBaseResponse<IMedicineListItem>>("/medications/details", { params: { medication_id: id } });
  }

  changeStatus(payload: IMedicineStatusUpdateDTO) {
    return $http.patch<IBaseResponse<any>>("client/customer/product/manage-status", payload);
  }

  getPriceHistoryList(params: IGetPriceHistoryParams) {
    return $http.get<IBasePaginationResponse<IPriceUpdateListItem[]>>("/client/customer/product/price-logs", { params: params });
  }

  getCustomerPriceHistoryList(params: IGetPriceHistoryParams) {
    return $http.get<IBasePaginationResponse<IPriceUpdateListItem[]>>("/customer/product/price-logs", { params: params });
  }
}

export const medicineRepository = new MedicineRepository($http);
