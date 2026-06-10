import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import urlcat from "urlcat";
// import Router from "next/router";
// import { protectedRoute, unprotectedRoutes } from "@/constants";
import { SERVER_URL_BASE_URL } from "@/constants";
import { ErrorResult, SuccessResult } from "./types/basic";

export function exists(json: any, key: string) {
  return json[key] !== undefined;
}

function createAxiosInstance(baseUrl: string) {
  return axios.create({
    baseURL: urlcat(baseUrl, "/api"),
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function request(
  config: AxiosRequestConfig
): Promise<SuccessResult<any> | ErrorResult> {
  const baseUrl = SERVER_URL_BASE_URL || "";
  const axiosInstance = createAxiosInstance(baseUrl);

  axiosInstance.interceptors.request.use(
    async (config) => {
      const token = tokenStore.getRequestHeaderToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      if (!config.headers["Content-Type"]) {
        config.headers["Content-Type"] = "application/json";
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async function (error) {
      const originalRequest = error.config;
      const currentRoute =
        typeof window !== "undefined" ? window.location.pathname : "";

      if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        console.log("api/account/refresh-token");
      }
      if (error?.response?.status === 403) {
        Cookies.remove("token");
        // Cookies.remove(SSO_TOKEN_NAME || "");
      }
      return Promise.reject(error);
    }
  );

  try {
    const response = await axiosInstance.request({ ...config });
    // The backend emits a JSON-encoded "Pagination" header on PagedList
    // endpoints. CORS exposes it (see ApplicationServiceExtensions.cs).
    // Parse it here so callers don't each have to.
    let pagination;
    const raw =
      (response.headers as any)?.pagination ??
      (response.headers as any)?.Pagination;
    if (typeof raw === "string" && raw.length > 0) {
      try {
        pagination = JSON.parse(raw);
      } catch {
        // Header malformed — ignore rather than blow up the request.
      }
    }
    return {
      remote: "success",
      data: response.data,
      status: response.status,
      ...(pagination ? { pagination } : {}),
    };
  } catch (error: any) {
    if (error.response) {
      const axiosError = error as AxiosError | any;
      return {
        remote: "failure",
        errors: {
          status: axiosError.response?.status,
          errors: {
            message:
              axiosError.response?.data.message ||
              "An unexpected error occurred",
            data: axiosError.response?.data?.data || null,
            is_verified: axiosError.response?.data?.is_verified,
          },
        },
      };
    }
    throw error;
  }
}

class TokenStore {
  nativeToken: null | string = null;
  getRequestHeaderToken = () => Cookies.get("token");
  getRefreshToken = () => Cookies.get("token");
}

export const tokenStore = new TokenStore();

export function BaseAPI() {
  throw new Error("Function not implemented.");
}
