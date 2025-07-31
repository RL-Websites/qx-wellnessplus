import $http from "@/common/api/axios";
import { AxiosInstance } from "axios";
import { ReactNode } from "react";
import { IBaseResponse } from "../models/interfaces/ApiResponse.model";
import {
  IChangePasswordPayload,
  IForgetPassPayload,
  ILoginRequestPayload,
  IOtpVerificationPayload,
  IResendOtpPayload,
  IResetPasswordPayload,
  ISignUpRequestPayload,
} from "../models/interfaces/Auth.model";
import { IUserData } from "../models/interfaces/User.model";

interface ILoginResponse {
  message: ReactNode;
  access_token: string;
  user: any;
  token_type?: string;
  expires_in?: any;
}

interface ILoginCheckResponse {
  message: ReactNode;
  access_code: string;
  otp_expired: any;
  email: string;
}

interface ISignUpResponse {
  message: ReactNode;
  data: string;
}

class AuthApiRepository {
  constructor(private $http: AxiosInstance) {}

  loginRequest(payload: ILoginRequestPayload) {
    return this.$http.post<ILoginCheckResponse>("auth/sign-in", payload);
  }

  noOtpLogin(payload: ILoginRequestPayload) {
    return this.$http.post<ILoginResponse>("auth/no-otp-sign-in", payload);
  }

  signUpRequest(payload: ISignUpRequestPayload) {
    return this.$http.post<ISignUpResponse>("auth/sign-up", payload);
  }

  forgetPassword(payload: IForgetPassPayload) {
    return this.$http.post<ILoginResponse>("auth/check-email", payload);
  }

  resetPassword(payload: IResetPasswordPayload) {
    return this.$http.post<ILoginResponse>("auth/reset-password", payload);
  }
  changePassword(payload: IChangePasswordPayload) {
    return this.$http.post<ILoginResponse>("auth/change-password", payload);
  }

  verifyOtp(payload: IOtpVerificationPayload) {
    return this.$http.post<any>("auth/otp-verification", payload);
  }

  resendOtp(payload: IResendOtpPayload) {
    return this.$http.post<any>("auth/otp-send", payload);
  }

  logout() {
    return this.$http.post<IBaseResponse<any>>("auth/logout");
  }

  getUserDetails(u_id: string | undefined) {
    return this.$http.get<IBaseResponse<IUserData>>("user/details/" + u_id, { params: {}, validateStatus: () => true });
  }

  authUser() {
    return this.$http.get<IBaseResponse<IUserData>>("auth/user", { params: {}, validateStatus: () => true });
  }
}

const authApiRepository = new AuthApiRepository($http);
export default authApiRepository;
