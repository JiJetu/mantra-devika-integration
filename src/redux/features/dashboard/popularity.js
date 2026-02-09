import { baseApi } from "../../api/base.api";

export const popularityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductPopularity: builder.query({
      query: () => ({
        url: "/dashboard/product-popularity/list/",
        method: "GET",
      }),
      providesTags: ["ProductPopularity"],
    }),
    searchProductPopularity: builder.query({
      query: ({ q = "" } = {}) => {
        const params = new URLSearchParams();
        if (q) params.set("q", String(q));
        return {
          url: `/dashboard/product-popularity/search/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["ProductPopularity"],
    }),
  }),
});

export const { useGetProductPopularityQuery, useSearchProductPopularityQuery } = popularityApi;
