// lib/types/user.type.ts
export type UserRole =
  | "CUSTOMER"
  | "SALES_REP"
  | "ADMIN"
  | "MANAGER"
  | "SALES_MANAGER"
  | "FINANCE_MANAGER"
  | "SUPER_ADMIN";

// Export the enum values as constants so they can be used as values
export const USER_ROLES = {
  CUSTOMER: "CUSTOMER" as const,
  SALES_REP: "SALES_REP" as const,
  ADMIN: "ADMIN" as const,
  MANAGER: "MANAGER" as const,
  SALES_MANAGER: "SALES_MANAGER" as const,
  FINANCE_MANAGER: "FINANCE_MANAGER" as const,
  SUPER_ADMIN: "SUPER_ADMIN" as const,
} as const;

// Array of roles for form usage
export const USER_ROLE_OPTIONS = [
  { value: USER_ROLES.CUSTOMER, label: "Customer" },
  { value: USER_ROLES.SALES_REP, label: "Sales Representative" },
  { value: USER_ROLES.SALES_MANAGER, label: "Sales Manager" },
  { value: USER_ROLES.FINANCE_MANAGER, label: "Finance Manager" },
  { value: USER_ROLES.ADMIN, label: "Administrator" },
  { value: USER_ROLES.MANAGER, label: "Manager" },
  { value: USER_ROLES.SUPER_ADMIN, label: "Super Administrator" },
];

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  preferredContact?: string;

  // Additional fields that might be in your form
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  department?: string;
  position?: string;
  hireDate?: string;
  commission?: number;
  salesGoal?: number;

  // Analytics/stats fields that your view is expecting
  totalSales?: number;
  averageRating?: number;
  vehiclesPurchased?: number;
  totalSpent?: number;
  loyaltyPoints?: number;
  lastLogin?: string;

  createdAt: string;
  updatedAt: string;

  // Counts (from backend aggregation)
  leadCount?: number;
  appointmentCount?: number;
  testDriveCount?: number;
  customerLeadsCount?: number;
  salesLeadsCount?: number;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  byRole: {
    customers: number;
    salesReps: number;
    admins: number;
    managers: number;
  };
  growthRate: string;
}

export interface UserFilters {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  sortBy?: "createdAt" | "firstName" | "lastName" | "email" | "role";
  sortOrder?: "asc" | "desc";
}

// Fix the naming to match what your form expects
export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  preferredContact?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  department?: string;
  position?: string;
  hireDate?: string;
  commission?: number;
  salesGoal?: number;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
  preferredContact?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  department?: string;
  position?: string;
  hireDate?: string;
  commission?: number;
  salesGoal?: number;
}

// Keep the original names for API compatibility
export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  preferredContact?: string;
}

export interface UpdateUserRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
  preferredContact?: string;
}

export interface UserPagination {
  current: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
  totalRecords: number;
  limit: number;
}

export interface SalesRep {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
}
