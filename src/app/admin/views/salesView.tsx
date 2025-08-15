// views/SalesDashboard.tsx
import React, { useState, useEffect } from "react";
import { useSalesDashboard } from "@/lib/store/hooks/useSalesDashboard";
import SalesMetrics from "../components/sales/salesMetrics";
import SalesChart from "../components/sales/salesChart";
import RecentActivity from "../components/sales/recentSalesActivity";
import DateRangePicker from "../components/ui/DateRangePicker";
import LoadingSpinner from "../components/ui/loadingAnimation";
import ErrorAlert from "../components/ui/errorAlert";
import { RefreshCw } from "lucide-react";

const SalesDashboard: React.FC<{ userId: string }> = ({ userId }) => {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: new Date(),
  });

  const { data, loading, error, refresh, refetch } = useSalesDashboard(userId, {
    from: dateRange.start,
    to: dateRange.end,
  });

  const handleDateChange = (range: { start: Date; end: Date }) => {
    setDateRange(range);
  };

  // Refetch when date range changes
  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [dateRange, userId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} onRetry={refresh} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Sales Dashboard</h1>
        <div className="flex items-center space-x-4">
          <DateRangePicker value={dateRange} onChange={handleDateChange} />
          <button
            onClick={refresh}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {data && (
        <>
          <SalesMetrics stats={data.stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <SalesChart data={data.salesData} />
            </div>
            <div>
              <RecentActivity activities={data.activities} />
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Last updated: {new Date(data.lastUpdated).toLocaleString()}
          </div>
        </>
      )}
    </div>
  );
};

export default SalesDashboard;
