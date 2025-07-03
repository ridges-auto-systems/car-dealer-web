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
  | "SOLD"
  | "UNAVAILABLE"
  | "IN_TRANSIT"
  | "IN_SERVICE";

export interface Vehicle {
  id: string;
  vin: string;
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
  serviceHistory?: string;
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
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
