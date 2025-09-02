// lib/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import userReducer from "./slices/user.slice";
import leadReducer from "./slices/leadSlice";
import authReducer from "./slices/auth.slice";
import vehicleReducer from "./slices/vehicle.slice";
import dashboardReducer from "./slices/dashboard.slice";
import { dashboardApi } from "../services/dashboard.service";
import salesReducer from "./slices/sales.slice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    leads: leadReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    vehicles: vehicleReducer,
    sales: salesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore RTK Query actions
          "persist/PERSIST",
          "persist/REHYDRATE",
        ],
        ignoredActionPaths: [
          "meta.arg",
          "payload.timestamp",
          // Ignore RTK Query paths
          "meta.baseQueryMeta.request",
          "meta.baseQueryMeta.response",
        ],
        ignoredPaths: [
          // Ignore RTK Query paths in state
          `${dashboardApi.reducerPath}.queries`,
          `${dashboardApi.reducerPath}.mutations`,
        ],
      },
    }).concat(dashboardApi.middleware), // Add this line
  devTools: process.env.NODE_ENV !== "production",
});

// Optional: Setup RTK Query listeners for refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
