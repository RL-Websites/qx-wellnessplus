import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { ICommonParams } from "../models/interfaces/Common.model";
import { IMedicineListItem } from "../models/interfaces/Medication.model";

class MedicineRepository {
  constructor(private $http: AxiosInstance) {}

  getAllMedicines(params: ICommonParams) {
    return $http.get<IBasePaginationResponse<IMedicineListItem[]>>("/wellness-plus-qx/medication-list", { params: params });
  }

  getMedicineDetails(id: string) {
    return $http.get<IBaseResponse<IMedicineListItem>>("/medications/details", { params: { medication_id: id } });
  }
}

export const medicineRepository = new MedicineRepository($http);
