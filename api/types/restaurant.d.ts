import { IAddress } from "./user";

export interface IRestaurant {
  id?: string;
  restaurantName: string;
  restaurantOwner: string;
  restaurantPhoneNumber: string;
  restaurantEmail: string;
  restaurantRegistrationNumber: string;
  address: IAddress;
  documents: File | null;
  displayImage: File | null;
  categoriesList?: categoriesDataType[];
  productList?: Product[];
}

export interface CreateRestaurantPayload {
  id?: string;
  restaurantName: string;
  restaurantOwner: string;
  restaurantPhoneNumber: string;
  restaurantEmail: string;
  restaurantRegistrationNumber: string;
  address: IAddress;
  documents: File | null;
  // categoriesList: categoriesDataType[];
  displayImage: File | null;
}
