import { baseApi } from "../../api/base.api";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductStats: builder.query({
      query: () => ({
        url: "/dashboard/product-management/stats/",
        method: "GET",
      }),
      providesTags: ["ProductStats"],
    }),

    listProducts: builder.query({
      query: ({ page = 1, page_size = 10, q } = {}) => ({
        url: "/dashboard/product-management/list_products/",
        method: "GET",
        params: q ? { page, page_size, q } : { page, page_size },
      }),
      providesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `/dashboard/product-management/products/${productId}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "ProductStats"],
    }),
  }),
});

export const {
  useGetProductStatsQuery,
  useListProductsQuery,
  useDeleteProductMutation,
} = productApi;
