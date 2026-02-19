import { baseApi } from "../../api/base.api";

export const colorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listColors: builder.query({
      query: () => ({
        url: "/dashboard/product-management/colors/list/",
        method: "GET",
      }),
      providesTags: ["Colors"],
    }),
    createColor: builder.mutation({
      query: (body) => ({
        url: "/dashboard/product-management/colors/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Colors"],
    }),
    deleteColor: builder.mutation({
      query: (colorId) => ({
        url: `/dashboard/product-management/colors/${colorId}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Colors"],
    }),
  }),
});

export const {
  useListColorsQuery,
  useCreateColorMutation,
  useDeleteColorMutation,
} = colorApi;
