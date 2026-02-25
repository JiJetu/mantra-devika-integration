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
      query: ({ page = 1, page_size = 10, q, category_id, stock_status } = {}) => ({
        url: "/dashboard/product-management/list_products/",
        method: "GET",
        params: {
          ...(q ? { q } : {}),
          ...(category_id ? { category_id } : {}),
          ...(stock_status ? { stock_status } : {}),
          page,
          page_size,
        },
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
    createProduct: builder.mutation({
      query: (body) => ({
        url: "/dashboard/product-management/products/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products", "ProductStats"],
    }),
    editProduct: builder.mutation({
      query: ({ productId, body }) => ({
        url: `/dashboard/product-management/products/${productId}/update/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Products", "ProductStats"],
    }),

    // Search and filter products (admin)
    searchProducts: builder.query({
      query: ({ q, category_id, stock_status, page = 1, page_size = 10 } = {}) => ({
        url: "/dashboard/product-management/products/search/",
        method: "GET",
        params: {
          ...(q ? { q } : {}),
          ...(category_id ? { category_id } : {}),
          ...(stock_status ? { stock_status } : {}),
          page,
          page_size,
        },
      }),
      providesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductStatsQuery,
  useListProductsQuery,
  useSearchProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
  useEditProductMutation,
} = productApi;
