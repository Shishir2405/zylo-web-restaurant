// `node` is intentionally excluded from tsconfig `types` (it'd pull in
// every Node global into client bundles), so declare just the env slice
// we actually read here. Next.js inlines NEXT_PUBLIC_* at build time.
declare const process: { env: { NEXT_PUBLIC_SERVER_URL_BASE_URL?: string } };

// // sso
// export const SSO_URL_BACKEND_BASE_URL = process.env.NEXT_PUBLIC_SSO_BACKEND_BASE_URL
// export const SSO_URL_WITH_POSTFIX = `${SSO_URL_BACKEND_BASE_URL}/api`
// export const SSO_FRONTEND_BASE_URL = process.env.NEXT_PUBLIC_SSO_FRONTEND_BASE_URL

// // backend
// NOTE: keep this as the bare host (no trailing /api). api/index.ts does
// urlcat(baseUrl, "/api"); adding "/api" here would produce ".../api/api/..."
// and every request would 404.
export const SERVER_URL_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL_BASE_URL ||
  "https://zylo-backend-f0rw.onrender.com";
// export const GET_TOKEN_URL = process.env.NEXT_PUBLIC_GET_TOKEN_URL

// // eu-tools
// export const FRONTEND_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL
// export const BASE_URL_WITH_POSTFIX = `${SERVER_URL_BASE_URL}/api`
// export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL

// // others
// export const LOGIN_REDIRECT_URL = process.env.NEXT_PUBLIC_LOGIN_REDIRECT
// export const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID
// export const SSO_UN_AUTHORIZED_REDIRECT = process.env.NEXT_PUBLIC_SS0_UN_AUTHORIZED_REDIRECT
// export const DEV = process.env.NODE_ENV === "development"
// export const TOOLS_TOKEN_NAME = process.env.NEXT_PUBLIC_TOOLS_TOKEN_NAME
