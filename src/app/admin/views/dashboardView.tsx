// src/app/admin/views/DashboardView.tsx
import React from "react";
import {
  BarChart,
  Car,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
} from "lucide-react";
import { AdminViewProps } from "../types";
import Card from "../components/ui/card";
import MetricCard from "../components/common/metricCard";
import SalesChart from "../components/charts/SalesChart";
import ActivityFeed from "../components/activity/ActivityFeed";

interface DashboardStats {
  totalSales: number;
  newLeads: number;
  inventoryCount: number;
  revenue: number;
  conversionRate: number;
  avgLeadTime: number;
  topSellingModel?: string;
}

interface Activity {
  id: number;
  type: string;
  description: string;
  time: string;
}

interface SalesData {
  labels: string[];
  vehiclesSold: number[];
  revenue: number[];
}

interface DashboardViewProps {
  userRole?: "ADMIN" | "SALES_REP";
  stats: DashboardStats;
  activities: Activity[];
  salesData: SalesData;
  isLoading?: boolean;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  userRole = "ADMIN",
  stats,
  activities = [],
  salesData,
  isLoading = false,
}) => {
  // Default stats if none provided
  const defaultStats: DashboardStats = {
    totalSales: 0,
    newLeads: 0,
    inventoryCount: 0,
    revenue: 0,
    conversionRate: 0,
    avgLeadTime: 0,
    topSellingModel: "N/A",
  };

  const defaultSalesData: SalesData = {
    labels: [],
    vehiclesSold: [],
    revenue: [],
  };

  // Use provided data or defaults
  const currentStats = stats || defaultStats;
  const currentSalesData = salesData || defaultSalesData;
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
                >
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Sales"
            value={currentStats.totalSales}
            icon={Car}
            color="blue"
            trend={12.5} // You might want to pass this as part of stats
          />
          <MetricCard
            title="New Leads"
            value={currentStats.newLeads}
            icon={Users}
            color="green"
            trend={8.3} // You might want to pass this as part of stats
          />
          <MetricCard
            title="Inventory"
            value={currentStats.inventoryCount}
            icon={Car}
            color="purple"
          />
          <MetricCard
            title="Revenue"
            value={`${(currentStats.revenue / 1000).toFixed(0)}K`}
            icon={DollarSign}
            color="orange"
            trend={18.2} // You might want to pass this as part of stats
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Monthly Sales</h3>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Last 6 months</span>
              </div>
            </div>
            <SalesChart data={currentSalesData} />
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold px-4">Quick Stats</h3>
            </div>
            <div className="space-y-4 px-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-medium text-gray-600">
                  {currentStats.conversionRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg Lead Time</span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-600">
                    {currentStats.avgLeadTime} days
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Top Selling Model</span>
                <span className="font-medium text-gray-600">
                  {currentStats.topSellingModel || "N/A"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 px-4">Recent Activity</h3>
          <ActivityFeed activities={activities} />
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
