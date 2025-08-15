import React from "react";
import { SalesRepStats } from "@/lib/types/sales.type";

const SalesMetrics: React.FC<{ stats: SalesRepStats }> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <MetricCard
      title="My Sales"
      value={stats.mySales}
      change={stats.conversionRate > 20 ? 5 : -2}
    />
    <MetricCard
      title="Commission"
      value={`$${stats.commission.toLocaleString()}`}
      change={stats.commission > 5000 ? 8 : -3}
    />
    <MetricCard
      title="Quota Progress"
      value={`${stats.quotaProgress}%`}
      change={stats.quotaProgress > 75 ? 10 : -5}
    />
  </div>
);

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
}> = ({ title, value, change }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold my-2">{value}</p>
    {change && (
      <div
        className={`flex items-center text-sm ${
          change > 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {change > 0 ? "↑" : "↓"} {Math.abs(change)}% vs last period
      </div>
    )}
  </div>
);

export default SalesMetrics;
