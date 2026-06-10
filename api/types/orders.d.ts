import { ISelectWithSearch, PaginationData } from "@/types";

import {
  Notification,
  ReceivedRequestDetails,
  ReportTypeDetails,
  TransactionDetails,
} from "./common";
import { Product } from "./product";

export interface IShippingItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  photoUrl?: string;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  orderedById: string;
  orderedBy: string;
  orderedFromId: string;
  orderedFrom: string;
  orderPlacedDateAndTime: string; // ISO date string
  orderAcceptedDateAndTime: string | null;
  orderPreparedDateAndTime: string | null;
  shippingAddress: IAddress;
  shippingItems: IShippingItem[];
  subTotal: number;
  taxAmount?: number;
  flatTax?: number | null;
  percentageTax?: number | null;
  deliveryFee: number;
  total: number;
  orderStatus: IOrderStatus;
  paymentStatus: "NotPaid" | "Processing" | "Paid" | "Refunded" | "Failed";
  paymentType: string | null;
  deliveredTime: string | null;
  orderRead: boolean;
  readBy: string | null;
  specialInstruction?: string;
  reviews?: unknown[];
}

export type IDeliveryStatus =
  | "Pending"
  | "Assigned"
  | "AtRestaurant"
  | "PickedUp"
  | "Delivered"
  | "Cancelled";

export interface IOrderDelivery {
  id: string;
  orderId: string;
  orderNumber: string | null;
  partnerId: string | null;
  partnerName: string | null;
  partnerPhone: string | null;
  status: IDeliveryStatus;
  // Restaurant sees pickupOtp; deliveryOtp is hidden from this surface.
  pickupOtp: string | null;
  deliveryOtp: string | null;
  assignedAt: string;
  acceptedAt: string | null;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  customerName: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
}

export type IOrderStatus =
  | "Pending"
  | "Accepted"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Declined"
  | "Cancelled";
