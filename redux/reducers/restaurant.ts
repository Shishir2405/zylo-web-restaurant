import { categoriesDataType } from "@/api/types/category";
import { IOrder } from "@/api/types/orders";
import { Product } from "@/api/types/product";
import { IRestaurant } from "@/api/types/restaurant";
import { createSlice } from "@reduxjs/toolkit";

interface restaurantInterface {
  restaurantDetails: IRestaurant;
  categoriesList: categoriesDataType[];
  productList: Product[];
  recentOrders?: IOrder[];
}

const initialState: restaurantInterface = {
  restaurantDetails: {
    id: "",
    restaurantName: "",
    restaurantOwner: "",
    restaurantPhoneNumber: "",
    restaurantEmail: "",
    restaurantRegistrationNumber: "",
    address: {
      streetAddress: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
    },
    documents: null,
    categoriesList: [],
    productList: [],
    displayImage: null,
  },
  categoriesList: [],
  productList: [],
  recentOrders: [],
};

const restaurantDetailSlice = createSlice({
  name: "restaurant",
  initialState: initialState,
  reducers: {
    setRestaurantDetails: (state, action) => {
      state.restaurantDetails = action.payload;
    },
    setCategories: (state, action) => {
      state.categoriesList = action.payload;
    },
    setProductList: (state, action) => {
      state.productList = action.payload;
    },
    setRecentOrders: (state, action) => {
      state.recentOrders = action.payload;
    },
    resetRestaurant: () => initialState,
  },
});

export const {
  setRestaurantDetails,
  setCategories,
  setProductList,
  setRecentOrders,
  resetRestaurant,
} = restaurantDetailSlice.actions;
export default restaurantDetailSlice.reducer;
