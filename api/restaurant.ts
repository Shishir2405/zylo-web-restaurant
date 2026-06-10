import { request } from ".";
import { ErrorResult, SuccessResult } from "./types/basic";
import { categoriesDataType, createProductPayload } from "./types/category";
import { CreateRestaurantPayload } from "./types/restaurant";
import { SignInPayload, SignInResponseData } from "./types/user";

export async function createRestaurantApi(
  payload: CreateRestaurantPayload
): Promise<SuccessResult<SignInResponseData> | ErrorResult> {
  let data = new FormData();
  data.append("restaurantName", payload.restaurantName);
  data.append("restaurantOwner", payload.restaurantOwner);
  data.append("restaurantPhoneNumber", payload.restaurantPhoneNumber);
  data.append("restaurantEmail", payload.restaurantEmail);

  data.append("address.streetAddress", payload.address.streetAddress);
  if (payload.address.city) {
    data.append("address.city", payload.address.city);
  }
  if (payload.address.state) {
    data.append("address.state", payload.address.state);
  }
  if (payload.address.zipcode) {
    data.append("address.zipcode", payload.address.zipcode);
  }
  if (payload.address.country) {
    data.append("address.country", payload.address.country);
  }
  if (payload.address.addressLink) {
    data.append("address.addressLink", payload.address.addressLink);
  }

  data.append(
    "restaurantRegistrationNumber",
    payload.restaurantRegistrationNumber
  );
  // Backend expects `documents` as List<CreateDocumentDto> with File +
  // DocumentNumber + DocumentExpiryDate per item. We don't collect those
  // fields yet, so omit the document for now — the restaurant still gets
  // created, and the license can be added on the profile page later.
  if (payload.displayImage) {
    data.append("displayImage", payload.displayImage);
  }

  const response = await request({
    url: `/restaurant/create-restaurant`,
    method: "POST",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}
export async function updateRestaurantApi(
  payload: CreateRestaurantPayload,
  id: string
): Promise<SuccessResult<SignInResponseData> | ErrorResult> {
  let data = new FormData();
  data.append("restaurantName", payload.restaurantName);
  data.append("restaurantOwner", payload.restaurantOwner);
  data.append("restaurantPhoneNumber", payload.restaurantPhoneNumber);
  data.append("restaurantEmail", payload.restaurantEmail);

  data.append("address.streetAddress", payload.address.streetAddress);
  if (payload.address.city) {
    data.append("address.city", payload.address.city);
  }
  if (payload.address.state) {
    data.append("address.state", payload.address.state);
  }
  if (payload.address.zipcode) {
    data.append("address.zipcode", payload.address.zipcode);
  }
  if (payload.address.country) {
    data.append("address.country", payload.address.country);
  }

  data.append(
    "restaurantRegistrationNumber",
    payload.restaurantRegistrationNumber
  );

  // if (payload.documents) {
  //   // data.append("documents", JSON.stringify(payload.documents));
  //   if (
  //     typeof payload.documents === "object" &&
  //     payload.documents !== null &&
  //     typeof payload.documents.name === "string" &&
  //     typeof payload.documents.size === "number" &&
  //     typeof payload.documents.type === "string"
  //   ) {
  //     data.append("documents", payload.documents);
  //   } else {
  //     data.append("documents", "");
  //   }
  // }
  // if (payload.displayImage) {
  //   // data.append("displayImage", JSON.stringify(payload.displayImage));
  //   if (
  //     typeof payload.displayImage === "object" &&
  //     payload.displayImage !== null &&
  //     typeof payload.displayImage.name === "string" &&
  //     typeof payload.displayImage.size === "number" &&
  //     typeof payload.displayImage.type === "string"
  //   ) {
  //     data.append("displayImage", payload.displayImage);
  //   } else {
  //     data.append("displayImage", "");
  //   }
  // }

  const response = await request({
    url: `/restaurant/update-restaurant/${id}`,
    method: "PUT",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}
export async function getRestaurantDetailsApi(
  id: string
): Promise<SuccessResult<any> | ErrorResult> {
  const response = await request({
    url: `/restaurant/get-restaurant/${id}`,
    method: "GET",
  });
  return response;
}
export async function getCategoriesApi(
  restaurantId: string
): Promise<SuccessResult<categoriesDataType[]> | ErrorResult> {
  const response = await request({
    url: `/category/${restaurantId}/get-all-categories`,
    method: "GET",
  });
  return response;
}
export async function getAllRestaurnatsApi(): Promise<
  SuccessResult<any> | ErrorResult
> {
  const response = await request({
    url: `/restaurant/get-all-restaurants`,
    method: "GET",
  });
  return response;
}
export async function getAllRestaurnatsProductsApi(
  id: string
): Promise<SuccessResult<any> | ErrorResult> {
  const response = await request({
    url: `/product/${id}/get-all-restaurant-products`,
    method: "GET",
  });
  return response;
}

export async function createCategoryApi(
  restaurantId: string,
  payload: FormData
): Promise<SuccessResult<SignInResponseData> | ErrorResult> {
  const response = await request({
    url: `/category/${restaurantId}/create-category`,
    method: "POST",
    data: payload,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}
export async function createProductApi(
  categoryId: string,
  payload: createProductPayload
): Promise<SuccessResult<any> | ErrorResult> {
  let data = new FormData();
  data.append("name", payload.name);
  data.append("productDescription", payload.productDescription);
  data.append("productPrice", payload.productPrice);
  data.append("commission", payload.commission);
  data.append("foodType", payload.foodType);
  // if (payload.photos) {
  // payload.photos.map((item: any) => data.append("photos", item));
  // }
  data.append("photos", payload.photos);

  const response = await request({
    url: `/product/${categoryId}/create-product`,
    method: "POST",
    data: payload,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}
// export async function signUpApi(
//   payload: SignInPayload
// ): Promise<SuccessResult<SignInResponseData> | ErrorResult> {
//   const response = await request({
//     url: `/restaurant/register`,
//     method: "POST",
//     data: payload,
//   });
//   return response;
// }
