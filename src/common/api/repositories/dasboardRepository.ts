import { AxiosInstance } from "axios";
import $http from "../axios";
import { IAPILogDetail, IAPILogs } from "../models/interfaces/ApiLogs.model";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { ICommonParams } from "../models/interfaces/Common.model";
import { ISaleTrendsDTO, SaleTrendsData } from "../models/interfaces/SaleTrends.model";
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

  getApiLogs(params?: ICommonParams) {
    return this.$http.get<IBasePaginationResponse<IAPILogs[]>>("/logs/index", { params: params });
  }
  getApiLogDetail(id: string) {
    return this.$http.get<IBaseResponse<IAPILogDetail>>("/logs/details", { params: { logId: id } });
  }

  saleTrends(params: ISaleTrendsDTO) {
    return this.$http.post<IBaseResponse<SaleTrendsData>>("dashboard/sales-trends", params);
  }

  getSpaSummary() {
    return this.$http.get<IBaseResponse<any>>(`/spa/dashboard/summary`);
  }

  getPartnerSummary() {
    return this.$http.get<IBaseResponse<any>>(`customer/summary`);
  }
}

const dashboardApiRepository = new DashboardApiRepository($http);

export default dashboardApiRepository;
