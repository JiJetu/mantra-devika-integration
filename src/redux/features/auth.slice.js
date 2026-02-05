import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setTokens, logout } = authSlice.actions;
export default authSlice.reducer;
