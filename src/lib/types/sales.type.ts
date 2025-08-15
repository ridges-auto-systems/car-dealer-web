// src/types/sales.type.ts
export interface DateRange {
  from: Date;
  to: Date;
}

export interface SalesRepStats {
  mySales: number;
  myLeads: number;
  conversionRate: number;
  commission: number;
  avgLeadTime: number;
  topPerformingModel: string;
  quotaProgress: number;
}

export interface SalesDataPoint {
  period: string;
  vehicles: number;
  revenue: number;
  date: string;
  label: string;
}

export interface SalesActivity {
  id: string;
  type: "sale" | "lead" | "follow-up" | "test-drive";
  title: string;
  description: string;
  time: string;
  amount?: number;
  priority?: "high" | "medium" | "low";
}

export interface SalesDashboardData {
  stats: SalesRepStats;
  salesData: SalesDataPoint[];
  activities: SalesActivity[];
  lastUpdated: string;
}
