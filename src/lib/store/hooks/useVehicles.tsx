// admin/hooks/useLeads.ts - Fixed to match LeadsView expectations
import { useState, useEffect, useCallback } from "react";
import type { VehicleFilters, Vehicle } from "../../../lib/types/vehicle.type";

// Simple API caller that works with your exact API format
const API_BASE_URL = "http://localhost:5000/api";

const transformVehicle = (apiVehicle: any): Vehicle => {
  return {
    ...apiVehicle,
    // Transform customerName from firstName + lastName
    customerName:
      apiVehicle.customerName ||
      `${apiVehicle.firstName || ""} ${apiVehicle.lastName || ""}`.trim(),

    // Transform vehicle info
    vehicle:
      apiVehicle.vehicleName ||
      (apiVehicle.vehicle
        ? `${apiVehicle.vehicle.year || ""} ${apiVehicle.vehicle.make || ""} ${
            apiVehicle.vehicle.model || ""
          }`.trim()
        : null) ||
      "General Inquiry",

    // Transform sales rep info
    salesRep:
      apiVehicle.salesRepName ||
      (apiVehicle.salesRep
        ? `${apiVehicle.salesRep.firstName || ""} ${
            apiVehicle.salesRep.lastName || ""
          }`.trim()
        : null) ||
      "Unassigned",

    // Ensure required fields have defaults
    firstName: apiVehicle.firstName || "",
    lastName: apiVehicle.lastName || "",
    email: apiVehicle.email || "",
    phone: apiVehicle.phone || "",
    status: apiVehicle.status || "NEW",
    priority: apiVehicle.priority || "MEDIUM",
    isHot: apiVehicle.isHot || apiVehicle.priority === "HOT",
    leadScore: apiVehicle.leadScore || 0,
    createdAt: apiVehicle.createdAt || new Date().toISOString(),
    updatedAt: apiVehicle.updatedAt || new Date().toISOString(),
    lastContact:
      apiVehicle.lastContact || apiVehicle.updatedAt || apiVehicle.createdAt,

    // Optional fields
    customerId: apiVehicle.customerId || "",
    salesRepId: apiVehicle.salesRepId,
    vehicleId: apiVehicle.vehicleId,
    source: apiVehicle.source,
    notes: apiVehicle.notes,
    interestedInTrade: apiVehicle.interestedInTrade || false,
    tradeVehicleInfo: apiVehicle.tradeVehicleInfo,
    financingNeeded: apiVehicle.financingNeeded || false,
    budgetRange: apiVehicle.budgetRange,
    timeline: apiVehicle.timeline,
  };
};

async function fetchVehiclesFromAPI(
  filters: VehicleFilters = {
    page: 0,
    limit: 0,
  }
) {
  console.log("🔍 Direct API: Fetching vehicles with filters:", filters);

  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const url = `${API_BASE_URL}/leads${
    params.toString() ? "?" + params.toString() : ""
  }`;
  console.log("📡 Direct API: URL:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("✅ Direct API: Response received:", data);

    // Your API returns: { success: true, data: { leads: [...], pagination: {...} } }
    if (data.success && data.data && Array.isArray(data.data.leads)) {
      console.log("🎯 Direct API: Found", data.data.leads.length, "leads");

      // Transform vehicles to match UI expectations
      const transformedVehicles = data.data.vehicles.map(transformVehicle);
      console.log(
        "🔄 Direct API: Transformed first vehicle:",
        transformedVehicles[0]
      );

      return {
        vehicles: transformedVehicles,
        pagination: data.data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      };
    } else {
      throw new Error("Invalid response format from API");
    }
  } catch (error) {
    console.error("❌ Direct API Error:", error);
    throw error;
  }
}

export const useVehicles = () => {
  // Simple state management
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<VehicleFilters>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Load vehicles function
  const loadVehicles = useCallback(
    async (customFilters?: VehicleFilters) => {
      console.log("🔄 useVehicles: Starting to load vehicles");
      setIsLoading(true);
      setError(null);

      try {
        const filtersToUse = customFilters || filters;
        const result = await fetchVehiclesFromAPI(filtersToUse);

        console.log(
          "✅ useVehicles: Successfully loaded",
          result.vehicles.length,
          "vehicles"
        );
        setVehicles(result.vehicles);
        setPagination(result.pagination);
      } catch (err: any) {
        console.error("❌ useVehicles: Failed to load vehicles:", err);
        setError(err.message || "Failed to load vehicles");
        setVehicles([]);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  // Auto-load on mount and when filters change
  useEffect(() => {
    console.log("useVehicles: Auto-loading vehicles on mount/filter change");
    loadVehicles();
  }, [loadVehicles]);

  // Helper functions
  const setFilters = useCallback((newFilters: Partial<VehicleFilters>) => {
    console.log("🔧 useVehicles: Setting filters:", newFilters);
    setFiltersState((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilters };

      // Reset to page 1 when filters change (except pagination changes)
      if (!newFilters.page) {
        updatedFilters.page = 1;
      }

      // Auto-reload with new filters
      fetchVehiclesFromAPI(updatedFilters)
        .then((result) => {
          setVehicles(result.vehicles);
          setPagination(result.pagination);
        })
        .catch((err) => {
          console.error("Error reloading with new filters:", err);
          setError(err.message);
        });
      return updatedFilters;
    });
  }, []);

  const refetch = useCallback(
    (customFilters?: VehicleFilters) => {
      console.log("🔄 useVehicles: Manual refetch requested");
      return loadVehicles(customFilters);
    },
    [loadVehicles]
  );

  // Return everything the VehiclesView needs
  return {
    // Core state
    vehicles,
    isLoading,
    error,
    filters,
    selectedVehicles,
    pagination,

    // Core actions
    fetchVehicles: loadVehicles,
    refetch,
    setFilters,
    loadVehicles: refetch, // Add this for the refresh button

    // Helper actions
    clearError: () => setError(null),
    toggleSelection: (vehicleId: string) => {
      setSelectedVehicles((prev) =>
        prev.includes(vehicleId)
          ? prev.filter((id) => id !== vehicleId)
          : [...prev, vehicleId]
      );
    },
    clearSelection: () => setSelectedVehicles([]),

    // Helper values
    isSelected: (vehicleId: string) => selectedVehicles.includes(vehicleId),
    getVehicleById: (id: string) =>
      vehicles.find((vehicle) => vehicle.id === id),
    selectedCount: selectedVehicles.length,
    hasSelectedVehicles: selectedVehicles.length > 0,
    isEmpty: vehicles.length === 0,
    isError: !!error,
  };
};

export default useVehicles;
