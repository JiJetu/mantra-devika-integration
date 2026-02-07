import { baseApi } from "../../api/base.api";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listOrders: builder.query({
      query: ({ page = 1, page_size = 10, q, status } = {}) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("page_size", String(page_size));
        if (q) params.set("q", String(q));
        if (status) params.set("status", String(status));
        return {
          url: `/dashboard/order-management/orders/list/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Orders"],
    }),
    searchOrders: builder.query({
      query: ({ page = 1, page_size = 10, q } = {}) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("page_size", String(page_size));
        if (q) params.set("q", String(q));
        return {
          url: `/dashboard/order-management/orders/search/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Orders"],
    }),
  }),
});

export const { useListOrdersQuery, useSearchOrdersQuery } = orderApi;
