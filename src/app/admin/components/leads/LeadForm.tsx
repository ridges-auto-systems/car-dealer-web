/* eslint-disable @typescript-eslint/no-explicit-any */
// admin/components/leads/LeadForm.tsx
import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Car,
  DollarSign,
  MessageSquare,
  RefreshCw,
  CreditCard,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useLeads } from "../../hooks/useLeads";
import type {
  CreateLeadRequest,
  LeadTimeline,
  TradeVehicleInfo,
  Lead,
} from "../../../../lib/types/lead.type";

// ============================================================================
// INTERFACES
// ============================================================================

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (leadData: CreateLeadRequest) => void;
  initialData?: Partial<Lead> | null;
  mode?: "create" | "edit";
  title?: string;
}

interface FormData {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Lead Details
  vehicleId: string;
  vehicleSearchTerm: string;
  message: string;
  source: string;
  timeline: LeadTimeline;
  budgetRange: string;

  // Preferences
  preferredContact: "phone" | "email" | "text";
  bestTimeToCall: "morning" | "afternoon" | "evening";

  // Options
  financingNeeded: boolean;
  interestedInTrade: boolean;

  // Trade-in Info (conditional)
  tradeVehicleInfo: TradeVehicleInfo;
}

interface FormErrors {
  [key: string]: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const TIMELINE_OPTIONS: { value: LeadTimeline; label: string }[] = [
  { value: "immediately", label: "Immediately" },
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
  { value: "next_month", label: "Next Month" },
  { value: "just_browsing", label: "Just Browsing" },
];

const BUDGET_RANGES = [
  { value: "under-1m", label: "Under 1M KES" },
  { value: "1m-2m", label: "1M - 2M KES" },
  { value: "2m-3m", label: "2M - 3M KES" },
  { value: "3m-5m", label: "3M - 5M KES" },
  { value: "over-5m", label: "Over 5M KES" },
];

const CONTACT_PREFERENCES = [
  { value: "phone", label: "Phone Call" },
  { value: "email", label: "Email" },
  { value: "text", label: "Text Message" },
];

const TIME_PREFERENCES = [
  { value: "morning", label: "Morning (9AM - 12PM)" },
  { value: "afternoon", label: "Afternoon (12PM - 5PM)" },
  { value: "evening", label: "Evening (5PM - 8PM)" },
];

const LEAD_SOURCES = [
  { value: "website_form", label: "Website Form" },
  { value: "phone_inquiry", label: "Phone Inquiry" },
  { value: "walk_in", label: "Walk-in" },
  { value: "referral", label: "Referral" },
  { value: "social_media", label: "Social Media" },
  { value: "advertisement", label: "Advertisement" },
  { value: "other", label: "Other" },
];

const VEHICLE_CONDITIONS = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const LeadForm: React.FC<LeadFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "create",
  title,
}) => {
  const { createLead, updateLead, isLoading } = useLeads();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    vehicleId: "",
    vehicleSearchTerm: "",
    message: "",
    source: "website_form",
    timeline: "this_month",
    budgetRange: "",
    preferredContact: "phone",
    bestTimeToCall: "morning",
    financingNeeded: true,
    interestedInTrade: false,
    tradeVehicleInfo: {
      make: "",
      model: "",
      year: undefined,
      mileage: undefined,
      condition: "",
      details: "",
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with existing data if editing
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData((prev) => ({
        ...prev,
        firstName: initialData.customerName?.split(" ")[0] || "",
        lastName: initialData.customerName?.split(" ").slice(1).join(" ") || "",
        // Add other fields as needed
      }));
    }
  }, [mode, initialData]);

  // ============================================================================
  // VALIDATION
  // ============================================================================

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      // Basic Information
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      }
    }

    if (step === 2) {
      // Lead Details
      if (!formData.message.trim()) {
        newErrors.message = "Please provide some details about your inquiry";
      }
    }

    if (step === 3 && formData.interestedInTrade) {
      // Trade-in validation
      if (!formData.tradeVehicleInfo.make?.trim()) {
        newErrors.tradeMake = "Vehicle make is required";
      }
      if (!formData.tradeVehicleInfo.model?.trim()) {
        newErrors.tradeModel = "Vehicle model is required";
      }
      if (!formData.tradeVehicleInfo.year) {
        newErrors.tradeYear = "Vehicle year is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleTradeInfoChange = (
    field: keyof TradeVehicleInfo,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      tradeVehicleInfo: {
        ...prev.tradeVehicleInfo,
        [field]: value,
      },
    }));

    // Clear trade-in errors
    const tradeField =
      typeof field === "string"
        ? `trade${field.charAt(0).toUpperCase() + field.slice(1)}`
        : "";
    if (errors[tradeField]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[tradeField];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const leadData: CreateLeadRequest = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        vehicleId: formData.vehicleId || undefined,
        message: formData.message,
        timeline: formData.timeline,
        budgetRange: formData.budgetRange,
        financingNeeded: formData.financingNeeded,
        interestedInTrade: formData.interestedInTrade,
        source: formData.source,
        tradeVehicleInfo: formData.interestedInTrade
          ? formData.tradeVehicleInfo
          : undefined,
      };

      if (mode === "create") {
        await createLead(leadData);
      } else if (mode === "edit" && initialData?.id) {
        await updateLead(initialData.id, leadData);
      }

      if (onSubmit) {
        onSubmit(leadData);
      }

      onClose();
    } catch (error) {
      console.error("Error submitting lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderInput = (
    field: keyof FormData,
    label: string,
    type: string = "text",
    placeholder?: string,
    icon?: React.ComponentType<any>
  ) => {
    const IconComponent = icon;
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}{" "}
          {["firstName", "lastName", "email", "phone", "message"].includes(
            field
          ) && "*"}
        </label>
        <div className="relative">
          {IconComponent && (
            <IconComponent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          )}
          <input
            type={type}
            value={formData[field] as string}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={placeholder}
            className={`w-full ${
              IconComponent ? "pl-10" : "pl-4"
            } pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${
              errors[field] ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        {errors[field] && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors[field]}
          </p>
        )}
      </div>
    );
  };

  const renderSelect = (
    field: keyof FormData,
    label: string,
    options: { value: string; label: string }[],
    required?: boolean
  ) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && "*"}
      </label>
      <select
        value={formData[field] as string}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent ${
          errors[field] ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[field] && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {errors[field]}
        </p>
      )}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <User className="h-12 w-12 text-red-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900">
          Customer Information
        </h3>
        <p className="text-gray-600">Basic contact details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput("firstName", "First Name", "text", "John", User)}
        {renderInput("lastName", "Last Name", "text", "Doe", User)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderInput(
          "email",
          "Email Address",
          "email",
          "john@example.com",
          Mail
        )}
        {renderInput("phone", "Phone Number", "tel", "+254 700 123 456", Phone)}
      </div>

      {renderSelect("source", "How did you hear about us?", LEAD_SOURCES)}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Car className="h-12 w-12 text-red-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900">Vehicle Interest</h3>
        <p className="text-gray-600">What are you looking for?</p>
      </div>

      {renderInput(
        "vehicleSearchTerm",
        "Vehicle of Interest",
        "text",
        "e.g., 2022 Toyota Camry or Stock #RA001",
        Car
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Message *
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            placeholder="Tell us about your vehicle needs, preferences, or any questions..."
            rows={4}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
        {errors.message && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderSelect("timeline", "Timeline", TIMELINE_OPTIONS)}
        {renderSelect("budgetRange", "Budget Range", BUDGET_RANGES)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderSelect(
          "preferredContact",
          "Preferred Contact Method",
          CONTACT_PREFERENCES
        )}
        {renderSelect("bestTimeToCall", "Best Time to Call", TIME_PREFERENCES)}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <DollarSign className="h-12 w-12 text-red-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900">Additional Options</h3>
        <p className="text-gray-600">Financing and trade-in preferences</p>
      </div>

      {/* Financing Option */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.financingNeeded}
            onChange={(e) =>
              handleInputChange("financingNeeded", e.target.checked)
            }
            className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-600"
          />
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">
              I need financing assistance
            </span>
          </div>
        </label>
      </div>

      {/* Trade-in Option */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={formData.interestedInTrade}
            onChange={(e) =>
              handleInputChange("interestedInTrade", e.target.checked)
            }
            className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-600"
          />
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900">
              I have a vehicle to trade in
            </span>
          </div>
        </label>
      </div>

      {/* Trade-in Details */}
      {formData.interestedInTrade && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
          <h4 className="font-semibold text-blue-900 mb-4">
            Trade-in Vehicle Details
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Make *
              </label>
              <input
                type="text"
                value={formData.tradeVehicleInfo.make || ""}
                onChange={(e) => handleTradeInfoChange("make", e.target.value)}
                placeholder="e.g., Toyota"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent ${
                  errors.tradeMake ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.tradeMake && (
                <p className="mt-1 text-sm text-red-600">{errors.tradeMake}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Model *
              </label>
              <input
                type="text"
                value={formData.tradeVehicleInfo.model || ""}
                onChange={(e) => handleTradeInfoChange("model", e.target.value)}
                placeholder="e.g., Camry"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent ${
                  errors.tradeModel ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.tradeModel && (
                <p className="mt-1 text-sm text-red-600">{errors.tradeModel}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Year *
              </label>
              <input
                type="number"
                value={formData.tradeVehicleInfo.year || ""}
                onChange={(e) =>
                  handleTradeInfoChange("year", parseInt(e.target.value))
                }
                placeholder="2020"
                min="1990"
                max="2024"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent ${
                  errors.tradeYear ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.tradeYear && (
                <p className="mt-1 text-sm text-red-600">{errors.tradeYear}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mileage (KM)
              </label>
              <input
                type="number"
                value={formData.tradeVehicleInfo.mileage || ""}
                onChange={(e) =>
                  handleTradeInfoChange("mileage", parseInt(e.target.value))
                }
                placeholder="50,000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Condition
              </label>
              <select
                value={formData.tradeVehicleInfo.condition || ""}
                onChange={(e) =>
                  handleTradeInfoChange("condition", e.target.value)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              >
                <option value="">Select Condition</option>
                {VEHICLE_CONDITIONS.map((condition) => (
                  <option key={condition.value} value={condition.value}>
                    {condition.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Details
            </label>
            <textarea
              value={formData.tradeVehicleInfo.details || ""}
              onChange={(e) => handleTradeInfoChange("details", e.target.value)}
              placeholder="Tell us more about your vehicle's condition, service history, modifications, etc."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              currentStep >= step
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step}
          </div>
          {step < 3 && (
            <div
              className={`w-16 h-1 mx-2 ${
                currentStep > step ? "bg-red-600" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {title || (mode === "edit" ? "Edit Lead" : "Add New Lead")}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Step {currentStep} of 3
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {renderStepIndicator()}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Error Display */}
            {/* Error Display removed because 'error' is not available from useLeads */}

            {/* Footer */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSubmitting || isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>
                          {mode === "edit" ? "Update Lead" : "Create Lead"}
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;
