"use client";
import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Car,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Heart,
  Loader2,
  CreditCard,
  FileText,
  Shield,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// TypeScript Interfaces
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  price: string | number;
  stockNumber?: string;
  mileage?: number;
  color?: string;
  images?: string[] | string;
  [key: string]: any;
}

interface CartItem {
  id: string;
  vehicle: Vehicle;
  type: string;
  addedAt: string;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  preferredContact: "phone" | "email";
  financingNeeded?: boolean;
  interestedInTrade?: boolean;
  timeline?: string;
  budgetRange?: string;
}

interface BookingDetails {
  [itemId: string]: {
    date?: Date;
    time?: string;
    notes?: string;
  };
}

interface CheckoutResponse {
  success: boolean;
  data?: {
    leadId: string;
    customerId: string;
    bookingCount: number;
    confirmationNumber: string;
    bookings: any[];
    customer: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
  };
  warnings?: string[];
  message?: string;
  error?: string;
}

interface StepProps {
  number: number;
  title: string;
  icon: React.ComponentType<any>;
}

// Cart Item Types (since we can't import yet)
const CART_ITEM_TYPES = {
  RESERVATION: "reservation",
  TEST_DRIVE: "test_drive",
} as const;

// Mock cart hook until we create the real context
const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    preferredContact: "phone",
  });
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({});

  // Mock functions - replace with real implementation
  return {
    items,
    customerInfo,
    bookingDetails,
    cartCount: items.length,
    totalValue: items.reduce((sum, item) => {
      const price =
        typeof item.vehicle.price === "string"
          ? parseFloat(item.vehicle.price)
          : item.vehicle.price;
      return sum + (price || 0);
    }, 0),
    removeFromCart: (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    updateCustomerInfo: (updates: Partial<CustomerInfo>) => {
      setCustomerInfo((prev) => ({ ...prev, ...updates }));
    },
    updateBookingDetails: (
      itemId: string,
      details: Partial<BookingDetails[string]>
    ) => {
      setBookingDetails((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], ...details },
      }));
    },
    clearCart: () => {
      setItems([]);
      setBookingDetails({});
    },
  };
};

// Time slots for test drives
const timeSlots: string[] = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const CartCheckoutPage: React.FC = () => {
  const {
    items: cartItems,
    customerInfo: savedCustomerInfo,
    totalValue,
    cartCount,
    removeFromCart,
    updateCustomerInfo,
    updateBookingDetails,
    bookingDetails,
    clearCart,
  } = useCart();

  // Local state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: savedCustomerInfo.firstName || "",
    lastName: savedCustomerInfo.lastName || "",
    email: savedCustomerInfo.email || "",
    phone: savedCustomerInfo.phone || "",
    address: savedCustomerInfo.address || "",
    city: savedCustomerInfo.city || "",
    preferredContact: savedCustomerInfo.preferredContact || "phone",
    financingNeeded: false,
    interestedInTrade: false,
    timeline: "this_month",
    budgetRange: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionComplete, setSubmissionComplete] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] =
    useState<CheckoutResponse | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartCount === 0 && !submissionComplete) {
      // Could redirect to inventory or show empty state
    }
  }, [cartCount, submissionComplete]);

  // Get next 14 days for date selection (excluding Sundays)
  const getAvailableDates = (): Date[] => {
    const dates: Date[] = [];
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      // Skip Sundays (day 0)
      if (date.getDay() !== 0) {
        dates.push(date);
      }
    }
    return dates;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Handle customer info change
  const handleCustomerInfoChange = (
    field: keyof CustomerInfo,
    value: string | boolean
  ): void => {
    const updatedInfo = {
      ...customerInfo,
      [field]: value,
    };
    setCustomerInfo(updatedInfo);

    // Also update in cart context
    updateCustomerInfo(updatedInfo);
  };

  // Handle date selection
  const handleDateSelect = (itemId: string, date: Date): void => {
    updateBookingDetails(itemId, { date });
  };

  // Handle time selection
  const handleTimeSelect = (itemId: string, time: string): void => {
    updateBookingDetails(itemId, { time });
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return cartItems.length > 0;
      case 2: {
        const testDriveItems = cartItems.filter(
          (item: CartItem) => item.type === CART_ITEM_TYPES.TEST_DRIVE
        );
        return testDriveItems.every((item: CartItem) => {
          const details = bookingDetails[item.id];
          return details?.date && details?.time;
        });
      }
      case 3:
        return Boolean(
          customerInfo.firstName &&
            customerInfo.lastName &&
            customerInfo.email &&
            customerInfo.phone
        );
      default:
        return true;
    }
  };

  // Submit checkout
  const handleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    setErrors([]);

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      // Prepare data for backend
      const checkoutData = {
        customerInfo,
        items: cartItems.map((item: CartItem) => {
          const details = bookingDetails[item.id];
          return {
            vehicleId: item.vehicle.id,
            type:
              item.type === CART_ITEM_TYPES.RESERVATION
                ? "RESERVATION"
                : "TEST_DRIVE",
            scheduledDate: details?.date?.toISOString(),
            scheduledTime: details?.time,
            notes: details?.notes || "",
          };
        }),
      };

      const response = await fetch(`${API_BASE_URL}/bookings/cart-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const result: CheckoutResponse = await response.json();

      if (result.success) {
        setSubmissionResult(result);
        setSubmissionComplete(true);
        setCurrentStep(4);

        // Clear cart on success
        setTimeout(() => {
          clearCart();
        }, 2000);
      } else {
        throw new Error(result.error || "Checkout failed");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      setErrors([error.message || "An error occurred during checkout"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset and start over
  const resetCheckout = (): void => {
    setCurrentStep(1);
    setSubmissionComplete(false);
    setSubmissionResult(null);
    setErrors([]);
  };

  // Step components
  const steps: StepProps[] = [
    { number: 1, title: "Review Cart", icon: ShoppingCart },
    { number: 2, title: "Schedule", icon: Calendar },
    { number: 3, title: "Information", icon: User },
    { number: 4, title: "Complete", icon: CheckCircle },
  ];

  // Empty cart state
  if (cartCount === 0 && !submissionComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Browse our inventory to find your perfect vehicle
            </p>
            <Link
              href="/users/inventory"
              className="inline-flex items-center bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Browse Inventory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {submissionComplete ? "Order Complete" : "Checkout"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {submissionComplete
                    ? "Thank you for your interest!"
                    : `${cartCount} item${
                        cartCount !== 1 ? "s" : ""
                      } in your cart`}
                </p>
              </div>
              {!submissionComplete && (
                <Link
                  href="/users/inventory"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Continue Shopping
                </Link>
              )}
            </div>

            {/* Progress Indicator */}
            {!submissionComplete && (
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          currentStep >= step.number
                            ? "bg-red-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {currentStep > step.number ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          <step.icon className="h-5 w-5" />
                        )}
                      </div>
                      <span
                        className={`ml-2 text-sm font-medium hidden sm:inline ${
                          currentStep >= step.number
                            ? "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </span>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-12 h-0.5 mx-4 ${
                            currentStep > step.number
                              ? "bg-red-600"
                              : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  {errors.length === 1 ? "Error" : "Errors"}
                </h3>
                <ul className="mt-1 text-sm text-red-700">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Step 1: Review Cart */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Review Your Selections
              </h2>
              <div className="space-y-4">
                {cartItems.map((item: CartItem) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.vehicle.year} {item.vehicle.make}{" "}
                          {item.vehicle.model}
                        </h3>
                        {item.vehicle.trim && (
                          <p className="text-gray-600 mt-1">
                            {item.vehicle.trim}
                          </p>
                        )}
                        <div className="mt-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              item.type === CART_ITEM_TYPES.RESERVATION
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {item.type === CART_ITEM_TYPES.RESERVATION ? (
                              <>
                                <Heart className="h-4 w-4 mr-1" />
                                Vehicle Reservation
                              </>
                            ) : (
                              <>
                                <Car className="h-4 w-4 mr-1" />
                                Test Drive
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-6">
                        <div className="text-xl font-bold text-gray-900">
                          $
                          {typeof item.vehicle.price === "string"
                            ? parseFloat(item.vehicle.price).toLocaleString()
                            : item.vehicle.price.toLocaleString()}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {cartItems.length > 0 && (
                <div className="mt-6 border-t pt-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Value:</span>
                    <span>${totalValue.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    *Final pricing subject to negotiation and inspection
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Schedule Test Drives */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Schedule Test Drive Appointments
              </h2>
              {cartItems.filter(
                (item: CartItem) => item.type === CART_ITEM_TYPES.TEST_DRIVE
              ).length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    No test drives to schedule
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    You can proceed to the next step
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {cartItems
                    .filter(
                      (item: CartItem) =>
                        item.type === CART_ITEM_TYPES.TEST_DRIVE
                    )
                    .map((item: CartItem) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          {item.vehicle.year} {item.vehicle.make}{" "}
                          {item.vehicle.model}
                        </h3>

                        {/* Date Selection */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Select Date
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {getAvailableDates()
                              .slice(0, 8)
                              .map((date) => (
                                <button
                                  key={date.toISOString()}
                                  onClick={() =>
                                    handleDateSelect(item.id, date)
                                  }
                                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                                    bookingDetails[
                                      item.id
                                    ]?.date?.toDateString() ===
                                    date.toDateString()
                                      ? "bg-red-600 text-white border-red-600"
                                      : "bg-white text-gray-700 border-gray-300 hover:border-red-300"
                                  }`}
                                >
                                  {formatDate(date)}
                                </button>
                              ))}
                          </div>
                        </div>

                        {/* Time Selection */}
                        {bookingDetails[item.id]?.date && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Select Time
                            </label>
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                              {timeSlots.map((time) => (
                                <button
                                  key={time}
                                  onClick={() =>
                                    handleTimeSelect(item.id, time)
                                  }
                                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                                    bookingDetails[item.id]?.time === time
                                      ? "bg-red-600 text-white border-red-600"
                                      : "bg-white text-gray-700 border-gray-300 hover:border-red-300"
                                  }`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Customer Information */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.firstName}
                    onChange={(e) =>
                      handleCustomerInfoChange("firstName", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="Enter your first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.lastName}
                    onChange={(e) =>
                      handleCustomerInfoChange("lastName", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="Enter your last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) =>
                      handleCustomerInfoChange("email", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      handleCustomerInfoChange("phone", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="phone"
                        checked={customerInfo.preferredContact === "phone"}
                        onChange={(e) =>
                          handleCustomerInfoChange(
                            "preferredContact",
                            e.target.value
                          )
                        }
                        className="mr-2 text-red-600 focus:ring-red-600"
                      />
                      <Phone className="h-4 w-4 mr-1" />
                      Phone
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="email"
                        checked={customerInfo.preferredContact === "email"}
                        onChange={(e) =>
                          handleCustomerInfoChange(
                            "preferredContact",
                            e.target.value
                          )
                        }
                        className="mr-2 text-red-600 focus:ring-red-600"
                      />
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline
                  </label>
                  <select
                    value={customerInfo.timeline}
                    onChange={(e) =>
                      handleCustomerInfoChange("timeline", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  >
                    <option value="immediately">Immediately</option>
                    <option value="this_week">This Week</option>
                    <option value="this_month">This Month</option>
                    <option value="next_month">Next Month</option>
                    <option value="just_browsing">Just Browsing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select
                    value={customerInfo.budgetRange}
                    onChange={(e) =>
                      handleCustomerInfoChange("budgetRange", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  >
                    <option value="">Select Budget Range</option>
                    <option value="under_20k">Under $20,000</option>
                    <option value="20k_30k">$20,000 - $30,000</option>
                    <option value="30k_40k">$30,000 - $40,000</option>
                    <option value="40k_50k">$40,000 - $50,000</option>
                    <option value="over_50k">Over $50,000</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={customerInfo.financingNeeded || false}
                        onChange={(e) =>
                          handleCustomerInfoChange(
                            "financingNeeded",
                            e.target.checked
                          )
                        }
                        className="mr-3 text-red-600 focus:ring-red-600"
                      />
                      <CreditCard className="h-4 w-4 mr-2" />
                      I'm interested in financing options
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={customerInfo.interestedInTrade || false}
                        onChange={(e) =>
                          handleCustomerInfoChange(
                            "interestedInTrade",
                            e.target.checked
                          )
                        }
                        className="mr-3 text-red-600 focus:ring-red-600"
                      />
                      <Car className="h-4 w-4 mr-2" />I have a trade-in vehicle
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation/Success */}
          {currentStep === 4 && submissionComplete && submissionResult && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Request Submitted Successfully!
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Confirmation Number:{" "}
                <span className="font-bold text-red-600">
                  {submissionResult.data?.confirmationNumber}
                </span>
              </p>
              <p className="text-gray-600 mb-8">
                Thank you, {submissionResult.data?.customer.name}! Our team will
                contact you within 2 hours to confirm your appointments.
              </p>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
                <h3 className="font-semibold text-gray-900 mb-4">Summary</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Items:</span>{" "}
                    {submissionResult.data?.bookingCount}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {submissionResult.data?.customer.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {submissionResult.data?.customer.phone}
                  </p>
                </div>
              </div>

              {submissionResult.warnings &&
                submissionResult.warnings.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-yellow-800 mb-2">Note:</h4>
                    <ul className="text-sm text-yellow-700">
                      {submissionResult.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/users/inventory"
                  className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/users/contact-us"
                  className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        {!submissionComplete && (
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                  validateStep(currentStep)
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!validateStep(currentStep)}
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !validateStep(currentStep)}
                className={`flex items-center px-8 py-3 rounded-lg font-semibold transition-colors ${
                  isSubmitting || !validateStep(currentStep)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Request
                    <Check className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Important Information */}
        {!submissionComplete && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <Shield className="h-6 w-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <h3 className="font-medium mb-2">Important Information:</h3>
                <ul className="space-y-1">
                  <li>• Vehicle reservations hold the car for 48 hours</li>
                  <li>
                    • Test drives require valid driver's license and insurance
                  </li>
                  <li>
                    • Our team will contact you within 2 hours to confirm
                    appointments
                  </li>
                  <li>
                    • All pricing is subject to final negotiation and vehicle
                    inspection
                  </li>
                  <li>• Appointments are subject to availability</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartCheckoutPage;
