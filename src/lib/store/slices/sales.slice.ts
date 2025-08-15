// lib/store/slices/salesSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchSalesRepData, refreshSalesData } from "../action/salesAction";

const initialState = {
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
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      })
      .addCase(fetchSalesRepData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(refreshSalesData.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
        state.salesData = action.payload.salesData;
        state.activities = action.payload.activities;
        state.lastUpdated = action.payload.lastUpdated;
      });
  },
});

export default salesSlice.reducer;
