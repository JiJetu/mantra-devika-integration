import { baseApi } from "../../api/base.api";

export const socialMediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listSocialLinks: builder.query({
      query: () => ({
        url: "/dashboard/social-media/admin-list/",
        method: "GET",
      }),
      providesTags: ["SocialMedia"],
    }),
    createSocialLink: builder.mutation({
      query: (body) => ({
        url: "/dashboard/social-media/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SocialMedia"],
    }),
    editSocialLink: builder.mutation({
      query: ({ id, body }) => ({
        url: `/dashboard/social-media/${id}/edit/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["SocialMedia"],
    }),
    deleteSocialLink: builder.mutation({
      query: (id) => ({
        url: `/dashboard/social-media/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["SocialMedia"],
    }),
  }),
});

export const {
  useListSocialLinksQuery,
  useCreateSocialLinkMutation,
  useEditSocialLinkMutation,
  useDeleteSocialLinkMutation,
} = socialMediaApi;

