import { baseApi } from "../../api/base.api";

export const policiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTermsPolicy: builder.query({
      query: () => ({
        url: "/dashboard/policies/terms-condition/",
        method: "GET",
      }),
      providesTags: ["Policies"],
    }),
    upsertTermsPolicy: builder.mutation({
      query: (policy) => ({
        url: "/dashboard/policies/terms-condition/upsert/",
        method: "POST",
        body: { policy },
      }),
      invalidatesTags: ["Policies"],
    }),

    getPrivacyPolicy: builder.query({
      query: () => ({
        url: "/dashboard/policies/privacy-policy/",
        method: "GET",
      }),
      providesTags: ["Policies"],
    }),
    upsertPrivacyPolicy: builder.mutation({
      query: (policy) => ({
        url: "/dashboard/policies/privacy-policy/upsert/",
        method: "POST",
        body: { policy },
      }),
      invalidatesTags: ["Policies"],
    }),

    getShippingPolicy: builder.query({
      query: () => ({
        url: "/dashboard/policies/shipping-policy/",
        method: "GET",
      }),
      providesTags: ["Policies"],
    }),
    upsertShippingPolicy: builder.mutation({
      query: (policy) => ({
        url: "/dashboard/policies/shipping-policy/upsert/",
        method: "POST",
        body: { policy },
      }),
      invalidatesTags: ["Policies"],
    }),

    getRefundPolicy: builder.query({
      query: () => ({
        url: "/dashboard/policies/refund-policy/",
        method: "GET",
      }),
      providesTags: ["Policies"],
    }),
    upsertRefundPolicy: builder.mutation({
      query: (policy) => ({
        url: "/dashboard/policies/refund-policy/upsert/",
        method: "POST",
        body: { policy },
      }),
      invalidatesTags: ["Policies"],
    }),
  }),
});

export const {
  useGetTermsPolicyQuery,
  useUpsertTermsPolicyMutation,
  useGetPrivacyPolicyQuery,
  useUpsertPrivacyPolicyMutation,
  useGetShippingPolicyQuery,
  useUpsertShippingPolicyMutation,
  useGetRefundPolicyQuery,
  useUpsertRefundPolicyMutation,
} = policiesApi;
