import $http from "@/common/api/axios";
import { ILocation } from "@/common/models/location";
import { AxiosInstance } from "axios";
import { IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { Clinic, IMessageing } from "../models/interfaces/Payment.model";

class CommonApiRepository {
  constructor(private $http: AxiosInstance) {}

  getLocations(params: any = null) {
    return this.$http.get<IBaseResponse<ILocation[]>>("locations", { params: params });
  }

  getClinics() {
    return this.$http.get<IBaseResponse<Clinic[]>>("message-clinics", {
      params: {
        noPaginate: true,
        messagePage: true,
      },
    });
  }

  getMessages() {
    return this.$http.get<IBaseResponse<IMessageing[]>>("clinic-my-messages", {
      params: {
        noPaginate: true,
        messagePage: true,
      },
    });
  }
}

const commonApiRepository = new CommonApiRepository($http);
export default commonApiRepository;
