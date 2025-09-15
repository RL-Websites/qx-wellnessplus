export interface IQXCustomerDetails {
  name: string;
  logo: string;
  slug: string;
  email: string;
  phone: string;
  payment_type?: string;
  stripe_enabled?: number;
  stripe_connect_id?: string;
  id: number;
}
