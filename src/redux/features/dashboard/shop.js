import { baseApi } from "../../api/base.api";

export const shopApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShopStatus: builder.query({
      query: () => ({
        url: "/dashboard/shop-control/status/",
        method: "POST",
      }),
    }),
    openShop: builder.mutation({
      query: (body = { is_open: true }) => ({
        url: "/dashboard/shop-control/open/",
        method: "POST",
        body: body ?? { is_open: true },
      }),
      invalidatesTags: [],
    }),
    closeShop: builder.mutation({
      query: (body = { is_open: false }) => ({
        url: "/dashboard/shop-control/close/",
        method: "POST",
        body: body ?? { is_open: false },
      }),
      invalidatesTags: [],
    }),
    setShopStatus: builder.mutation({
      query: ({ is_open }) => ({
        url: "/dashboard/shop-control/status/",
        method: "POST",
        body: { is_open },
      }),
      invalidatesTags: [],
    }),
  }),
});

export const {
  useGetShopStatusQuery,
  useOpenShopMutation,
  useCloseShopMutation,
  useSetShopStatusMutation,
} = shopApi;

