import React, { useState } from "react";
import {
  Car,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Package,
  Activity,
  Filter,
  Download,
  Eye,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  Mail,
  Phone,
  LucideIcon,
} from "lucide-react";

// TypeScript interfaces
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
  title: string;
  description: string;
  time: string;
  amount?: string;
  priority?: "High" | "Medium" | "Low";
  scheduled?: string;
}

interface SalesDataPoint {
  month: string;
  vehicles: number;
  revenue: number;
}

interface SalesData {
  data: SalesDataPoint[];
}

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: LucideIcon;
  color: string;
  prefix?: string;
  suffix?: string;
}

interface ActivityIconProps {
  type: string;
}

interface DashboardViewProps {
  userRole?: "ADMIN" | "SALES_REP";
  stats?: DashboardStats;
  activities?: Activity[];
  salesData?: SalesData;
  isLoading?: boolean;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  userRole = "ADMIN",
  stats,
  activities = [],
  salesData,
  isLoading = false,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  // Default data when no props provided
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
    data: [],
  };

  // Use provided data or defaults
  const currentStats = stats || defaultStats;
  const currentSalesData = salesData || defaultSalesData;

  const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    change,
    icon: Icon,
    color,
    prefix = "",
    suffix = "",
  }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-sm`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {change && change !== 0 && (
          <div
            className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              change > 0
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {change > 0 ? (
              <ChevronUp className="h-3 w-3 mr-1" />
            ) : (
              <ChevronDown className="h-3 w-3 mr-1" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">
          {prefix}
          {typeof value === "number" ? value.toLocaleString() : value}
          {suffix}
        </p>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {change && change !== 0 && (
          <p className="text-xs text-gray-400 mt-1">vs last month</p>
        )}
      </div>
    </div>
  );

  const SalesChart = () => {
    if (!currentSalesData.data || currentSalesData.data.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm">No sales data available</p>
          </div>
        </div>
      );
    }

    const maxVehicles = Math.max(
      ...currentSalesData.data.map((d) => d.vehicles)
    );
    const maxRevenue = Math.max(...currentSalesData.data.map((d) => d.revenue));

    return (
      <div className="h-64 flex items-end justify-between px-4 pb-4">
        {currentSalesData.data.map((data, index) => (
          <div
            key={data.month}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg">
              {data.vehicles} vehicles
              <br />${data.revenue}K revenue
            </div>
            <div className="flex space-x-1">
              <div
                className="w-6 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t hover:from-blue-600 hover:to-blue-500 transition-colors duration-200"
                style={{
                  height: `${
                    maxVehicles > 0 ? (data.vehicles / maxVehicles) * 180 : 0
                  }px`,
                }}
              />
              <div
                className="w-6 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t hover:from-emerald-600 hover:to-emerald-500 transition-colors duration-200"
                style={{
                  height: `${
                    maxRevenue > 0 ? (data.revenue / maxRevenue) * 180 : 0
                  }px`,
                }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2 font-medium">
              {data.month}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const ActivityIcon: React.FC<ActivityIconProps> = ({ type }) => {
    const iconProps = "h-4 w-4";
    switch (type) {
      case "sale":
        return <CheckCircle className={`${iconProps} text-green-500`} />;
      case "lead":
        return <Mail className={`${iconProps} text-blue-500`} />;
      case "test-drive":
        return <Calendar className={`${iconProps} text-purple-500`} />;
      case "follow-up":
        return <Phone className={`${iconProps} text-orange-500`} />;
      default:
        return <Activity className={`${iconProps} text-gray-500`} />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
        </div>
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="animate-pulse">
                  <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome back! Here's what's happening with your dealership.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="6months">Last 6 months</option>
              <option value="1year">Last year</option>
            </select>
            <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors duration-200">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Sales"
            value={currentStats.totalSales}
            icon={Car}
            color="from-blue-500 to-blue-600"
          />
          <MetricCard
            title="New Leads"
            value={currentStats.newLeads}
            icon={Users}
            color="from-emerald-500 to-emerald-600"
          />
          <MetricCard
            title="Inventory"
            value={currentStats.inventoryCount}
            icon={Package}
            color="from-purple-500 to-purple-600"
          />
          <MetricCard
            title="Revenue"
            value={
              currentStats.revenue > 0
                ? (currentStats.revenue / 1000000).toFixed(1)
                : "0"
            }
            icon={DollarSign}
            color="from-orange-500 to-orange-600"
            prefix="$"
            suffix="M"
          />
        </div>

        {/* Charts and Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Sales Performance
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Vehicles sold and revenue over time
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Vehicles</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Revenue</span>
                </div>
              </div>
            </div>
            <SalesChart />
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Quick Stats
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-50 rounded-lg mr-3">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Conversion Rate
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {currentStats.conversionRate}%
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-50 rounded-lg mr-3">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Avg Lead Time
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {currentStats.avgLeadTime} days
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-50 rounded-lg mr-3">
                    <Car className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-gray-700 font-medium">Top Selling</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {currentStats.topSellingModel || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Latest updates from your dealership
                </p>
              </div>
              <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
                <Eye className="h-4 w-4 mr-1" />
                View All
              </button>
            </div>
          </div>

          {activities.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <ActivityIcon type={activity.type} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {activity.title}
                          </h4>
                          {activity.priority && (
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                activity.priority === "High"
                                  ? "bg-red-100 text-red-700"
                                  : activity.priority === "Medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {activity.priority}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{activity.time}</span>
                          {activity.amount && (
                            <span className="font-medium text-green-600">
                              {activity.amount}
                            </span>
                          )}
                          {activity.scheduled && (
                            <span className="font-medium text-blue-600">
                              {activity.scheduled}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
