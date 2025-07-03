/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/types/lead.ts

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "APPOINTMENT_SCHEDULED"
  | "TEST_DRIVE_COMPLETED"
  | "NEGOTIATING"
  | "FINANCING_PENDING"
  | "PAPERWORK"
  | "CLOSED_WON"
  | "CLOSED_LOST"
  | "FOLLOW_UP"
  | "UNRESPONSIVE";

export type LeadPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT" | "HOT";

export type LeadTimeline =
  | "immediately"
  | "this_week"
  | "this_month"
  | "next_month"
  | "just_browsing";

export interface TradeVehicleInfo {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  details?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  color?: string;
  price?: number;
  [key: string]: any; // Remove or refine as needed for stricter typing
}

export interface Lead {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  lastContact: string;
  vehicle: any;
  salesRep: any;
  id: string;
  customerId: string;
  salesRepId?: string;
  vehicleId?: string;
  status: LeadStatus;
  priority: LeadPriority;
  source?: string;
  notes?: string;
  interestedInTrade: boolean;
  tradeVehicleInfo?: TradeVehicleInfo;
  financingNeeded: boolean;
  budgetRange?: string;
  timeline?: LeadTimeline;
  leadScore?: number;
  isHot: boolean;
  customerName?: string;
  vehicleName?: string;
  salesRepName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  vehicleId?: string;
  message?: string;
  interestedInTrade?: boolean;
  financingNeeded?: boolean;
  timeline?: LeadTimeline;
  preferredContact?: string; // e.g., "email", "phone", "text"
  bestTimeToCall?: string; // e.g., "morning", "afternoon

  budgetRange?: string;
  source?: string;
  tradeVehicleInfo?: TradeVehicleInfo;
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

export interface LeadStats {
  totalLeads: number;
  newLeads: number;
  hotLeads: number;
  convertedLeads: number;
  conversionRate: number;
}

// State Types
export interface LeadState {
  leads: Lead[];
  currentLead: Lead | null;
  filters: LeadFilters;
  selectedLeads: string[];
  stats: LeadStats;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
