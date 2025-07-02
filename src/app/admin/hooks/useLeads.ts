/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { leadService } from "../../../lib/services/leadService";
import type { LeadFilters } from "../../../lib/types/lead.type";
import { CreateLeadRequest, Lead } from "@/lib/types/lead.type";

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filters, setFilters] = useState<LeadFilters>({
    status: undefined,
    priority: undefined,
    salesRepId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await leadService.getLeads(filters);
      setLeads(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createLead = async (leadData: CreateLeadRequest) => {
    try {
      const response = await leadService.createLead(leadData);
      setLeads((prev) => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error("Error creating lead:", error);
      throw error;
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      const response = await leadService.updateLead(id, updates);
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? response.data : lead))
      );
      return response.data;
    } catch (error) {
      console.error("Error updating lead:", error);
      throw error;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      await leadService.deleteLead(id);
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    } catch (error) {
      console.error("Error deleting lead:", error);
      throw error;
    }
  };

  return {
    leads,
    isLoading,
    filters,
    setFilters,
    createLead,
    updateLead,
    deleteLead,
    refetch: fetchLeads,
  };
};
