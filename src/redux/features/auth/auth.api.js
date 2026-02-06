import { baseApi } from "../../api/base.api";
import { logout, setTokens } from "./auth.slice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/dashboard/admin-login/",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setTokens(data));
        } catch {
          dispatch(logout());
        }
      },
    }),

    // Forgot password: send OTP
    // sendOtp: builder.mutation({
    //   query: ({ email }) => ({
    //     url: "/auth/forget_passord",
    //     method: "POST",
    //     body: { email },
    //   }),
    // }),

    // Verify OTP
    // verifyOtp: builder.mutation({
    //   query: ({ email, otp }) => ({
    //     url: "/auth/veryfy_otp/",
    //     method: "POST",
    //     body: { email, otp },
    //   }),
    // }),

    // Reset password
    // resetPassword: builder.mutation({
    //   query: ({ email, reset_token, password, retype_password }) => ({
    //     url: "/auth/reset_password/",
    //     method: "POST",
    //     body: { email, reset_token, password, retype_password },
    //   }),
    // }),
  }),
});

export const { useLoginMutation } = authApi;
