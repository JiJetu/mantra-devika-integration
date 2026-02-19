import { baseApi } from "../../api/base.api";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomersList: builder.query({
      query: ({ page = 1, page_size = 10 } = {}) => ({
        url: "/dashboard/customer-management/users/list/",
        method: "GET",
        params: { page, page_size },
      }),
      providesTags: ["Customers"],
    }),

    searchCustomers: builder.query({
      query: ({ q = "", page = 1, page_size = 10 } = {}) => ({
        url: "/dashboard/customer-management/users/search/",
        method: "GET",
        params: { q, page, page_size },
      }),
      providesTags: ["Customers"],
    }),

    getCustomerProfile: builder.query({
      query: (userId) => ({
        url: `/dashboard/customer-management/users/${userId}/profile/`,
        method: "GET",
      }),
      providesTags: ["CustomerProfile"],
    }),

    suspendUser: builder.mutation({
      query: (userId) => ({
        url: `/dashboard/customer-management/users/${userId}/suspend/`,
        method: "PATCH",
        body: {},
      }),
      invalidatesTags: ["Customers", "CustomerProfile"],
    }),

    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/dashboard/customer-management/users/${userId}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers", "CustomerProfile"],
    }),
  }),
});

export const {
  useGetCustomersListQuery,
  useSearchCustomersQuery,
  useGetCustomerProfileQuery,
  useSuspendUserMutation,
  useDeleteUserMutation,
} = customerApi;
