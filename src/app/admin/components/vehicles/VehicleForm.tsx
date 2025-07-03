// src/app/admin/components/vehicles/VehicleForm.tsx
import React, { useState, useRef } from "react";
import {
  X,
  Upload,
  Plus,
  Trash2,
  Car,
  Camera,
  AlertCircle,
  Check,
  RefreshCw,
} from "lucide-react";
import type {
  Vehicle,
  VehicleCondition,
  VehicleStatus,
} from "../../../../lib/types/vehicle.type";

interface VehicleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vehicleData: Partial<Vehicle>) => Promise<void>;
  vehicle?: Vehicle | null;
  isLoading?: boolean;
}

const CONDITIONS: VehicleCondition[] = [
  "NEW",
  "USED",
  "CERTIFIED_PRE_OWNED",
  "FAIR",
  "POOR",
];

const STATUSES: VehicleStatus[] = [
  "AVAILABLE",
  "PENDING",
  "HOLD",
  "SOLD",
  "UNAVAILABLE",
  "IN_TRANSIT",
  "IN_SERVICE",
];

const FUEL_TYPES = [
  "Gasoline",
  "Diesel",
  "Electric",
  "Hybrid",
  "Plug-in Hybrid",
  "Flex Fuel",
  "Natural Gas",
  "Other",
];

const TRANSMISSION_TYPES = [
  "Automatic",
  "Manual",
  "CVT",
  "Semi-Automatic",
  "Dual-Clutch",
];

const DRIVETRAIN_TYPES = ["FWD", "RWD", "AWD", "4WD"];

const VehicleForm: React.FC<VehicleFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vehicle,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<Vehicle>>({
    vin: vehicle?.vin || "",
    stockNumber: vehicle?.stockNumber || "",
    make: vehicle?.make || "",
    model: vehicle?.model || "",
    year: vehicle?.year || new Date().getFullYear(),
    trim: vehicle?.trim || "",
    mileage: vehicle?.mileage || 0,
    price: vehicle?.price || 0,
    msrp: vehicle?.msrp || 0,
    condition: vehicle?.condition || "USED",
    status: vehicle?.status || "AVAILABLE",
    exterior: vehicle?.exterior || "",
    interior: vehicle?.interior || "",
    engine: vehicle?.engine || "",
    transmission: vehicle?.transmission || "",
    drivetrain: vehicle?.drivetrain || "",
    fuelType: vehicle?.fuelType || "",
    mpgCity: vehicle?.mpgCity || 0,
    mpgHighway: vehicle?.mpgHighway || 0,
    doors: vehicle?.doors || 4,
    seats: vehicle?.seats || 5,
    features: vehicle?.features || [],
    description: vehicle?.description || "",
    location: vehicle?.location || "",
    isFeatured: vehicle?.isFeatured || false,
    isOnline: vehicle?.isOnline !== false, // Default to true
    images: vehicle?.images || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragOver, setDragOver] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    let processedValue: any = value;

    if (type === "number") {
      processedValue = value === "" ? 0 : Number(value);
    } else if (type === "checkbox") {
      processedValue = (e.target as HTMLInputElement).checked;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setFormData((prev) => ({
              ...prev,
              images: [...(prev.images || []), e.target!.result as string],
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || [],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // UPDATED VIN VALIDATION - Only validate if VIN is provided
    if (formData.vin?.trim()) {
      if (formData.vin.length !== 17) {
        newErrors.vin = "VIN must be exactly 17 characters if provided";
      }
    }

    if (!formData.make?.trim()) {
      newErrors.make = "Make is required";
    }

    if (!formData.model?.trim()) {
      newErrors.model = "Model is required";
    }

    if (
      !formData.year ||
      formData.year < 1900 ||
      formData.year > new Date().getFullYear() + 1
    ) {
      newErrors.year = "Valid year is required";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (formData.mileage === undefined || formData.mileage < 0) {
      newErrors.mileage = "Valid mileage is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      console.log("🚗 Submitting vehicle form:", formData);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting vehicle:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  VIN
                </label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin || ""}
                  onChange={handleInputChange}
                  placeholder="17-character VIN (optional)"
                  maxLength={17}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent ${
                    errors.vin ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.vin && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.vin}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Number
                </label>
                <input
                  type="text"
                  name="stockNumber"
                  value={formData.stockNumber || ""}
                  onChange={handleInputChange}
                  placeholder="Stock #"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year || ""}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent ${
                    errors.year ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.year && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.year}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Make <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="make"
                  value={formData.make || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., Toyota"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent ${
                    errors.make ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.make && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.make}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., Camry"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent ${
                    errors.model ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.model && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.model}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trim
                </label>
                <input
                  type="text"
                  name="trim"
                  value={formData.trim || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., LE, XLE"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  name="condition"
                  value={formData.condition || "USED"}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  {CONDITIONS.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status || "AVAILABLE"}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing and Mileage */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Pricing & Mileage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || ""}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent ${
                    errors.price ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.price}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MSRP
                </label>
                <input
                  type="number"
                  name="msrp"
                  value={formData.msrp || ""}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mileage <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage || ""}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent ${
                    errors.mileage ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {errors.mileage && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.mileage}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Vehicle Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exterior Color
                </label>
                <input
                  type="text"
                  name="exterior"
                  value={formData.exterior || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., White, Black"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interior Color
                </label>
                <input
                  type="text"
                  name="interior"
                  value={formData.interior || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., Black, Tan"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Engine
                </label>
                <input
                  type="text"
                  name="engine"
                  value={formData.engine || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., 2.5L 4-Cylinder"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transmission
                </label>
                <select
                  name="transmission"
                  value={formData.transmission || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Select Transmission</option>
                  {TRANSMISSION_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drivetrain
                </label>
                <select
                  name="drivetrain"
                  value={formData.drivetrain || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Select Drivetrain</option>
                  {DRIVETRAIN_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Select Fuel Type</option>
                  {FUEL_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MPG City
                </label>
                <input
                  type="number"
                  name="mpgCity"
                  value={formData.mpgCity || ""}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MPG Highway
                </label>
                <input
                  type="number"
                  name="mpgHighway"
                  value={formData.mpgHighway || ""}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doors
                </label>
                <input
                  type="number"
                  name="doors"
                  value={formData.doors || ""}
                  onChange={handleInputChange}
                  placeholder="4"
                  min="2"
                  max="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Features
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addFeature())
                  }
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {formData.features && formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
            <div className="space-y-4">
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragOver
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                />
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag and drop images here, or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-gray-500">
                  Supports: JPG, PNG, GIF (max 10MB each)
                </p>
              </div>

              {/* Image Preview */}
              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Vehicle ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Description
            </h3>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              rows={4}
              placeholder="Vehicle description, history, special notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
          </div>

          {/* Options */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Options
            </h3>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured || false}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-600"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Featured Vehicle
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isOnline"
                  checked={formData.isOnline !== false}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-600"
                />
                <span className="ml-2 text-sm text-gray-700">Show Online</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {vehicle ? "Update Vehicle" : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
