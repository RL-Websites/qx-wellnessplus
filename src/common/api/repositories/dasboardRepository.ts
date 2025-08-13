import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { ISummery, ITopSellingDrug, ITopSellingStates } from "../models/interfaces/Summery.model";

class DashboardApiRepository {
  constructor(private $http: AxiosInstance) {}

  getSummery(queryParams: any = null) {
    return this.$http.get<IBaseResponse<ISummery>>(`/dashboard/summary`, { params: queryParams });
  }

  topSellingDrugs(params: any = null) {
    return this.$http.get<IBasePaginationResponse<ITopSellingDrug[]>>("/dashboard/top-selling-drugs", { params: params });
  }
  topSellingStates(params: any = null) {
    return this.$http.get<IBasePaginationResponse<ITopSellingStates[]>>("/dashboard/state-wise-sales", { params: params });
  }
}

const dashboardApiRepository = new DashboardApiRepository($http);

export default dashboardApiRepository;
