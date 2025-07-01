// lib/store/slices/leadSlice.ts
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

// Async thunks
export const fetchLeads = createAsyncThunk(
  "leads/fetchLeads",
  async (filters: LeadFilters = {}) => {
    const response = await leadService.getLeads(filters);
    return response.data;
  }
);

export const createLead = createAsyncThunk(
  "leads/createLead",
  async (leadData: CreateLeadRequest) => {
    const response = await leadService.createLead(leadData);
    return response.data;
  }
);

export const fetchLead = createAsyncThunk(
  "leads/fetchLead",
  async (id: string) => {
    const response = await leadService.getLead(id);
    return response.data;
  }
);

export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async ({ id, updates }: { id: string; updates: Partial<Lead> }) => {
    const response = await leadService.updateLead(id, updates);
    return response.data;
  }
);

export const deleteLead = createAsyncThunk(
  "leads/deleteLead",
  async (id: string) => {
    await leadService.deleteLead(id);
    return id;
  }
);

export const bulkUpdateLeads = createAsyncThunk(
  "leads/bulkUpdateLeads",
  async ({
    leadIds,
    updates,
  }: {
    leadIds: string[];
    updates: Partial<Lead>;
  }) => {
    const response = await leadService.bulkUpdateLeads(leadIds, updates);
    return { leadIds, updates, data: response.data };
  }
);

export const fetchLeadStats = createAsyncThunk("leads/fetchStats", async () => {
  const response = await leadService.getLeadStats();
  return response.data;
});

// Slice
const leadSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    // Filters
    setFilters: (state, action: PayloadAction<Partial<LeadFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    resetFilters: (state) => {
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
    // Fetch leads
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leads = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch leads";
      });

    // Create lead
    builder
      .addCase(createLead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.lead) {
          state.leads.unshift(action.payload.lead);
          state.stats.totalLeads += 1;
          state.stats.newLeads += 1;
        }
      })
      .addCase(createLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create lead";
      });

    // Fetch single lead
    builder
      .addCase(fetchLead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLead.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLead = action.payload;
      })
      .addCase(fetchLead.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch lead";
      });

    // Update lead
    builder
      .addCase(updateLead.fulfilled, (state, action) => {
        const updatedLead = action.payload;
        const leadIndex = state.leads.findIndex(
          (lead) => lead.id === updatedLead.id
        );
        if (leadIndex !== -1) {
          state.leads[leadIndex] = updatedLead;
        }
        if (state.currentLead?.id === updatedLead.id) {
          state.currentLead = updatedLead;
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update lead";
      });

    // Delete lead
    builder
      .addCase(deleteLead.fulfilled, (state, action) => {
        const leadId = action.payload;
        state.leads = state.leads.filter((lead) => lead.id !== leadId);
        state.selectedLeads = state.selectedLeads.filter((id) => id !== leadId);
        if (state.currentLead?.id === leadId) {
          state.currentLead = null;
        }
        state.stats.totalLeads = Math.max(0, state.stats.totalLeads - 1);
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete lead";
      });

    // Bulk update leads
    builder
      .addCase(bulkUpdateLeads.fulfilled, (state, action) => {
        const { leadIds, updates } = action.payload;
        leadIds.forEach((leadId) => {
          const leadIndex = state.leads.findIndex((lead) => lead.id === leadId);
          if (leadIndex !== -1) {
            state.leads[leadIndex] = { ...state.leads[leadIndex], ...updates };
          }
        });
        state.selectedLeads = [];
      })
      .addCase(bulkUpdateLeads.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update leads";
      });

    // Fetch stats
    builder
      .addCase(fetchLeadStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchLeadStats.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch stats";
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
