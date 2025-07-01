/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/store/hooks/useLeads.ts
import { useCallback, useMemo } from "react";
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
  toggleLeadSelection,
  clearSelection,
  setCurrentLead,
  clearError,
} from "../slices/leadSlice";
import type {
  LeadFilters,
  CreateLeadRequest,
  Lead,
} from "../../types/lead.type";

export const useLeads = () => {
  const dispatch = useAppDispatch();

  // State selectors
  const {
    leads,
    currentLead,
    filters,
    selectedLeads,
    stats,
    isLoading,
    error,
    pagination,
  } = useAppSelector((state) => state.leads);

  // Actions
  const actions = useMemo(
    () => ({
      // Fetch leads
      loadLeads: (filters?: LeadFilters) =>
        dispatch(fetchLeads(filters ?? ({} as LeadFilters))),

      // Create lead
      createNewLead: (leadData: CreateLeadRequest) =>
        dispatch(createLead(leadData)),

      // Get single lead
      loadLead: (id: string) => dispatch(fetchLead(id)),

      // Update lead
      updateLead: (id: string, updates: Partial<Lead>) =>
        dispatch(updateLead({ id, updates })),

      // Delete lead
      removeLead: (id: string) => dispatch(deleteLead(id)),

      // Bulk operations
      bulkUpdate: (leadIds: string[], updates: Partial<Lead>) =>
        dispatch(bulkUpdateLeads({ leadIds, updates })),

      // Stats
      loadStats: () => dispatch(fetchLeadStats()),

      // Filters
      setFilters: (newFilters: Partial<LeadFilters>) =>
        dispatch(setFilters(newFilters)),
      resetFilters: () => dispatch(resetFilters()),

      // Selection
      toggleSelection: (leadId: string) =>
        dispatch(toggleLeadSelection(leadId)),
      clearSelection: () => dispatch(clearSelection()),

      // Current lead
      setCurrentLead: (lead: Lead | null) => dispatch(setCurrentLead(lead)),

      // Error handling
      clearError: () => dispatch(clearError()),
    }),
    [dispatch]
  );

  // Individual callback functions for quick actions
  const updateStatus = useCallback(
    async (id: string, status: string) => {
      return dispatch(updateLead({ id, updates: { status: status as any } }));
    },
    [] // dispatch is stable, no need to include it
  );

  const updatePriority = useCallback(async (id: string, priority: string) => {
    return dispatch(
      updateLead({
        id,
        updates: { priority: priority as any, isHot: priority === "HOT" },
      })
    );
  }, []);

  const assignToSalesRep = useCallback(
    async (id: string, salesRepId: string) => {
      return dispatch(updateLead({ id, updates: { salesRepId } }));
    },
    []
  );

  const markAsHot = useCallback(async (id: string) => {
    return dispatch(
      updateLead({
        id,
        updates: { priority: "HOT", isHot: true },
      })
    );
  }, []);

  // Quick actions object
  const quickActions = useMemo(
    () => ({
      updateStatus,
      updatePriority,
      assignToSalesRep,
      markAsHot,
    }),
    [updateStatus, updatePriority, assignToSalesRep, markAsHot]
  );

  // Filter shortcuts
  const filterShortcuts = useMemo(
    () => ({
      showNew: () => dispatch(setFilters({ status: "NEW", page: 1 })),
      showHot: () => dispatch(setFilters({ priority: "HOT", page: 1 })),
      showUnassigned: () =>
        dispatch(setFilters({ salesRepId: undefined, page: 1 })),
      showMy: (salesRepId: string) =>
        dispatch(setFilters({ salesRepId, page: 1 })),
      showByStatus: (status: string) =>
        dispatch(setFilters({ status: status as any, page: 1 })),
      showByPriority: (priority: string) =>
        dispatch(setFilters({ priority: priority as any, page: 1 })),
    }),
    [] // dispatch is stable
  );

  // Computed values
  const computed = useMemo(
    () => ({
      hasLeads: leads.length > 0,
      hasSelectedLeads: selectedLeads.length > 0,
      selectedCount: selectedLeads.length,
      totalLeads: pagination.total,
      hasNextPage: pagination.page < pagination.totalPages,
      hasPrevPage: pagination.page > 1,

      // Get specific leads
      newLeads: leads.filter((lead) => lead.status === "NEW"),
      hotLeads: leads.filter((lead) => lead.isHot || lead.priority === "HOT"),
      unassignedLeads: leads.filter((lead) => !lead.salesRepId),

      // Selected leads data
      selectedLeadsData: selectedLeads
        .map((id) => leads.find((lead) => lead.id === id))
        .filter(Boolean) as Lead[],
    }),
    [leads, selectedLeads, pagination]
  );

  // Helper functions
  const helpers = useMemo(
    () => ({
      isSelected: (leadId: string) => selectedLeads.includes(leadId),
      getLeadById: (id: string) => leads.find((lead) => lead.id === id),
      getLeadsByStatus: (status: string) =>
        leads.filter((lead) => lead.status === status),
      getLeadsByPriority: (priority: string) =>
        leads.filter((lead) => lead.priority === priority),
      getLeadsBySalesRep: (salesRepId: string) =>
        leads.filter((lead) => lead.salesRepId === salesRepId),
    }),
    [leads, selectedLeads]
  );

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

    // Quick actions
    ...quickActions,

    // Filter shortcuts
    ...filterShortcuts,

    // Computed values
    ...computed,

    // Helpers
    ...helpers,
  };
};

// Hook for lead creation form
export const useLeadForm = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.leads);

  const createLeadHandler = useCallback(
    async (leadData: CreateLeadRequest): Promise<any> => {
      try {
        const result = await dispatch(createLead(leadData));
        return result.payload;
      } catch (err) {
        throw err;
      }
    },
    [] // dispatch is stable
  );

  return {
    createLead: createLeadHandler,
    isLoading,
    error,
  };
};

// Hook for individual lead management
export const useLead = (leadId?: string) => {
  const dispatch = useAppDispatch();
  const { leads, currentLead, isLoading, error } = useAppSelector(
    (state) => state.leads
  );

  const lead = useMemo(() => {
    if (leadId) {
      return leads.find((l) => l.id === leadId) || currentLead;
    }
    return currentLead;
  }, [leadId, leads, currentLead]);

  const actions = useMemo(
    () => ({
      load: () => leadId && dispatch(fetchLead(leadId)),
      update: (updates: Partial<Lead>) =>
        leadId && dispatch(updateLead({ id: leadId, updates })),
      remove: () => leadId && dispatch(deleteLead(leadId)),
      setCurrent: () => lead && dispatch(setCurrentLead(lead)),
    }),
    [leadId, lead] // dispatch is stable, no need to include
  );

  return {
    lead,
    isLoading,
    error,
    ...actions,
  };
};
