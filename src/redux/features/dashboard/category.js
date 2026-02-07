import { baseApi } from "../../api/base.api";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCategories: builder.query({
      query: () => ({
        url: "/dashboard/category-management/categories/list/",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),
    editCategory: builder.mutation({
      query: ({ categoryId, body }) => ({
        url: `/dashboard/category-management/categories/${categoryId}/edit/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/dashboard/category-management/categories/${categoryId}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
    createCategory: builder.mutation({
      query: (body) => ({
        url: "/dashboard/category-management/categories/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useListCategoriesQuery,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
  useCreateCategoryMutation,
} = categoryApi;
