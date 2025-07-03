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
  Send,
  CheckCircle,
  Star,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { useLeads } from "@/lib/store/hooks/useLeads";
import type { CreateLeadRequest } from "@/lib/types/lead.type";

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
    details: "+254711690560",
    action: "tel:+254711690560",
    buttonText: "Call Now",
    hours: "Mon-Fri: 8AM-6PM | Sat: 8AM-5PM",
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us your questions anytime",
    details: "info@ridgesautomotors.com",
    action: "mailto:info@ridgesautomotors.com",
    buttonText: "Send Email",
    hours: "We respond within 24 hours",
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
  { day: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
  { day: "Saturday", hours: "8:00 AM - 5:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

export default function ContactPage() {
  const [activeForm, setActiveForm] = useState("general");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Use Redux for lead creation
  const { createLead, isLoading, error } = useLeads();
  /*
  const companyPhone =
    process.env.NEXT_PUBLIC_COMPANY_PHONE || "(555) 123-4567";
  const companyEmail =
    process.env.NEXT_PUBLIC_COMPANY_EMAIL || "info@ridgewaysmotors.com";
*/
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

    try {
      // Prepare the payload for Redux
      const leadData: CreateLeadRequest = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        vehicleId: formData.vehicleId || undefined,
        message: formData.message,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        timeline: formData.timeline as any,
        budgetRange: formData.budgetRange,
        source: formData.source,
        tradeVehicleInfo: formData.interestedInTrade
          ? formData.tradeVehicleInfo
          : undefined,
      };

      // Use Redux to create the lead
      await createLead(leadData);

      setIsSubmitted(true);
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error submitting form:", error);
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
                <option value="morning">Morning (8AM - 12PM)</option>
                <option value="afternoon">Afternoon (12PM - 5PM)</option>
                <option value="evening">Evening (5PM - 8PM)</option>
              </select>
            </div>
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
                    within 24 hours during business hours.
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
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
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
                  {[{ icon: Car, label: "Vehicle Sales" }].map(
                    (service, index) => {
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
                    }
                  )}
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
                        +254 711690560
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
    </div>
  );
}
