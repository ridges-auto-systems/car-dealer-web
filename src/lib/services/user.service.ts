import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from "../types/user.type";

// Make sure this matches your backend URL
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

class UserService {
  // Get stored token
  private getToken(): string | null {
    return localStorage.getItem("Ridges_auth_token");
  }

  // Get authorization headers
  private getAuthHeaders() {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Get all users
  async getUsers(): Promise<User[]> {
    try {
      console.log("🚀 Making getUsers request to:", `${API_BASE_URL}/users`);

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      console.log("📡 getUsers response status:", response.status);

      const data = await response.json();
      console.log("📄 getUsers response data:", data);

      if (!response.ok) {
        throw new Error(
          data.error || `HTTP ${response.status}: Failed to fetch users`
        );
      }

      return data.data || data; // Handle both { data: users } and direct users array
    } catch (error) {
      console.error("❌ getUsers error:", error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    try {
      console.log(
        "🚀 Making getUserById request to:",
        `${API_BASE_URL}/users/${id}`
      );

      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      console.log("📡 getUserById response status:", response.status);

      const data = await response.json();
      console.log("📄 getUserById response data:", data);

      if (!response.ok) {
        throw new Error(
          data.error || `HTTP ${response.status}: Failed to fetch user`
        );
      }

      return data.data || data;
    } catch (error) {
      console.error("❌ getUserById error:", error);
      throw error;
    }
  }

  // Create new user
  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    try {
      console.log(
        "🚀 Making createUser request to:",
        `${API_BASE_URL}/admin/users`
      );
      console.log("📝 Create user data:", userData);

      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      console.log("📡 createUser response status:", response.status);

      const data = await response.json();
      console.log("📄 createUser response data:", data);

      if (!response.ok) {
        throw new Error(
          data.error || `HTTP ${response.status}: Failed to create user`
        );
      }

      return data;
    } catch (error) {
      console.error("❌ createUser error:", error);
      throw error;
    }
  }

  // Update user
  async updateUser(userData: UpdateUserRequest): Promise<User> {
    try {
      const { id, ...updateData } = userData;
      console.log(
        "🚀 Making updateUser request to:",
        `${API_BASE_URL}/admin/users/${id}`
      );
      console.log("📝 Update user data:", updateData);

      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      console.log("📡 updateUser response status:", response.status);

      const data = await response.json();
      console.log("📄 updateUser response data:", data);

      if (!response.ok) {
        throw new Error(
          data.error || `HTTP ${response.status}: Failed to update user`
        );
      }

      return data.data || data;
    } catch (error) {
      console.error("❌ updateUser error:", error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(id: string): Promise<void> {
    try {
      console.log(
        "🚀 Making deleteUser request to:",
        `${API_BASE_URL}/admin/users/${id}`
      );

      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      console.log("📡 deleteUser response status:", response.status);

      if (!response.ok) {
        const data = await response.json();
        console.log("📄 deleteUser error response:", data);
        throw new Error(
          data.error || `HTTP ${response.status}: Failed to delete user`
        );
      }

      console.log("✅ User deleted successfully");
    } catch (error) {
      console.error("❌ deleteUser error:", error);
      throw error;
    }
  }

  // Reset user password
  async resetUserPassword(
    id: string
  ): Promise<{ email: string; temporaryPassword: string }> {
    try {
      console.log(
        "🚀 Making resetUserPassword request to:",
        `${API_BASE_URL}/users/${id}/reset-password`
      );

      const response = await fetch(
        `${API_BASE_URL}/users/${id}/reset-password`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
        }
      );

      console.log("📡 resetUserPassword response status:", response.status);

      const data = await response.json();
      console.log("📄 resetUserPassword response data:", {
        ...data,
        temporaryPassword: "***",
      });

      if (!response.ok) {
        throw new Error(
          data.error || `HTTP ${response.status}: Failed to reset password`
        );
      }

      return data;
    } catch (error) {
      console.error("❌ resetUserPassword error:", error);
      throw error;
    }
  }

  // Search users
  async searchUsers(query: string): Promise<User[]> {
    try {
      const encodedQuery = encodeURIComponent(query);
      console.log(
        "🚀 Making searchUsers request to:",
        `${API_BASE_URL}/users/search?q=${encodedQuery}`
      );

      const response = await fetch(
        `${API_BASE_URL}/users/search?q=${encodedQuery}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      console.log("📡 searchUsers response status:", response.status);

      const data = await response.json();
      console.log("📄 searchUsers response data:", data);

      if (!response.ok) {
        throw new Error(
          data.error || `HTTP ${response.status}: Failed to search users`
        );
      }

      return data.data || data;
    } catch (error) {
      console.error("❌ searchUsers error:", error);
      throw error;
    }
  }

  // Test backend connection for users endpoint
  async testConnection(): Promise<boolean> {
    try {
      console.log("🧪 Testing users endpoint connection...");
      const response = await fetch(`${API_BASE_URL}/users/test`, {
        headers: this.getAuthHeaders(),
      });
      console.log("🏥 Users endpoint test response:", response.status);
      return response.ok;
    } catch (error) {
      console.error("❌ Users endpoint connection failed:", error);
      return false;
    }
  }
}

export const userService = new UserService();
