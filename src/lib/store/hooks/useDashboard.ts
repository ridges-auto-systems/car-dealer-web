import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/index";

import {
  useGetDashboardStatsQuery,
  useGetSalesPerformanceQuery,
  useGetRecentActivityQuery,
} from "../../services/dashboard.service";
import {
  setStats,
  setSalesData,
  setActivities,
  setError,
} from "../slices/dashboard.slice";
import { DashboardStats } from "@/lib/types/dashboard";

export interface UseDashboardOptions {
  timeframe?: string;
  period?: "daily" | "weekly" | "monthly";
  months?: number;
  activityLimit?: number;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

export const useDashboard = (options: UseDashboardOptions = {}) => {
  const {
    timeframe = "30",
    period = "monthly",
    months = 6,
    activityLimit = 10,
    autoRefresh = false,
    refreshInterval = 300000, // 5 minutes
  } = options;

  const dispatch = useDispatch();
  const dashboardState = useSelector((state: RootState) => state.dashboard);

  // RTK Query hooks
  const {
    data: statsData,
    error: statsError,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetDashboardStatsQuery({ timeframe });

  const {
    data: salesData,
    error: salesError,
    isLoading: salesLoading,
    refetch: refetchSales,
  } = useGetSalesPerformanceQuery({ period, months });

  const {
    data: activityData,
    error: activityError,
    isLoading: activityLoading,
    refetch: refetchActivity,
  } = useGetRecentActivityQuery({ limit: activityLimit });

  // Handle stats data updates
  useEffect(() => {
    if (statsData?.success && statsData.data) {
      const { summary, metrics } = statsData.data;
      const transformedStats: DashboardStats = {
        totalSales: summary.totalSales,
        newLeads: summary.newLeads,
        inventoryCount: summary.inventory.total,
        revenue: summary.revenue.total,
        conversionRate: parseFloat(metrics.conversionRate.replace("%", "")),
        avgLeadTime: parseInt(metrics.averageLeadTime.replace(" days", "")),
        topSellingModel: metrics.topSelling,
      };
      dispatch(setStats(transformedStats));
    }
  }, [statsData, dispatch]);

  // Handle sales data updates
  useEffect(() => {
    if (salesData?.success && salesData.data?.chartData) {
      dispatch(setSalesData(salesData.data.chartData));
    }
  }, [salesData, dispatch]);

  // Handle activity data updates
  useEffect(() => {
    if (activityData?.success && activityData.data?.activities) {
      dispatch(setActivities(activityData.data.activities));
    }
  }, [activityData, dispatch]);

  // Handle errors
  useEffect(() => {
    const error = statsError || salesError || activityError;
    if (error) {
      dispatch(setError("Failed to load dashboard data"));
    }
  }, [statsError, salesError, activityError, dispatch]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refetchStats();
      refetchSales();
      refetchActivity();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [
    autoRefresh,
    refreshInterval,
    refetchStats,
    refetchSales,
    refetchActivity,
  ]);

  // Memoized computed values
  const computedData = useMemo(() => {
    const isLoading = statsLoading || salesLoading || activityLoading;
    const hasError = Boolean(statsError || salesError || activityError);

    return {
      isLoading,
      hasError,
      stats: dashboardState.stats,
      salesData: dashboardState.salesData,
      activities: dashboardState.activities,
      lastUpdated: dashboardState.lastUpdated,
    };
  }, [
    statsLoading,
    salesLoading,
    activityLoading,
    statsError,
    salesError,
    activityError,
    dashboardState,
  ]);

  // Action methods
  const actions = useMemo(
    () => ({
      refresh: () => {
        refetchStats();
        refetchSales();
        refetchActivity();
      },
      refetchStats,
      refetchSales,
      refetchActivity,
    }),
    [refetchStats, refetchSales, refetchActivity]
  );

  return {
    ...computedData,
    actions,
  };
};
