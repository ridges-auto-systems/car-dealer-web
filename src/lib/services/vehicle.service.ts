// lib/services/leadService.ts
import type { VehicleFilters } from "../types/vehicle.type";

const API_BASE_URL = "http://localhost:5000/api";

class VehicleService {
  async getVehicles(filters: VehicleFilters = {}) {
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

  /*
  async createLead(leadData: CreateLeadRequest) {
    console.log("📝 Creating lead:", leadData);
    ``;
    try {
      const response = await fetch(`${API_BASE_URL}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Lead created:", data);
      return data;
    } catch (error) {
      console.error("❌ Create error:", error);
      throw error;
    }
  }
*/
  /*
  async updateLead(id: string, updates: Partial<Lead>) {
    console.log("✏️ Updating lead:", id, updates);

    try {
      const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Lead updated:", data);
      return data;
    } catch (error) {
      console.error("❌ Update error:", error);
      throw error;
    }
  }
    */
  /*
  async deleteLead(id: string) {
    console.log("🗑️ Deleting lead:", id);

    try {
      const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      console.log("✅ Lead deleted:", id);
      return { success: true };
    } catch (error) {
      console.error("❌ Delete error:", error);
      throw error;
    }
  }
    */

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
