import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/auth/auth.slice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithExpiryGuard = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(logout());
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithExpiryGuard,
  tagTypes: [
    "AdminUser",
    "DashboardStats",
    "SalesTrends",
    "OrderStatus",
    "MostVisitedPages",
    "ProductEngagementInsights",
    "Customers",
    "CustomerProfile",
    "Products",
    "ProductStats",
  ],
  endpoints: () => ({}),
});
