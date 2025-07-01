/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/services/leadService.ts
import { CreateLeadRequest, Lead, LeadFilters } from "../types/lead.type";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class LeadService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const token = localStorage.getItem("ridges_auth_token");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  }

  // Create a new lead
  async createLead(leadData: CreateLeadRequest) {
    return this.request<any>("/leads", {
      method: "POST",
      body: JSON.stringify(leadData),
    });
  }

  // Get all leads with filters
  async getLeads(filters: LeadFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = `/leads${queryString ? `?${queryString}` : ""}`;

    return this.request<any>(endpoint);
  }

  // Get a single lead by ID
  async getLead(id: string) {
    return this.request<any>(`/leads/${id}`);
  }

  // Update a lead
  async updateLead(id: string, updates: Partial<Lead>) {
    return this.request<any>(`/leads/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  // Delete a lead
  async deleteLead(id: string) {
    return this.request<any>(`/leads/${id}`, {
      method: "DELETE",
    });
  }

  // Bulk update leads
  async bulkUpdateLeads(leadIds: string[], updates: Partial<Lead>) {
    return this.request<any>("/leads/bulk-update", {
      method: "PATCH",
      body: JSON.stringify({ ids: leadIds, updates }),
    });
  }

  // Update lead status
  async updateLeadStatus(id: string, status: string) {
    return this.updateLead(id, { status: status as any });
  }

  // Update lead priority
  async updateLeadPriority(id: string, priority: string) {
    return this.updateLead(id, { priority: priority as any });
  }

  // Assign lead to sales rep
  async assignLeadToSalesRep(id: string, salesRepId: string) {
    return this.updateLead(id, { salesRepId });
  }

  // Get lead statistics
  async getLeadStats() {
    return this.request<any>("/leads/stats");
  }
}

export const leadService = new LeadService();
export default leadService;
