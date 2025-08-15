import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSalesReport,
  fetchInventoryReport,
  fetchLeadConversionReport,
  exportReport,
} from "../action/reports.actions";

interface ReportState {
  sales: any;
  inventory: any;
  leads: any;
  loading: boolean;
  error: string | null;
  exporting: boolean;
}

const initialState: ReportState = {
  sales: null,
  inventory: null,
  leads: null,
  loading: false,
  error: null,
  exporting: false,
};

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.sales = action.payload;
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load sales report";
      })

      .addCase(fetchInventoryReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventoryReport.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory = action.payload;
      })
      .addCase(fetchInventoryReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load inventory report";
      })

      .addCase(fetchLeadConversionReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeadConversionReport.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(fetchLeadConversionReport.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to load lead conversion report";
      })

      .addCase(exportReport.pending, (state) => {
        state.exporting = true;
      })
      .addCase(exportReport.fulfilled, (state) => {
        state.exporting = false;
      })
      .addCase(exportReport.rejected, (state, action) => {
        state.exporting = false;
        state.error = action.error.message || "Failed to export report";
      });
  },
});

export const { clearError } = reportSlice.actions;
export default reportSlice.reducer;
