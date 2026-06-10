import { request } from ".";
import { ErrorResult, SuccessResult } from "./types/basic";
import { IOrderStatus } from "./types/orders";
import { SignInResponseData } from "./types/user";

export type OrderPageParams = {
  pageNumber?: number;
  pageSize?: number;
};

export async function getOrderList(
  restaurantId: string,
  params: OrderPageParams = {},
): Promise<SuccessResult<SignInResponseData> | ErrorResult> {
  const response = await request({
    url: `/order/${restaurantId}/get-restaurant-orders`,
    method: "GET",
    params: {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
    },
  });
  return response;
}
export async function getNewOrdersList(
  restaurantId: string,
  params: OrderPageParams = {},
): Promise<SuccessResult<any> | ErrorResult> {
  const response = await request({
    url: `/order/${restaurantId}/get-new-orders`,
    method: "GET",
    params: {
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
    },
  });
  return response;
}
export async function getOrderDetails(
  orderId: string
): Promise<SuccessResult<any> | ErrorResult> {
  const response = await request({
    url: `/order/get-order-details/${orderId}`,
    method: "GET",
  });
  return response;
}
export async function getOrderDelivery(
  orderId: string
): Promise<SuccessResult<any> | ErrorResult> {
  const response = await request({
    url: `/order/${orderId}/delivery`,
    method: "GET",
  });
  return response;
}

export async function updateOrderStatus(
  orderId: string,
  data: {
    status: IOrderStatus;
  }
): Promise<SuccessResult<any> | ErrorResult> {
  const response = await request({
    url: `/order/update-order-status/${orderId}`,
    method: "PATCH",
    data,
  });
  return response;
}
