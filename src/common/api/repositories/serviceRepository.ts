import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { ICommonParams } from "../models/interfaces/Common.model";
import { IAddServiceDTO, IServiceItem } from "../models/interfaces/Service.model";

class ServiceRepository {
  constructor(private $http: AxiosInstance) {}

  getServiceList(params: ICommonParams) {
    return this.$http.get<IBaseResponse<IServiceItem[]>>("/services", { params: params });
  }

  getAuthFreeService() {
    return this.$http.get<IBaseResponse<IServiceItem[]>>("/spa/service-list");
  }

  addService(payload: IAddServiceDTO) {
    return this.$http.post<IBaseResponse<any>>("/services", payload);
  }

  deleteService(id: string) {
    return this.$http.delete<IBaseResponse<any>>(`/services/${id}`);
  }

  editService(payload: IServiceItem) {
    return this.$http.put<IBaseResponse<any>>(`/services/${payload.id}`, payload);
  }
}

const serviceRepository = new ServiceRepository($http);

export default serviceRepository;
