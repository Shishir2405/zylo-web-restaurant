import { User } from "@/redux/reducers/user";
import { request } from ".";
import { ErrorResult, SuccessResult } from "./types/basic";
import { SignInPayload, SignInResponseData } from "./types/user";

export async function loginApi(
  payload: SignInPayload
): Promise<SuccessResult<SignInResponseData> | ErrorResult> {
  const response = await request({
    url: `/restaurant/login-restaurant`,
    method: "POST",
    data: payload,
  });
  return response;
}
export async function signUpApi(
  payload: SignInPayload
): Promise<SuccessResult<SignInResponseData> | ErrorResult> {
  const response = await request({
    url: `/restaurant/register`,
    method: "POST",
    data: payload,
  });
  return response;
}

export async function getUserRestaurantDetailApi(): Promise<
  SuccessResult<User> | ErrorResult
> {
  const response = await request({
    url: `/restaurant/get-user-restaurant`,
    method: "GET",
  });
  return response;
}
export async function getUserDetailsApi(): Promise<
  SuccessResult<User> | ErrorResult
> {
  const response = await request({
    url: `/user/get-user`,
    method: "GET",
  });
  return response;
}
export async function updateUserProfileApi(
  data: any
): Promise<SuccessResult<SignInResponseData> | ErrorResult> {
  const response = await request({
    url: `/user/update-user`,
    method: "PUT",
    data: data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}
