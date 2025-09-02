// src/hooks/useSalesDashboard.ts
import { useState, useEffect } from "react";
import { salesService } from "../../services/sales.service";
import { SalesDashboardData, DateRange } from "../../types/sales.type";

export const useSalesDashboard = (
  userId: string,
  initialDateRange: DateRange
) => {
  const [data, setData] = useState<SalesDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await salesService.fetchSalesRepDashboard(
        userId,
        dateRange
      );
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const refreshedData = await salesService.refreshSalesData(userId);
      setData(refreshedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refresh failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, dateRange]);

  return {
    data,
    loading,
    error,
    dateRange,
    setDateRange,
    refresh: refreshData,
    refetch: fetchData,
  };
};
