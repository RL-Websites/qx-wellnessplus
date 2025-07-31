import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { ICommonParams } from "../models/interfaces/Common.model";
import { INotificationMarkAsReadRequest, INotificationRes } from "../models/interfaces/Notifications";

class NotificationApiRepository {
  constructor(private $http: AxiosInstance) {}
  getNotificationList(params: ICommonParams) {
    return this.$http.get<IBaseResponse<INotificationRes>>("notification/index", { params: params });
  }

  markAsRead(payload: INotificationMarkAsReadRequest) {
    return this.$http.post<IBaseResponse<any>>("notification/read", payload);
  }

  markAllAsRead() {
    return this.$http.post<IBaseResponse<any>>("notification/mark-all-read");
  }
}

const notificationApiRepository = new NotificationApiRepository($http);

export default notificationApiRepository;
