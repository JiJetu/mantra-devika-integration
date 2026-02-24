import { baseApi } from "../../api/base.api";

export const promotionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listBanners: builder.query({
      query: () => ({
        url: "/dashboard/banner-management/banners/admin-list/",
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

    // Heading announcements
    listHeadings: builder.query({
      query: () => ({
        url: "/dashboard/announcement-management/heading/admin-list/",
        method: "GET",
      }),
      providesTags: ["Announcements"],
    }),
    createHeading: builder.mutation({
      query: (body) => ({
        url: "/dashboard/announcement-management/heading/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Announcements"],
    }),
    editHeading: builder.mutation({
      query: ({ announcementId, body }) => ({
        url: `/dashboard/announcement-management/heading/${announcementId}/edit/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Announcements"],
    }),
    deleteHeading: builder.mutation({
      query: (announcementId) => ({
        url: `/dashboard/announcement-management/heading/${announcementId}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Announcements"],
    }),

    // Pop-up announcements
    listPopups: builder.query({
      query: () => ({
        url: "/dashboard/announcement-management/popup/admin-list/",
        method: "GET",
      }),
      providesTags: ["Announcements"],
    }),
    createPopup: builder.mutation({
      query: (body) => ({
        url: "/dashboard/announcement-management/popup/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Announcements"],
    }),
    editPopup: builder.mutation({
      query: ({ announcementId, body }) => ({
        url: `/dashboard/announcement-management/popup/${announcementId}/edit/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Announcements"],
    }),
    deletePopup: builder.mutation({
      query: (announcementId) => ({
        url: `/dashboard/announcement-management/popup/${announcementId}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Announcements"],
    }),

    // Coupons (Promo Codes)
    listCoupons: builder.query({
      query: ({ page = 1, page_size = 10 } = {}) => ({
        url: `/dashboard/coupon-management/coupons/list/?page=${page}&page_size=${page_size}`,
        method: "GET",
      }),
      providesTags: ["Coupons"],
    }),
    createCoupon: builder.mutation({
      query: (body) => ({
        url: "/dashboard/coupon-management/coupons/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Coupons"],
    }),
    editCoupon: builder.mutation({
      query: ({ couponId, body }) => ({
        url: `/dashboard/coupon-management/coupons/${couponId}/edit/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Coupons"],
    }),
    deleteCoupon: builder.mutation({
      query: (couponId) => ({
        url: `/dashboard/coupon-management/coupons/${couponId}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupons"],
    }),
  }),
});

export const {
  useListBannersQuery,
  useCreateBannerMutation,
  useEditBannerMutation,
  useDeleteBannerMutation,
  useListHeadingsQuery,
  useCreateHeadingMutation,
  useEditHeadingMutation,
  useDeleteHeadingMutation,
  useListPopupsQuery,
  useCreatePopupMutation,
  useEditPopupMutation,
  useDeletePopupMutation,
  useListCouponsQuery,
  useCreateCouponMutation,
  useEditCouponMutation,
  useDeleteCouponMutation,
} = promotionApi;
