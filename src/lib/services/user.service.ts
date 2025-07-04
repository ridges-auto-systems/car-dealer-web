import type {
  UserFilters,
  CreateUserData,
  UpdateUserData,
  User,
} from "@/lib/types/user.type";

const API_BASE_URL = "http://localhost:5000/api";

class UserService {
  // Helper method to get auth headers
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token"); // Make sure this matches how you store the token

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  // Helper method to handle API responses
  private async handleResponse(response: Response) {
    if (response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login
      throw new Error("Authentication failed. Please log in again.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: `HTTP ${response.status}: ${response.statusText}`,
      }));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return response.json();
  }

  async getUsers(
    filters: UserFilters = {
      page: 0,
      limit: 0,
    }
  ) {
    console.log("fetching users from api:", filters);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const url = `${API_BASE_URL}/users${
      params.toString() ? "?" + params.toString() : ""
    }`;
    console.log("API URL:", url);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeaders(), // 🔥 FIXED: Added auth headers
      });

      const data = await this.handleResponse(response);
      console.log("API Response:", data);
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async createUser(userData: CreateUserData) {
    console.log("📝 Creating User:", userData);

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: this.getAuthHeaders(), // 🔥 FIXED: Added auth headers
        body: JSON.stringify(userData),
      });

      const data = await this.handleResponse(response);
      console.log("✅ User created:", data);
      return data;
    } catch (error) {
      console.error("❌ User error:", error);
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<User>) {
    console.log("✏️ Updating User:", id, updates);

    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT", // Changed from PATCH to PUT to match backend
        headers: this.getAuthHeaders(), // 🔥 FIXED: Added auth headers
        body: JSON.stringify(updates),
      });

      const data = await this.handleResponse(response);
      console.log("✅ user updated:", data);
      return data;
    } catch (error) {
      console.error("❌ user error:", error);
      throw error;
    }
  }

  async getUser(id: string) {
    console.log("🔍 Fetching single user:", id);

    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "GET",
        headers: this.getAuthHeaders(), // 🔥 FIXED: Added auth headers
      });

      const data = await this.handleResponse(response);
      console.log("✅ User fetched:", data);
      return data;
    } catch (error) {
      console.error("❌ Fetch error:", error);
      throw error;
    }
  }

  async deleteUser(id: string) {
    console.log("🗑️ Deleting user:", id);

    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(), // 🔥 FIXED: Added auth headers
      });

      const data = await this.handleResponse(response);
      console.log("✅ User deleted:", data);
      return data;
    } catch (error) {
      console.error("❌ Delete error:", error);
      throw error;
    }
  }

  async toggleUserStatus(id: string, isActive: boolean) {
    console.log("🔄 Toggling user status:", id, isActive);

    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}/status`, {
        method: "PATCH",
        headers: this.getAuthHeaders(), // 🔥 FIXED: Added auth headers
        body: JSON.stringify({ isActive }),
      });

      const data = await this.handleResponse(response);
      console.log("✅ User status updated:", data);
      return data;
    } catch (error) {
      console.error("❌ Status update error:", error);
      throw error;
    }
  }
}

// Export as named export and singleton
export const userService = new UserService();
export default userService;
