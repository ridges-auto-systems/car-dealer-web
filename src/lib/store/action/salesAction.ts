import { createAsyncThunk } from "@reduxjs/toolkit";
import { salesService } from "../../services/sales.service";
import { DateRange, SalesDashboardData } from "../../types/sales.type";

// Action payload interface
export interface SalesActionData {
  stats: any;
  salesData: any[];
  activities: any[];
  lastUpdated: string;
}

export const fetchSalesRepData = createAsyncThunk<
  SalesActionData,
  { userId: string; dateRange?: DateRange },
  { rejectValue: string }
>(
  "sales/fetchRepData",
  async ({ userId, dateRange }, { rejectWithValue }) => {
    try {
      // Service returns SalesDashboardData directly (not wrapped in { data: ... })
      const dashboardData: SalesDashboardData = dateRange 
        ? await salesService.fetchSalesRepDashboard(userId, dateRange)
        : await salesService.fetchSalesRepDashboard(userId, {
            from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            to: new Date()
          });
      
      return {
        stats: dashboardData.stats || null,
        salesData: dashboardData.salesData || [],
        activities: dashboardData.activities || [],
        lastUpdated: new Date().toISOString(),
      };
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to fetch sales data';
      return rejectWithValue(errorMessage);
    }
  }
);

export const refreshSalesData = createAsyncThunk<
  SalesActionData,
  { userId: string; dateRange?: DateRange },
  { rejectValue: string }
>(
  "sales/refreshData",
  async ({ userId, dateRange }, { rejectWithValue }) => {
    try {
      // Service returns SalesDashboardData directly (not wrapped in { data: ... })
      const dashboardData: SalesDashboardData = dateRange 
        ? await salesService.refreshSalesData(userId, dateRange)
        : await salesService.refreshSalesData(userId, {
            from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            to: new Date()
          });
      
      return {
        stats: dashboardData.stats || null,
        salesData: dashboardData.salesData || [],
        activities: dashboardData.activities || [],
        lastUpdated: new Date().toISOString(),
      };
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to refresh sales data';
      return rejectWithValue(errorMessage);
    }
  }
);