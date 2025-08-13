import { DashboardQueryParams } from "@/lib/services/dashboard.service";
import {
  Activity,
  DashboardState,
  DashboardStats,
  SalesDataPoint,
} from "@/lib/types/dashboard";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

// Replace with your actual API base URL or import from config
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// Async thunks for fallback API calls (if not using RTK Query)
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchData",
  async (params: DashboardQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/dashboard/stats?timeframe=${params.timeframe || "30"}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState: DashboardState = {
  stats: null,
  salesData: [],
  activities: [],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setStats: (state, action: PayloadAction<DashboardStats>) => {
      state.stats = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    setSalesData: (state, action: PayloadAction<SalesDataPoint[]>) => {
      state.salesData = action.payload;
    },
    setActivities: (state, action: PayloadAction<Activity[]>) => {
      state.activities = action.payload;
    },
    refreshData: (state) => {
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data } = action.payload;

        // Transform API response to match component interface
        state.stats = {
          totalSales: data.summary.totalSales,
          newLeads: data.summary.newLeads,
          inventoryCount: data.summary.inventory.total,
          revenue: data.summary.revenue.total,
          conversionRate: parseFloat(
            data.metrics.conversionRate.replace("%", "")
          ),
          avgLeadTime: parseInt(
            data.metrics.averageLeadTime.replace(" days", "")
          ),
          topSellingModel: data.metrics.topSelling,
        };

        state.salesData = data.salesData || [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setStats,
  setSalesData,
  setActivities,
  refreshData,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
