// lib/store/slices/leadSlice.ts - FIXED VERSION
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  LeadState,
  Lead,
  LeadFilters,
  CreateLeadRequest,
} from "../../types/lead.type";
import leadService from "../../services/leadService";

// Initial state
const initialState: LeadState = {
  leads: [],
  currentLead: null,
  filters: {
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  selectedLeads: [],
  stats: {
    totalLeads: 0,
    newLeads: 0,
    hotLeads: 0,
    convertedLeads: 0,
    conversionRate: 0,
  },
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
};

// FIXED: Async thunk with proper error handling and response parsing
export const fetchLeads = createAsyncThunk(
  "leads/fetchLeads",
  async (filters: LeadFilters = {}, { rejectWithValue }) => {
    try {
      console.log("🔄 Redux: Starting fetchLeads with filters:", filters);

      // Use direct API call instead of leadService to match your working hook
      const API_BASE_URL = "http://localhost:5000/api";
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });

      const url = `${API_BASE_URL}/leads${
        params.toString() ? "?" + params.toString() : ""
      }`;

      console.log("📡 Redux: API URL:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("🔍 Redux: Full API response received:", data);

      // The API returns: { success: true, data: { leads: [...], pagination: {...} } }
      if (data && data.success && data.data) {
        console.log("✅ Redux: Valid response format detected");
        console.log(
          "📊 Redux: Leads data:",
          data.data.leads?.length || 0,
          "leads found"
        );

        // Return the data structure that the fulfilled case expects
        return {
          leads: data.data.leads || [],
          pagination: data.data.pagination || {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
          },
        };
      } else {
        console.error("❌ Redux: Invalid API response format:", data);
        throw new Error("Invalid response format from API");
      }
    } catch (error: any) {
      console.error("❌ Redux: Leads fetch failed:", error);
      return rejectWithValue(error.message || "Failed to fetch leads");
    }
  }
);

// FIXED: Other thunks to use direct API calls
export const createLead = createAsyncThunk(
  "leads/createLead",
  async (leadData: CreateLeadRequest, { rejectWithValue }) => {
    try {
      console.log("🔄 Redux: Creating lead:", leadData);

      const response = await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create lead: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Redux: Lead creation successful:", result);
      return result;
    } catch (error: any) {
      console.error("❌ Redux: Lead creation failed:", error);
      return rejectWithValue(error.message || "Failed to create lead");
    }
  }
);

export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async (
    { id, updates }: { id: string; updates: Partial<Lead> },
    { rejectWithValue }
  ) => {
    try {
      console.log("🔄 Redux: Updating lead:", id, updates);

      const response = await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update lead: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Redux: Lead update successful:", result);
      return result;
    } catch (error: any) {
      console.error("❌ Redux: Lead update failed:", error);
      return rejectWithValue(error.message || "Failed to update lead");
    }
  }
);

export const deleteLead = createAsyncThunk(
  "leads/deleteLead",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log("🔄 Redux: Deleting lead:", id);

      const response = await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete lead: ${response.status}`);
      }

      console.log("✅ Redux: Lead deletion successful:", id);
      return id;
    } catch (error: any) {
      console.error("❌ Redux: Lead deletion failed:", error);
      return rejectWithValue(error.message || "Failed to delete lead");
    }
  }
);

// FIXED: Calculate stats from leads
const calculateStatsFromLeads = (leads: Lead[]) => {
  const totalLeads = leads.length;
  const newLeads = leads.filter((lead) => lead.status === "NEW").length;
  const hotLeads = leads.filter(
    (lead) => lead.priority === "HOT" || lead.isHot
  ).length;
  const convertedLeads = leads.filter(
    (lead) => lead.status === "CLOSED_WON"
  ).length;
  const conversionRate =
    totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

  return {
    totalLeads,
    newLeads,
    hotLeads,
    convertedLeads,
    conversionRate,
  };
};

// Slice
const leadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    // Filters
    setFilters: (state, action: PayloadAction<Partial<LeadFilters>>) => {
      console.log("🔧 Redux: Setting filters:", action.payload);
      state.filters = { ...state.filters, ...action.payload };
    },

    resetFilters: (state) => {
      console.log("🔧 Redux: Resetting filters");
      state.filters = {
        page: 1,
        limit: 20,
        sortBy: "createdAt",
        sortOrder: "desc",
      };
    },

    // Selection
    selectLead: (state, action: PayloadAction<string>) => {
      const leadId = action.payload;
      if (!state.selectedLeads.includes(leadId)) {
        state.selectedLeads.push(leadId);
      }
    },

    deselectLead: (state, action: PayloadAction<string>) => {
      state.selectedLeads = state.selectedLeads.filter(
        (id) => id !== action.payload
      );
    },

    toggleLeadSelection: (state, action: PayloadAction<string>) => {
      const leadId = action.payload;
      if (state.selectedLeads.includes(leadId)) {
        state.selectedLeads = state.selectedLeads.filter((id) => id !== leadId);
      } else {
        state.selectedLeads.push(leadId);
      }
    },

    selectAllLeads: (state) => {
      state.selectedLeads = state.leads.map((lead) => lead.id);
    },

    clearSelection: (state) => {
      state.selectedLeads = [];
    },

    // Current lead
    setCurrentLead: (state, action: PayloadAction<Lead | null>) => {
      state.currentLead = action.payload;
    },

    clearCurrentLead: (state) => {
      state.currentLead = null;
    },

    // Quick status updates
    updateLeadInState: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Lead> }>
    ) => {
      const { id, updates } = action.payload;
      const leadIndex = state.leads.findIndex((lead) => lead.id === id);
      if (leadIndex !== -1) {
        state.leads[leadIndex] = { ...state.leads[leadIndex], ...updates };
        // Recalculate stats
        state.stats = calculateStatsFromLeads(state.leads);
      }
      if (state.currentLead?.id === id) {
        state.currentLead = { ...state.currentLead, ...updates };
      }
    },

    // Error handling
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // FIXED: Fetch leads
    builder
      .addCase(fetchLeads.pending, (state) => {
        console.log("🔄 Redux: Fetch leads pending");
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        console.log("✅ Redux: Fetch leads fulfilled - START");
        console.log(
          "📦 Redux: Action payload:",
          JSON.stringify(action.payload, null, 2)
        );

        state.isLoading = false;
        state.error = null;

        try {
          // FIXED: action.payload should be { leads: [...], pagination: {...} }
          if (
            action.payload &&
            action.payload.leads &&
            Array.isArray(action.payload.leads)
          ) {
            console.log(
              "🎯 Redux: Setting leads array with",
              action.payload.leads.length,
              "leads"
            );

            state.leads = action.payload.leads;

            // Update pagination if present
            if (action.payload.pagination) {
              state.pagination = action.payload.pagination;
              console.log(
                "📄 Redux: Updated pagination:",
                action.payload.pagination
              );
            }

            // FIXED: Calculate stats from the actual leads data
            state.stats = calculateStatsFromLeads(action.payload.leads);

            console.log("✅ Redux: State updated successfully");
            console.log(
              "📊 Redux: Final leads count in state:",
              state.leads.length
            );
            console.log("📊 Redux: Stats:", state.stats);

            // Log first lead for verification
            if (state.leads.length > 0) {
              console.log("🔍 Redux: First lead:", state.leads[0]);
            }
          } else {
            console.warn(
              "⚠️ Redux: Unexpected payload format:",
              action.payload
            );
            state.leads = [];
            state.error = "Invalid data format received from API";
          }
        } catch (error) {
          console.error("❌ Redux: Error processing fulfilled action:", error);
          state.leads = [];
          state.error = "Error processing lead data";
        }

        console.log("✅ Redux: Fetch leads fulfilled - END");
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        console.error("❌ Redux: Fetch leads rejected:", action.payload);
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch leads";
        state.leads = [];
      });

    // FIXED: Create lead
    builder
      .addCase(createLead.pending, (state) => {
        console.log("🔄 Redux: Create lead pending");
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        console.log("✅ Redux: Create lead fulfilled:", action.payload);
        state.isLoading = false;

        // Handle the API response structure
        if (
          action.payload.success &&
          action.payload.data &&
          action.payload.data.lead
        ) {
          const newLead = action.payload.data.lead;
          state.leads.unshift(newLead);
          state.stats = calculateStatsFromLeads(state.leads);
          console.log("📊 Redux: Added new lead:", newLead.id);
        }
      })
      .addCase(createLead.rejected, (state, action) => {
        console.error("❌ Redux: Create lead rejected:", action.payload);
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to create lead";
      });

    // FIXED: Update lead
    builder
      .addCase(updateLead.pending, (state) => {
        console.log("🔄 Redux: Update lead pending");
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        console.log("✅ Redux: Update lead fulfilled:", action.payload);

        if (action.payload.success && action.payload.data) {
          const updatedLead = action.payload.data;
          const leadIndex = state.leads.findIndex(
            (lead) => lead.id === updatedLead.id
          );
          if (leadIndex !== -1) {
            state.leads[leadIndex] = updatedLead;
            state.stats = calculateStatsFromLeads(state.leads);
          }
          if (state.currentLead?.id === updatedLead.id) {
            state.currentLead = updatedLead;
          }
          console.log("📊 Redux: Updated lead in state:", updatedLead.id);
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        console.error("❌ Redux: Update lead rejected:", action.payload);
        state.error = (action.payload as string) || "Failed to update lead";
      });

    // FIXED: Delete lead
    builder
      .addCase(deleteLead.pending, (state) => {
        console.log("🔄 Redux: Delete lead pending");
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        console.log("✅ Redux: Delete lead fulfilled:", action.payload);
        const leadId = action.payload;
        state.leads = state.leads.filter((lead) => lead.id !== leadId);
        state.selectedLeads = state.selectedLeads.filter((id) => id !== leadId);
        if (state.currentLead?.id === leadId) {
          state.currentLead = null;
        }
        state.stats = calculateStatsFromLeads(state.leads);
        console.log("📊 Redux: Removed lead from state:", leadId);
      })
      .addCase(deleteLead.rejected, (state, action) => {
        console.error("❌ Redux: Delete lead rejected:", action.payload);
        state.error = (action.payload as string) || "Failed to delete lead";
      });
  },
});

export const {
  setFilters,
  resetFilters,
  selectLead,
  deselectLead,
  toggleLeadSelection,
  selectAllLeads,
  clearSelection,
  setCurrentLead,
  clearCurrentLead,
  updateLeadInState,
  clearError,
} = leadSlice.actions;

export default leadSlice.reducer;
