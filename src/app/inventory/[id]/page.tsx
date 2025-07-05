// app/inventory/[id]/page.tsx - FIXED VERSION (no infinite re-render)
"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Share2,
  Printer,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Car,
  Shield,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Play,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Import backend hook and cart
import { useVehicles } from "@/lib/store/hooks/useVehicles";
import { useCart } from "@/lib/contexts/cartContext";
import type { Vehicle } from "../../../lib/types/vehicle.type";

// Mock similar vehicles data (you can replace this with API call later)
const similarVehicles = [
  {
    id: "2",
    make: "Honda",
    model: "Accord",
    year: 2021,
    price: 26500,
    mileage: 22000,
    image: "/api/placeholder/300/200",
  },
  {
    id: "3",
    make: "Nissan",
    model: "Altima",
    year: 2022,
    price: 24900,
    mileage: 18000,
    image: "/api/placeholder/300/200",
  },
  {
    id: "4",
    make: "Hyundai",
    model: "Sonata",
    year: 2021,
    price: 23500,
    mileage: 25000,
    image: "/api/placeholder/300/200",
  },
];

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;

  // Backend state - ONLY get the vehicles array and getVehicleById function
  const { vehicles, getVehicleById } = useVehicles();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cart functionality
  const { addToCart, isInCart } = useCart();

  // UI state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showFinanceCalculator, setShowFinanceCalculator] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Contact form state
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Finance calculator state
  const [downPayment, setDownPayment] = useState(5000);
  const [loanTerm, setLoanTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(4.9);

  // 🔧 FIXED: Fetch vehicle data - removed getVehicleById from dependency array
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Try to get vehicle from cache first
        const cachedVehicle = getVehicleById(vehicleId);
        if (cachedVehicle) {
          setVehicle(cachedVehicle);
          setContactData((prev) => ({
            ...prev,
            message: `I'm interested in the ${cachedVehicle.year} ${cachedVehicle.make} ${cachedVehicle.model} (Stock #${cachedVehicle.stockNumber})`,
          }));
          setIsLoading(false);
          return;
        }

        // If not in cache, fetch from API
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`);

        if (!response.ok) {
          throw new Error(`Vehicle not found: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.data) {
          setVehicle(data.data);
          setContactData((prev) => ({
            ...prev,
            message: `I'm interested in the ${data.data.year} ${data.data.make} ${data.data.model} (Stock #${data.data.stockNumber})`,
          }));
        } else {
          throw new Error("Vehicle not found");
        }
      } catch (err: any) {
        console.error("Failed to fetch vehicle:", err);
        setError(err.message || "Failed to load vehicle details");
      } finally {
        setIsLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicle();
    }
  }, [vehicleId]); // 🔧 FIXED: Only vehicleId in dependency array

  // 🔧 ALTERNATIVE: Check for vehicle in cache whenever vehicles array changes
  useEffect(() => {
    if (vehicleId && vehicles.length > 0 && !vehicle) {
      const cachedVehicle = vehicles.find((v) => v.id === vehicleId);
      if (cachedVehicle) {
        setVehicle(cachedVehicle);
        setIsLoading(false);
        setContactData((prev) => ({
          ...prev,
          message: `I'm interested in the ${cachedVehicle.year} ${cachedVehicle.make} ${cachedVehicle.model} (Stock #${cachedVehicle.stockNumber})`,
        }));
      }
    }
  }, [vehicles, vehicleId, vehicle]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">
            Loading Vehicle Details...
          </h2>
          <p className="text-gray-600 mt-2">
            Please wait while we fetch the information
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Vehicle Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "The vehicle you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => router.push("/inventory")}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  // Cart handlers
  const handleReserve = () => {
    addToCart(vehicle, "RESERVATION");
  };

  const handleScheduleTestDrive = () => {
    addToCart(vehicle, "TEST_DRIVE");
  };

  const calculateMonthlyPayment = () => {
    const principal = vehicle.price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm;

    if (monthlyRate === 0) return principal / numPayments;

    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    return monthlyPayment;
  };

  const ImageGallery = () => {
    const images =
      vehicle.images && vehicle.images.length > 0
        ? vehicle.images
        : ["/api/placeholder/800/600"];

    return (
      <div className="space-y-4">
        {/* Main Image */}
        <div
          className="relative bg-gray-200 rounded-2xl overflow-hidden"
          style={{ paddingBottom: "75%" }}
        >
          <img
            src={images[currentImageIndex]}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}

          {/* Actions */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-opacity">
              <Camera className="h-5 w-5 text-gray-700" />
            </button>
            {vehicle.videos && vehicle.videos.length > 0 && (
              <button className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-opacity">
                <Play className="h-5 w-5 text-gray-700" />
              </button>
            )}
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="grid grid-cols-6 gap-2">
            {images.slice(0, 6).map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative rounded-lg overflow-hidden border-2 transition-colors ${
                  currentImageIndex === index
                    ? "border-red-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                style={{ paddingBottom: "100%" }}
              >
                <img
                  src={image}
                  alt={`View ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const VehicleInfo = () => {
    const isReserved = vehicle.status === "RESERVED";
    const isSold = vehicle.status === "SOLD";
    const isAvailable = vehicle.status === "AVAILABLE";

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              <div className="flex space-x-2">
                {vehicle.condition === "CERTIFIED_PRE_OWNED" && (
                  <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-full font-bold">
                    ✅ Certified
                  </span>
                )}
                {vehicle.isFeatured && (
                  <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-full font-bold">
                    ⭐ Featured
                  </span>
                )}
                {isReserved && (
                  <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                    💚 Reserved
                  </span>
                )}
                {isSold && (
                  <span className="bg-gray-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                    🔒 Sold
                  </span>
                )}
              </div>
            </div>
            <p className="text-lg text-gray-600">
              {vehicle.trim && `${vehicle.trim} • `}Stock #{vehicle.stockNumber}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-3 rounded-full border-2 transition-colors ${
                isWishlisted
                  ? "border-red-500 bg-red-50 text-red-600"
                  : "border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-600"
              }`}
            >
              <Heart
                className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
              />
            </button>
            <button className="p-3 rounded-full border-2 border-gray-300 text-gray-600 hover:border-gray-400">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-3 rounded-full border-2 border-gray-300 text-gray-600 hover:border-gray-400">
              <Printer className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  ${vehicle.price.toLocaleString()}
                </span>
                {vehicle.msrp && vehicle.msrp > vehicle.price && (
                  <div className="text-right">
                    <div className="text-lg text-gray-500 line-through">
                      MSRP ${vehicle.msrp.toLocaleString()}
                    </div>
                    <div className="text-green-600 font-semibold">
                      Save ${(vehicle.msrp - vehicle.price).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
              <div className="text-gray-600">
                Est. ${Math.round(calculateMonthlyPayment()).toLocaleString()}
                /month •
                <button
                  onClick={() => setShowFinanceCalculator(true)}
                  className="text-red-600 hover:text-red-700 font-medium ml-1"
                >
                  Calculate Payment
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2">
              {isAvailable ? (
                <>
                  <button
                    onClick={handleReserve}
                    disabled={isInCart(vehicle.id, "RESERVATION")}
                    className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 ${
                      isInCart(vehicle.id, "RESERVATION")
                        ? "bg-orange-100 text-orange-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:scale-105"
                    }`}
                  >
                    {isInCart(vehicle.id, "RESERVATION")
                      ? "Reserved in Cart"
                      : "Reserve Vehicle"}
                  </button>
                  <button
                    onClick={handleScheduleTestDrive}
                    disabled={isInCart(vehicle.id, "TEST_DRIVE")}
                    className={`px-8 py-3 rounded-lg font-bold transition-colors ${
                      isInCart(vehicle.id, "TEST_DRIVE")
                        ? "bg-blue-100 text-blue-600 border-2 border-blue-200 cursor-not-allowed"
                        : "bg-white text-red-600 border-2 border-red-600 hover:bg-red-50"
                    }`}
                  >
                    {isInCart(vehicle.id, "TEST_DRIVE")
                      ? "Test Drive Scheduled"
                      : "Schedule Test Drive"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold shadow-lg hover:scale-105"
                  >
                    Contact Dealer
                  </button>
                  <div className="text-center text-sm text-gray-600">
                    {isSold
                      ? "Contact for similar vehicles"
                      : "Contact to join waitlist"}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <Gauge className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {vehicle.mileage}
            </div>
            <div className="text-sm text-gray-600">Miles</div>
          </div>

          {(vehicle.mpgCombined || vehicle.mpgCity) && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <Fuel className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {vehicle.mpgCombined || vehicle.mpgCity}
              </div>
              <div className="text-sm text-gray-600">MPG Combined</div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <Settings className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {vehicle.transmission?.split(" ")[0] || "Auto"}
            </div>
            <div className="text-sm text-gray-600">Transmission</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <Car className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {vehicle.drivetrain || "FWD"}
            </div>
            <div className="text-sm text-gray-600">Drivetrain</div>
          </div>
        </div>
      </div>
    );
  };

  const TabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Description */}
            {vehicle.description && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {vehicle.description}
                </p>
              </div>
            )}

            {/* Highlights */}
            {vehicle.highlights && vehicle.highlights.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Highlights
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {vehicle.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="bg-green-50 border border-green-200 rounded-lg p-3 text-center"
                    >
                      <Check className="h-5 w-5 text-green-600 mx-auto mb-1" />
                      <span className="text-sm font-medium text-green-800">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Features & Equipment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(showAllFeatures
                    ? vehicle.features
                    : vehicle.features.slice(0, 8)
                  ).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                {vehicle.features.length > 8 && (
                  <button
                    onClick={() => setShowAllFeatures(!showAllFeatures)}
                    className="mt-4 text-red-600 hover:text-red-700 font-medium"
                  >
                    {showAllFeatures
                      ? "Show Less"
                      : `Show All ${vehicle.features.length} Features`}
                  </button>
                )}
              </div>
            )}
          </div>
        );

      case "specifications":
        return (
          <div className="space-y-8">
            {/* Engine & Performance */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Engine & Performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {vehicle.engine && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-700">Engine</span>
                      <span className="text-gray-900">{vehicle.engine}</span>
                    </div>
                  )}
                  {vehicle.transmission && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-700">
                        Transmission
                      </span>
                      <span className="text-gray-900">
                        {vehicle.transmission}
                      </span>
                    </div>
                  )}
                  {vehicle.drivetrain && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-700">
                        Drivetrain
                      </span>
                      <span className="text-gray-900">
                        {vehicle.drivetrain}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {vehicle.fuelType && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-700">
                        Fuel Type
                      </span>
                      <span className="text-gray-900">{vehicle.fuelType}</span>
                    </div>
                  )}
                  {vehicle.mpgCity && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-700">
                        City MPG
                      </span>
                      <span className="text-gray-900">{vehicle.mpgCity}</span>
                    </div>
                  )}
                  {vehicle.mpgHighway && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-700">
                        Highway MPG
                      </span>
                      <span className="text-gray-900">
                        {vehicle.mpgHighway}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Vehicle Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {vehicle.exterior && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-700">
                        Exterior Color
                      </span>
                      <span className="text-gray-900">{vehicle.exterior}</span>
                    </div>
                  )}
                  {vehicle.interior && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-700">
                        Interior
                      </span>
                      <span className="text-gray-900">{vehicle.interior}</span>
                    </div>
                  )}
                  {vehicle.doors && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-700">Doors</span>
                      <span className="text-gray-900">{vehicle.doors}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {vehicle.seats && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-700">Seating</span>
                      <span className="text-gray-900">
                        {vehicle.seats} passengers
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">Condition</span>
                    <span className="text-gray-900">
                      {vehicle.condition.replace(/_/g, " ")}
                    </span>
                  </div>
                  {vehicle.vin && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="font-medium text-gray-700">VIN</span>
                      <span className="text-gray-900 font-mono text-sm">
                        {vehicle.vin}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "history":
        return (
          <div className="space-y-8">
            {/* Service History */}
            {vehicle.serviceHistory && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Service History
                </h3>
                <div className="space-y-3">
                  {Array.isArray(vehicle.serviceHistory) ? (
                    vehicle.serviceHistory.map((service, index) => (
                      <div
                        key={service.id || index}
                        className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {service.service}
                            </div>
                            <div className="text-sm text-gray-600">
                              {service.date}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {service.mileage?.toLocaleString()} miles
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-500" />
                        <div className="text-gray-700">
                          {vehicle.serviceHistory}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Inspection */}
            {vehicle.inspectionDate && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Inspection
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Shield className="h-6 w-6 text-green-600" />
                    <span className="font-semibold text-green-800">
                      Inspection Completed
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    Date: {vehicle.inspectionDate}
                  </div>
                  {vehicle.inspectionNotes && (
                    <div className="text-gray-700">
                      {vehicle.inspectionNotes}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* General Vehicle Info */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Vehicle Information
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Status</span>
                    <span className="text-blue-900">{vehicle.status}</span>
                  </div>
                  {vehicle.location && (
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-800">
                        Location
                      </span>
                      <span className="text-blue-900">{vehicle.location}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Listed</span>
                    <span className="text-blue-900">
                      {new Date(vehicle.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const ContactForm = () => {
    const handleSubmit = async () => {
      try {
        // TODO: Implement contact form submission to backend
        console.log("Contact form submitted:", contactData);
        alert("Thank you! We'll contact you shortly.");
        setShowContactForm(false);
      } catch (error) {
        alert("Failed to send message. Please try again.");
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Contact About This Vehicle
            </h3>
            <button onClick={() => setShowContactForm(false)}>
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={contactData.name}
                onChange={(e) =>
                  setContactData({ ...contactData, name: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={contactData.email}
                onChange={(e) =>
                  setContactData({ ...contactData, email: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={contactData.phone}
                onChange={(e) =>
                  setContactData({ ...contactData, phone: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                rows={3}
                value={contactData.message}
                onChange={(e) =>
                  setContactData({ ...contactData, message: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FinanceCalculator = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Payment Calculator
          </h3>
          <button onClick={() => setShowFinanceCalculator(false)}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              Vehicle Price: ${vehicle.price.toLocaleString()}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment: ${downPayment.toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max={vehicle.price}
              step="500"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Term: {loanTerm} months
            </label>
            <input
              type="range"
              min="24"
              max="84"
              step="12"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate: {interestRate}%
            </label>
            <input
              type="range"
              min="2.9"
              max="12.9"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                ${Math.round(calculateMonthlyPayment()).toLocaleString()}/month
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Estimated monthly payment
              </div>
            </div>
          </div>

          <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
            Apply for Financing
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => router.push("/inventory")}
              className="text-gray-500 hover:text-red-600"
            >
              Inventory
            </button>
            <span className="text-gray-300">/</span>
            <button
              onClick={() => router.push(`/inventory?make=${vehicle.make}`)}
              className="text-gray-500 hover:text-red-600"
            >
              {vehicle.make}
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">
              {vehicle.year} {vehicle.model}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-red-600 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Inventory</span>
        </button>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <ImageGallery />
          </div>

          {/* Right Column - Vehicle Info */}
          <div className="lg:col-span-1">
            <VehicleInfo />
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: "overview", label: "Overview" },
                { id: "specifications", label: "Specifications" },
                { id: "history", label: "History & Info" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            <TabContent />
          </div>
        </div>

        {/* Similar Vehicles */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Similar Vehicles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarVehicles.map((similarVehicle) => (
              <div
                key={similarVehicle.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={similarVehicle.image}
                  alt={`${similarVehicle.year} ${similarVehicle.make} ${similarVehicle.model}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">
                    {similarVehicle.year} {similarVehicle.make}{" "}
                    {similarVehicle.model}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${similarVehicle.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      {similarVehicle.mileage.toLocaleString()} miles
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      router.push(`/inventory/${similarVehicle.id}`)
                    }
                    className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Take the Next Step?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Contact our team today to schedule a test drive or get more
              information
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center space-x-3">
                <Phone className="h-6 w-6" />
                <span className="text-lg">(555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Mail className="h-6 w-6" />
                <span className="text-lg">info@ridgesautomotors.com</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <MapPin className="h-6 w-6" />
                <span className="text-lg">Kiambu Road, Nairobi</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowContactForm(true)}
                className="bg-white text-red-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-bold"
              >
                Contact Dealer
              </button>
              <button
                onClick={handleScheduleTestDrive}
                className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-red-600 transition-colors font-bold"
              >
                Schedule Test Drive
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showContactForm && <ContactForm />}
      {showFinanceCalculator && <FinanceCalculator />}
    </div>
  );
}
