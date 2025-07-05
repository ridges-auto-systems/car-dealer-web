// lib/types/vehicle.type.ts - Updated with RESERVED status
export type VehicleCondition =
  | "NEW"
  | "USED"
  | "CERTIFIED_PRE_OWNED"
  | "FAIR"
  | "POOR";

export type VehicleStatus =
  | "AVAILABLE"
  | "PENDING"
  | "HOLD"
  | "RESERVED" // ← Added this
  | "SOLD"
  | "UNAVAILABLE"
  | "IN_TRANSIT"
  | "IN_SERVICE";

// Service History Interface (instead of string)
export interface ServiceRecord {
  id?: string;
  date: string;
  service: string;
  mileage?: number;
  cost?: number;
  notes?: string;
}

export interface Vehicle {
  id: string;
  vin?: string;
  stockNumber?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage: number;
  price: number;
  priceFormatted: string;
  msrp?: number;
  msrpFormatted?: string;
  costBasis?: number;
  condition: VehicleCondition;
  status: VehicleStatus;
  exterior?: string;
  interior?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  fuelType?: string;
  mpgCity?: number;
  mpgHighway?: number;
  mpgCombined?: number;
  doors?: number;
  seats?: number;
  features?: string[];
  packages?: string[];
  options?: string[];
  images?: string[];
  videos?: string[];
  documents?: string[];
  description?: string;
  highlights?: string[];
  keywords?: string[];
  inspectionDate?: string;
  inspectionNotes?: string;
  accidentHistory?: string;
  serviceHistory?: ServiceRecord[] | string; // ← Can be array or string
  previousOwners?: number;
  location?: string;
  isFeatured: boolean;
  isOnline: boolean;
  displayOrder?: number;
  mainImage?: string;
  mileageFormatted: string;
  fuelEconomy?: string;
  soldDate?: string;
  soldPrice?: number;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleHistory {
  id: string;
  vehicleId: string;
  eventType: string;
  oldValue?: string;
  newValue?: string;
  description?: string;
  userId?: string;
  userEmail?: string;
  createdAt: string;
}

export interface VehicleFilters {
  make?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  priceFrom?: number;
  priceTo?: number;
  mileageFrom?: number;
  mileageTo?: number;
  condition?: VehicleCondition[];
  status?: VehicleStatus[];
  location?: string;
  isFeatured?: boolean;
  isOnline?: boolean;
  searchQuery?: string;
  search?: string; // Add this for search compatibility
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  minPrice?: number; // Add these for price range filtering
  maxPrice?: number;
}
