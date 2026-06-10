import { ISelectWithSearch, PaginationData } from "@/types";

import {
  Notification,
  ReceivedRequestDetails,
  ReportTypeDetails,
  TransactionDetails,
} from "./common";
import { Product } from "./product";

export type Auth = {
  email: string;
  password: string;
};
export interface SignInPayload {
  email: string;
  password: string;
}

export interface IAddress {
  id?: string;
  streetAddress: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  addressTitle?: string;
  addressLink?: string;
}
export interface SignUpPayload {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: IAddress;
}
export interface SignInPayload2 {
  country_code: string;
  mobile_number: string;
  password: string;
}
export interface SignInResponseData {
  email: string;
  userName: string;
  token: string;
}
