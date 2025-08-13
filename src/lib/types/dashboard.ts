import { ReactNode } from "react";
import { Key } from "readline";

export interface DashboardStats {
  totalSales: number;
  newLeads: number;
  inventoryCount: number;
  revenue: number;
  conversionRate: number;
  avgLeadTime: number;
  topSellingModel: string;
}

export interface SalesDataPoint {
  period: string;
  vehicles: number;
  revenue: number;
  date: string;
}

export interface Activity {
  id: undefined;
  scheduled: any;
  time: ReactNode;
  type: "lead" | "sale" | "listing";
  icon: string;
  title: string;
  description: string;
  timestamp: string;
  timeAgo: string;
  formattedTime: string;
  priority?: "HOT" | "HIGH" | "MEDIUM" | "LOW";
  amount?: number;
}

export interface DashboardApiResponse {
  success: boolean;
  data: {
    summary: {
      totalSales: number;
      newLeads: number;
      inventory: {
        total: number;
        available: number;
        sold: number;
      };
      revenue: {
        total: number;
        formatted: string;
        inMillions: string;
      };
    };
    metrics: {
      conversionRate: string;
      averageLeadTime: string;
      topSelling: string;
    };
    salesData?: SalesDataPoint[];
  };
  company: string;
  timestamp: string;
}

export interface DashboardState {
  stats: DashboardStats | null;
  salesData: SalesDataPoint[];
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}
