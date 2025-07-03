// lib/store/slices/auth.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  fetchUserProfile,
  logoutUser,
  initializeAuth,
} from "../action/authActions";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "SALES_REP" | "CUSTOMER";
  isActive: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  initialized: false,
};

// Helper functions for localStorage
const saveAuthData = (token: string, user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("rides_auth_token", token);
    localStorage.setItem("rides_user_data", JSON.stringify(user));
  }
};

const clearAuthData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("rides_auth_token");
    localStorage.removeItem("rides_user_data");
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.initialized = true;
      // Clear token from localStorage
      clearAuthData();
    },
    // Add this reducer to handle manual auth restoration
    restoreAuth: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    // Login User
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.initialized = true;
        // Save to localStorage
        saveAuthData(action.payload.token, action.payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.initialized = true;
        clearAuthData();
      });

    // Fetch User Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.initialized = true;
        // Save to localStorage
        saveAuthData(action.payload.token, action.payload.user);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.initialized = true;
        clearAuthData();
      });

    // Logout User
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.initialized = true;
      clearAuthData();
    });

    // Register User
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.initialized = true;
        // Save to localStorage
        saveAuthData(action.payload.token, action.payload.user);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.initialized = true;
        clearAuthData();
      });

    // Initialize Auth
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        state.initialized = false;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.initialized = true;
        // Save to localStorage
        saveAuthData(action.payload.token, action.payload.user);
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.initialized = true;
        clearAuthData();
      });
  },
});

export const { clearError, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
