export interface ILoginRequestPayload {
  email: string;
  password: string;
}

export interface ISignUpRequestPayload {
  confirmPassword: string;
  password: string;
  type?: string;
  u_id: string | null;
}

export interface IRegistrationRequestPayload {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  confirm_password?: string;
}

export interface IForgetPassPayload {
  email: string;
  domain_app: string;
}

export interface IResetPasswordPayload {
  new_password: string;
  new_password_confirmation: string;
}
export interface IChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}
export interface IOtpVerificationPayload {
  otp: string;
  accessCode: string | undefined;
}

export interface IResendOtpPayload {
  accessCode: string | undefined;
}
