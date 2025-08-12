"use client";
import React, { useState, useEffect } from "react";
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
} from "lucide-react";

// Mock vehicle data
const vehicleData = {
  id: "1",
  make: "Toyota",
  model: "Camry",
  year: 2022,
  trim: "LE",
  price: 28500,
  msrp: 32000,
  mileage: 15000,
  condition: "USED",
  status: "AVAILABLE",
  exterior: "Silver Metallic",
  interior: "Black Cloth",
  engine: "2.5L 4-Cylinder DOHC",
  transmission: "CVT Automatic",
  drivetrain: "FWD",
  fuelType: "Gasoline",
  mpgCity: 28,
  mpgHighway: 39,
  mpgCombined: 32,
  doors: 4,
  seats: 5,
  vin: "1HGBH41JXMN109186",
  stockNumber: "RA001",
  location: "Front Lot A-1",
  images: [
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
  ],
  features: [
    "Bluetooth Connectivity",
    "Backup Camera",
    "Lane Departure Warning",
    "Automatic Emergency Braking",
    "Apple CarPlay",
    "Android Auto",
    "Adaptive Cruise Control",
    "LED Headlights",
    "Dual-Zone Climate Control",
    "Power Windows",
    "Power Locks",
    "Keyless Entry",
  ],
  packages: ["Safety Sense 2.0", "Convenience Package"],
  description:
    "Well-maintained Toyota Camry with excellent fuel economy and modern safety features. Single owner, non-smoker vehicle with complete service history.",
  highlights: [
    "Low Mileage",
    "Excellent Condition",
    "Recent Trade-In",
    "Clean Title",
  ],
  inspectionDate: "2024-01-15",
  inspectionNotes: "Passed 150-point inspection with flying colors.",
  serviceHistory: [
    {
      date: "2024-01-10",
      service: "Oil Change & Multi-Point Inspection",
      mileage: 14800,
    },
    {
      date: "2023-09-15",
      service: "Tire Rotation & Brake Inspection",
      mileage: 12500,
    },
    { date: "2023-05-20", service: "Scheduled Maintenance", mileage: 10000 },
  ],
  warranty: {
    powertrain: "60 months / 60,000 miles remaining",
    bumperToBumper: "36 months / 36,000 miles remaining",
    additional: "90-day limited warranty included",
  },
};

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

  // Initialize contact message when component loads
  useEffect(() => {
    setContactData((prev) => ({
      ...prev,
      message: `I'm interested in the ${vehicleData.year} ${vehicleData.make} ${vehicleData.model} (Stock #${vehicleData.stockNumber})`,
    }));
  }, []);

  // Finance calculator state
  const [downPayment, setDownPayment] = useState(5000);
  const [loanTerm, setLoanTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(4.9);

  const calculateMonthlyPayment = () => {
    const principal = vehicleData.price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm;

    if (monthlyRate === 0) return principal / numPayments;

    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    return monthlyPayment;
  };

  const ImageGallery = () => (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative bg-gray-200 rounded-2xl overflow-hidden"
        style={{ paddingBottom: "75%" }}
      >
        <img
          src={vehicleData.images[currentImageIndex]}
          alt={`${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Navigation Arrows */}
        <button
          onClick={() =>
            setCurrentImageIndex((prev) =>
              prev === 0 ? vehicleData.images.length - 1 : prev - 1
            )
          }
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={() =>
            setCurrentImageIndex((prev) =>
              prev === vehicleData.images.length - 1 ? 0 : prev + 1
            )
          }
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
          {currentImageIndex + 1} / {vehicleData.images.length}
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-opacity">
            <Camera className="h-5 w-5 text-gray-700" />
          </button>
          <button className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-opacity">
            <Play className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-6 gap-2">
        {vehicleData.images.map((image, index) => (
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
    </div>
  );

  const VehicleInfo = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {vehicleData.year} {vehicleData.make} {vehicleData.model}
            </h1>
            <div className="flex space-x-2">
              {vehicleData.condition === "CERTIFIED_PRE_OWNED" && (
                <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-full font-bold">
                  ✅ Certified
                </span>
              )}
              {vehicleData.highlights.includes("Low Mileage") && (
                <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-bold">
                  🔹 Low Miles
                </span>
              )}
            </div>
          </div>
          <p className="text-lg text-gray-600">
            {vehicleData.trim} • Stock #{vehicleData.stockNumber}
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
                ${vehicleData.price.toLocaleString()}
              </span>
              {vehicleData.msrp > vehicleData.price && (
                <div className="text-right">
                  <div className="text-lg text-gray-500 line-through">
                    MSRP ${vehicleData.msrp.toLocaleString()}
                  </div>
                  <div className="text-green-600 font-semibold">
                    Save $
                    {(vehicleData.msrp - vehicleData.price).toLocaleString()}
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

          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setShowContactForm(true)}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold shadow-lg hover:scale-105"
            >
              Contact Dealer
            </button>
            <button className="bg-white text-red-600 border-2 border-red-600 px-8 py-3 rounded-lg hover:bg-red-50 transition-colors font-bold">
              Schedule Test Drive
            </button>
          </div>
        </div>
      </div>

      {/* Quick Specs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <Gauge className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {vehicleData.mileage.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Miles</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <Fuel className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {vehicleData.mpgCombined}
          </div>
          <div className="text-sm text-gray-600">MPG Combined</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <Settings className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {vehicleData.transmission.split(" ")[0]}
          </div>
          <div className="text-sm text-gray-600">Transmission</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <Car className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {vehicleData.drivetrain}
          </div>
          <div className="text-sm text-gray-600">Drivetrain</div>
        </div>
      </div>
    </div>
  );

  const TabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {vehicleData.description}
              </p>
            </div>

            {/* Highlights */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Highlights
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {vehicleData.highlights.map((highlight, index) => (
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

            {/* Features */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Features & Equipment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(showAllFeatures
                  ? vehicleData.features
                  : vehicleData.features.slice(0, 8)
                ).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              {vehicleData.features.length > 8 && (
                <button
                  onClick={() => setShowAllFeatures(!showAllFeatures)}
                  className="mt-4 text-red-600 hover:text-red-700 font-medium"
                >
                  {showAllFeatures
                    ? "Show Less"
                    : `Show All ${vehicleData.features.length} Features`}
                </button>
              )}
            </div>
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
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">Engine</span>
                    <span className="text-gray-900">{vehicleData.engine}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">
                      Transmission
                    </span>
                    <span className="text-gray-900">
                      {vehicleData.transmission}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">
                      Drivetrain
                    </span>
                    <span className="text-gray-900">
                      {vehicleData.drivetrain}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">Fuel Type</span>
                    <span className="text-gray-900">
                      {vehicleData.fuelType}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">City MPG</span>
                    <span className="text-gray-900">{vehicleData.mpgCity}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">
                      Highway MPG
                    </span>
                    <span className="text-gray-900">
                      {vehicleData.mpgHighway}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Exterior & Interior */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Exterior & Interior
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">
                      Exterior Color
                    </span>
                    <span className="text-gray-900">
                      {vehicleData.exterior}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">Interior</span>
                    <span className="text-gray-900">
                      {vehicleData.interior}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">Doors</span>
                    <span className="text-gray-900">{vehicleData.doors}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">Seating</span>
                    <span className="text-gray-900">
                      {vehicleData.seats} passengers
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">Condition</span>
                    <span className="text-gray-900">
                      {vehicleData.condition.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-700">VIN</span>
                    <span className="text-gray-900 font-mono text-sm">
                      {vehicleData.vin}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "history":
        return (
          <div className="space-y-8">
            {/* Service History */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Service History
              </h3>
              <div className="space-y-3">
                {vehicleData.serviceHistory.map((service, index) => (
                  <div
                    key={index}
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
                      {service.mileage.toLocaleString()} miles
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inspection */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Inspection
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <Shield className="h-6 w-6 text-green-600" />
                  <span className="font-semibold text-green-800">
                    150-Point Inspection Completed
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  Date: {vehicleData.inspectionDate}
                </div>
                <div className="text-gray-700">
                  {vehicleData.inspectionNotes}
                </div>
              </div>
            </div>

            {/* Warranty */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Warranty Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between bg-blue-50 p-3 rounded-lg">
                  <span className="font-medium text-blue-800">
                    Powertrain Warranty
                  </span>
                  <span className="text-blue-900">
                    {vehicleData.warranty.powertrain}
                  </span>
                </div>
                <div className="flex justify-between bg-blue-50 p-3 rounded-lg">
                  <span className="font-medium text-blue-800">
                    Bumper-to-Bumper
                  </span>
                  <span className="text-blue-900">
                    {vehicleData.warranty.bumperToBumper}
                  </span>
                </div>
                <div className="flex justify-between bg-green-50 p-3 rounded-lg">
                  <span className="font-medium text-green-800">
                    Dealer Warranty
                  </span>
                  <span className="text-green-900">
                    {vehicleData.warranty.additional}
                  </span>
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
    const handleSubmit = () => {
      // Handle form submission here
      console.log("Contact form submitted:", contactData);
      setShowContactForm(false);
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
              Vehicle Price: ${vehicleData.price.toLocaleString()}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Down Payment: ${downPayment.toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max={vehicleData.price}
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
            <button className="text-gray-500 hover:text-red-600">
              Inventory
            </button>
            <span className="text-gray-300">/</span>
            <button className="text-gray-500 hover:text-red-600">
              {vehicleData.make}
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">
              {vehicleData.year} {vehicleData.model}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button className="flex items-center space-x-2 text-gray-600 hover:text-red-600 mb-6">
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
                { id: "history", label: "History & Warranty" },
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
            {similarVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={vehicle.image}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${vehicle.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      {vehicle.mileage.toLocaleString()} miles
                    </span>
                  </div>
                  <button className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
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
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-red-600 transition-colors font-bold">
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
