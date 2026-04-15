export interface IQXCustomerDetails {
  name: string;
  logo: string;
  favicon: string;
  slug: string;
  email: string;
  phone: string;
  payment_type?: string;
  stripe_enabled?: number;
  stripe_connect_id?: string;
  over_night_shipping_fee?: string;
  id: number;
}
