import { useState, useEffect } from "react";
import { leadService } from "../services/leadService";

export const useLeads = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    salesRepId: "",
  });

  useEffect(() => {
    fetchLeads();
  }, [filters]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await leadService.getLeads(filters);
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createLead = async (leadData) => {
    try {
      const response = await leadService.createLead(leadData);
      setLeads((prev) => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      console.error("Error creating lead:", error);
      throw error;
    }
  };

  const updateLead = async (id, updates) => {
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

  const deleteLead = async (id) => {
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
