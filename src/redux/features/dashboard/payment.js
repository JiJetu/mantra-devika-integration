import { baseApi } from "../../api/base.api";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentSummary: builder.query({
      query: () => ({
        url: "/dashboard/payment-management/summary/",
        method: "GET",
      }),
      providesTags: ["Payments"],
    }),
    listPayments: builder.query({
      query: ({ page = 1, page_size = 10 } = {}) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("page_size", String(page_size));
        return {
          url: `/dashboard/payment-management/payments/list/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Payments"],
    }),
    searchPayments: builder.query({
      query: ({ q = "", page = 1, page_size = 10 } = {}) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("page_size", String(page_size));
        if (q) params.set("q", String(q));
        return {
          url: `/dashboard/payment-management/payments/search/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Payments"],
    }),
    filterPayments: builder.query({
      query: ({ status, page = 1, page_size = 10 } = {}) => {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("page_size", String(page_size));
        if (status) params.set("status", String(status));
        return {
          url: `/dashboard/payment-management/payments/filter/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Payments"],
    }),
  }),
});

export const {
  useGetPaymentSummaryQuery,
  useListPaymentsQuery,
  useSearchPaymentsQuery,
  useFilterPaymentsQuery,
} = paymentApi;
