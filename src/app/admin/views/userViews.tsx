// UserViews.tsx - Fixed with proper null/undefined checks

import React, { useEffect, useRef, useState } from "react";
import { useUsers } from "@/lib/store/hooks/useUsers";
import UserForm from "../components/users/UserForm";
import type { User } from "@/lib/types/user.type";

// Icons
import {
  Search,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  MoreVertical,
  UserCheck,
  UserX,
  Phone,
  Calendar,
  Shield,
  Users as UsersIcon,
  AlertTriangle,
} from "lucide-react";

const UserViews: React.FC = () => {
  // 🔥 SAFE HOOKS - No infinite loops
  const {
    users,
    isLoading,
    error,
    fetchUsers,
    deleteUser,
    clearError,
    filters,
    setFilters,
    resetFilters,
    hasUsers,
    activeUsers,
    inactiveUsers,
    totalUsers,
  } = useUsers();

  // 🔥 SAFE INITIALIZATION
  const hasInitialized = useRef(false);

  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // 🔥 SAFE EFFECT - ONLY RUNS ONCE
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      console.log("🚀 UserViews: Initial fetch");
      fetchUsers();
    }
  }, []); // Empty dependency array

  // 🔥 HELPER FUNCTION: Safe user initials
  const getUserInitials = (user: User) => {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    return `${firstName.charAt(0) || "?"}${
      lastName.charAt(0) || ""
    }`.toUpperCase();
  };

  // 🔥 HELPER FUNCTION: Safe user full name
  const getUserFullName = (user: User) => {
    const firstName = user?.firstName || "Unknown";
    const lastName = user?.lastName || "User";
    return `${firstName} ${lastName}`;
  };

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilters({ search: term, page: 1 });
  };

  // Handle role filter
  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    setFilters({ role: (role || undefined) as User["role"], page: 1 });
  };

  // Handle refresh
  const handleRefresh = () => {
    console.log("🔄 Manual refresh");
    clearError();
    fetchUsers();
  };

  // Handle successful form submission
  const handleFormSuccess = () => {
    console.log("✅ Form submitted successfully, refreshing users...");
    fetchUsers(); // Refresh the users list
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    console.log("✏️ Editing user:", user);
    setEditingUser(user);
    setShowEditModal(true);
  };

  // Handle delete user
  const handleDeleteUser = (user: User) => {
    console.log("🗑️ Preparing to delete user:", user);
    setDeletingUser(user);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (!deletingUser) return;

    try {
      console.log("🗑️ Deleting user:", deletingUser.id);
      await deleteUser(deletingUser.id);
      console.log("✅ User deleted successfully");
      setShowDeleteConfirm(false);
      setDeletingUser(null);
      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error("❌ Failed to delete user:", error);
    }
  };

  // Get role badge
  const getRoleBadge = (role: string) => {
    const badges = {
      CUSTOMER: { color: "bg-blue-100 text-blue-800", text: "👤 Customer" },
      SALES_REP: { color: "bg-green-100 text-green-800", text: "🤝 Sales Rep" },
      SALES_MANAGER: {
        color: "bg-purple-100 text-purple-800",
        text: "👨‍💼 Sales Manager",
      },
      FINANCE_MANAGER: {
        color: "bg-orange-100 text-orange-800",
        text: "💰 Finance Manager",
      },
      ADMIN: { color: "bg-red-100 text-red-800", text: "⚡ Admin" },
      SUPER_ADMIN: {
        color: "bg-gray-100 text-gray-800",
        text: "🛡️ Super Admin",
      },
    };
    return badges[role as keyof typeof badges] || badges.CUSTOMER;
  };

  // Get status badge
  const getStatusBadge = (isActive: boolean) => {
    return isActive
      ? { color: "bg-green-100 text-green-800", text: "✅ Active" }
      : { color: "bg-red-100 text-red-800", text: "❌ Inactive" };
  };

  // Loading state
  if (isLoading && users.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading users
              </h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <UsersIcon className="h-8 w-8 mr-3" />
            Users
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage user accounts and permissions
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalUsers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCheck className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Users
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {activeUsers.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserX className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Inactive Users
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {inactiveUsers.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Admins
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {
                      users.filter((u) =>
                        ["ADMIN", "SUPER_ADMIN"].includes(u.role)
                      ).length
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search users by name or email..."
                />
              </div>
            </div>

            {/* Role Filter - 🔥 FIXED: Use only working roles */}
            <div className="sm:w-48">
              <select
                value={selectedRole}
                onChange={(e) => handleRoleFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Roles</option>
                <option value="CUSTOMER">Customer</option>
                <option value="SALES_REP">Sales Rep</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 text-sm font-medium border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  viewMode === "grid"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 text-sm font-medium border-t border-r border-b rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  viewMode === "table"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                Table
              </button>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedRole) && (
            <div className="mt-3">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRole("");
                  resetFilters();
                }}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Users List - Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {/* 🔥 FIXED: Safe initials */}
                          {getUserInitials(user)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {/* 🔥 FIXED: Safe full name */}
                        {getUserFullName(user)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {user.email || "No email"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getRoleBadge(user.role).color
                      }`}
                    >
                      {getRoleBadge(user.role).text}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getStatusBadge(user.isActive).color
                      }`}
                    >
                      {getStatusBadge(user.isActive).text}
                    </span>
                  </div>

                  {user.phone && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-2" />
                      {user.phone}
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-5 flex space-x-3">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="flex-1 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit className="h-4 w-4 inline mr-2" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="flex-1 py-2 px-3 border border-red-300 rounded-md shadow-sm text-sm leading-4 font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Trash2 className="h-4 w-4 inline mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users List - Table View */}
      {viewMode === "table" && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {/* 🔥 FIXED: Safe initials */}
                              {getUserInitials(user)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {/* 🔥 FIXED: Safe full name */}
                            {getUserFullName(user)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getRoleBadge(user.role).color
                        }`}
                      >
                        {getRoleBadge(user.role).text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getStatusBadge(user.isActive).color
                        }`}
                      >
                        {getStatusBadge(user.isActive).text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {users.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No users found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedRole
              ? "Try adjusting your search filters."
              : "Get started by adding a new user."}
          </p>
          {!searchTerm && !selectedRole && (
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add your first user
              </button>
            </div>
          )}
        </div>
      )}

      {/* 🔥 USERFORM INTEGRATION - Create Modal */}
      <UserForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        mode="create"
        onSuccess={handleFormSuccess}
      />

      {/* 🔥 USERFORM INTEGRATION - Edit Modal */}
      <UserForm
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        mode="edit"
        user={editingUser}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deletingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={() => setShowDeleteConfirm(false)}
              ></div>
            </div>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete User
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete{" "}
                        <strong>
                          {/* 🔥 FIXED: Safe full name in delete modal */}
                          {getUserFullName(deletingUser)}
                        </strong>
                        ? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDeleteUser}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeletingUser(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserViews;
