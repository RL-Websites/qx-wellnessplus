export interface IInviteDoctorPayload {
  type?: string;
  first_name: string;
  email: string;
  phone: string;
  clientIds?: string[];
}

export interface IResendLinkDTO {
  u_id: string;
}

export interface IStatusUpdateDTO {
  u_id: string;
  status: string;
  note: string;
}
