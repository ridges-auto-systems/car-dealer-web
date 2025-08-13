import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DashboardApiResponse } from "../types/dashboard";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export interface DashboardQueryParams {
  timeframe?: string; // '7', '30', '90', '365'
  period?: "daily" | "weekly" | "monthly";
  months?: number;
  limit?: number;
}

// RTK Query API
export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/dashboard`,
    prepareHeaders: (headers, { getState }) => {
      // Add auth token if available
      const token = (getState() as any)?.auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["DashboardStats", "SalesPerformance", "RecentActivity"],
  endpoints: (builder) => ({
    // Get dashboard statistics
    getDashboardStats: builder.query<
      DashboardApiResponse,
      DashboardQueryParams
    >({
      query: (params = { timeframe: "30" }) => ({
        url: "/stats",
        params: {
          timeframe: params.timeframe || "30",
        },
      }),
      providesTags: ["DashboardStats"],
      // Cache for 5 minutes
      keepUnusedDataFor: 300,
    }),

    // Get sales performance data
    getSalesPerformance: builder.query<any, DashboardQueryParams>({
      query: (params = { period: "monthly" }) => ({
        url: "/sales-performance",
        params: {
          period: params.period || "monthly",
          months: params.months || 6,
        },
      }),
      providesTags: ["SalesPerformance"],
      keepUnusedDataFor: 300,
    }),

    // Get recent activity
    getRecentActivity: builder.query<any, { limit?: number }>({
      query: (params = {}) => ({
        url: "/recent-activity",
        params: {
          limit: params.limit || 10,
        },
      }),
      providesTags: ["RecentActivity"],
      keepUnusedDataFor: 60, // Refresh more frequently
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetSalesPerformanceQuery,
  useGetRecentActivityQuery,
  useLazyGetDashboardStatsQuery,
  useLazyGetSalesPerformanceQuery,
  useLazyGetRecentActivityQuery,
} = dashboardApi;
