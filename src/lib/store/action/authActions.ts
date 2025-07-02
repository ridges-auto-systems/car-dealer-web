/* eslint-disable @typescript-eslint/no-explicit-any */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginCredentials, RegisterData } from "../../types/auth.type";
import { authService } from "../../services/auth.service";

// Login action
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);

      // Store token in localStorage
      localStorage.setItem("rides_auth_token", response.data.token);
      localStorage.setItem(
        "rides_user_data",
        JSON.stringify(response.data.user)
      );

      return {
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

// Register action
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);

      // Store token in localStorage
      localStorage.setItem("rides_auth_token", response.data.token);
      localStorage.setItem(
        "rides_user_data",
        JSON.stringify(response.data.user)
      );

      return {
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

// Logout action
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Clear localStorage
      localStorage.removeItem("rides_auth_token");
      localStorage.removeItem("rides_user_data");

      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

// Get current user action
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to get user");
    }
  }
);

// Initialize auth from localStorage
export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("rides_auth_token");
      const userData = localStorage.getItem("rides_user_data");

      if (token && userData) {
        return {
          user: JSON.parse(userData),
          token: token,
        };
      }

      return null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      return rejectWithValue("Failed to initialize auth");
    }
  }
);
