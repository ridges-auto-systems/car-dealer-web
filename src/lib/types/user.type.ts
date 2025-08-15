// src/types/user.types.ts
export type UserRole =
  | "CUSTOMER"
  | "SALES_REP"
  | "MANAGER"
  | "ADMIN"
  | "SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string; // Optional field
  isActive: boolean;
  lastActive: string;
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

// Admin-only roles for user creation
export type AdminUserRole = "SALES_REP" | "MANAGER" | "ADMIN";

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: AdminUserRole;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: string;
}

export interface UserCredentials {
  email: string;
  temporaryPassword: string;
}

export interface UserResponse {
  user: User;
  credentials?: UserCredentials;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  selectedUser: User | null;
  searchQuery: string;
  filters: {
    role?: string;
    status?: string;
  };
}
