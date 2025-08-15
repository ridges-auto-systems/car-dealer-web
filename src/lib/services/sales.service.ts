// src/services/sales.service.ts
import { DateRange, SalesDashboardData } from "../types/sales.type";

const API_BASE_URL = "http://localhost:5000/api";

export const salesService = {
  async fetchSalesRepDashboard(
    userId: string,
    dateRange: DateRange
  ): Promise<SalesDashboardData> {
    if (!userId) {
      throw new Error("userId is required");
    }
    const params = new URLSearchParams({
      userId,
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    });

    const res = await fetch(`${API_BASE_URL}/sales/rep/${userId}?${params}`);
    if (!res.ok) throw new Error(`Sales Dashboard Error: ${res.status}`);
    const data = await res.json();
    return data.data;
  },

  async refreshSalesData(userId: string): Promise<SalesDashboardData> {
    const res = await fetch(`${API_BASE_URL}/sales/rep/${userId}/refresh`, {
      method: "POST",
    });
    if (!res.ok) throw new Error(`Refresh Sales Data Error: ${res.status}`);
    const data = await res.json();
    return data.data;
  },

  async exportSalesReport(
    userId: string,
    dateRange: DateRange,
    format: string = "pdf"
  ): Promise<Blob> {
    const params = new URLSearchParams({
      userId,
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
      format,
    });

    const res = await fetch(`${API_BASE_URL}/sales/export?${params}`);
    if (!res.ok) throw new Error(`Export Sales Report Error: ${res.status}`);
    return await res.blob();
  },

  async getSalesTargets(userId: string): Promise<{ monthlyTarget: number }> {
    const res = await fetch(`${API_BASE_URL}/sales/targets/${userId}`);
    if (!res.ok) throw new Error(`Sales Targets Error: ${res.status}`);
    const data = await res.json();
    return data.data;
  },
};
