import {
  LeadPriority,
  LeadStatus,
  LeadTimeline,
  TradeVehicleInfo,
} from "./lead.type";
import { User } from "./user.type";
import { Vehicle } from "./vehicle.type";

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
  budgetRange?: string;
  source?: string;
  tradeVehicleInfo?: TradeVehicleInfo;
  preferredContact?: string;
  bestTimeToCall?: string;
}

export interface CreateLeadResponse {
  lead: {
    id: string;
    status: LeadStatus;
    priority: LeadPriority;
    leadScore?: number;
    createdAt: string;
  };
  customer: User;
  vehicle?: Vehicle;
  nextSteps: string[];
}
