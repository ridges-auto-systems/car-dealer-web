import React, { useState } from "react";
import {
  Download,
  BarChart2,
  PieChart,
  LineChart,
  Calendar as CalendarIcon,
} from "lucide-react";
import DateRangePicker from "../components/ui/DateRangePicker";
import InventoryReport from "../components/reports/InventoryReport";
import LeadConversionReport from "../components/reports/LeadConversionReport";
import SalesReport from "../components/reports/SalesReport";

// TypeScript Interfaces
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

interface ReportsViewProps {
  userRole?: "ADMIN" | "SALES_REP";
  salesReportData?: SalesReportData;
  inventoryReportData?: InventoryReportData;
  leadConversionData?: LeadConversionData;
  isLoading?: boolean;
  onExportReport?: (reportType: string, dateRange: DateRange) => void;
  onDateRangeChange?: (dateRange: DateRange) => void;
}

const ReportsView: React.FC<ReportsViewProps> = ({
  userRole = "ADMIN",
  salesReportData,
  inventoryReportData,
  leadConversionData,
  isLoading = false,
  onExportReport,
  onDateRangeChange,
}) => {
  const [activeReport, setActiveReport] = useState("sales");
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date(),
  });

  // Default empty data
  const defaultSalesData: SalesReportData = {
    totalSales: 0,
    totalRevenue: 0,
    avgSalePrice: 0,
    salesByMonth: [],
    topPerformers: [],
    vehiclesSold: [],
  };

  const defaultInventoryData: InventoryReportData = {
    totalVehicles: 0,
    totalValue: 0,
    avgDaysOnLot: 0,
    lowStockAlert: 0,
    vehiclesByCategory: [],
    agingInventory: [],
  };

  const defaultLeadData: LeadConversionData = {
    totalLeads: 0,
    convertedLeads: 0,
    conversionRate: 0,
    avgConversionTime: 0,
    leadsBySource: [],
    conversionFunnel: [],
  };

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
    if (onDateRangeChange) {
      onDateRangeChange(newRange);
    }
  };

  const handleExport = () => {
    if (onExportReport) {
      onExportReport(activeReport, dateRange);
    }
  };

  if (isLoading) {
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <div className="flex items-center gap-3">
            <DateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
            />
            <button
              onClick={handleExport}
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Report Type Selector */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "sales", label: "Sales Report", icon: BarChart2 },
              { id: "inventory", label: "Inventory Report", icon: PieChart },
              { id: "leads", label: "Lead Conversion", icon: LineChart },
            ].map((report) => (
              <button
                key={report.id}
                onClick={() => setActiveReport(report.id)}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeReport === report.id
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <report.icon className="h-4 w-4" />
                <span>{report.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeReport === "sales" && (
            <SalesReport data={salesReportData || defaultSalesData} />
          )}
          {activeReport === "inventory" && (
            <InventoryReport
              data={inventoryReportData || defaultInventoryData}
            />
          )}
          {activeReport === "leads" && (
            <LeadConversionReport
              data={leadConversionData || defaultLeadData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
