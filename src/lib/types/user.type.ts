export type UserRole =
  | "CUSTOMER"
  | "SALES_REP"
  | "SALES_MANAGER"
  | "FINANCE_MANAGER"
  | "ADMIN"
  | "SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  profileImage?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  preferredContact?: string;
  marketingOptIn: boolean;
  createdAt: string;
  updatedAt: string;
}
