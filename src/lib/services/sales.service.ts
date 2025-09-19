// lib/store/services/salesService.ts
import { DateRange, SalesDashboardData } from "../types/sales.type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export const salesService = {
  async fetchSalesRepDashboard(
    userId: string,
    dateRange: DateRange
  ): Promise<SalesDashboardData> {
    const params = new URLSearchParams({
      userId,
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    });

    const res = await fetch(`${API_BASE_URL}/sales/rep?${params}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Sales Dashboard Error: ${res.status}`);
    }
    return await res.json();
  },

  async refreshSalesData(userId: string, dateRange: DateRange): Promise<SalesDashboardData> {
    const params = new URLSearchParams({
      userId,
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    });

    const res = await fetch(`${API_BASE_URL}/sales/rep/refresh?${params}`, {
      method: 'POST'
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Refresh failed: ${res.status}`);
    }
    return await res.json();
  },

  async claimLead(leadId: string, userId: string): Promise<{ success: boolean; lead: any }> {
    const res = await fetch(`${API_BASE_URL}/sales/claim-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leadId, userId }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Claim lead failed: ${res.status}`);
    }
    return await res.json();
  },

  async updateSalesTarget(userId: string, target: number): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE_URL}/sales/target`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, target }),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Update target failed: ${res.status}`);
    }
    return await res.json();
  },

  async fetchFreeLeads(dateRange: DateRange): Promise<any[]> {
    const params = new URLSearchParams({
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    });

    const res = await fetch(`${API_BASE_URL}/sales/free-leads?${params}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Fetch free leads failed: ${res.status}`);
    }
    const data = await res.json();
    return data.leads || [];
  }
};