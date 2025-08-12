/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Car,
  Gauge,
  Fuel,
  Settings,
  Heart,
  Grid3X3,
  List,
  MapPin,
  Phone,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

// Import the backend-connected useVehicles hook
import { useVehicles } from "@/lib/store/hooks/useVehicles";
import type { Vehicle } from "../../../lib/types/vehicle.type";

// Cart functionality - you'll need to create this context/hook
interface CartItem {
  id: string;
  vehicle: Vehicle;
  type: "RESERVATION" | "TEST_DRIVE";
  addedAt: string;
}

// Mock cart hook - replace with your actual cart context
const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (vehicle: Vehicle, type: "RESERVATION" | "TEST_DRIVE") => {
    const newItem: CartItem = {
      id: `${vehicle.id}-${type}-${Date.now()}`,
      vehicle,
      type,
      addedAt: new Date().toISOString(),
    };
    setCartItems((prev) => [...prev, newItem]);

    // Show success message
    alert(
      `${vehicle.year} ${vehicle.make} ${vehicle.model} added to cart for ${type
        .toLowerCase()
        .replace("_", " ")}!`
    );
  };

  const isInCart = (vehicleId: string, type: "RESERVATION" | "TEST_DRIVE") => {
    return cartItems.some(
      (item) => item.vehicle.id === vehicleId && item.type === type
    );
  };

  const cartCount = cartItems.length;

  return { addToCart, isInCart, cartCount };
};

const conditions = ["All Conditions", "NEW", "USED", "CERTIFIED_PRE_OWNED"];
const statuses = ["All Status", "AVAILABLE", "RESERVED", "SOLD"];
const priceRanges = [
  "All Prices",
  "Under $20,000",
  "$20,000 - $30,000",
  "$30,000 - $40,000",
  "$40,000 - $50,000",
  "Over $50,000",
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "mileage-low", label: "Mileage: Low to High" },
  { value: "mileage-high", label: "Mileage: High to Low" },
  { value: "year-new", label: "Year: Newest" },
  { value: "year-old", label: "Year: Oldest" },
];

export default function VehicleInventoryPage() {
  // Backend state management
  const {
    vehicles,
    isLoading,
    error,
    pagination,
    setFilters,
    refetch,
    clearError,
  } = useVehicles();

  // Cart functionality
  const { addToCart, isInCart, cartCount } = useCart();

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("All Conditions");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);

  // Get unique makes from the vehicles data
  const availableMakes = useMemo(() => {
    const makes = vehicles.map((vehicle) => vehicle.make).filter(Boolean);
    const uniqueMakes = Array.from(new Set(makes)).sort();
    return ["All Makes", ...uniqueMakes];
  }, [vehicles]);

  const [selectedMake, setSelectedMake] = useState("All Makes");

  // Handle backend filtering
  useEffect(() => {
    const filters: any = {
      page: currentPage,
      limit: 12, // Show 12 vehicles per page
    };

    // Add search filter
    if (searchQuery.trim()) {
      filters.search = searchQuery.trim();
    }

    // Add make filter
    if (selectedMake !== "All Makes") {
      filters.make = selectedMake;
    }

    // Add condition filter
    if (selectedCondition !== "All Conditions") {
      filters.condition = selectedCondition;
    }

    // Add status filter
    if (selectedStatus !== "All Status") {
      filters.status = selectedStatus;
    }

    // Add price range filter
    if (selectedPriceRange !== "All Prices") {
      const priceMap: { [key: string]: { min?: number; max?: number } } = {
        "Under $20,000": { max: 20000 },
        "$20,000 - $30,000": { min: 20000, max: 30000 },
        "$30,000 - $40,000": { min: 30000, max: 40000 },
        "$40,000 - $50,000": { min: 40000, max: 50000 },
        "Over $50,000": { min: 50000 },
      };

      const priceRange = priceMap[selectedPriceRange];
      if (priceRange?.min) filters.minPrice = priceRange.min;
      if (priceRange?.max) filters.maxPrice = priceRange.max;
    }

    // Add sorting
    const sortMap: { [key: string]: { sortBy: string; sortOrder: string } } = {
      newest: { sortBy: "createdAt", sortOrder: "desc" },
      oldest: { sortBy: "createdAt", sortOrder: "asc" },
      "price-low": { sortBy: "price", sortOrder: "asc" },
      "price-high": { sortBy: "price", sortOrder: "desc" },
      "mileage-low": { sortBy: "mileage", sortOrder: "asc" },
      "mileage-high": { sortBy: "mileage", sortOrder: "desc" },
      "year-new": { sortBy: "year", sortOrder: "desc" },
      "year-old": { sortBy: "year", sortOrder: "asc" },
    };

    const sort = sortMap[sortBy];
    if (sort) {
      filters.sortBy = sort.sortBy;
      filters.sortOrder = sort.sortOrder;
    }

    setFilters(filters);
  }, [
    searchQuery,
    selectedMake,
    selectedCondition,
    selectedPriceRange,
    sortBy,
    currentPage,
    setFilters,
  ]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    selectedMake,
    selectedCondition,
    selectedStatus,
    selectedPriceRange,
    sortBy,
  ]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat("en-US").format(mileage);
  };

  // Loading state
  if (isLoading && vehicles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Vehicle Inventory
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover our extensive collection of quality vehicles
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Loading Vehicles...
            </h2>
            <p className="text-gray-600">
              Please wait while we fetch our latest inventory
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Vehicle Inventory
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover our extensive collection of quality vehicles
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Unable to Load Vehicles
            </h2>
            <p className="text-gray-600 text-center max-w-md">{error}</p>
            <button
              onClick={() => {
                clearError();
                refetch();
              }}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vehicle Card Component
  const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
    const handleReserve = () => {
      addToCart(vehicle, "RESERVATION");
    };

    const handleScheduleTestDrive = () => {
      addToCart(vehicle, "TEST_DRIVE");
    };

    const isReserved = vehicle.status === ("RESERVED" as Vehicle["status"]);
    const isSold = vehicle.status === ("SOLD" as Vehicle["status"]);
    const isAvailable = vehicle.status === ("AVAILABLE" as Vehicle["status"]);

    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
        {/* Image Section */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          {vehicle.images && vehicle.images.length > 0 ? (
            <img
              src={vehicle.images[0] || "/api/placeholder/400/300"}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Car className="h-16 w-16 text-gray-400" />
            </div>
          )}

          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {/* Featured Badge */}
            {vehicle.isFeatured && (
              <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Featured
              </div>
            )}

            {/* Reserved Badge */}
            {isReserved && (
              <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                <Heart className="h-3 w-3 mr-1" />
                Reserved
              </div>
            )}

            {/* Sold Badge */}
            {isSold && (
              <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                Sold
              </div>
            )}
          </div>

          {/* Condition Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                vehicle.condition === "NEW"
                  ? "bg-green-100 text-green-800"
                  : vehicle.condition === "CERTIFIED_PRE_OWNED"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {vehicle.condition === "CERTIFIED_PRE_OWNED"
                ? "Certified"
                : vehicle.condition}
            </span>
          </div>

          {/* Price Overlay */}
          <div className="absolute bottom-3 left-3 bg-black/75 text-white px-3 py-1 rounded-lg">
            <span className="text-lg font-bold">
              {formatPrice(vehicle.price)}
            </span>
            {vehicle.msrp && vehicle.msrp > vehicle.price && (
              <span className="text-sm text-gray-300 line-through ml-2">
                {formatPrice(vehicle.msrp)}
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          {vehicle.trim && <p className="text-gray-600 mb-3">{vehicle.trim}</p>}

          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center space-x-2">
              <Gauge className="h-4 w-4 text-gray-400" />
              <span>{formatMileage(vehicle.mileage)} miles</span>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-gray-400" />
              <span>{vehicle.transmission}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Fuel className="h-4 w-4 text-gray-400" />
              <span>{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{vehicle.location || "In Stock"}</span>
            </div>
          </div>

          {/* MPG (if available) */}
          {(vehicle.mpgCity || vehicle.mpgHighway) && (
            <div className="mb-4 text-sm text-gray-600">
              <span>
                {vehicle.mpgCity && vehicle.mpgHighway
                  ? `${vehicle.mpgCity}/${vehicle.mpgHighway} MPG (City/Hwy)`
                  : vehicle.mpgCombined
                  ? `${vehicle.mpgCombined} MPG Combined`
                  : ""}
              </span>
            </div>
          )}

          {/* Stock Number */}
          {vehicle.stockNumber && (
            <p className="text-xs text-gray-500 mb-4">
              Stock #{vehicle.stockNumber}
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* View Details Button */}
            <Link
              href={`/inventory/${vehicle.id}`}
              className="w-full bg-gray-100 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>View Details</span>
            </Link>

            {/* Reserve and Test Drive Buttons */}
            {isAvailable && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleReserve}
                  disabled={isInCart(vehicle.id, "RESERVATION")}
                  className={`py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1 text-sm font-medium ${
                    isInCart(vehicle.id, "RESERVATION")
                      ? "bg-orange-100 text-orange-600 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  <Heart className="h-3 w-3" />
                  <span>
                    {isInCart(vehicle.id, "RESERVATION")
                      ? "Reserved"
                      : "Reserve"}
                  </span>
                </button>

                <button
                  onClick={handleScheduleTestDrive}
                  disabled={isInCart(vehicle.id, "TEST_DRIVE")}
                  className={`py-2 px-3 rounded-lg transition-colors flex items-center justify-center space-x-1 text-sm font-medium ${
                    isInCart(vehicle.id, "TEST_DRIVE")
                      ? "bg-blue-100 text-blue-600 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <Car className="h-3 w-3" />
                  <span>
                    {isInCart(vehicle.id, "TEST_DRIVE")
                      ? "Scheduled"
                      : "Test Drive"}
                  </span>
                </button>
              </div>
            )}

            {/* Sold or Reserved Status */}
            {(isReserved || isSold) && (
              <div className="w-full py-2 px-4 rounded-lg bg-gray-100 text-gray-500 text-center text-sm font-medium">
                {isSold
                  ? "Sold - Contact for Similar"
                  : "Reserved - Contact for Waitlist"}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Vehicle Inventory
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover our extensive collection of quality vehicles
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Controls */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by make, model, year, or stock number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            {/* Results Count and Cart */}
            <div className="flex items-center space-x-4">
              {/* Cart Indicator */}
              {cartCount > 0 && (
                <Link
                  href="/cart/checkout"
                  className="relative flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Cart</span>
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                </Link>
              )}

              {/* Results Count */}
              <div className="text-gray-600">
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <>
                    <span className="font-semibold text-red-600">
                      {pagination.total || vehicles.length}
                    </span>{" "}
                    vehicles found
                  </>
                )}
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className={`mb-8 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Make Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Make
                </label>
                <select
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  {availableMakes.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status === "All Status" ? "All Availability" : status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  {priceRanges.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedMake("All Makes");
                    setSelectedCondition("All Conditions");
                    setSelectedStatus("All Status");
                    setSelectedPriceRange("All Prices");
                    setSortBy("newest");
                    setCurrentPage(1);
                  }}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {vehicles.length === 0 && !isLoading ? (
          <div className="text-center py-16">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No vehicles found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedMake("All Makes");
                setSelectedCondition("All Conditions");
                setSelectedStatus("All Status");
                setSelectedPriceRange("All Prices");
                setSortBy("newest");
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            {/* Vehicle Grid */}
            <div
              className={`grid gap-6 mb-8 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>

            {/* Loading indicator for more results */}
            {isLoading && vehicles.length > 0 && (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto" />
                <p className="text-gray-600 mt-2">Loading more vehicles...</p>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="flex space-x-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const page =
                        Math.max(
                          1,
                          Math.min(pagination.totalPages - 4, currentPage - 2)
                        ) + i;

                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg ${
                            currentPage === page
                              ? "bg-red-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage(
                      Math.min(pagination.totalPages, currentPage + 1)
                    )
                  }
                  disabled={currentPage === pagination.totalPages}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Contact Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Perfect Vehicle?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Contact our team today to schedule a test drive
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Kiambu Road, Nairobi</span>
            </div>
          </div>
          <Link
            href="/contact-us"
            className="inline-block mt-8 bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Contact Us Today
          </Link>
        </div>
      </div>
    </div>
  );
}
