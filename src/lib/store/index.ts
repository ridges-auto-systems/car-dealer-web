// lib/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import leadReducer from "./slices/leadSlice";
import authReducer from "./slices/auth.slice";
import vehicleReducer from "./slices/vehicle.slice";
import userReducer from "./slices/user.slice";

export const store = configureStore({
  reducer: {
    leads: leadReducer,
    auth: authReducer,
    vehicles: vehicleReducer,
    users: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
