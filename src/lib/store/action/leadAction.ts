/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchLeads,
  createLead,
  updateLead,
  deleteLead,
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
} from "../slices/leadSlice";
import { LeadFilters, CreateLeadRequest, Lead } from "../../types/lead.type";
import type { RootState } from "../index";

// ============================================================================
// SELECTORS
// ============================================================================

export const selectLeads = (state: RootState) => state.leads.leads;
export const selectCurrentLead = (state: RootState) => state.leads.currentLead;
export const selectLeadFilters = (state: RootState) => state.leads.filters;
export const selectSelectedLeads = (state: RootState) =>
  state.leads.selectedLeads;
export const selectLeadStats = (state: RootState) => state.leads.stats;
export const selectLeadLoading = (state: RootState) => state.leads.isLoading;
export const selectLeadError = (state: RootState) => state.leads.error;
export const selectLeadPagination = (state: RootState) =>
  state.leads.pagination;

// Complex selectors
export const selectLeadById = (id: string) => (state: RootState) =>
  state.leads.leads.find((lead) => lead.id === id);

export const selectSelectedLeadsData = (state: RootState) =>
  state.leads.selectedLeads
    .map((id) => state.leads.leads.find((lead) => lead.id === id))
    .filter(Boolean);

export const selectLeadsByStatus = (status: string) => (state: RootState) =>
  state.leads.leads.filter((lead) => lead.status === status);

export const selectLeadsByPriority = (priority: string) => (state: RootState) =>
  state.leads.leads.filter((lead) => lead.priority === priority);

export const selectHotLeads = (state: RootState) =>
  state.leads.leads.filter((lead) => lead.isHot || lead.priority === "HOT");

export const selectNewLeads = (state: RootState) =>
  state.leads.leads.filter((lead) => lead.status === "NEW");

export const selectUnassignedLeads = (state: RootState) =>
  state.leads.leads.filter((lead) => !lead.salesRepId);

export const selectLeadsBySalesRep =
  (salesRepId: string) => (state: RootState) =>
    state.leads.leads.filter((lead) => lead.salesRepId === salesRepId);

export const selectHasSelectedLeads = (state: RootState) =>
  state.leads.selectedLeads.length > 0;

export const selectSelectedLeadsCount = (state: RootState) =>
  state.leads.selectedLeads.length;

export const selectIsLeadSelected = (leadId: string) => (state: RootState) =>
  state.leads.selectedLeads.includes(leadId);

// ============================================================================
// CUSTOM HOOK - FIXED VERSION
// ============================================================================

export const useLeads = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const leads = useAppSelector(selectLeads);
  const currentLead = useAppSelector(selectCurrentLead);
  const filters = useAppSelector(selectLeadFilters);
  const selectedLeads = useAppSelector(selectSelectedLeads);
  const stats = useAppSelector(selectLeadStats);
  const isLoading = useAppSelector(selectLeadLoading);
  const error = useAppSelector(selectLeadError);
  const pagination = useAppSelector(selectLeadPagination);

  const actions = {
    // Async actions
    fetchLeads: useCallback(
      async (filters?: LeadFilters) => {
        try {
          console.log(
            "🔄 useLeads: Dispatching fetchLeads with filters:",
            filters
          );
          const result = await dispatch(fetchLeads(filters ?? {}));

          if (fetchLeads.fulfilled.match(result)) {
            console.log("✅ useLeads: fetchLeads succeeded");
            return result.payload;
          } else if (fetchLeads.rejected.match(result)) {
            console.error("❌ useLeads: fetchLeads failed:", result.payload);
            throw new Error(result.payload as string);
          }
        } catch (error) {
          console.error("❌ useLeads: fetchLeads error:", error);
          throw error;
        }
      },
      [dispatch]
    ),

    createLead: useCallback(
      async (leadData: CreateLeadRequest) => {
        try {
          console.log("🔄 useLeads: Creating lead:", leadData);
          const result = await dispatch(createLead(leadData));

          if (createLead.fulfilled.match(result)) {
            console.log("✅ useLeads: createLead succeeded");
            // Refresh leads after creating
            await dispatch(fetchLeads(filters));
            return result.payload;
          } else if (createLead.rejected.match(result)) {
            console.error("❌ useLeads: createLead failed:", result.payload);
            throw new Error(result.payload as string);
          }
        } catch (error) {
          console.error("❌ useLeads: createLead error:", error);
          throw error;
        }
      },
      [dispatch, filters]
    ),

    updateLead: useCallback(
      async (id: string, updates: Partial<Lead>) => {
        try {
          console.log("🔄 useLeads: Updating lead:", id, updates);
          const result = await dispatch(updateLead({ id, updates }));

          if (updateLead.fulfilled.match(result)) {
            console.log("✅ useLeads: updateLead succeeded");
            return result.payload;
          } else if (updateLead.rejected.match(result)) {
            console.error("❌ useLeads: updateLead failed:", result.payload);
            throw new Error(result.payload as string);
          }
        } catch (error) {
          console.error("❌ useLeads: updateLead error:", error);
          throw error;
        }
      },
      [dispatch]
    ),

    deleteLead: useCallback(
      async (id: string) => {
        try {
          console.log("🔄 useLeads: Deleting lead:", id);
          const result = await dispatch(deleteLead(id));

          if (deleteLead.fulfilled.match(result)) {
            console.log("✅ useLeads: deleteLead succeeded");
            return result.payload;
          } else if (deleteLead.rejected.match(result)) {
            console.error("❌ useLeads: deleteLead failed:", result.payload);
            throw new Error(result.payload as string);
          }
        } catch (error) {
          console.error("❌ useLeads: deleteLead error:", error);
          throw error;
        }
      },
      [dispatch]
    ),

    // Sync actions
    setFilters: useCallback(
      (newFilters: Partial<LeadFilters>) => {
        console.log("🔧 useLeads: Setting filters:", newFilters);
        dispatch(setFilters(newFilters));
        // Auto-refresh with new filters
        setTimeout(() => {
          dispatch(fetchLeads({ ...filters, ...newFilters }));
        }, 100);
      },
      [dispatch, filters]
    ),

    resetFilters: useCallback(() => {
      console.log("🔧 useLeads: Resetting filters");
      dispatch(resetFilters());
      // Auto-refresh with default filters
      setTimeout(() => {
        dispatch(fetchLeads({}));
      }, 100);
    }, [dispatch]),

    selectLead: useCallback(
      (id: string) => dispatch(selectLead(id)),
      [dispatch]
    ),

    deselectLead: useCallback(
      (id: string) => dispatch(deselectLead(id)),
      [dispatch]
    ),

    toggleSelection: useCallback(
      (id: string) => dispatch(toggleLeadSelection(id)),
      [dispatch]
    ),

    selectAll: useCallback(() => dispatch(selectAllLeads()), [dispatch]),

    clearSelection: useCallback(() => dispatch(clearSelection()), [dispatch]),

    setCurrentLead: useCallback(
      (lead: Lead | null) => dispatch(setCurrentLead(lead)),
      [dispatch]
    ),

    clearCurrentLead: useCallback(
      () => dispatch(clearCurrentLead()),
      [dispatch]
    ),

    updateLeadInState: useCallback(
      (id: string, updates: Partial<Lead>) =>
        dispatch(updateLeadInState({ id, updates })),
      [dispatch]
    ),

    clearError: useCallback(() => dispatch(clearError()), [dispatch]),

    // Convenience methods
    refetch: useCallback(
      (customFilters?: LeadFilters) => {
        console.log("🔄 useLeads: Manual refetch requested");
        return dispatch(fetchLeads(customFilters || filters));
      },
      [dispatch, filters]
    ),

    // Quick actions
    updateStatus: useCallback(
      async (id: string, status: string) => {
        // Optimistic update
        dispatch(updateLeadInState({ id, updates: { status: status as any } }));
        try {
          await dispatch(
            updateLead({ id, updates: { status: status as any } })
          );
        } catch (error) {
          // Revert on error
          console.error("Failed to update status, reverting:", error);
          // You might want to refetch to get the correct state
          dispatch(fetchLeads(filters));
        }
      },
      [dispatch, filters]
    ),

    updatePriority: useCallback(
      async (id: string, priority: string) => {
        // Optimistic update
        dispatch(
          updateLeadInState({
            id,
            updates: { priority: priority as any, isHot: priority === "HOT" },
          })
        );
        try {
          await dispatch(
            updateLead({ id, updates: { priority: priority as any } })
          );
        } catch (error) {
          console.error("Failed to update priority, reverting:", error);
          dispatch(fetchLeads(filters));
        }
      },
      [dispatch, filters]
    ),

    assignToSalesRep: useCallback(
      async (id: string, salesRepId: string) => {
        // Optimistic update
        dispatch(updateLeadInState({ id, updates: { salesRepId } }));
        try {
          await dispatch(updateLead({ id, updates: { salesRepId } }));
        } catch (error) {
          console.error("Failed to assign sales rep, reverting:", error);
          dispatch(fetchLeads(filters));
        }
      },
      [dispatch, filters]
    ),

    // Filter shortcuts
    showNewLeads: useCallback(
      () => dispatch(setFilters({ status: "NEW", page: 1 })),
      [dispatch]
    ),

    showHotLeads: useCallback(
      () => dispatch(setFilters({ priority: "HOT", page: 1 })),
      [dispatch]
    ),

    showMyLeads: useCallback(
      (salesRepId: string) => dispatch(setFilters({ salesRepId, page: 1 })),
      [dispatch]
    ),

    showUnassignedLeads: useCallback(
      () => dispatch(setFilters({ salesRepId: "unassigned", page: 1 })),
      [dispatch]
    ),
  };

  // Helper functions
  const helpers = {
    isSelected: useCallback(
      (leadId: string) => selectedLeads.includes(leadId),
      [selectedLeads]
    ),

    getLeadById: useCallback(
      (id: string) => leads.find((lead) => lead.id === id),
      [leads]
    ),

    getSelectedLeadsData: useCallback(
      () =>
        selectedLeads
          .map((id) => leads.find((lead) => lead.id === id))
          .filter(Boolean),
      [selectedLeads, leads]
    ),

    hasSelectedLeads: selectedLeads.length > 0,
    selectedCount: selectedLeads.length,

    // FIXED: Add loading and error states to helpers
    isError: !!error,
    isEmpty: !isLoading && leads.length === 0,
    hasLeads: leads.length > 0,
  };

  return {
    // State
    leads,
    currentLead,
    filters,
    selectedLeads,
    stats,
    isLoading,
    error,
    pagination,

    // Actions
    ...actions,

    // Helpers
    ...helpers,
  };
};

// ============================================================================
// HOOK FOR LEAD STATS
// ============================================================================

export const useLeadStats = () => {
  const stats = useAppSelector(selectLeadStats);
  const isLoading = useAppSelector(selectLeadLoading);

  return {
    stats,
    isLoading,
  };
};

// ============================================================================
// HOOK FOR LEAD FILTERS
// ============================================================================

export const useLeadFilters = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectLeadFilters);

  const updateFilters = useCallback(
    (newFilters: Partial<LeadFilters>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const clearFilters = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

  return {
    filters,
    updateFilters,
    clearFilters,
  };
};
