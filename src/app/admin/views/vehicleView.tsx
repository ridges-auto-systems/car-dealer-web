import React, { useState, useMemo } from "react";
import {
  Car,
  Search,
  Plus,
  Download,
  Upload,
  MoreVertical,
  Eye,
  Edit,
  Grid3X3,
  List,
  RefreshCw,
  Menu,
} from "lucide-react";
import { useVehicles } from "../../../lib/store/action/vehicleActions";
//import VehicleForm from "../components/vehicles/VehicleForm";
//import BulkActions from "../components/vehicles/BulkActions";
import type { Vehicle } from "../../../lib/types/lead.type";

interface VehicleViewProps {
  userRole?: "ADMIN" | "SALES_REP";
}

interface ViewMode {
  type: "table" | "cards";
  density: "compact" | "comfortable" | "spacious";
}

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest First" },
  { value: "createdAt:asc", label: "Oldest First" },
  { value: "make:asc", label: "Make A-Z" },
  { value: "make:desc", label: "Make Z-A" },
  { value: "model:asc", label: "Model A-Z" },
  { value: "model:desc", label: "Model Z-A" },
];

const VehicleView: React.FC<VehicleViewProps> = ({ userRole = "ADMIN" }) => {
  const {
    vehicles,
    isLoading,
    error,
    pagination,
    fetchVehicles,
    clearError,
    setFilters,
    isEmpty,
    isError,
  } = useVehicles();

  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>({
    type: "table",
    density: "comfortable",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
    sortBy: "createdAt:desc",
  });

  // Filter vehicles based on search query
  const safeVehicles = Array.isArray(vehicles) ? vehicles : [];
  const filteredVehicles = useMemo(() => {
    if (!searchQuery) return safeVehicles;
    return safeVehicles.filter((vehicle: Vehicle) => {
      const make = (vehicle.make || "").toLowerCase();
      const model = (vehicle.model || "").toLowerCase();
      const year = String(vehicle.year || "");
      return (
        make.includes(searchQuery.toLowerCase()) ||
        model.includes(searchQuery.toLowerCase()) ||
        year.includes(searchQuery)
      );
    });
  }, [safeVehicles, searchQuery]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSelectVehicle = (vehicleId: string) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const handleSelectAll = () => {
    setSelectedVehicles(
      selectedVehicles.length === filteredVehicles.length
        ? []
        : filteredVehicles.map((vehicle) => vehicle.id)
    );
  };

  const handleViewVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleForm(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleForm(true);
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      // TODO: Implement deleteVehicle action
      // await deleteVehicle(vehicleId);
    }
  };

  const handleBulkAction = (
    action: string,
    vehicleIds: string[],
    additionalData?: any
  ) => {
    // TODO: Implement bulk actions for vehicles
    setSelectedVehicles([]);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...currentFilters, [key]: value };
    setCurrentFilters(newFilters);

    const filterObj: any = {};
    const [sortBy, sortOrder] = newFilters.sortBy.split(":");
    filterObj.sortBy = sortBy;
    filterObj.sortOrder = sortOrder;

    setFilters(filterObj);
  };

  const handleRefresh = () => {
    fetchVehicles().catch((err: any) => {
      console.error("Refresh failed:", err);
    });
  };

  const handleVehicleFormSubmit = () => {
    handleRefresh();
    setShowVehicleForm(false);
    setSelectedVehicle(null);
  };

  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================

  const VehicleTableRow: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selectedVehicles.includes(vehicle.id)}
          onChange={() => handleSelectVehicle(vehicle.id)}
          className="rounded border-gray-300 text-red-600 focus:ring-red-600"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Car className="h-6 w-6 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900">
              {vehicle.make} {vehicle.model}
            </div>
            <div className="text-sm text-gray-500">{vehicle.year}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">{vehicle.color || "-"}</td>
      <td className="px-6 py-4 whitespace-nowrap">{vehicle.mileage || "-"}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {vehicle.price ? `$${vehicle.price}` : "-"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {vehicle.createdAt
          ? new Date(vehicle.createdAt).toLocaleDateString()
          : "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-1">
          <button
            onClick={() => handleViewVehicle(vehicle)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditVehicle(vehicle)}
            className="text-gray-600 hover:text-gray-900 p-1 rounded"
            title="Edit Vehicle"
          >
            <Edit className="h-4 w-4" />
          </button>
          <div className="relative group">
            <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
              <MoreVertical className="h-4 w-4" />
            </button>
            <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-1">
                <button
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );

  const VehicleCard: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Car className="h-6 w-6 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-sm text-gray-500 truncate">{vehicle.year}</p>
        </div>
        <input
          type="checkbox"
          checked={selectedVehicles.includes(vehicle.id)}
          onChange={() => handleSelectVehicle(vehicle.id)}
          className="rounded border-gray-300 text-red-600 focus:ring-red-600"
        />
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Color:</span>
          <span className="text-sm font-medium text-gray-900">
            {vehicle.color || "-"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Mileage:</span>
          <span className="text-sm font-medium">{vehicle.mileage || "-"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Price:</span>
          <span className="text-sm font-medium">
            {vehicle.price ? `$${vehicle.price}` : "-"}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <button
          onClick={() => handleViewVehicle(vehicle)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </button>
        <span className="text-xs text-gray-500">
          {vehicle.createdAt
            ? new Date(vehicle.createdAt).toLocaleDateString()
            : ""}
        </span>
      </div>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Vehicles
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={clearError}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Vehicle Inventory
            </h1>
            <p className="text-gray-600 mt-1">
              {userRole === "ADMIN"
                ? "Manage all vehicles in inventory"
                : "View your assigned vehicles"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-3">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
            <button
              onClick={() => setShowVehicleForm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Vehicle</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex flex-col space-y-4">
            {/* Top Row - Search and Mobile Menu */}
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vehicles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
            {/* Filters Row */}
            <div className={`${showMobileMenu ? "block" : "hidden"} lg:block`}>
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={currentFilters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() =>
                        setViewMode({ ...viewMode, type: "table" })
                      }
                      className={`p-2 rounded-md transition-colors ${
                        viewMode.type === "table"
                          ? "bg-white text-red-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setViewMode({ ...viewMode, type: "cards" })
                      }
                      className={`p-2 rounded-md transition-colors ${
                        viewMode.type === "cards"
                          ? "bg-white text-red-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleRefresh}
                    className="p-2 rounded-md transition-colors text-gray-600 hover:text-gray-900"
                    title="Refresh"
                    disabled={isLoading}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </div>
            {/* Selected Items Actions */}
          </div>
        </div>

        {/* Vehicles Content */}
        {isLoading && filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading vehicles...</span>
            </div>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No vehicles found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Try adjusting your search criteria"
                : "Get started by adding your first vehicle"}
            </p>
            <button
              onClick={() => setShowVehicleForm(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add First Vehicle</span>
            </button>
          </div>
        ) : viewMode.type === "table" ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={
                          selectedVehicles.length === filteredVehicles.length &&
                          filteredVehicles.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-600"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Color
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mileage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVehicles.map((vehicle) => (
                    <VehicleTableRow key={vehicle.id} vehicle={vehicle} />
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-gray-700">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters({ page: pagination.page - 1 })}
                    disabled={pagination.page <= 1}
                    className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setFilters({ page: pagination.page + 1 })}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleView;
