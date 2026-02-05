import storage from "redux-persist/lib/storage";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/auth/auth.slice";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import { baseApi } from "./api/base.api";

// encryption transform for redux-persist
const encryptor = encryptTransform({
  secretKey: import.meta.env.VITE_REDUX_PERSIST_SECRET,
  onError: (error) => {
    console.error("Redux Persist Encryption Error:", error);
  },
});

// persist config for auth slice
const authPersistConfig = {
  key: "auth",
  storage,
  transforms: [encryptor],
  whitelist: ["accessToken", "refreshToken"], // persist only required fields
};

const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authReducer
);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
