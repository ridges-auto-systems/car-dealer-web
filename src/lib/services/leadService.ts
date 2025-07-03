// lib/services/leadService.ts
import type { CreateLeadRequest, Lead, LeadFilters } from "../types/lead.type";

const API_BASE_URL = "http://localhost:5000/api";

class LeadService {
  async getLeads(filters: LeadFilters = {}) {
    console.log("🔍 Fetching leads from API:", filters);

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const url = `${API_BASE_URL}/leads${
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

  async createLead(leadData: CreateLeadRequest) {
    console.log("📝 Creating lead:", leadData);

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

  async getLead(id: string) {
    console.log("🔍 Fetching single lead:", id);

    try {
      const response = await fetch(`${API_BASE_URL}/leads/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("✅ Lead fetched:", data);
      return data;
    } catch (error) {
      console.error("❌ Fetch error:", error);
      throw error;
    }
  }

  async bulkUpdateLeads(leadIds: string[], updates: Partial<Lead>) {
    console.log("📦 Bulk updating leads:", leadIds, updates);

    try {
      const response = await fetch(`${API_BASE_URL}/leads/bulk`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leadIds, updates }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Bulk update completed:", data);
      return data;
    } catch (error) {
      console.error("❌ Bulk update error:", error);
      throw error;
    }
  }

  async getLeadStats() {
    console.log("📊 Fetching lead stats");

    try {
      const response = await fetch(`${API_BASE_URL}/leads/stats`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("✅ Stats fetched:", data);
      return data;
    } catch (error) {
      console.error("❌ Stats error:", error);
      // Fallback: return basic stats
      return {
        success: true,
        data: {
          totalLeads: 0,
          newLeads: 0,
          hotLeads: 0,
          convertedLeads: 0,
          conversionRate: 0,
        },
      };
    }
  }
}

// Export as named export to match existing import
export const leadService = new LeadService();

// Also export as default for flexibility
export default leadService;
