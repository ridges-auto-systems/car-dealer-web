// services/auth.service.ts

import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
} from "../types/auth.type";

// Make sure this matches your backend URL
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log("🚀 Making login request to:", `${API_BASE_URL}/auth/login`);
      console.log("📝 Login credentials:", {
        email: credentials.email,
        password: "***",
      });

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      console.log("📡 Login response status:", response.status);

      const data = await response.json();
      console.log("📄 Login response data:", data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Login failed`);
      }

      return data;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  }

  // Register user
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      console.log(
        "🚀 Making register request to:",
        `${API_BASE_URL}/auth/register`
      );
      console.log("📝 Register data:", { ...userData, password: "***" });

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log("📡 Register response status:", response.status);

      const data = await response.json();
      console.log("📄 Register response data:", data);

      if (!response.ok) {
        throw new Error(
          data.error || `HTTP ${response.status}: Registration failed`
        );
      }

      return data;
    } catch (error) {
      console.error("❌ Register error:", error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<{ success: boolean; data: User }> {
    try {
      const token = this.getToken();

      if (!token) {
        throw new Error("No token found");
      }

      console.log(
        "🚀 Making getCurrentUser request to:",
        `${API_BASE_URL}/auth/me`
      );

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 getCurrentUser response status:", response.status);

      const data = await response.json();
      console.log("📄 getCurrentUser response data:", data);

      if (!response.ok) {
        throw new Error(
          data.error || `HTTP ${response.status}: Failed to get user`
        );
      }

      return data;
    } catch (error) {
      console.error("❌ getCurrentUser error:", error);
      throw error;
    }
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem("rides_auth_token");
  }

  // Clear stored data
  clearStorage(): void {
    localStorage.removeItem("rides_auth_token");
    localStorage.removeItem("rides_user_data");
  }

  // Test backend connection
  async testConnection(): Promise<boolean> {
    try {
      console.log("🧪 Testing backend connection...");
      const response = await fetch(
        `${API_BASE_URL.replace("/api", "")}/health`
      );
      console.log("🏥 Health check response:", response.status);
      return response.ok;
    } catch (error) {
      console.error("❌ Backend connection failed:", error);
      return false;
    }
  }
}

export const authService = new AuthService();
