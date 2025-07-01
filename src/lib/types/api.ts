/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  company: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage?: number;
    previousPage?: number;
  };
  filters?: any;
  meta?: any;
}

export interface ErrorResponse {
  success: false;
  error: string;
  company: string;
  timestamp: string;
  suggestion?: string;
  details?: any;
}

// Financing Types
export type FinancingStatus =
  | "PENDING"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "DECLINED"
  | "CONDITIONAL_APPROVAL"
  | "FUNDED"
  | "CANCELLED";

export interface FinancingApplication {
  id: string;
  customerId: string;
  leadId?: string;
  vehicleId?: string;
  status: FinancingStatus;
  lenderName?: string;
  requestedAmount: number;
  approvedAmount?: number;
  interestRate?: number;
  termMonths?: number;
  monthlyPayment?: number;
  downPayment?: number;
  annualIncome?: number;
  employmentType?: string;
  yearsEmployed?: number;
  creditScore?: number;
  applicationData?: Record<string, any>;
  applicationId?: string;
  contractNumber?: string;
  submittedAt?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Vehicle History Types
