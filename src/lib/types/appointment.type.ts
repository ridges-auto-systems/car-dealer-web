export type AppointmentType =
  | "CONSULTATION"
  | "TEST_DRIVE"
  | "VEHICLE_INSPECTION"
  | "FINANCING_MEETING"
  | "PAPERWORK_SIGNING"
  | "DELIVERY"
  | "FOLLOW_UP"
  | "SERVICE_APPOINTMENT";

export type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "RESCHEDULED";

export interface Appointment {
  id: string;
  leadId: string;
  customerId: string;
  vehicleId?: string;
  salesRepId?: string;
  type: AppointmentType;
  scheduledAt: string;
  duration: number;
  status: AppointmentStatus;
  location?: string;
  meetingRoom?: string;
  specialRequests?: string;
  notes?: string;
  outcome?: string;
  rating?: number;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}
