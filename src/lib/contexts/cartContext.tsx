// lib/contexts/CartContext.tsx - Complete Cart System
"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { Vehicle } from "../types/vehicle.type";

// ============================================================================
// TYPES
// ============================================================================

export interface CartItem {
  id: string;
  vehicle: Vehicle;
  type: "RESERVATION" | "TEST_DRIVE";
  addedAt: string;
}

export interface CustomerInfo {
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

export interface BookingDetails {
  [itemId: string]: {
    date?: Date;
    time?: string;
    notes?: string;
  };
}

interface CartState {
  items: CartItem[];
  customerInfo: CustomerInfo;
  bookingDetails: BookingDetails;
}

interface CartContextType extends CartState {
  // Computed values
  cartCount: number;
  totalValue: number;
  reservationCount: number;
  testDriveCount: number;

  // Core actions
  addToCart: (vehicle: Vehicle, type: "RESERVATION" | "TEST_DRIVE") => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  // Query functions
  isInCart: (vehicleId: string, type: "RESERVATION" | "TEST_DRIVE") => boolean;
  getCartItem: (
    vehicleId: string,
    type: "RESERVATION" | "TEST_DRIVE"
  ) => CartItem | undefined;
  getVehicleCartItems: (vehicleId: string) => CartItem[];

  // Customer info management
  updateCustomerInfo: (updates: Partial<CustomerInfo>) => void;
  clearCustomerInfo: () => void;

  // Booking details management
  updateBookingDetails: (
    itemId: string,
    details: Partial<BookingDetails[string]>
  ) => void;
  getBookingDetails: (itemId: string) => BookingDetails[string] | undefined;
  clearBookingDetails: (itemId: string) => void;

  // Utility functions
  getItemsByType: (type: "RESERVATION" | "TEST_DRIVE") => CartItem[];
  hasReservations: boolean;
  hasTestDrives: boolean;
  isEmpty: boolean;
}

// ============================================================================
// ACTIONS
// ============================================================================

type CartAction =
  | {
      type: "ADD_TO_CART";
      payload: { vehicle: Vehicle; itemType: "RESERVATION" | "TEST_DRIVE" };
    }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "UPDATE_CUSTOMER_INFO"; payload: Partial<CustomerInfo> }
  | { type: "CLEAR_CUSTOMER_INFO" }
  | {
      type: "UPDATE_BOOKING_DETAILS";
      payload: { itemId: string; details: Partial<BookingDetails[string]> };
    }
  | { type: "CLEAR_BOOKING_DETAILS"; payload: string }
  | { type: "LOAD_FROM_STORAGE"; payload: CartState };

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialCustomerInfo: CustomerInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  preferredContact: "phone",
  financingNeeded: false,
  interestedInTrade: false,
  timeline: "this_month",
  budgetRange: "",
};

const initialState: CartState = {
  items: [],
  customerInfo: initialCustomerInfo,
  bookingDetails: {},
};

// ============================================================================
// REDUCER
// ============================================================================

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { vehicle, itemType } = action.payload;

      // Check if item already exists
      const existingItem = state.items.find(
        (item) => item.vehicle.id === vehicle.id && item.type === itemType
      );

      if (existingItem) {
        console.log("Item already in cart:", existingItem);
        return state; // Item already exists, don't add again
      }

      const newItem: CartItem = {
        id: `${vehicle.id}-${itemType}-${Date.now()}`,
        vehicle,
        type: itemType,
        addedAt: new Date().toISOString(),
      };

      console.log("Adding item to cart:", newItem);

      return {
        ...state,
        items: [...state.items, newItem],
      };
    }

    case "REMOVE_FROM_CART": {
      const itemId = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => item.id !== itemId),
        bookingDetails: Object.fromEntries(
          Object.entries(state.bookingDetails).filter(([key]) => key !== itemId)
        ),
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        bookingDetails: {},
      };

    case "UPDATE_CUSTOMER_INFO":
      return {
        ...state,
        customerInfo: { ...state.customerInfo, ...action.payload },
      };

    case "CLEAR_CUSTOMER_INFO":
      return {
        ...state,
        customerInfo: initialCustomerInfo,
      };

    case "UPDATE_BOOKING_DETAILS":
      return {
        ...state,
        bookingDetails: {
          ...state.bookingDetails,
          [action.payload.itemId]: {
            ...state.bookingDetails[action.payload.itemId],
            ...action.payload.details,
          },
        },
      };

    case "CLEAR_BOOKING_DETAILS": {
      const { [action.payload]: removed, ...remaining } = state.bookingDetails;
      return {
        ...state,
        bookingDetails: remaining,
      };
    }

    case "LOAD_FROM_STORAGE":
      return action.payload;

    default:
      return state;
  }
};

// ============================================================================
// CONTEXT
// ============================================================================

const CartContext = createContext<CartContextType | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // ============================================================================
  // PERSISTENCE (localStorage)
  // ============================================================================

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ridges-automotors-cart");
      if (saved) {
        const parsedState = JSON.parse(saved);

        // Convert date strings back to Date objects in booking details
        Object.keys(parsedState.bookingDetails || {}).forEach((key) => {
          if (parsedState.bookingDetails[key]?.date) {
            parsedState.bookingDetails[key].date = new Date(
              parsedState.bookingDetails[key].date
            );
          }
        });

        dispatch({ type: "LOAD_FROM_STORAGE", payload: parsedState });
        console.log("Cart loaded from localStorage:", parsedState);
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      // Clear corrupted data
      localStorage.removeItem("ridges-automotors-cart");
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem("ridges-automotors-cart", JSON.stringify(state));
      console.log("Cart saved to localStorage:", state);
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [state]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const cartCount = state.items.length;
  const reservationCount = state.items.filter(
    (item) => item.type === "RESERVATION"
  ).length;
  const testDriveCount = state.items.filter(
    (item) => item.type === "TEST_DRIVE"
  ).length;
  const hasReservations = reservationCount > 0;
  const hasTestDrives = testDriveCount > 0;
  const isEmpty = cartCount === 0;

  const totalValue = state.items.reduce((sum, item) => {
    const price =
      typeof item.vehicle.price === "string"
        ? parseFloat(item.vehicle.price)
        : item.vehicle.price;
    return sum + (price || 0);
  }, 0);

  // ============================================================================
  // CORE ACTIONS
  // ============================================================================

  const addToCart = (vehicle: Vehicle, type: "RESERVATION" | "TEST_DRIVE") => {
    // Check if already in cart
    const exists = state.items.some(
      (item) => item.vehicle.id === vehicle.id && item.type === type
    );

    if (exists) {
      const action = type === "RESERVATION" ? "reservation" : "test drive";
      alert(
        `${vehicle.year} ${vehicle.make} ${vehicle.model} is already in your cart for ${action}!`
      );
      return;
    }

    dispatch({ type: "ADD_TO_CART", payload: { vehicle, itemType: type } });

    // Success message
    const action = type === "RESERVATION" ? "reservation" : "test drive";
    alert(
      `${vehicle.year} ${vehicle.make} ${vehicle.model} added to cart for ${action}!`
    );
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
    console.log("Item removed from cart:", id);
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    console.log("Cart cleared");
  };

  // ============================================================================
  // QUERY FUNCTIONS
  // ============================================================================

  const isInCart = (vehicleId: string, type: "RESERVATION" | "TEST_DRIVE") => {
    return state.items.some(
      (item) => item.vehicle.id === vehicleId && item.type === type
    );
  };

  const getCartItem = (
    vehicleId: string,
    type: "RESERVATION" | "TEST_DRIVE"
  ) => {
    return state.items.find(
      (item) => item.vehicle.id === vehicleId && item.type === type
    );
  };

  const getVehicleCartItems = (vehicleId: string) => {
    return state.items.filter((item) => item.vehicle.id === vehicleId);
  };

  const getItemsByType = (type: "RESERVATION" | "TEST_DRIVE") => {
    return state.items.filter((item) => item.type === type);
  };

  // ============================================================================
  // CUSTOMER INFO MANAGEMENT
  // ============================================================================

  const updateCustomerInfo = (updates: Partial<CustomerInfo>) => {
    dispatch({ type: "UPDATE_CUSTOMER_INFO", payload: updates });
    console.log("Customer info updated:", updates);
  };

  const clearCustomerInfo = () => {
    dispatch({ type: "CLEAR_CUSTOMER_INFO" });
  };

  // ============================================================================
  // BOOKING DETAILS MANAGEMENT
  // ============================================================================

  const updateBookingDetails = (
    itemId: string,
    details: Partial<BookingDetails[string]>
  ) => {
    dispatch({ type: "UPDATE_BOOKING_DETAILS", payload: { itemId, details } });
    console.log("Booking details updated:", { itemId, details });
  };

  const getBookingDetails = (itemId: string) => {
    return state.bookingDetails[itemId];
  };

  const clearBookingDetails = (itemId: string) => {
    dispatch({ type: "CLEAR_BOOKING_DETAILS", payload: itemId });
  };

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: CartContextType = {
    // State
    ...state,

    // Computed values
    cartCount,
    totalValue,
    reservationCount,
    testDriveCount,
    hasReservations,
    hasTestDrives,
    isEmpty,

    // Core actions
    addToCart,
    removeFromCart,
    clearCart,

    // Query functions
    isInCart,
    getCartItem,
    getVehicleCartItems,
    getItemsByType,

    // Customer info management
    updateCustomerInfo,
    clearCustomerInfo,

    // Booking details management
    updateBookingDetails,
    getBookingDetails,
    clearBookingDetails,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// ============================================================================
// HOOK
// ============================================================================

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
