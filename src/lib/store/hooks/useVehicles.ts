// src/app/admin/hooks/useVehicles.ts - WORKING VERSION WITH REAL CRUD
import { useState, useEffect, useCallback } from "react";
import type { VehicleFilters, Vehicle } from "../../../lib/types/vehicle.type";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const transformVehicle = (apiVehicle: any): Vehicle => {
  return {
    id: apiVehicle.id,
    vin: apiVehicle.vin || "",
    stockNumber: apiVehicle.stockNumber || "",
    make: apiVehicle.make || "",
    model: apiVehicle.model || "",
    year: apiVehicle.year || new Date().getFullYear(),
    trim: apiVehicle.trim || "",
    mileage: apiVehicle.mileage || 0,
    price: apiVehicle.price || 0,
    priceFormatted: apiVehicle.priceFormatted || `$${apiVehicle.price || 0}`,
    msrp: apiVehicle.msrp,
    msrpFormatted: apiVehicle.msrpFormatted,
    costBasis: apiVehicle.costBasis,
    condition: apiVehicle.condition || "USED",
    status: apiVehicle.status || "AVAILABLE",
    exterior: apiVehicle.exterior || "",
    interior: apiVehicle.interior || "",
    engine: apiVehicle.engine || "",
    transmission: apiVehicle.transmission || "",
    drivetrain: apiVehicle.drivetrain || "",
    fuelType: apiVehicle.fuelType || "",
    mpgCity: apiVehicle.mpgCity,
    mpgHighway: apiVehicle.mpgHighway,
    mpgCombined: apiVehicle.mpgCombined,
    doors: apiVehicle.doors,
    seats: apiVehicle.seats,
    features: apiVehicle.features || [],
    packages: apiVehicle.packages || [],
    options: apiVehicle.options || [],
    images: apiVehicle.images || [],
    videos: apiVehicle.videos || [],
    documents: apiVehicle.documents || [],
    description: apiVehicle.description || "",
    highlights: apiVehicle.highlights || [],
    keywords: apiVehicle.keywords || [],
    inspectionDate: apiVehicle.inspectionDate,
    inspectionNotes: apiVehicle.inspectionNotes,
    accidentHistory: apiVehicle.accidentHistory,
    serviceHistory: apiVehicle.serviceHistory,
    previousOwners: apiVehicle.previousOwners,
    location: apiVehicle.location || "",
    isFeatured: apiVehicle.isFeatured || false,
    isOnline: apiVehicle.isOnline || true,
    displayOrder: apiVehicle.displayOrder,
    mainImage: apiVehicle.mainImage || apiVehicle.images?.[0],
    mileageFormatted:
      apiVehicle.mileageFormatted ||
      apiVehicle.mileage?.toLocaleString() ||
      "0",
    fuelEconomy: apiVehicle.fuelEconomy,
    soldDate: apiVehicle.soldDate,
    soldPrice: apiVehicle.soldPrice,
    createdAt: apiVehicle.createdAt || new Date().toISOString(),
    updatedAt: apiVehicle.updatedAt || new Date().toISOString(),
  };
};

async function fetchVehiclesFromAPI(
  filters: VehicleFilters = { page: 1, limit: 20 }
) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const url = `${API_BASE_URL}/vehicles${
    params.toString() ? "?" + params.toString() : ""
  }`;
  console.log("📡 Full URL:", url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ API Response:", data);

    if (data.success && data.data && Array.isArray(data.data.vehicles)) {
      console.log("🎯 Found", data.data.vehicles.length, "vehicles");

      const transformedVehicles = data.data.vehicles.map(transformVehicle);
      console.log("🔄 Transformed vehicles:", transformedVehicles);

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
    console.error("❌ API Error:", error);
    throw error;
  }
}

export const useVehicles = () => {
  console.log("🏗️ useVehicles hook initialized");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const loadVehicles = useCallback(
    async (customFilters?: VehicleFilters) => {
      console.log("🔄 Loading vehicles...");
      setIsLoading(true);
      setError(null);

      try {
        const filtersToUse = customFilters || filters;
        const result = await fetchVehiclesFromAPI(filtersToUse);

        console.log(
          "✅ Successfully loaded",
          result.vehicles.length,
          "vehicles"
        );
        setVehicles(result.vehicles);
        setPagination(result.pagination);
      } catch (err: any) {
        console.error("❌ Failed to load vehicles:", err);
        setError(err.message || "Failed to load vehicles");
        setVehicles([]);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  // Auto-load on mount
  useEffect(() => {
    console.log("🚀 Auto-loading vehicles on mount");
    loadVehicles();
  }, []);

  const setFilters = useCallback((newFilters: Partial<VehicleFilters>) => {
    console.log("🔧 Setting filters:", newFilters);
    setFiltersState((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      if (!newFilters.page) {
        updatedFilters.page = 1;
      }
      return updatedFilters;
    });
  }, []);

  const refetch = useCallback(() => {
    console.log("🔄 Manual refetch requested");
    return loadVehicles();
  }, [loadVehicles]);

  // REAL CREATE VEHICLE FUNCTION:
  const createVehicle = useCallback(
    async (vehicleData: Partial<Vehicle>) => {
      console.log("🚗 Creating vehicle:", vehicleData);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/vehicles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vehicleData),
        });

        console.log("📡 Create response status:", response.status);

        if (!response.ok) {
          const errorData = await response.text();
          console.error("❌ Create error response:", errorData);
          throw new Error(
            `Failed to create vehicle: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        console.log("✅ Vehicle created successfully:", result);

        if (result.success) {
          // Reload vehicles to get the updated list
          await loadVehicles();
          return result.data.vehicle;
        } else {
          throw new Error(result.error || "Failed to create vehicle");
        }
      } catch (err: any) {
        console.error("❌ Create vehicle error:", err);
        setError(err.message || "Failed to create vehicle");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [loadVehicles]
  );

  // REAL UPDATE VEHICLE FUNCTION:
  const updateVehicle = useCallback(
    async (id: string, updates: Partial<Vehicle>) => {
      console.log("✏️ Updating vehicle:", id, updates);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(
            `Failed to update vehicle: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        console.log("✅ Vehicle updated successfully:", result);

        if (result.success) {
          // Update the vehicle in the current state
          setVehicles((prev) =>
            prev.map((v) => (v.id === id ? transformVehicle(result.data) : v))
          );
          return result.data;
        } else {
          throw new Error(result.error || "Failed to update vehicle");
        }
      } catch (err: any) {
        console.error("❌ Update vehicle error:", err);
        setError(err.message || "Failed to update vehicle");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // REAL DELETE VEHICLE FUNCTION:
  const deleteVehicle = useCallback(async (id: string) => {
    console.log("🗑️ Deleting vehicle:", id);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Failed to delete vehicle: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("✅ Vehicle deleted successfully:", result);

      if (result.success) {
        // Remove the vehicle from the current state
        setVehicles((prev) => prev.filter((v) => v.id !== id));
        return result.data;
      } else {
        throw new Error(result.error || "Failed to delete vehicle");
      }
    } catch (err: any) {
      console.error("❌ Delete vehicle error:", err);
      setError(err.message || "Failed to delete vehicle");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  console.log("🔍 Current state:", {
    vehicleCount: vehicles.length,
    isLoading,
    error,
  });

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
    loadVehicles: refetch,
    createVehicle, // ← Now this is a real function
    updateVehicle, // ← Now this is a real function
    deleteVehicle, // ← Now this is a real function

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
