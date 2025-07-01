import { LeadStatus, LeadPriority } from "./lead.type";
import { VehicleCondition } from "./vehicle.type";

export interface VehicleFilters {
  page?: number;
  limit?: number;
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  condition?: VehicleCondition;
  transmission?: string;
  fuelType?: string;
  drivetrain?: string;
  search?: string;
  sortBy?: "price" | "year" | "mileage" | "make" | "createdAt";
  sortOrder?: "asc" | "desc";
  featured?: boolean;
}

export interface LeadFilters {
  page?: number;
  limit?: number;
  status?: LeadStatus;
  priority?: LeadPriority;
  salesRepId?: string;
  source?: string;
  sortBy?: "createdAt" | "priority" | "leadScore" | "lastContactDate";
  sortOrder?: "asc" | "desc";
}
