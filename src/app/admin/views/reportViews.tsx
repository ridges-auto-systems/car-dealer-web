import React, { useState } from "react";
import {
  Download,
  BarChart2,
  PieChart,
  LineChart,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import DateRangePicker from "../components/ui/DateRangePicker";
import InventoryReport from "../components/reports/InventoryReport";
import LeadConversionReport from "../components/reports/LeadConversionReport";
import SalesReport from "../components/reports/SalesReport";
import { useReports } from "@/lib/store/hooks/useReport";

// TypeScript Interfaces (keep your existing ones)
interface DateRange {
  start: Date;
  end: Date;
}

interface ReportsViewProps {
  userRole?: "ADMIN" | "SALES_REP";
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const ReportsView: React.FC<ReportsViewProps> = ({
  userRole = "ADMIN",
  autoRefresh = false,
  refreshInterval = 300000,
}) => {
  const [activeReport, setActiveReport] = useState("sales");

  // Use the reports hook
  const {
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
    errors,

    // Helper booleans
    hasSalesData,
    hasInventoryData,
    hasLeadsData,
    hasAnyData,

    // Actions
    actions,
  } = useReports({
    autoRefresh,
    refreshInterval,
  });

  // Default empty data (fallbacks)
  const defaultSalesData = {
    totalSales: 0,
    totalRevenue: 0,
    avgSalePrice: 0,
    salesByMonth: [],
    topPerformers: [],
    vehiclesSold: [],
  };

  const defaultInventoryData = {
    totalVehicles: 0,
    totalValue: 0,
    avgDaysOnLot: 0,
    lowStockAlert: 0,
    vehiclesByCategory: [],
    agingInventory: [],
  };

  const defaultLeadData = {
    totalLeads: 0,
    convertedLeads: 0,
    conversionRate: 0,
    avgConversionTime: 0,
    leadsBySource: [],
    conversionFunnel: [],
  };

  // Handle export
  const handleExport = async () => {
    try {
      await actions.exportReport(activeReport, dateRange);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      await actions.refreshAllData();
    } catch (error) {
      console.error("Refresh failed:", error);
    }
  };

  // Error Display Component
  const ErrorDisplay: React.FC<{ error: string; onRetry?: () => void }> = ({
    error,
    onRetry,
  }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <span className="text-red-800 font-medium">Error loading report</span>
      </div>
      <p className="text-red-700 mt-1 text-sm">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
        >
          Try again
        </button>
      )}
    </div>
  );

  // Loading skeleton
  if (isLoading && !hasAnyData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-6">
              <div className="flex space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded w-32"></div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <div className="flex items-center gap-3">
            <DateRangePicker
              value={dateRange}
              onChange={actions.setDateRange}
            />
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleExport}
              disabled={exporting || !hasAnyData}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              <span>{exporting ? "Exporting..." : "Export"}</span>
            </button>
          </div>
        </div>

        {/* Global Error Display */}
        {hasError && errors.length > 0 && (
          <div className="space-y-2">
            {errors.map((error, index) => (
              <ErrorDisplay
                key={index}
                error={error ?? ""}
                onRetry={actions.refreshAllData}
              />
            ))}
          </div>
        )}

        {/* Report Type Selector */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-2">
            {[
              {
                id: "sales",
                label: "Sales Report",
                icon: BarChart2,
                loading: salesLoading,
                hasData: hasSalesData,
                error: salesError,
              },
              {
                id: "inventory",
                label: "Inventory Report",
                icon: PieChart,
                loading: inventoryLoading,
                hasData: hasInventoryData,
                error: inventoryError,
              },
              {
                id: "leads",
                label: "Lead Conversion",
                icon: LineChart,
                loading: leadsLoading,
                hasData: hasLeadsData,
                error: leadsError,
              },
            ].map((report) => (
              <button
                key={report.id}
                onClick={() => setActiveReport(report.id)}
                disabled={report.loading}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors relative ${
                  activeReport === report.id
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${report.loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <report.icon
                  className={`h-4 w-4 ${report.loading ? "animate-spin" : ""}`}
                />
                <span>{report.label}</span>
                {report.error && (
                  <AlertCircle className="h-3 w-3 text-red-500 ml-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Sales Report */}
          {activeReport === "sales" && (
            <>
              {salesError && (
                <ErrorDisplay
                  error={salesError}
                  onRetry={actions.fetchSalesData}
                />
              )}
              {salesLoading && (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-600">
                    Loading sales report...
                  </span>
                </div>
              )}
              {!salesLoading && (
                <SalesReport data={salesReportData || defaultSalesData} />
              )}
            </>
          )}

          {/* Inventory Report */}
          {activeReport === "inventory" && (
            <>
              {inventoryError && (
                <ErrorDisplay
                  error={inventoryError}
                  onRetry={actions.fetchInventoryData}
                />
              )}
              {inventoryLoading && (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-600">
                    Loading inventory report...
                  </span>
                </div>
              )}
              {!inventoryLoading && (
                <InventoryReport
                  data={inventoryReportData || defaultInventoryData}
                />
              )}
            </>
          )}

          {/* Lead Conversion Report */}
          {activeReport === "leads" && (
            <>
              {leadsError && (
                <ErrorDisplay
                  error={leadsError}
                  onRetry={actions.fetchLeadsData}
                />
              )}
              {leadsLoading && (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-600">
                    Loading lead conversion report...
                  </span>
                </div>
              )}
              {!leadsLoading && (
                <LeadConversionReport
                  data={leadConversionData || defaultLeadData}
                />
              )}
            </>
          )}

          {/* Export Error */}
          {exportError && (
            <div className="mt-4">
              <ErrorDisplay error={exportError} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
