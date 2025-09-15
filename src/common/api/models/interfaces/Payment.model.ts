import { IMultipleServicesRef } from "./Patient.model";

export interface IUpdateCardDoTo {
  payment_method_id: string;
  payment_method_data: PaymentMethodData;
}

export interface PaymentMethodData {
  card: Card;
}

export interface Card {
  brand: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  country: string;
}
export interface IVerifyCardDTO {
  card_name?: string;
  card_number: string;
  expiration_date: string;
  cvv: string;
}

export interface ISaveCardDTO {
  payment_method_data: IPaymentMethodData;
  clinic_data: IClinicDataForCard;
}
export interface IPaymentMethodData {
  payment_method_id: string;
  card_type: string;
  card_number: string;
  exp_month: string;
  exp_year: string;
  billing_country: string;
}

export interface IClinicDataForCard {
  name: string;
  email: string;
}

export interface ICardRef {
  id?: number;
  card_number?: string;
  cvv?: string;
  expiration_date?: string;
  exp_month?: string;
  exp_year?: string;
  card_holder_name?: string;
  card_type?: string;
  address_line1?: null;
  address_line2?: null;
  billing_city?: null;
  billing_state?: null;
  billing_postal_code?: null;
  billing_country?: null;
  phone_number?: null;
  email?: null;
  bank_name?: null;
  account_type?: null;
  cardable_type?: string;
  cardable_id?: number;
  status?: number;
  created_at?: Date;
  updated_at?: Date;
  payment_customer_id?: number;
  payment_method_id?: number;
}

export interface IPayments {
  id: number;
  patient_id: any;
  card_id: any;
  amount: number;
  tax: any;
  status: string;
  trx_id: any;
  order_id: any;
  stripe_payment_intent_id: string;
  payer: string;
  created_at: string;
  updated_at: string;
  patient: any;
  doctor: Doctor;
  medications: Medication[];
  prescription: Prescription;
  multiple_services: IMultipleServicesRef[];
  clinic: Clinic;
  service: any;
  interval: string;
}

export interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  type: string;
  name: string;
  userable: any;
}

export interface Medication {
  id: number;
  drug_name: string;
  price: string;
  drug_gpi: any;
  drug_shape: string;
}

export interface Prescription {
  id: number;
  u_id: string;
  type: any;
  order_id?: string;
  medication: {
    id: number;
    drug_name: string;
  };
  pharmacy: {
    id: number;
    contact_name: string;
  };
}
export interface Clinic {
  id: number;
  name: string;
  type: string;
  logo: string;
  messages?: IMessageing[] | undefined;
}

export interface IMessageing {
  clinic_id: number;
  sender_user_id: number;
  receive_user_id: number;
  message: string;
  created_at: string;
  user: UserInterface;
}

interface UserInterface {
  name: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
}

export interface ICreatePaymentIntentDTO {
  amount: number;
  prescription_id?: number;
}
