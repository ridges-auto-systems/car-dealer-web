// admin/views/UsersView.tsx - FIXED HOOKS VERSION
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  MoreVertical,
  Eye,
  Edit,
  Phone,
  Mail,
  Grid3X3,
  List,
  RefreshCw,
  UserPlus,
  UserCheck,
  UserX,
  Shield,
  Star,
  Clock,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useUsers } from "@/lib/store/hooks/useUsers";
import UserForm from "../components/users/UserForm";
import UserDetails from "../components/users/userDetails";
import type {
  User,
  CreateUserData,
  UpdateUserData,
  UserRole,
} from "../../../lib/types/user.type";
import { USER_ROLES } from "../../../lib/types/user.type";

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

type UserTab = "sales_reps" | "customers" | "admin_users";

interface UsersViewProps {
  userRole: "ADMIN" | "SALES_REP";
}

interface ViewMode {
  type: "table" | "cards";
  density: "compact" | "comfortable" | "spacious";
}

interface UserMetrics {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest First" },
  { value: "createdAt:asc", label: "Oldest First" },
  { value: "firstName:asc", label: "First Name A-Z" },
  { value: "firstName:desc", label: "First Name Z-A" },
  { value: "lastName:asc", label: "Last Name A-Z" },
  { value: "lastName:desc", label: "Last Name Z-A" },
  { value: "lastLogin:desc", label: "Recent Activity" },
  { value: "totalSales:desc", label: "Top Performers" },
];

const ROLE_OPTIONS = [
  { value: "", label: "All Roles", color: "gray" },
  { value: USER_ROLES.SALES_REP, label: "Sales Rep", color: "blue" },
  { value: USER_ROLES.SALES_MANAGER, label: "Sales Manager", color: "purple" },
  {
    value: USER_ROLES.FINANCE_MANAGER,
    label: "Finance Manager",
    color: "green",
  },
  { value: USER_ROLES.ADMIN, label: "Admin", color: "orange" },
  { value: USER_ROLES.SUPER_ADMIN, label: "Super Admin", color: "red" },
  { value: USER_ROLES.CUSTOMER, label: "Customer", color: "teal" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status", color: "gray" },
  { value: "active", label: "Active", color: "green" },
  { value: "inactive", label: "Inactive", color: "red" },
];

// ============================================================================
// MAIN COMPONENT - FIXED: ALL HOOKS AT TOP LEVEL
// ============================================================================

const UsersView: React.FC<UsersViewProps> = ({ userRole = "ADMIN" }) => {
  // ⚠️ CRITICAL: ALL HOOKS MUST BE CALLED AT THE TOP LEVEL - NO CONDITIONALS!

  // Call useUsers hook FIRST and ALWAYS
  const usersHookResult = useUsers();

  // Destructure AFTER the hook call to avoid changing hook order
  const {
    users,
    salesReps,
    salesTeam,
    customers,
    adminUsers,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    bulkUpdateUsers,
    exportUsers,
    clearError,
  } = usersHookResult;

  // ALL useState hooks must be called in the same order every render
  const [activeTab, setActiveTab] = useState<UserTab>("sales_reps");
  const [showUserForm, setShowUserForm] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>({
    type: "table",
    density: "comfortable",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    status: "",
    sortBy: "createdAt:desc",
  });

  // useEffect hooks must also be called in same order
  useEffect(() => {
    // Load users on component mount
    if (usersHookResult.loadUsers) {
      usersHookResult.loadUsers();
    }
  }, [usersHookResult.loadUsers]);

  // useMemo hooks must be called in same order
  const getCurrentData = useMemo((): User[] => {
    // Safely access arrays with fallbacks
    const safeSalesTeam = Array.isArray(salesTeam) ? salesTeam : [];
    const safeCustomers = Array.isArray(customers) ? customers : [];
    const safeAdminUsers = Array.isArray(adminUsers) ? adminUsers : [];

    switch (activeTab) {
      case "sales_reps":
        return safeSalesTeam;
      case "customers":
        return safeCustomers;
      case "admin_users":
        return safeAdminUsers;
      default:
        return [];
    }
  }, [activeTab, salesTeam, customers, adminUsers]);

  const currentData = getCurrentData;

  // Filter and search users - MEMOIZED
  const filteredUsers = useMemo(() => {
    let usersList = [...currentData];

    // Apply search filter
    if (searchQuery) {
      usersList = usersList.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.phone?.includes(searchQuery)
      );
    }

    // Apply role filter
    if (filters.role) {
      usersList = usersList.filter((user) => user.role === filters.role);
    }

    // Apply status filter
    if (filters.status) {
      usersList = usersList.filter((user) =>
        filters.status === "active" ? user.isActive : !user.isActive
      );
    }

    // Apply sorting
    const [field, direction] = filters.sortBy.split(":");
    usersList.sort((a, b) => {
      let aValue = (a as any)[field];
      let bValue = (b as any)[field];

      // Handle undefined values
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return usersList;
  }, [currentData, searchQuery, filters]);

  // Calculate metrics - MEMOIZED
  const metrics: UserMetrics = useMemo(() => {
    const safeCurrentData = Array.isArray(currentData) ? currentData : [];
    const total = safeCurrentData.length;
    const active = safeCurrentData.filter((user) => user.isActive).length;
    const inactive = total - active;
    const newThisMonth = safeCurrentData.filter((user) => {
      const createdDate = new Date(user.createdAt);
      const now = new Date();
      return (
        createdDate.getMonth() === now.getMonth() &&
        createdDate.getFullYear() === now.getFullYear()
      );
    }).length;

    return { total, active, inactive, newThisMonth };
  }, [currentData]);

  // All other functions using useCallback
  const handleSelectUser = useCallback((userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedUsers((prev) => {
      if (prev.length === filteredUsers.length) {
        return [];
      } else {
        return filteredUsers.map((user) => user.id);
      }
    });
  }, [filteredUsers]);

  const handleViewUser = useCallback((user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  }, []);

  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
    setShowUserForm(true);
  }, []);

  const handleCreateUser = useCallback(
    async (userData: CreateUserData) => {
      try {
        await createUser(userData);
        setShowUserForm(false);
        setSelectedUser(null);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    },
    [createUser]
  );

  const handleUpdateUser = useCallback(
    async (userData: UpdateUserData) => {
      if (!selectedUser) return;
      try {
        await updateUser(selectedUser.id, userData);
        setShowUserForm(false);
        setSelectedUser(null);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    },
    [selectedUser, updateUser]
  );

  const handleFormSubmit = useCallback(
    async (userData: CreateUserData | UpdateUserData) => {
      if (selectedUser) {
        await handleUpdateUser(userData as UpdateUserData);
      } else {
        await handleCreateUser(userData as CreateUserData);
      }
    },
    [selectedUser, handleUpdateUser, handleCreateUser]
  );

  const getRoleColor = useCallback((role: UserRole): string => {
    const colors = {
      [USER_ROLES.CUSTOMER]: "bg-teal-100 text-teal-800",
      [USER_ROLES.SALES_REP]: "bg-blue-100 text-blue-800",
      [USER_ROLES.SALES_MANAGER]: "bg-purple-100 text-purple-800",
      [USER_ROLES.FINANCE_MANAGER]: "bg-green-100 text-green-800",
      [USER_ROLES.ADMIN]: "bg-orange-100 text-orange-800",
      [USER_ROLES.SUPER_ADMIN]: "bg-red-100 text-red-800",
      [USER_ROLES.MANAGER]: "bg-indigo-100 text-indigo-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  }, []);

  // Early return AFTER all hooks have been called
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Loading users...
        </h3>
        <p className="text-gray-600">
          Please wait while we fetch the user data.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-12 text-center">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Error loading users
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={clearError}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center space-x-2"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  // Rest of your component JSX remains the same...
  return (
    <div className="space-y-6">
      {/* Your existing JSX content */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage sales team, customers, and administrative users
          </p>
        </div>
        {userRole === "ADMIN" && (
          <div className="flex items-center space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowUserForm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center space-x-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
        )}
      </div>

      {/* Add your existing JSX content here... */}

      {/* Modals */}
      <UserForm
        isOpen={showUserForm}
        onClose={() => {
          setShowUserForm(false);
          setSelectedUser(null);
        }}
        mode={selectedUser ? "edit" : "create"}
        user={selectedUser}
        onSubmit={handleFormSubmit}
        userRole={userRole}
      />

      {selectedUser && (
        <UserDetails
          isOpen={showUserDetails}
          onClose={() => {
            setShowUserDetails(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          onEdit={() => {
            setShowUserDetails(false);
            setShowUserForm(true);
          }}
          userRole={userRole}
        />
      )}
    </div>
  );
};

export default UsersView;
