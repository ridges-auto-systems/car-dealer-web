"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Car,
  CreditCard,
  RefreshCw,
  Send,
  CheckCircle,
  Shield,
  Star,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/layout/header";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  vehicleId?: string;
  timeline?: string;
  budgetRange?: string;
  financingNeeded?: boolean;
  interestedInTrade?: boolean;
  tradeVehicleInfo?: {
    make?: string;
    model?: string;
    year?: number;
    mileage?: number;
    condition?: string;
    details?: string;
  };
  preferredContact?: string;
  bestTimeToCall?: string;
  source?: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
  vehicleId: "",
  timeline: "this_month",
  budgetRange: "",
  financingNeeded: false,
  interestedInTrade: false,
  tradeVehicleInfo: {},
  preferredContact: "phone",
  bestTimeToCall: "morning",
  source: "website_contact_form",
};

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak directly with our sales team",
    details: "(555) 123-4567",
    action: "tel:(555)123-4567",
    buttonText: "Call Now",
    hours: "Mon-Fri: 9AM-8PM | Sat: 9AM-6PM",
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us your questions anytime",
    details: "info@ridgesautomotors.com",
    action: "mailto:info@ridgesautomotors.com",
    buttonText: "Send Email",
    hours: "We respond within 2 hours",
  },
  {
    icon: MapPin,
    title: "Visit Showroom",
    description: "See our vehicles in person",
    details: "123 Auto Plaza Drive, Nairobi",
    action: "#map-section",
    buttonText: "Get Directions",
    hours: "Open 7 days a week",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our team instantly",
    details: "Available during business hours",
    action: "#",
    buttonText: "Start Chat",
    hours: "Mon-Fri: 9AM-8PM",
  },
];

const formTypes = [
  {
    id: "general",
    title: "General Inquiry",
    description: "Ask questions about our services",
    icon: MessageSquare,
    source: "website_general_inquiry",
  },
  {
    id: "testdrive",
    title: "Schedule Test Drive",
    description: "Book a test drive for any vehicle",
    icon: Car,
    source: "website_testdrive_request",
  },
];

const businessHours = [
  { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
  { day: "Saturday", hours: "9:00 AM - 6:00 PM" },
  { day: "Sunday", hours: "11:00 AM - 5:00 PM" },
];

export default function ContactPage() {
  const [activeForm, setActiveForm] = useState("general");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.startsWith("trade_")) {
      const tradeField = name.replace("trade_", "");
      setFormData((prev) => ({
        ...prev,
        tradeVehicleInfo: {
          ...prev.tradeVehicleInfo,
          [tradeField]: type === "number" ? parseInt(value) || 0 : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  const handleFormTypeChange = (formType: string) => {
    setActiveForm(formType);
    const selectedForm = formTypes.find((f) => f.id === formType);
    setFormData((prev) => ({
      ...prev,
      source: selectedForm?.source || "website_contact_form",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError("");

    try {
      // Prepare the payload to match your existing API structure
      const payload = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        message: formData.message,
        vehicleId: formData.vehicleId || undefined,
        timeline: formData.timeline,
        budgetRange: formData.budgetRange,
        financingNeeded: formData.financingNeeded,
        interestedInTrade: formData.interestedInTrade,
        source: formData.source,
        tradeVehicleInfo: formData.interestedInTrade
          ? formData.tradeVehicleInfo
          : undefined,
      };

      // Call your existing Express API
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setFormData(initialFormData);

        // Optional: Track form submission for analytics
        /*
        if (typeof gtag !== "undefined") {
          gtag("event", "form_submit", {
            event_category: "lead_generation",
            event_label: formData.source,
            value: 1,
          });
        }
        */
      } else {
        throw new Error(result.error || "Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "Failed to submit form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormFields = () => {
    switch (activeForm) {
      case "testdrive":
        return (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vehicle of Interest
                </label>
                <input
                  type="text"
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleInputChange}
                  placeholder="e.g., 2022 Toyota Camry or Stock Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Timeline
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="immediately">Immediately</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                  <option value="next_month">Next Month</option>
                  <option value="just_browsing">Just Browsing</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Best Time to Call
              </label>
              <select
                name="bestTimeToCall"
                value={formData.bestTimeToCall}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              >
                <option value="morning">Morning (9AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 5PM)</option>
                <option value="evening">Evening (5PM - 8PM)</option>
              </select>
            </div>
          </>
        );

      case "financing":
        return (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Budget Range
                </label>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Select Budget Range</option>
                  <option value="under-1m">Under 1M KES</option>
                  <option value="1m-2m">1M - 2M KES</option>
                  <option value="2m-3m">2M - 3M KES</option>
                  <option value="3m-5m">3M - 5M KES</option>
                  <option value="over-5m">Over 5M KES</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Timeline
                </label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="immediately">Immediately</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                  <option value="next_month">Next Month</option>
                  <option value="just_browsing">Just Browsing</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="financingNeeded"
                  checked={formData.financingNeeded}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-600"
                />
                <span className="text-gray-700">
                  I need financing assistance
                </span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="interestedInTrade"
                  checked={formData.interestedInTrade}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-600"
                />
                <span className="text-gray-700">
                  I have a vehicle to trade in
                </span>
              </label>
            </div>
          </>
        );

      case "tradein":
        return (
          <>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vehicle Make
                </label>
                <input
                  type="text"
                  name="trade_make"
                  value={formData.tradeVehicleInfo?.make || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., Toyota"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vehicle Model
                </label>
                <input
                  type="text"
                  name="trade_model"
                  value={formData.tradeVehicleInfo?.model || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., Camry"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Year
                </label>
                <input
                  type="number"
                  name="trade_year"
                  value={formData.tradeVehicleInfo?.year || ""}
                  onChange={handleInputChange}
                  placeholder="2020"
                  min="1990"
                  max="2024"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mileage (KM)
                </label>
                <input
                  type="number"
                  name="trade_mileage"
                  value={formData.tradeVehicleInfo?.mileage || ""}
                  onChange={handleInputChange}
                  placeholder="50,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  name="trade_condition"
                  value={formData.tradeVehicleInfo?.condition || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Select Condition</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Details
              </label>
              <textarea
                name="trade_details"
                value={formData.tradeVehicleInfo?.details || ""}
                onChange={handleInputChange}
                placeholder="Tell us more about your vehicle's condition, service history, any modifications, etc."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>
            {/* Auto-enable trade-in flag for this form */}
            <input type="hidden" name="interestedInTrade" value="true" />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-red-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-red-400 rounded-full opacity-15 blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Contact Ridges Automotors
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
            Ready to find your perfect vehicle? Our team is here to help you
            every step of the way. Get in touch today!
          </p>

          {/* Quick Contact Icons */}
          <div className="flex justify-center space-x-8 mt-8">
            <a href="tel:(555)123-4567" className="group">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                <Phone className="h-8 w-8" />
              </div>
              <div className="text-sm mt-2">Call Now</div>
            </a>
            <a href="mailto:info@ridgesautomotors.com" className="group">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                <Mail className="h-8 w-8" />
              </div>
              <div className="text-sm mt-2">Email Us</div>
            </a>
            <a href="#map-section" className="group">
              <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                <MapPin className="h-8 w-8" />
              </div>
              <div className="text-sm mt-2">Visit Us</div>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the method that works best for you. We&apos;re here to
              help!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl hover:border-red-500 transition-all duration-500 hover:scale-105 group text-center"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-colors">
                    <IconComponent className="h-8 w-8 text-red-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  <p className="font-semibold text-gray-900 mb-2">
                    {method.details}
                  </p>
                  <p className="text-sm text-gray-500 mb-6">{method.hours}</p>
                  <a
                    href={method.action}
                    className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-semibold shadow-lg hover:scale-105"
                  >
                    {method.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lead Forms Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Send Us a Message
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fill out the form below and we&apos;ll get back to you within 2
              hours during business hours.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Form Type Selector */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {formTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleFormTypeChange(type.id)}
                    className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                      activeForm === type.id
                        ? "bg-red-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">{type.title}</div>
                      <div className="text-xs opacity-75">
                        {type.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Thank You!
                  </h3>
                  <p className="text-gray-600 mb-8">
                    We&apos;ve received your message and will get back to you
                    within 2 hours during business hours.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                        placeholder="+254 700 123 456"
                      />
                    </div>
                  </div>

                  {/* Dynamic Form Fields */}
                  {renderFormFields()}

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  {/* Error Message */}
                  {submissionError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700 text-sm">{submissionError}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours & Location */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Business Hours */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Business Hours
              </h2>
              <div className="space-y-4">
                {businessHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white p-6 rounded-xl shadow-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-4">
                      <Clock className="h-6 w-6 text-red-600" />
                      <span className="font-semibold text-gray-900">
                        {schedule.day}
                      </span>
                    </div>
                    <span className="text-red-600 font-semibold">
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>

              {/* Additional Services */}
              <div className="mt-12">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Our Services
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Car, label: "Vehicle Sales" },
                    { icon: RefreshCw, label: "Trade-In Services" },
                    { icon: CreditCard, label: "Financing" },
                    { icon: Shield, label: "Warranties" },
                  ].map((service, index) => {
                    const IconComponent = service.icon;
                    return (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg shadow border border-gray-200 flex items-center space-x-3"
                      >
                        <IconComponent className="h-5 w-5 text-red-600" />
                        <span className="font-medium text-gray-900">
                          {service.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Visit Our Showroom
              </h2>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 mb-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-red-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Address</h3>
                      <p className="text-gray-600">
                        123 Auto Plaza Drive
                        <br />
                        Kiambu Road, Nairobi
                        <br />
                        Kenya, 00100
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-red-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
                      <a
                        href="tel:(555)123-4567"
                        className="text-red-600 hover:text-red-700 font-semibold"
                      >
                        (555) 123-4567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-red-600 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                      <a
                        href="mailto:info@ridgesautomotors.com"
                        className="text-red-600 hover:text-red-700 font-semibold"
                      >
                        info@ridgesautomotors.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">
                    What to Expect
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Professional sales consultation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Vehicle history reports</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Financing assistance</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Trade-in evaluations</span>
                    </li>
                  </ul>
                </div>
              </div>

              <Link
                href="/inventory"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold shadow-lg hover:scale-105 flex items-center justify-center"
              >
                <Car className="mr-2 h-5 w-5" />
                Browse Our Inventory
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section id="map-section" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Find Us on the Map
            </h2>
            <p className="text-xl text-gray-600">
              Located conveniently on Kiambu Road, Nairobi. Easy parking
              available.
            </p>
          </div>

          {/* Google Maps Embed */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <div className="aspect-w-16 aspect-h-9 h-96 lg:h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819592464127!2d36.73652731459634!3d-1.2844321359302555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1a5b7f7f7f7f%3A0x0!2sKiambu%20Road%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ridges Automotors Location"
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Map Overlay Info */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg max-w-xs">
              <h3 className="font-bold text-gray-900 mb-2">
                Ridges Automotors
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                123 Auto Plaza Drive
                <br />
                Kiambu Road, Nairobi
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-red-600 hover:text-red-700 font-semibold text-sm"
              >
                Get Directions
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Directions */}
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-50 p-6 rounded-xl">
              <Car className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">By Car</h3>
              <p className="text-gray-600">
                Ample free parking available. Located just off Kiambu Road with
                easy highway access.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Public Transport</h3>
              <p className="text-gray-600">
                Accessible by matatu routes 45, 46, and 100. Short walk from
                Kiambu Road stage.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <Clock className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">From CBD</h3>
              <p className="text-gray-600">
                Just 15 minutes from Nairobi CBD. Take Uhuru Highway to Kiambu
                Road.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
