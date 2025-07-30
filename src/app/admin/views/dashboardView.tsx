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

interface DashboardViewProps {
  userRole?: "ADMIN" | "SALES_REP";
}

const DashboardView: React.FC<DashboardViewProps> = ({
  userRole = "ADMIN",
}) => {
  // Mock data - replace with real API calls
  const stats = {
    totalSales: 42,
    newLeads: 18,
    inventoryCount: 76,
    revenue: 1250000,
    conversionRate: 28.5,
    avgLeadTime: 7.2,
  };

  const recentActivities = [
    {
      id: 1,
      type: "sale",
      description: "2023 Toyota Camry sold to John Doe",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "lead",
      description: "New lead from website contact form",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "test-drive",
      description: "Test drive scheduled for Honda Accord",
      time: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Sales"
            value={stats.totalSales}
            icon={Car}
            color="blue"
            trend={12.5}
          />
          <MetricCard
            title="New Leads"
            value={stats.newLeads}
            icon={Users}
            color="green"
            trend={8.3}
          />
          <MetricCard
            title="Inventory"
            value={stats.inventoryCount}
            icon={Car}
            color="purple"
          />
          <MetricCard
            title="Revenue"
            value={`$${(stats.revenue / 1000).toFixed(0)}K`}
            icon={DollarSign}
            color="orange"
            trend={18.2}
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
            <SalesChart />
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold px-4">Quick Stats</h3>
            </div>
            <div className="space-y-4 px-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Conversion Rate</span>
                <span className="font-medium text-gray-600">
                  {stats.conversionRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg Lead Time</span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-600">
                    {stats.avgLeadTime} days
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Top Selling Model</span>
                <span className="font-medium text-gray-600">Toyota Camry</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Activity Feed */}
        <Card>
          <h3 className="text-lg font-semibold mb-4 px-4">Recent Activity</h3>
          <ActivityFeed activities={recentActivities} />
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
