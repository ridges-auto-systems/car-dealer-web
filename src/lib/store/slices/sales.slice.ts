import { createSlice } from "@reduxjs/toolkit";
import { fetchSalesRepData, refreshSalesData, SalesActionData } from "../action/salesAction";

interface SalesState {
  stats: any | null;
  salesData: any[];
  activities: any[];
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SalesState = {
  stats: null,
  salesData: [],
  activities: [],
  lastUpdated: null,
  isLoading: false,
  error: null,
};

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSalesData: (state) => {
      state.stats = null;
      state.salesData = [];
      state.activities = [];
      state.lastUpdated = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sales Rep Data
      .addCase(fetchSalesRepData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSalesRepData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.salesData = action.payload.salesData;
        state.activities = action.payload.activities;
        state.lastUpdated = action.payload.lastUpdated;
        state.error = null;
      })
      .addCase(fetchSalesRepData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch sales data';
      })
      
      // Refresh Sales Data
      .addCase(refreshSalesData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshSalesData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.salesData = action.payload.salesData;
        state.activities = action.payload.activities;
        state.lastUpdated = action.payload.lastUpdated;
        state.error = null;
      })
      .addCase(refreshSalesData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to refresh sales data';
      });
  },
});

export const { clearError, clearSalesData } = salesSlice.actions;
export default salesSlice.reducer;