// admin/hooks/useReports.ts
import { useState, useEffect, useCallback, useMemo } from "react";

// API Base URL
const API_BASE_URL = "http://localhost:5000/api";

// Types matching your ReportsView interfaces
interface DateRange {
  start: Date;
  end: Date;
}

interface SalesReportData {
  totalSales: number;
  totalRevenue: number;
  avgSalePrice: number;
  salesByMonth: Array<{
    month: string;
    sales: number;
    revenue: number;
  }>;
  topPerformers: Array<{
    salesRep: string;
    sales: number;
    revenue: number;
  }>;
  vehiclesSold: Array<{
    make: string;
    model: string;
    year: number;
    price: number;
    saleDate: string;
    salesRep: string;
  }>;
}

interface InventoryReportData {
  totalVehicles: number;
  totalValue: number;
  avgDaysOnLot: number;
  lowStockAlert: number;
  vehiclesByCategory: Array<{
    category: string;
    count: number;
    value: number;
  }>;
  agingInventory: Array<{
    vehicleId: string;
    make: string;
    model: string;
    year: number;
    daysOnLot: number;
    currentPrice: number;
  }>;
}

interface LeadConversionData {
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  avgConversionTime: number;
  leadsBySource: Array<{
    source: string;
    leads: number;
    conversions: number;
    conversionRate: number;
  }>;
  conversionFunnel: Array<{
    stage: string;
    count: number;
    percentage: number;
  }>;
}

interface UseReportsOptions {
  defaultDateRange?: DateRange;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

// API functions
async function fetchSalesReport(
  dateRange: DateRange
): Promise<SalesReportData> {
  console.log("📊 Sales Report API: Fetching data", dateRange);

  const params = new URLSearchParams({
    startDate: dateRange.start.toISOString(),
    endDate: dateRange.end.toISOString(),
  });

  const response = await fetch(`${API_BASE_URL}/reports/sales?${params}`);
  if (!response.ok) {
    throw new Error(`Sales Report API Error: ${response.status}`);
  }

  const data = await response.json();
  console.log("✅ Sales Report API: Success", data);

  // Transform API response to match expected format
  if (data.success && data.data) {
    return {
      totalSales: data.data.totalSales || 0,
      totalRevenue: data.data.totalRevenue || 0,
      avgSalePrice: data.data.avgSalePrice || 0,
      salesByMonth: data.data.salesByMonth || [],
      topPerformers: data.data.topPerformers || [],
      vehiclesSold: data.data.vehiclesSold || [],
    };
  }

  throw new Error("Invalid sales report response format");
}

async function fetchInventoryReport(
  dateRange: DateRange
): Promise<InventoryReportData> {
  console.log("📦 Inventory Report API: Fetching data", dateRange);

  const params = new URLSearchParams({
    asOfDate: dateRange.end.toISOString(),
  });

  const response = await fetch(`${API_BASE_URL}/reports/inventory?${params}`);
  if (!response.ok) {
    throw new Error(`Inventory Report API Error: ${response.status}`);
  }

  const data = await response.json();
  console.log("✅ Inventory Report API: Success", data);

  if (data.success && data.data) {
    return {
      totalVehicles: data.data.totalVehicles || 0,
      totalValue: data.data.totalValue || 0,
      avgDaysOnLot: data.data.avgDaysOnLot || 0,
      lowStockAlert: data.data.lowStockAlert || 0,
      vehiclesByCategory: data.data.vehiclesByCategory || [],
      agingInventory: data.data.agingInventory || [],
    };
  }

  throw new Error("Invalid inventory report response format");
}

async function fetchLeadConversionReport(
  dateRange: DateRange
): Promise<LeadConversionData> {
  console.log("🎯 Lead Conversion API: Fetching data", dateRange);

  const params = new URLSearchParams({
    startDate: dateRange.start.toISOString(),
    endDate: dateRange.end.toISOString(),
  });

  const response = await fetch(
    `${API_BASE_URL}/reports/lead-conversion?${params}`
  );
  if (!response.ok) {
    throw new Error(`Lead Conversion API Error: ${response.status}`);
  }

  const data = await response.json();
  console.log("✅ Lead Conversion API: Success", data);

  if (data.success && data.data) {
    return {
      totalLeads: data.data.totalLeads || 0,
      convertedLeads: data.data.convertedLeads || 0,
      conversionRate: data.data.conversionRate || 0,
      avgConversionTime: data.data.avgConversionTime || 0,
      leadsBySource: data.data.leadsBySource || [],
      conversionFunnel: data.data.conversionFunnel || [],
    };
  }

  throw new Error("Invalid lead conversion report response format");
}

async function exportReport(
  reportType: string,
  dateRange: DateRange,
  format: string = "pdf"
): Promise<Blob> {
  console.log("📤 Export Report API:", reportType, dateRange, format);

  const params = new URLSearchParams({
    reportType,
    startDate: dateRange.start.toISOString(),
    endDate: dateRange.end.toISOString(),
    format,
  });

  const response = await fetch(`${API_BASE_URL}/reports/export?${params}`);
  if (!response.ok) {
    throw new Error(`Export Report API Error: ${response.status}`);
  }

  return await response.blob();
}

export const useReports = (options: UseReportsOptions = {}) => {
  const {
    defaultDateRange = {
      start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      end: new Date(),
    },
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutes
  } = options;

  // State management
  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);
  const [salesReportData, setSalesReportData] =
    useState<SalesReportData | null>(null);
  const [inventoryReportData, setInventoryReportData] =
    useState<InventoryReportData | null>(null);
  const [leadConversionData, setLeadConversionData] =
    useState<LeadConversionData | null>(null);

  // Loading states
  const [salesLoading, setSalesLoading] = useState(false);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Error states
  const [salesError, setSalesError] = useState<string | null>(null);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [leadsError, setLeadsError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  // Fetch functions
  const fetchSalesData = useCallback(
    async (customDateRange?: DateRange) => {
      const range = customDateRange || dateRange;
      setSalesLoading(true);
      setSalesError(null);

      try {
        const data = await fetchSalesReport(range);
        setSalesReportData(data);
      } catch (error: any) {
        console.error("❌ Sales Report Error:", error);
        setSalesError(error.message || "Failed to load sales report");
      } finally {
        setSalesLoading(false);
      }
    },
    [dateRange]
  );

  const fetchInventoryData = useCallback(
    async (customDateRange?: DateRange) => {
      const range = customDateRange || dateRange;
      setInventoryLoading(true);
      setInventoryError(null);

      try {
        const data = await fetchInventoryReport(range);
        setInventoryReportData(data);
      } catch (error: any) {
        console.error("❌ Inventory Report Error:", error);
        setInventoryError(error.message || "Failed to load inventory report");
      } finally {
        setInventoryLoading(false);
      }
    },
    [dateRange]
  );

  const fetchLeadsData = useCallback(
    async (customDateRange?: DateRange) => {
      const range = customDateRange || dateRange;
      setLeadsLoading(true);
      setLeadsError(null);

      try {
        const data = await fetchLeadConversionReport(range);
        setLeadConversionData(data);
      } catch (error: any) {
        console.error("❌ Lead Conversion Report Error:", error);
        setLeadsError(error.message || "Failed to load lead conversion report");
      } finally {
        setLeadsLoading(false);
      }
    },
    [dateRange]
  );

  // Export function
  const handleExportReport = useCallback(
    async (reportType: string, customDateRange?: DateRange) => {
      const range = customDateRange || dateRange;
      setExporting(true);
      setExportError(null);

      try {
        const blob = await exportReport(reportType, range);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${reportType}-report-${
          range.start.toISOString().split("T")[0]
        }-to-${range.end.toISOString().split("T")[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log("✅ Report exported successfully");
      } catch (error: any) {
        console.error("❌ Export Report Error:", error);
        setExportError(error.message || "Failed to export report");
      } finally {
        setExporting(false);
      }
    },
    [dateRange]
  );

  // Refresh all data
  const refreshAllData = useCallback(
    async (customDateRange?: DateRange) => {
      console.log("🔄 Refreshing all reports data");
      const range = customDateRange || dateRange;

      await Promise.all([
        fetchSalesData(range),
        fetchInventoryData(range),
        fetchLeadsData(range),
      ]);
    },
    [fetchSalesData, fetchInventoryData, fetchLeadsData, dateRange]
  );

  // Handle date range changes
  const handleDateRangeChange = useCallback(
    (newRange: DateRange) => {
      console.log("📅 Date range changed:", newRange);
      setDateRange(newRange);
      refreshAllData(newRange);
    },
    [refreshAllData]
  );

  // Auto-load on mount
  useEffect(() => {
    console.log("🚀 useReports: Initial data load");
    refreshAllData();
  }, []); // Empty dependency - only run on mount

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    console.log(`⏰ Setting up auto-refresh every ${refreshInterval}ms`);
    const interval = setInterval(() => {
      refreshAllData();
    }, refreshInterval);

    return () => {
      console.log("⏰ Cleaning up auto-refresh interval");
      clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, refreshAllData]);

  // Computed values
  const computedData = useMemo(() => {
    const isLoading = salesLoading || inventoryLoading || leadsLoading;
    const hasError = Boolean(
      salesError || inventoryError || leadsError || exportError
    );
    const allErrors = [
      salesError,
      inventoryError,
      leadsError,
      exportError,
    ].filter(Boolean);

    return {
      // Data
      salesReportData,
      inventoryReportData,
      leadConversionData,
      dateRange,

      // Loading states
      isLoading,
      salesLoading,
      inventoryLoading,
      leadsLoading,
      exporting,

      // Error states
      hasError,
      salesError,
      inventoryError,
      leadsError,
      exportError,
      errors: allErrors,

      // Helper booleans
      hasSalesData: Boolean(salesReportData),
      hasInventoryData: Boolean(inventoryReportData),
      hasLeadsData: Boolean(leadConversionData),
      hasAnyData: Boolean(
        salesReportData || inventoryReportData || leadConversionData
      ),
    };
  }, [
    salesReportData,
    inventoryReportData,
    leadConversionData,
    dateRange,
    salesLoading,
    inventoryLoading,
    leadsLoading,
    exporting,
    salesError,
    inventoryError,
    leadsError,
    exportError,
  ]);

  // Action methods
  const actions = useMemo(
    () => ({
      // Data fetching
      refreshAllData,
      fetchSalesData,
      fetchInventoryData,
      fetchLeadsData,

      // Date range
      setDateRange: handleDateRangeChange,

      // Export
      exportReport: handleExportReport,

      // Error handling
      clearErrors: () => {
        setSalesError(null);
        setInventoryError(null);
        setLeadsError(null);
        setExportError(null);
      },
      clearSalesError: () => setSalesError(null),
      clearInventoryError: () => setInventoryError(null),
      clearLeadsError: () => setLeadsError(null),
      clearExportError: () => setExportError(null),
    }),
    [
      refreshAllData,
      fetchSalesData,
      fetchInventoryData,
      fetchLeadsData,
      handleDateRangeChange,
      handleExportReport,
    ]
  );

  return {
    ...computedData,
    actions,
  };
};

export default useReports;
