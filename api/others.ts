import { request } from ".";
import { ErrorResult, SuccessResult } from "./types/basic";
import { SignInResponseData } from "./types/user";

export async function getAllCategories(
  restaurantId: string
): Promise<SuccessResult<SignInResponseData> | ErrorResult> {
  const response = await request({
    url: `/category/${restaurantId}/get-all-categories`,
    method: "GET",
  });
  return response;
}
export async function getCategoryDetails(
  restaurantId: string
): Promise<SuccessResult<SignInResponseData> | ErrorResult> {
  const response = await request({
    url: `/category/get-category/${restaurantId}`,
    method: "GET",
    // data: payload,
  });
  return response;
}

export async function createProduct(
  productId: string
): Promise<SuccessResult<SignInResponseData> | ErrorResult> {
  const response = await request({
    url: `/product/${productId}/create-product`,
    method: "POST",
    // data: payload,
  });
  return response;
}

// export async function getAllProducts(): Promise<
//   SuccessResult<ProductApiResponse> | ErrorResult
// > {
//   const response = await request({
//     url: `/product/get-all-products`,
//     method: "GET",
//   });
//   return response;
// }
export async function getProductDetails(
  productId: string
): Promise<SuccessResult<SignInResponseData> | ErrorResult> {
  const response = await request({
    url: `/product/get-product/${productId}`,
    method: "GET",
    // data: payload,
  });
  return response;
}
export async function updateCategoryApi(
  categoryId: string,
  data: any
): Promise<SuccessResult<any> | ErrorResult> {
  const response = await request({
    url: `/category/update-category/${categoryId}`,
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
  return response;
}
export async function updateProductApi(
  productId: string,
  data: any
): Promise<SuccessResult<any> | ErrorResult> {
  const response = await request({
    url: `/product/update-product/${productId}`,
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
  return response;
}
export async function deleteCategoryApi(
  categoryId: string
): Promise<SuccessResult<SignInResponseData> | ErrorResult> {
  const response = await request({
    url: `/category/delete-category/${categoryId}`,
    method: "DELETE",
  });
  return response;
}
export async function deleteProductApi(
  productId: string
): Promise<SuccessResult<SignInResponseData> | ErrorResult> {
  const response = await request({
    url: `/product/delete-product/${productId}`,
    method: "DELETE",
  });
  return response;
}
