// lib/store/action/authActions.ts - CORRECTED VERSION
import { createAsyncThunk } from "@reduxjs/toolkit";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "SALES_REP" | "CUSTOMER";
  isActive: boolean;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    expiresIn: string;
  };
  message: string;
}

// FIXED: Get API URL from environment variable
const getApiUrl = () => {
  // Always use the environment variable for API URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error(
      "❌ NEXT_PUBLIC_API_URL not configured! Please set it in .env.local"
    );
    // Fallback to common backend port
    return "http://localhost:5000/api";
  }

  console.log("🔗 Using API URL:", apiUrl);
  return apiUrl;
};

// Helper to get token from localStorage
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
};

// Helper to set token in localStorage
const setToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
};

// Helper to remove token from localStorage
const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
};

// Login user action
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const apiUrl = getApiUrl();
      const loginUrl = `${apiUrl}/auth/login`;

      console.log("🔐 Making login request to:", loginUrl);

      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log("📡 Login response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("📡 Login error data:", errorData);
        return rejectWithValue(errorData.error || "Login failed");
      }

      const data: AuthResponse = await response.json();
      console.log("📡 Login response data:", data);

      if (data.success) {
        // Store token in localStorage
        setToken(data.data.token);
        console.log("✅ Token stored successfully");

        return {
          user: data.data.user,
          token: data.data.token,
        };
      } else {
        return rejectWithValue("Login failed");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      return rejectWithValue("Network error occurred");
    }
  }
);

// Fetch user profile action
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const apiUrl = getApiUrl();
      const profileUrl = `${apiUrl}/auth/me`;

      console.log("🔐 Making profile request to:", profileUrl);
      console.log("🔐 Using token:", token.substring(0, 20) + "...");

      const response = await fetch(profileUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Profile response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("📡 Profile error data:", errorData);

        // If token is invalid, remove it
        if (response.status === 401) {
          removeToken();
          console.log("🗑️ Invalid token removed from localStorage");
        }
        return rejectWithValue(
          errorData.error || "Failed to fetch user profile"
        );
      }

      const data = await response.json();
      console.log("📡 Profile response data:", data);

      if (data.success) {
        console.log("✅ Profile fetched successfully");
        return {
          user: data.data.user,
          token, // Keep the existing token
        };
      } else {
        return rejectWithValue("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("❌ Fetch profile error:", error);
      return rejectWithValue("Network error occurred");
    }
  }
);

// Logout user action
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      removeToken();
      console.log("🚪 User logged out successfully");
      return {};
    } catch (error) {
      console.error("❌ Logout error:", error);
      return rejectWithValue("Logout failed");
    }
  }
);

// Register user action
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    userData: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phone?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const apiUrl = getApiUrl();
      const registerUrl = `${apiUrl}/auth/register`;

      console.log("📝 Making registration request to:", registerUrl);

      const response = await fetch(registerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log("📡 Registration response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log("📡 Registration error data:", errorData);
        return rejectWithValue(errorData.error || "Registration failed");
      }

      const data: AuthResponse = await response.json();
      console.log("📡 Registration response data:", data);

      if (data.success) {
        // Store token in localStorage
        setToken(data.data.token);
        console.log("✅ Registration successful, token stored");

        return {
          user: data.data.user,
          token: data.data.token,
        };
      } else {
        return rejectWithValue("Registration failed");
      }
    } catch (error) {
      console.error("❌ Registration error:", error);
      return rejectWithValue("Network error occurred");
    }
  }
);

// Initialize auth state from localStorage
export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = getToken();

      if (!token) {
        console.log("🔍 No token found during initialization");
        return rejectWithValue("No token found");
      }

      console.log("🔍 Initializing auth with existing token");

      // Fetch user profile to validate token
      const result = await dispatch(fetchUserProfile());

      if (fetchUserProfile.fulfilled.match(result)) {
        console.log("✅ Auth initialized successfully");
        return result.payload;
      } else {
        console.log("❌ Auth initialization failed");
        return rejectWithValue("Invalid token");
      }
    } catch (error) {
      console.error("❌ Initialize auth error:", error);
      return rejectWithValue("Failed to initialize auth");
    }
  }
);
