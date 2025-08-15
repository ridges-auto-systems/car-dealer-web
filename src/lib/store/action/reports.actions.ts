import { createAsyncThunk } from "@reduxjs/toolkit";
import { reportService } from "../../services/report.service";
import { DateRange } from "../../types/report.type";

export const fetchSalesReport = createAsyncThunk(
  "reports/fetchSales",
  async (dateRange: DateRange) => {
    return await reportService.fetchSalesReport(dateRange);
  }
);

export const fetchInventoryReport = createAsyncThunk(
  "reports/fetchInventory",
  async (dateRange: DateRange) => {
    return await reportService.fetchInventoryReport(dateRange);
  }
);

export const fetchLeadConversionReport = createAsyncThunk(
  "reports/fetchLeadConversion",
  async (dateRange: DateRange) => {
    return await reportService.fetchLeadConversionReport(dateRange);
  }
);

export const exportReport = createAsyncThunk(
  "reports/export",
  async ({
    reportType,
    dateRange,
  }: {
    reportType: string;
    dateRange: DateRange;
  }) => {
    return await reportService.exportReport(reportType, dateRange);
  }
);
