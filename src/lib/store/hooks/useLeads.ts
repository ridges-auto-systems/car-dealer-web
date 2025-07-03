// admin/hooks/useLeads.ts - Fixed to match LeadsView expectations
import { useState, useEffect, useCallback } from "react";
import type {
  LeadFilters,
  CreateLeadRequest,
  Lead,
} from "../../../lib/types/lead.type";

// Simple API caller that works with your exact API format
const API_BASE_URL = "http://localhost:5000/api";

// Transform API lead data to match UI expectations
const transformLead = (apiLead: any): Lead => {
  return {
    ...apiLead,
    // Transform customerName from firstName + lastName
    customerName:
      apiLead.customerName ||
      `${apiLead.firstName || ""} ${apiLead.lastName || ""}`.trim(),

    // Transform vehicle info
    vehicle:
      apiLead.vehicleName ||
      (apiLead.vehicle
        ? `${apiLead.vehicle.year || ""} ${apiLead.vehicle.make || ""} ${
            apiLead.vehicle.model || ""
          }`.trim()
        : null) ||
      "General Inquiry",

    // Transform sales rep info
    salesRep:
      apiLead.salesRepName ||
      (apiLead.salesRep
        ? `${apiLead.salesRep.firstName || ""} ${
            apiLead.salesRep.lastName || ""
          }`.trim()
        : null) ||
      "Unassigned",

    // Ensure required fields have defaults
    firstName: apiLead.firstName || "",
    lastName: apiLead.lastName || "",
    email: apiLead.email || "",
    phone: apiLead.phone || "",
    status: apiLead.status || "NEW",
    priority: apiLead.priority || "MEDIUM",
    isHot: apiLead.isHot || apiLead.priority === "HOT",
    leadScore: apiLead.leadScore || 0,
    createdAt: apiLead.createdAt || new Date().toISOString(),
    updatedAt: apiLead.updatedAt || new Date().toISOString(),
    lastContact: apiLead.lastContact || apiLead.updatedAt || apiLead.createdAt,

    // Optional fields
    customerId: apiLead.customerId || "",
    salesRepId: apiLead.salesRepId,
    vehicleId: apiLead.vehicleId,
    source: apiLead.source,
    notes: apiLead.notes,
    interestedInTrade: apiLead.interestedInTrade || false,
    tradeVehicleInfo: apiLead.tradeVehicleInfo,
    financingNeeded: apiLead.financingNeeded || false,
    budgetRange: apiLead.budgetRange,
    timeline: apiLead.timeline,
  };
};

async function fetchLeadsFromAPI(filters: LeadFilters = {}) {
  console.log("🔍 Direct API: Fetching leads with filters:", filters);

  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const url = `${API_BASE_URL}/leads${
    params.toString() ? "?" + params.toString() : ""
  }`;
  console.log("📡 Direct API: URL:", url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("✅ Direct API: Response received:", data);

    // Your API returns: { success: true, data: { leads: [...], pagination: {...} } }
    if (data.success && data.data && Array.isArray(data.data.leads)) {
      console.log("🎯 Direct API: Found", data.data.leads.length, "leads");

      // Transform leads to match UI expectations
      const transformedLeads = data.data.leads.map(transformLead);
      console.log(
        "🔄 Direct API: Transformed first lead:",
        transformedLeads[0]
      );

      return {
        leads: transformedLeads,
        pagination: data.data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      };
    } else {
      throw new Error("Invalid response format from API");
    }
  } catch (error) {
    console.error("❌ Direct API Error:", error);
    throw error;
  }
}

export const useLeads = () => {
  // Simple state management
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<LeadFilters>({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Stats calculated from leads
  const stats = {
    totalLeads: leads.length,
    newLeads: leads.filter((lead) => lead.status === "NEW").length,
    hotLeads: leads.filter((lead) => lead.priority === "HOT" || lead.isHot)
      .length,
    convertedLeads: leads.filter((lead) => lead.status === "CLOSED_WON").length,
    conversionRate:
      leads.length > 0
        ? (leads.filter((lead) => lead.status === "CLOSED_WON").length /
            leads.length) *
          100
        : 0,
  };

  // Load leads function
  const loadLeads = useCallback(
    async (customFilters?: LeadFilters) => {
      console.log("🔄 useLeads: Starting to load leads");
      setIsLoading(true);
      setError(null);

      try {
        const filtersToUse = customFilters || filters;
        const result = await fetchLeadsFromAPI(filtersToUse);

        console.log(
          "✅ useLeads: Successfully loaded",
          result.leads.length,
          "leads"
        );
        setLeads(result.leads);
        setPagination(result.pagination);
      } catch (err: any) {
        console.error("❌ useLeads: Failed to load leads:", err);
        setError(err.message || "Failed to load leads");
        setLeads([]);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  // Auto-load on mount and when filters change
  useEffect(() => {
    console.log("useLeads: Auto-loading leads on mount/filter change");
    loadLeads();
  }, [loadLeads]);

  // API functions
  const createLead = async (leadData: CreateLeadRequest) => {
    console.log("📝 useLeads: Creating lead:", leadData);
    try {
      const response = await fetch(`${API_BASE_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create lead: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ useLeads: Lead created successfully:", result);

      // Reload leads to get the updated list
      await loadLeads();

      return result;
    } catch (error) {
      console.error("❌ useLeads: Create lead failed:", error);
      throw error;
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    console.log("✏️ useLeads: Updating lead:", id, updates);
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update lead: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ useLeads: Lead updated successfully:", result);

      // Transform and update local state
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === id ? transformLead({ ...lead, ...updates }) : lead
        )
      );

      return result;
    } catch (error) {
      console.error("❌ useLeads: Update lead failed:", error);
      throw error;
    }
  };

  const deleteLead = async (id: string) => {
    console.log("🗑️ useLeads: Deleting lead:", id);
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete lead: ${response.status}`);
      }

      console.log("✅ useLeads: Lead deleted successfully:", id);

      // Update local state
      setLeads((prevLeads) => prevLeads.filter((lead) => lead.id !== id));
      setSelectedLeads((prevSelected) =>
        prevSelected.filter((leadId) => leadId !== id)
      );
    } catch (error) {
      console.error("❌ useLeads: Delete lead failed:", error);
      throw error;
    }
  };

  // Helper functions
  const setFilters = useCallback((newFilters: Partial<LeadFilters>) => {
    console.log("🔧 useLeads: Setting filters:", newFilters);
    setFiltersState((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilters };

      // Reset to page 1 when filters change (except pagination changes)
      if (!newFilters.page) {
        updatedFilters.page = 1;
      }

      // Auto-reload with new filters
      fetchLeadsFromAPI(updatedFilters)
        .then((result) => {
          setLeads(result.leads);
          setPagination(result.pagination);
        })
        .catch((err) => {
          console.error("Error reloading with new filters:", err);
          setError(err.message);
        });
      return updatedFilters;
    });
  }, []);

  const refetch = useCallback(
    (customFilters?: LeadFilters) => {
      console.log("🔄 useLeads: Manual refetch requested");
      return loadLeads(customFilters);
    },
    [loadLeads]
  );

  // Return everything the LeadsView needs
  return {
    // Core state
    leads,
    isLoading,
    error, // ← Fix for error 1
    filters,
    selectedLeads,
    stats,
    pagination, // ← Fix for error 3

    // Core actions
    fetchLeads: loadLeads,
    refetch,
    createLead,
    updateLead,
    deleteLead,
    setFilters,
    loadLeads: refetch, // Add this for the refresh button

    // Helper actions
    clearError: () => setError(null),
    toggleSelection: (leadId: string) => {
      setSelectedLeads((prev) =>
        prev.includes(leadId)
          ? prev.filter((id) => id !== leadId)
          : [...prev, leadId]
      );
    },
    clearSelection: () => setSelectedLeads([]),

    // Helper values
    isSelected: (leadId: string) => selectedLeads.includes(leadId),
    getLeadById: (id: string) => leads.find((lead) => lead.id === id),
    selectedCount: selectedLeads.length,
    hasSelectedLeads: selectedLeads.length > 0,
    isEmpty: leads.length === 0,
    isError: !!error,
  };
};

export default useLeads;
