import { AxiosInstance } from "axios";
import $http from "../axios";
import { IBasePaginationResponse, IBaseResponse } from "../models/interfaces/ApiResponse.model";
import { ICommonParams } from "../models/interfaces/Common.model";
import { IAdminBasicInfoDto, ICreateUserDto, IProfileImageDto, IUserData, IUsers } from "../models/interfaces/User.model";

export interface IProfileImageUpdateResponse {
  profileImageUrl: string;
  user: IUserData;
}
interface IDeviceToken {
  tokenData: string;
}

class UserRepository {
  constructor(private $http: AxiosInstance) {}

  updateUserData(payload: IAdminBasicInfoDto) {
    return this.$http.put<IBaseResponse<any>>("user/profile-update", payload);
  }

  profileImageUpdate(payload: IProfileImageDto) {
    return this.$http.post<IBaseResponse<IProfileImageUpdateResponse>>("/user/profile-image-update", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  getAllUsers(params: ICommonParams) {
    return this.$http.get<IBasePaginationResponse<IUsers[]>>("/user/index", { params: params });
  }

  getAllUsersWithoutPaginate(params: any) {
    return this.$http.get<any>("/user/index", { params: params });
  }

  createUser(payload: ICreateUserDto) {
    return this.$http.post<IBaseResponse<any>>("auth/user-create", payload);
  }

  storeClinicUser(payload: ICreateUserDto) {
    return this.$http.post<IBaseResponse<any>>("user/user-create", payload);
  }

  userSettingInfoUpdate(payload: ICreateUserDto) {
    return this.$http.post<IBaseResponse<any>>("user/settings-info-update", payload);
  }

  storeDeviceToken(payload: IDeviceToken) {
    return this.$http.post<IBaseResponse<any>>("user/store-device-token", payload);
  }
}

const userRepository = new UserRepository($http);

export default userRepository;
