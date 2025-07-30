// src/app/admin/views/ReportsView.tsx
import React, { useState } from "react";
import {
  Download,
  Filter,
  BarChart2,
  PieChart,
  LineChart,
  Calendar as CalendarIcon,
} from "lucide-react";
import DateRangePicker from "../components/ui/DateRangePicker";
import InventoryReport from "../components/reports/InventoryReport";
import LeadConversionReport from "../components/reports/LeadConversionReport";

interface ReportsViewProps {
  userRole?: "ADMIN" | "SALES_REP";
}
const ReportsView: React.FC<ReportsViewProps> = ({ userRole = "ADMIN" }) => {
  const [activeReport, setActiveReport] = useState("sales");
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date(),
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <div className="flex items-center gap-3">
            <DateRangePicker value={dateRange} onChange={setDateRange} />
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
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
          {/*{activeReport === "sales" && <SalesReport dateRange={dateRange} />}*/}
          {activeReport === "inventory" && <InventoryReport />}
          {activeReport === "leads" && (
            <LeadConversionReport dateRange={dateRange} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
