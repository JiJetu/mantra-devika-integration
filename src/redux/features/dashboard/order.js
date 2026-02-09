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
    filterOrders: builder.query({
      query: ({ page = 1, page_size = 10, status } = {}) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("page_size", String(page_size));
        if (status) params.set("status", String(status));
        return {
          url: `/dashboard/order-management/orders/filter/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Orders"],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/dashboard/order-management/orders/${orderId}/status/`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
    updateRefundStatus: builder.mutation({
      query: ({ refundId, status }) => ({
        url: `/dashboard/order-management/refunds/${refundId}/status/`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useListOrdersQuery,
  useSearchOrdersQuery,
  useFilterOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdateRefundStatusMutation,
} = orderApi;
