// lib/slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type {
  User,
  UserStats,
  UserFilters,
  CreateUserData,
  UpdateUserData,
  CreateUserRequest,
  UpdateUserRequest,
  UserPagination,
  SalesRep,
} from "@/lib/types/user.type";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Function to get and validate token
// Replace the getValidToken function in your user.slice.ts with this:

// Replace the getValidToken function in your user.slice.ts with this:

const getValidToken = (): string | null => {
  try {
    // 🔥 FIXED: Check the correct token key from your localStorage
    const tokenKeys = [
      "rides_auth_token",
      "authToken",
      "access_token",
      "token",
    ];

    for (const key of tokenKeys) {
      const token = localStorage.getItem(key);
      if (token && token.trim()) {
        console.log(`✅ Using token from key: ${key}`);

        // Validate JWT format
        const parts = token.split(".");
        if (parts.length === 3) {
          try {
            const payload = JSON.parse(atob(parts[1]));
            const isExpired = payload.exp * 1000 < Date.now();

            if (isExpired) {
              console.warn(`❌ Token from ${key} is expired`);
              localStorage.removeItem(key);
              continue; // Try next key
            }

            console.log(`✅ Valid token found in ${key}`);
            return token.trim();
          } catch (e) {
            console.warn(`❌ Invalid token format in ${key}`);
            localStorage.removeItem(key);
            continue;
          }
        } else {
          console.warn(
            `❌ Invalid JWT format in ${key} (${parts.length} parts instead of 3)`
          );
          localStorage.removeItem(key);
          continue;
        }
      }
    }

    console.warn("❌ No valid token found in localStorage");
    return null;
  } catch (error) {
    console.error("❌ Error getting token:", error);
    return null;
  }
};
// Function to handle API responses with better error handling
const handleApiResponse = async (response: Response) => {
  if (response.status === 401) {
    // Token is invalid, clear it
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login
    throw new Error("Authentication failed. Please log in again.");
  }

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || `HTTP ${response.status}`);
  }

  return response.json();
};

// ============================================================================
// ASYNC THUNKS WITH BETTER ERROR HANDLING
// ============================================================================
let currentFetchUsersPromise: Promise<any> | null = null;
// Fetch users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (filters: Partial<UserFilters> = {}, { rejectWithValue }) => {
    // 🔥 PREVENT MULTIPLE SIMULTANEOUS REQUESTS
    if (currentFetchUsersPromise) {
      console.log(
        "⚠️ fetchUsers already in progress, returning existing promise"
      );
      return await currentFetchUsersPromise;
    }

    const token = getValidToken();

    if (!token) {
      throw new Error("No valid authentication token found");
    }

    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, String(value));
      }
    });

    // 🔥 CREATE AND STORE THE PROMISE
    currentFetchUsersPromise = (async () => {
      try {
        console.log("🔄 Making fetchUsers API call...");
        const response = await fetch(`${API_BASE_URL}/users?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await handleApiResponse(response);
        console.log("✅ fetchUsers successful");
        return data.data;
      } catch (error) {
        console.error("❌ fetchUsers failed:", error);
        throw error;
      } finally {
        // 🔥 CLEAR THE PROMISE WHEN DONE
        currentFetchUsersPromise = null;
      }
    })();

    return await currentFetchUsersPromise;
  }
);
// Fetch single user
export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async (userId: string) => {
    const token = getValidToken();

    if (!token) {
      throw new Error("No valid authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await handleApiResponse(response);
    return data.data;
  }
);

// Create user
export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData: CreateUserData) => {
    const token = getValidToken();

    if (!token) {
      throw new Error("No valid authentication token found");
    }

    // Map CreateUserData to CreateUserRequest for API
    const apiData: CreateUserRequest = {
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.role,
      preferredContact: userData.preferredContact,
    };

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiData),
    });

    const data = await handleApiResponse(response);
    return data.data;
  }
);

// Update user
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, updates }: { id: string; updates: UpdateUserData }) => {
    const token = getValidToken();

    if (!token) {
      throw new Error("No valid authentication token found");
    }

    // Map UpdateUserData to UpdateUserRequest for API
    const apiData: UpdateUserRequest = {
      email: updates.email,
      firstName: updates.firstName,
      lastName: updates.lastName,
      phone: updates.phone,
      role: updates.role,
      isActive: updates.isActive,
      preferredContact: updates.preferredContact,
    };

    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiData),
    });

    const data = await handleApiResponse(response);
    return data.data;
  }
);

// Delete user (soft delete)
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId: string) => {
    const token = getValidToken();

    if (!token) {
      throw new Error("No valid authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    await handleApiResponse(response);
    return userId;
  }
);

// Fetch user stats
export const fetchUserStats = createAsyncThunk("users/fetchStats", async () => {
  const token = getValidToken();

  if (!token) {
    throw new Error("No valid authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/users/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await handleApiResponse(response);
  return data.data;
});

// Fetch sales representatives
export const fetchSalesReps = createAsyncThunk(
  "users/fetchSalesReps",
  async () => {
    const token = getValidToken();

    if (!token) {
      throw new Error("No valid authentication token found");
    }

    const response = await fetch(`${API_BASE_URL}/users/role/sales-reps`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await handleApiResponse(response);
    return data.data;
  }
);

// ============================================================================
// INTERFACE
// ============================================================================

interface UserState {
  users: User[];
  currentUser: User | null;
  salesReps: SalesRep[];
  stats: UserStats | null;
  filters: UserFilters;
  selectedUsers: string[];
  pagination: UserPagination;
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: UserState = {
  users: [],
  currentUser: null,
  salesReps: [],
  stats: null,
  filters: {
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  selectedUsers: [],
  pagination: {
    current: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
    totalRecords: 0,
    limit: 20,
  },
  isLoading: false,
  error: null,
};

// ============================================================================
// SLICE
// ============================================================================

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Filters
    setFilters: (state, action: PayloadAction<Partial<UserFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Selection
    selectUser: (state, action: PayloadAction<string>) => {
      if (!state.selectedUsers.includes(action.payload)) {
        state.selectedUsers.push(action.payload);
      }
    },
    deselectUser: (state, action: PayloadAction<string>) => {
      state.selectedUsers = state.selectedUsers.filter(
        (id) => id !== action.payload
      );
    },
    toggleUserSelection: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      if (state.selectedUsers.includes(userId)) {
        state.selectedUsers = state.selectedUsers.filter((id) => id !== userId);
      } else {
        state.selectedUsers.push(userId);
      }
    },
    selectAllUsers: (state) => {
      state.selectedUsers = state.users.map((user) => user.id);
    },
    clearSelection: (state) => {
      state.selectedUsers = [];
    },

    // Current user
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },

    // Update user in state
    updateUserInState: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      if (state.currentUser?.id === action.payload.id) {
        state.currentUser = action.payload;
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch users";
      });

    // Fetch single user
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        // Update in users array if it exists
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch user";
      });

    // Create user
    builder
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
        state.pagination.totalRecords += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to create user";
      });

    // Update user
    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const userIndex = state.users.findIndex(
          (user) => user.id === updatedUser.id
        );
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
        if (state.currentUser?.id === updatedUser.id) {
          state.currentUser = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update user";
      });

    // Delete user
    builder
      .addCase(deleteUser.fulfilled, (state, action) => {
        const userId = action.payload;
        // Mark as inactive instead of removing (soft delete)
        const userIndex = state.users.findIndex((user) => user.id === userId);
        if (userIndex !== -1) {
          state.users[userIndex].isActive = false;
        }
        state.selectedUsers = state.selectedUsers.filter((id) => id !== userId);
        if (state.currentUser?.id === userId) {
          state.currentUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete user";
      });

    // Fetch stats
    builder
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch stats";
      });

    // Fetch sales reps
    builder
      .addCase(fetchSalesReps.fulfilled, (state, action) => {
        state.salesReps = action.payload;
      })
      .addCase(fetchSalesReps.rejected, (state, action) => {
        state.error =
          action.error.message || "Failed to fetch sales representatives";
      });
  },
});

export const {
  setFilters,
  resetFilters,
  selectUser,
  deselectUser,
  toggleUserSelection,
  selectAllUsers,
  clearSelection,
  setCurrentUser,
  clearCurrentUser,
  updateUserInState,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
