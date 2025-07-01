/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";

// Mock data for vehicles
const mockVehicles = [
  {
    id: "1",
    make: "Toyota",
    model: "Camry",
    year: 2022,
    trim: "LE",
    price: 28500,
    msrp: 32000,
    mileage: 15000,
    condition: "USED",
    exterior: "Silver",
    interior: "Black Cloth",
    engine: "2.5L 4-Cylinder",
    transmission: "CVT Automatic",
    drivetrain: "FWD",
    fuelType: "Gasoline",
    mpgCity: 28,
    mpgHighway: 39,
    images: ["/api/placeholder/400/300"],
    features: ["Bluetooth", "Backup Camera", "Lane Departure Warning"],
    isFeatured: true,
    location: "Front Lot A-1",
    stockNumber: "RA001",
  },
  {
    id: "2",
    make: "Ford",
    model: "F-150",
    year: 2021,
    trim: "XLT SuperCrew",
    price: 42000,
    msrp: 48000,
    mileage: 25000,
    condition: "USED",
    exterior: "Oxford Blue",
    interior: "Medium Gray Cloth",
    engine: "3.5L V6 EcoBoost",
    transmission: "10-Speed Automatic",
    drivetrain: "4WD",
    fuelType: "Gasoline",
    mpgCity: 20,
    mpgHighway: 26,
    images: ["/api/placeholder/400/300"],
    features: ["SYNC 3", "Trailer Tow Package", "Remote Start"],
    isFeatured: false,
    location: "Back Lot B-3",
    stockNumber: "RA002",
  },
  {
    id: "3",
    make: "Honda",
    model: "Accord",
    year: 2023,
    trim: "Sport",
    price: 32000,
    msrp: 35000,
    mileage: 8000,
    condition: "USED",
    exterior: "Platinum White Pearl",
    interior: "Black Leather",
    engine: "1.5L Turbo 4-Cylinder",
    transmission: "CVT Automatic",
    drivetrain: "FWD",
    fuelType: "Gasoline",
    mpgCity: 30,
    mpgHighway: 38,
    images: ["/api/placeholder/400/300"],
    features: ["Honda Sensing", "Wireless Charging", "Sunroof"],
    isFeatured: true,
    location: "Showroom Floor",
    stockNumber: "RA003",
  },
  {
    id: "4",
    make: "Jeep",
    model: "Grand Cherokee",
    year: 2020,
    trim: "Limited",
    price: 38500,
    msrp: 45000,
    mileage: 35000,
    condition: "CERTIFIED_PRE_OWNED",
    exterior: "Granite Crystal Metallic",
    interior: "Black Leather",
    engine: "3.6L V6",
    transmission: "8-Speed Automatic",
    drivetrain: "AWD",
    fuelType: "Gasoline",
    mpgCity: 23,
    mpgHighway: 30,
    images: ["/api/placeholder/400/300"],
    features: ["Uconnect 4C Nav", "Blind Spot Monitoring", "Panoramic Sunroof"],
    isFeatured: true,
    location: "Front Lot A-2",
    stockNumber: "RA004",
  },
  {
    id: "5",
    make: "BMW",
    model: "3 Series",
    year: 2022,
    trim: "330i",
    price: 45000,
    msrp: 48000,
    mileage: 12000,
    condition: "USED",
    exterior: "Jet Black",
    interior: "Black Leather",
    engine: "2.0L Turbo 4-Cylinder",
    transmission: "8-Speed Automatic",
    drivetrain: "RWD",
    fuelType: "Gasoline",
    mpgCity: 26,
    mpgHighway: 36,
    images: ["/api/placeholder/400/300"],
    features: ["iDrive", "Heated Seats", "Premium Sound"],
    isFeatured: false,
    location: "Premium Section",
    stockNumber: "RA005",
  },
  {
    id: "6",
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2021,
    trim: "C300",
    price: 41000,
    msrp: 44000,
    mileage: 18000,
    condition: "USED",
    exterior: "Polar White",
    interior: "Black Leather",
    engine: "2.0L Turbo 4-Cylinder",
    transmission: "9-Speed Automatic",
    drivetrain: "RWD",
    fuelType: "Gasoline",
    mpgCity: 24,
    mpgHighway: 35,
    images: ["/api/placeholder/400/300"],
    features: ["MBUX", "LED Headlights", "Premium Audio"],
    isFeatured: false,
    location: "Luxury Section",
    stockNumber: "RA006",
  },
];

const makes = [
  "All Makes",
  "Toyota",
  "Ford",
  "Honda",
  "Jeep",
  "BMW",
  "Mercedes-Benz",
  "Chevrolet",
  "Nissan",
];

const conditions = ["All Conditions", "NEW", "USED", "CERTIFIED_PRE_OWNED"];
const priceRanges = [
  "All Prices",
  "Under $20,000",
  "$20,000 - $30,000",
  "$30,000 - $40,000",
  "$40,000 - $50,000",
  "Over $50,000",
];

export default function VehicleInventoryPage() {
  const [vehicles] = useState(mockVehicles);
  const [filteredVehicles, setFilteredVehicles] = useState(mockVehicles);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMake, setSelectedMake] = useState("All Makes");
  const [selectedBodyType, setSelectedBodyType] = useState("All Body Types");
  const [selectedCondition, setSelectedCondition] = useState("All Conditions");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All Prices");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const vehiclesPerPage = 12;

  // Filtering logic
  useEffect(() => {
    let filtered = vehicles;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (vehicle) =>
          `${vehicle.year} ${vehicle.make} ${vehicle.model}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          vehicle.stockNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Make filter
    if (selectedMake !== "All Makes") {
      filtered = filtered.filter((vehicle) => vehicle.make === selectedMake);
    }

    // Condition filter
    if (selectedCondition !== "All Conditions") {
      filtered = filtered.filter(
        (vehicle) => vehicle.condition === selectedCondition
      );
    }

    // Price range filter
    if (selectedPriceRange !== "All Prices") {
      filtered = filtered.filter((vehicle) => {
        switch (selectedPriceRange) {
          case "Under $20,000":
            return vehicle.price < 20000;
          case "$20,000 - $30,000":
            return vehicle.price >= 20000 && vehicle.price < 30000;
          case "$30,000 - $40,000":
            return vehicle.price >= 30000 && vehicle.price < 40000;
          case "$40,000 - $50,000":
            return vehicle.price >= 40000 && vehicle.price < 50000;
          case "Over $50,000":
            return vehicle.price >= 50000;
          default:
            return true;
        }
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "year-new":
          return b.year - a.year;
        case "year-old":
          return a.year - b.year;
        case "mileage-low":
          return a.mileage - b.mileage;
        case "mileage-high":
          return b.mileage - a.mileage;
        default:
          return b.year - a.year; // newest first
      }
    });

    setFilteredVehicles(filtered);
    setCurrentPage(1);
  }, [
    vehicles,
    searchQuery,
    selectedMake,
    selectedBodyType,
    selectedCondition,
    selectedPriceRange,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);
  const startIndex = (currentPage - 1) * vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(
    startIndex,
    startIndex + vehiclesPerPage
  );

  const VehicleCard = ({ vehicle }: { vehicle: any }) => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-red-500 group flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0">
        <img
          src={vehicle.images[0]}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          {vehicle.condition === "CERTIFIED_PRE_OWNED" && (
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
              ✅ Certified
            </span>
          )}
          {vehicle.condition === "NEW" && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
              🆕 New
            </span>
          )}
          {vehicle.isFeatured && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-95 rounded-full flex items-center justify-center hover:bg-red-50 transition-all duration-300 shadow-lg hover:scale-110">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-600" />
        </button>

        {/* Stock Number */}
        <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          Stock #{vehicle.stockNumber}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-tight">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-gray-600 text-sm">{vehicle.trim}</p>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <Gauge className="h-3 w-3" />
            <span>{vehicle.mileage.toLocaleString()} miles</span>
          </div>
          <div className="flex items-center space-x-1">
            <Fuel className="h-3 w-3" />
            <span>
              {vehicle.mpgCity}/{vehicle.mpgHighway} mpg
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Settings className="h-3 w-3" />
            <span>{vehicle.transmission.split(" ")[0]}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Car className="h-3 w-3" />
            <span>{vehicle.drivetrain}</span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4 flex-grow">
          <div className="flex flex-wrap gap-1">
            {vehicle.features
              .slice(0, 2)
              .map(
                (
                  feature:
                    | string
                    | number
                    | bigint
                    | boolean
                    | React.ReactElement<
                        unknown,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactPortal
                        | React.ReactElement<
                            unknown,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined,
                  index: React.Key | null | undefined
                ) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {feature}
                  </span>
                )
              )}
            {vehicle.features.length > 2 && (
              <span className="text-gray-500 text-xs">
                +{vehicle.features.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Actions */}
        <div className="border-t pt-3 mt-auto">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">
                  ${vehicle.price.toLocaleString()}
                </span>
                {vehicle.msrp > vehicle.price && (
                  <span className="text-xs text-gray-500 line-through">
                    ${vehicle.msrp.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center justify-center">
              <Eye className="h-4 w-4 mr-1" />
              View
            </button>
            <button className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white py-2 px-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium shadow-lg hover:scale-105 text-sm">
              <Link href="/vehicle-details">Details</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Sidebar = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        <button
          onClick={() => {
            setSearchQuery("");
            setSelectedMake("All Makes");
            setSelectedBodyType("All Body Types");
            setSelectedCondition("All Conditions");
            setSelectedPriceRange("All Prices");
          }}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Make Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Make
          </label>
          <select
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          >
            {makes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        {/* Condition Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Condition
          </label>
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          >
            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price Range
          </label>
          <select
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
          >
            {priceRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Quick Filters
          </label>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
              Featured Vehicles
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
              Under $25,000
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
              Certified Pre-Owned
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
              Low Mileage
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-gradient-to-br from-red-600 to-red-700 text-white p-4 rounded-xl">
          <h3 className="font-bold mb-2">Need Help?</h3>
          <p className="text-sm mb-3 opacity-90">
            Our sales team is ready to assist you.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Kiambu Road, Nairobi</span>
            </div>
          </div>
          <button className="w-full bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium mt-3">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );

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

            {/* Results Count */}
            <div className="text-gray-600">
              <span className="font-semibold text-red-600">
                {filteredVehicles.length}
              </span>{" "}
              vehicles found
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-new">Year: Newest</option>
                <option value="year-old">Year: Oldest</option>
                <option value="mileage-low">Mileage: Low to High</option>
                <option value="mileage-high">Mileage: High to Low</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Desktop */}
          <div
            className={`lg:block ${
              showFilters ? "block" : "hidden"
            } lg:col-span-1`}
          >
            <Sidebar />
          </div>

          {/* Vehicle Grid */}
          <div className="lg:col-span-3">
            {currentVehicles.length > 0 ? (
              <>
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {currentVehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-12">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            currentPage === page
                              ? "bg-red-600 text-white"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No vehicles found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedMake("All Makes");
                    setSelectedCondition("All Conditions");
                    setSelectedPriceRange("All Prices");
                  }}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
