/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/store/leads/actions.ts
import { createAction } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchLeads,
  createLead,
  fetchLead,
  updateLead,
  deleteLead,
  bulkUpdateLeads,
  fetchLeadStats,
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
// ACTION CREATORS
// ============================================================================

// Quick status update actions
export const updateLeadStatus = createAction<{ id: string; status: string }>(
  "leads/updateStatus"
);
export const updateLeadPriority = createAction<{
  id: string;
  priority: string;
}>("leads/updatePriority");
export const assignLeadToSalesRep = createAction<{
  id: string;
  salesRepId: string;
}>("leads/assignToSalesRep");

// Bulk actions
export const bulkUpdateStatus = createAction<{
  leadIds: string[];
  status: string;
}>("leads/bulkUpdateStatus");
export const bulkUpdatePriority = createAction<{
  leadIds: string[];
  priority: string;
}>("leads/bulkUpdatePriority");
export const bulkAssignToSalesRep = createAction<{
  leadIds: string[];
  salesRepId: string;
}>("leads/bulkAssignToSalesRep");

// Filter shortcuts
export const showNewLeads = createAction("leads/showNewLeads");
export const showHotLeads = createAction("leads/showHotLeads");
export const showMyLeads = createAction<string>("leads/showMyLeads");
export const showUnassignedLeads = createAction("leads/showUnassignedLeads");

// ============================================================================
// CUSTOM HOOK
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

  // Actions
  const actions = {
    // Async actions
    fetchLeads: useCallback(
      (filters?: LeadFilters) =>
        dispatch(fetchLeads(filters ?? ({} as LeadFilters))),
      [dispatch]
    ),
    createLead: useCallback(
      (leadData: CreateLeadRequest) => dispatch(createLead(leadData)),
      [dispatch]
    ),
    fetchLead: useCallback((id: string) => dispatch(fetchLead(id)), [dispatch]),
    updateLead: useCallback(
      (id: string, updates: Partial<Lead>) =>
        dispatch(updateLead({ id, updates })),
      [dispatch]
    ),
    deleteLead: useCallback(
      (id: string) => dispatch(deleteLead(id)),
      [dispatch]
    ),
    bulkUpdateLeads: useCallback(
      (leadIds: string[], updates: Partial<Lead>) =>
        dispatch(bulkUpdateLeads({ leadIds, updates })),
      [dispatch]
    ),
    fetchStats: useCallback(() => dispatch(fetchLeadStats()), [dispatch]),

    // Sync actions
    setFilters: useCallback(
      (filters: Partial<LeadFilters>) => dispatch(setFilters(filters)),
      [dispatch]
    ),
    resetFilters: useCallback(() => dispatch(resetFilters()), [dispatch]),
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

    // Quick actions
    updateStatus: useCallback(
      (id: string, status: string) => {
        dispatch(updateLeadInState({ id, updates: { status: status as any } }));
        dispatch(updateLead({ id, updates: { status: status as any } }));
      },
      [dispatch]
    ),

    updatePriority: useCallback(
      (id: string, priority: string) => {
        dispatch(
          updateLeadInState({
            id,
            updates: { priority: priority as any, isHot: priority === "HOT" },
          })
        );
        dispatch(updateLead({ id, updates: { priority: priority as any } }));
      },
      [dispatch]
    ),

    assignToSalesRep: useCallback(
      (id: string, salesRepId: string) => {
        dispatch(updateLeadInState({ id, updates: { salesRepId } }));
        dispatch(updateLead({ id, updates: { salesRepId } }));
      },
      [dispatch]
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
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectLeadStats);
  const isLoading = useAppSelector(selectLeadLoading);

  const refreshStats = useCallback(() => {
    dispatch(fetchLeadStats());
  }, [dispatch]);

  return {
    stats,
    isLoading,
    refreshStats,
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
