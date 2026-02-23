import { baseApi } from "../../api/base.api";

export const promotionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listBanners: builder.query({
      query: () => ({
        url: "/dashboard/banner-management/banners/list/",
        method: "GET",
      }),
      providesTags: ["Banners"],
    }),
    createBanner: builder.mutation({
      query: (body) => ({
        url: "/dashboard/banner-management/banners/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Banners"],
    }),
    editBanner: builder.mutation({
      query: ({ bannerId, body }) => ({
        url: `/dashboard/banner-management/banners/${bannerId}/edit/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Banners"],
    }),
    deleteBanner: builder.mutation({
      query: (bannerId) => ({
        url: `/dashboard/banner-management/banners/${bannerId}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banners"],
    }),
  }),
});

export const {
  useListBannersQuery,
  useCreateBannerMutation,
  useEditBannerMutation,
  useDeleteBannerMutation,
} = promotionApi;
