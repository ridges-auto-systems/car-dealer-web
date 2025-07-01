// lib/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import leadReducer from "./slices/leadSlice";

export const store = configureStore({
  reducer: {
    leads: leadReducer,
    // Add other reducers here as we create them
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
