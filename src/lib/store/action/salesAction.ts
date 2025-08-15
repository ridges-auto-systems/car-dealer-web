// lib/store/actions/salesActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SalesService } from "../../services/sales.service";

export const fetchSalesRepData = createAsyncThunk(
  "sales/fetchRepData",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await SalesService.getRepDashboardData(userId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const refreshSalesData = createAsyncThunk(
  "sales/refreshData",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await SalesService.getRepDashboardData(userId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
