import { ISelectWithSearch, PaginationData } from "@/types";

import {
  Notification,
  ReceivedRequestDetails,
  ReportTypeDetails,
  TransactionDetails,
} from "./common";
export interface ProductPhoto {
  id: string;
  publicId: string;
  url: string;
  productId: string;
  uploadedAt: string; // ISO date string
}

export interface Product {
  id: string;
  name: string;
  productPrice: number;
  commission: number;
  foodType: "veg" | "non-veg";
  productDescription: string;
  photos: ProductPhoto[];
}

export interface ProductApiResponse {
  success: boolean;
  message: string;
  data: Product[];
}
