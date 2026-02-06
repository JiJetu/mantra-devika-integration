import { baseApi } from "../../api/base.api";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminUser: builder.query({
      query: () => ({
        url: "/dashboard/admin-user/",
        method: "GET",
      }),
      providesTags: ["AdminUser"],
    }),
    getDashboardStats: builder.query({
      query: () => ({
        url: "/dashboard/dashboard-stats/",
        method: "GET",
      }),
      providesTags: ["DashboardStats"],
    }),

    getSalesTrends: builder.query({
      query: () => ({
        url: "/dashboard/sales-trends/",
        method: "GET",
      }),
      providesTags: ["SalesTrends"],
    }),

    getOrderStatus: builder.query({
      query: () => ({
        url: "/dashboard/order_by_status/",
        method: "GET",
      }),
      providesTags: ["OrderStatus"],
    }),

    getMostVisitedPages: builder.query({
      query: () => ({
        url: "/dashboard/most-visited-pages/",
        method: "GET",
      }),
      providesTags: ["MostVisitedPages"],
    }),

    getProductEngagementInsights: builder.query({
      query: () => ({
        url: "/dashboard/product-engagement-insights/",
        method: "GET",
      }),
      providesTags: ["ProductEngagementInsights"],
    }),
  }),
});

export const {
  useGetAdminUserQuery,
  useGetDashboardStatsQuery,
  useGetSalesTrendsQuery,
  useGetOrderStatusQuery,
  useGetMostVisitedPagesQuery,
  useGetProductEngagementInsightsQuery,
} = dashboardApi;
