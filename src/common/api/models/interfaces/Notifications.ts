import { IPaginatedData } from "./ApiResponse.model";

export interface INotificationRes {
  notifications: IPaginatedData<INotificationData[]>;
  totalUnread?: number;
  totalCount?: number;
}

export interface INotificationData {
  created_at?: Date | string;
  id?: number;
  is_read?: number;
  notification: NotificationRef;
  notification_id?: number;
  user_id?: number;
}

export interface NotificationRef {
  body?: string;
  data?: INotificationInfoRef;
  id?: number;
  title?: string;
  type?: string;
}

export interface INotificationInfoRef {
  name?: string;
  u_id?: string;
  time?: Date;
}

export interface UserRef {
  id?: number;
  first_name?: string;
  last_name?: string;
  name?: string;
  userable_uid?: string;
}

export interface INotificationMarkAsReadRequest {
  notification_id: number | null;
}
