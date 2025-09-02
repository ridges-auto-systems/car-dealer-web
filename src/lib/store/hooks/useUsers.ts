// lib/store/hooks/useUsers.ts - Fixed version
import { get } from "http";
import { useState, useEffect, useCallback } from "react";

// API Base URL
const API_BASE_URL = "http://localhost:5000/api";

// User interface
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "ADMIN" | "SALES_REP" | "MANAGER";
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING";
  lastActive: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "ADMIN" | "SALES_REP" | "MANAGER";
  password: string;
}

// Transform API user data
const transformUser = (apiUser: any): User => {
  return {
    id: apiUser.id,
    email: apiUser.email,
    firstName: apiUser.firstName || apiUser.first_name || "",
    lastName: apiUser.lastName || apiUser.last_name || "",
    phone: apiUser.phone || "",
    role: apiUser.role || "SALES_REP",
    status: apiUser.status || "ACTIVE",
    lastActive:
      apiUser.lastActive ||
      apiUser.last_active ||
      apiUser.updatedAt ||
      new Date().toISOString(),
    createdAt:
      apiUser.createdAt || apiUser.created_at || new Date().toISOString(),
    updatedAt:
      apiUser.updatedAt || apiUser.updated_at || new Date().toISOString(),
    avatar: apiUser.avatar,
  };
};

// Add this helper function at the top of useUsers.ts
const getAuthHeaders = () => {
  const token = localStorage.getItem("Ridges_auth_token");
  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// API functions
async function fetchUsersFromAPI() {
  console.log("🔍 Users API: Fetching users");

  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Users API: Response received:", data);

    // Handle different response formats
    let users = [];

    if (data.success && Array.isArray(data.data)) {
      // Format: { success: true, data: [...] }
      users = data.data;
    } else if (data.success && data.data && Array.isArray(data.data.users)) {
      // Format: { success: true, data: { users: [...] } }
      users = data.data.users;
    } else if (Array.isArray(data)) {
      // Format: [...]
      users = data;
    } else if (data.users && Array.isArray(data.users)) {
      // Format: { users: [...] }
      users = data.users;
    } else {
      console.warn("⚠️ Users API: Unexpected response format:", data);
      return [];
    }

    console.log("🎯 Users API: Found", users.length, "users");
    return users.map(transformUser);
  } catch (error) {
    console.error("❌ Users API Error:", error);
    throw error;
  }
}

export const useUsers = () => {
  // Initialize state with empty arrays to prevent filter errors
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Load users function
  const loadUsers = useCallback(async () => {
    console.log("🔄 useUsers: Starting to load users");
    setLoading(true);
    setError(null);

    try {
      const fetchedUsers = await fetchUsersFromAPI();
      console.log(
        "✅ useUsers: Successfully loaded",
        fetchedUsers.length,
        "users"
      );

      // Ensure we always set an array
      const usersArray = Array.isArray(fetchedUsers) ? fetchedUsers : [];
      setUsers(usersArray);
      setFilteredUsers(usersArray);
    } catch (err: any) {
      console.error("❌ useUsers: Failed to load users:", err);
      setError(err.message || "Failed to load users");

      // Set empty arrays on error to prevent filter issues
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Search users function
  const searchUsers = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        // If no search query, show all users
        setFilteredUsers(users);
        return;
      }

      // Ensure users is an array before filtering
      if (!Array.isArray(users)) {
        console.warn("⚠️ useUsers: users is not an array, cannot filter");
        setFilteredUsers([]);
        return;
      }

      const filtered = users.filter((user) => {
        const searchLower = query.toLowerCase();
        return (
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          (user.phone && user.phone.includes(query)) ||
          user.role.toLowerCase().includes(searchLower)
        );
      });

      console.log(
        `🔍 useUsers: Filtered ${filtered.length} users for query: "${query}"`
      );
      setFilteredUsers(filtered);
    },
    [users]
  );

  // Update filtered users when users change
  useEffect(() => {
    if (searchQuery) {
      searchUsers(searchQuery);
    } else {
      setFilteredUsers(users);
    }
  }, [users, searchQuery, searchUsers]);

  // Create user function
  const createUser = async (userData: CreateUserRequest) => {
    console.log("📝 useUsers: Creating user:", userData);
    setLoading(true);

    try {
      // Generate a secure temporary password
      const tempPassword = generateTemporaryPassword();

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...userData,
          password: tempPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to create user: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("✅ useUsers: User created successfully:", result);

      // Return both the API result and the credentials we generated
      return {
        type: "users/createUser/fulfilled",
        payload: {
          ...result,
          credentials: {
            email: userData.email,
            temporaryPassword: tempPassword,
          },
        },
      };
    } catch (error) {
      console.error("❌ useUsers: Create user failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate a secure temporary password
  function generateTemporaryPassword() {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  // Update user function
  const updateUser = async (id: string, updates: Partial<User>) => {
    console.log("✏️ useUsers: Updating user:", id, updates);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to update user: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("✅ useUsers: User updated successfully:", result);

      // Update local state
      setUsers((prevUsers) =>
        Array.isArray(prevUsers)
          ? prevUsers.map((user) =>
              user.id === id ? { ...user, ...updates } : user
            )
          : []
      );

      return result;
    } catch (error) {
      console.error("❌ useUsers: Update user failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete user function
  const deleteUser = async (id: string) => {
    console.log("🗑️ useUsers: Deleting user:", id);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to delete user: ${response.status}`
        );
      }

      console.log("✅ useUsers: User deleted successfully:", id);

      // Update local state
      setUsers((prevUsers) =>
        Array.isArray(prevUsers)
          ? prevUsers.filter((user) => user.id !== id)
          : []
      );
    } catch (error) {
      console.error("❌ useUsers: Delete user failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (id: string) => {
    console.log("🔑 useUsers: Resetting password for user:", id);
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/users/${id}/reset-password`,
        {
          method: "POST",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to reset password: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("✅ useUsers: Password reset successfully");

      return {
        type: "users/resetUserPassword/fulfilled",
        payload: result,
      };
    } catch (error) {
      console.error("❌ useUsers: Reset password failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Select user function
  const selectUser = useCallback((user: User | null) => {
    setSelectedUser(user);
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-load on mount
  useEffect(() => {
    console.log("🚀 useUsers: Initial data load");
    loadUsers();
  }, [loadUsers]);

  // Return the hook interface
  return {
    // Data - ensure we always return arrays
    users: Array.isArray(filteredUsers) ? filteredUsers : [],
    allUsers: Array.isArray(users) ? users : [],
    selectedUser,

    // State
    loading,
    error,
    searchQuery,

    // Actions
    loadUsers,
    searchUsers,
    createUser,
    updateUser,
    deleteUser,
    resetPassword,
    selectUser,
    clearError,

    // Helper functions
    getUserById: (id: string) => users.find((user) => user.id === id),
    isLoading: loading,
    hasError: !!error,
    isEmpty: users.length === 0,
    totalUsers: users.length,
  };
};

export default useUsers;
