import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { IMedicineListItem } from "../models/interfaces/Medication.model";

class CategoryRepository {
  constructor(private $http: AxiosInstance) {}

  getCategoryList(slug: string) {
    return $http.get<IBaseResponse<IMedicineListItem>>("/wellness-plus-qx/category", { params: { customer_slug: slug } });
  }
}

export const categoryRepository = new CategoryRepository($http);
