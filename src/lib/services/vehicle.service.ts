// lib/services/vehicle.service.ts - Complete version with all methods
import type { VehicleFilters, Vehicle } from "../types/vehicle.type";

const API_BASE_URL = "http://localhost:5000/api";

class VehicleService {
  async getVehicles(
    filters: VehicleFilters = {
      page: 0,
      limit: 0,
    }
  ) {
    console.log("🔍 Fetching vehicles from API:", filters);

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const url = `${API_BASE_URL}/vehicles${
      params.toString() ? "?" + params.toString() : ""
    }`;
    console.log("📡 API URL:", url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("✅ API Response:", data);
      return data;
    } catch (error) {
      console.error("❌ API Error:", error);
      throw error;
    }
  }

  async getVehicle(id: string) {
    console.log("🔍 Fetching single vehicle:", id);

    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("✅ Vehicle fetched:", data);
      return data;
    } catch (error) {
      console.error("❌ Fetch error:", error);
      throw error;
    }
  }

  // ADD MISSING METHODS:

  async createVehicle(vehicleData: Partial<Vehicle>) {
    console.log("📝 Creating vehicle:", vehicleData);

    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("✅ Vehicle created:", data);
      return data;
    } catch (error) {
      console.error("❌ Create error:", error);
      throw error;
    }
  }

  async updateVehicle(id: string, updates: Partial<Vehicle>) {
    console.log("✏️ Updating vehicle:", id, updates);

    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("✅ Vehicle updated:", data);
      return data;
    } catch (error) {
      console.error("❌ Update error:", error);
      throw error;
    }
  }

  async deleteVehicle(id: string) {
    console.log("🗑️ Deleting vehicle:", id);

    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("✅ Vehicle deleted:", data);
      return data;
    } catch (error) {
      console.error("❌ Delete error:", error);
      throw error;
    }
  }

  async getVehicleHistory(id: string) {
    console.log("📜 Fetching vehicle history:", id);

    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}/history`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("✅ Vehicle history fetched:", data);
      return data;
    } catch (error) {
      console.error("❌ History fetch error:", error);
      throw error;
    }
  }
}

// Export as named export to match existing import
export const vehicleService = new VehicleService();
