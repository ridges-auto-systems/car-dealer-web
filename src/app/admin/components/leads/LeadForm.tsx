/* eslint-disable @typescript-eslint/no-explicit-any */
// admin/components/leads/LeadForm.tsx
import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Car,
  MessageSquare,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useLeads } from "@/lib/store/hooks/useLeads";
import type {
  CreateLeadRequest,
  LeadTimeline,
  Lead,
} from "../../../../lib/types/lead.type";

// ============================================================================
// INTERFACES
// ============================================================================

export interface LeadFormProps {
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const LeadForm = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "create",
  title,
}: LeadFormProps) => {
  const { createLead, updateLead, isLoading } = useLeads();

  // Debug logging
  useEffect(() => {
    console.log("LeadForm mounted, isLoading:", isLoading);
  }, [isLoading]);

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
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with existing data if editing
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData((prev) => ({
        ...prev,
        firstName: initialData.customerName?.split(" ")[0] || "",
        lastName: initialData.customerName?.split(" ").slice(1).join(" ") || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        vehicleSearchTerm: initialData.vehicleName || "",
        message: initialData.notes || "",
        source: initialData.source || "website_form",
        timeline: initialData.timeline || "this_month",
        budgetRange: initialData.budgetRange || "",
      }));
    }
  }, [mode, initialData]);

  // Reset form when opening for create mode
  useEffect(() => {
    if (isOpen && mode === "create") {
      setFormData({
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
      });
      setErrors({});
    }
  }, [isOpen, mode]);

  // ============================================================================
  // VALIDATION
  // ============================================================================

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
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
    if (!formData.message.trim()) {
      newErrors.message = "Please provide some details about your inquiry";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
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
        source: formData.source,
        preferredContact: formData.preferredContact,
        bestTimeToCall: formData.bestTimeToCall,
        // Keep these as they exist in the type
        financingNeeded: false,
        interestedInTrade: false,
      };

      console.log("Submitting lead data:", leadData);

      if (mode === "create") {
        const result = await createLead(leadData);
        console.log("Lead created successfully:", result);
      } else if (mode === "edit" && initialData?.id) {
        const result = await updateLead(initialData.id, leadData);
        console.log("Lead updated successfully:", result);
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
    icon?: React.ComponentType<any>,
    required: boolean = false
  ) => {
    const IconComponent = icon;
    return (
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
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
        {label} {required && <span className="text-red-500">*</span>}
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
              Fill in the customer details below
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <User className="h-12 w-12 text-red-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900">
                  Customer Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput(
                  "firstName",
                  "First Name",
                  "text",
                  "John",
                  User,
                  true
                )}
                {renderInput(
                  "lastName",
                  "Last Name",
                  "text",
                  "Doe",
                  User,
                  true
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput(
                  "email",
                  "Email Address",
                  "email",
                  "john@example.com",
                  Mail,
                  true
                )}
                {renderInput(
                  "phone",
                  "Phone Number",
                  "tel",
                  "+254 700 123 456",
                  Phone,
                  true
                )}
              </div>

              {renderSelect(
                "source",
                "How did you hear about us?",
                LEAD_SOURCES
              )}
            </div>

            {/* Vehicle Interest */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Car className="h-12 w-12 text-red-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900">
                  Vehicle Interest
                </h3>
              </div>

              {renderInput(
                "vehicleSearchTerm",
                "Vehicle of Interest",
                "text",
                "e.g., 2022 Toyota Camry or any specific model",
                Car
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSelect("timeline", "Timeline", TIMELINE_OPTIONS)}
                {renderSelect("budgetRange", "Budget Range", BUDGET_RANGES)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSelect(
                  "preferredContact",
                  "Preferred Contact Method",
                  CONTACT_PREFERENCES
                )}
                {renderSelect(
                  "bestTimeToCall",
                  "Best Time to Call",
                  TIME_PREFERENCES
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end pt-6 border-t border-gray-200 space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeadForm;
