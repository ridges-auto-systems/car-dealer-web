import {
  DateRange,
  SalesReportData,
  InventoryReportData,
  LeadConversionData,
} from "../types/report.type";

const API_BASE_URL = "http://localhost:5000/api";

export const reportService = {
  async fetchSalesReport(dateRange: DateRange): Promise<SalesReportData> {
    const params = new URLSearchParams({
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    });

    const res = await fetch(`${API_BASE_URL}/reports/sales?${params}`);
    if (!res.ok) throw new Error(`Sales Report Error: ${res.status}`);
    const data = await res.json();
    return data.data;
  },

  async fetchInventoryReport(
    dateRange: DateRange
  ): Promise<InventoryReportData> {
    const params = new URLSearchParams({
      asOfDate: dateRange.to.toISOString(),
    });

    const res = await fetch(`${API_BASE_URL}/reports/inventory?${params}`);
    if (!res.ok) throw new Error(`Inventory Report Error: ${res.status}`);
    const data = await res.json();
    return data.data;
  },

  async fetchLeadConversionReport(
    dateRange: DateRange
  ): Promise<LeadConversionData> {
    const params = new URLSearchParams({
      startDate: dateRange.start.toISOString(),
      endDate: dateRange.end.toISOString(),
    });

    const res = await fetch(
      `${API_BASE_URL}/reports/lead-conversion?${params}`
    );
    if (!res.ok) throw new Error(`Lead Conversion Report Error: ${res.status}`);
    const data = await res.json();
    return data.data;
  },

  async exportReport(
    reportType: string,
    dateRange: DateRange,
    format: string = "pdf"
  ): Promise<Blob> {
    const params = new URLSearchParams({
      reportType,
      startDate: dateRange.start.toISOString(),
      endDate: dateRange.end.toISOString(),
      format,
    });

    const res = await fetch(`${API_BASE_URL}/reports/export?${params}`);
    if (!res.ok) throw new Error(`Export Report Error: ${res.status}`);
    return await res.blob();
  },
};
