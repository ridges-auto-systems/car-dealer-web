/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
//import { useLeads } from "../hooks/useLeads";
//import SearchFilters from "../components/common/SearchFilters";
//import DataTable from "../components/common/DataTable";
//import LeadForm from "../components/leads/LeadForm";
//import BulkActions from "../components/leads/BulkActions";
import { Plus, Download } from "lucide-react";

const LeadsView = () => {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState([]);

  const { leads, isLoading, filters, setFilters, createLead, deleteLead } =
    useLeads();

  const handleBulkAction = (action: any, leadIds: any) => {
    // Handle bulk operations
    console.log("Bulk action:", action, leadIds);
  };

  const tableColumns = [
    { key: "customerName", label: "Customer" },
    { key: "vehicle", label: "Vehicle Interest" },
    { key: "status", label: "Status" },
    { key: "salesRep", label: "Sales Rep" },
    { key: "leadScore", label: "Score" },
    { key: "lastContact", label: "Last Contact" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-1">Manage and track customer leads</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowLeadForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        searchPlaceholder="Search leads..."
      />

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <BulkActions
          selectedCount={selectedLeads.length}
          onBulkAction={handleBulkAction}
          selectedIds={selectedLeads}
        />
      )}

      {/* Leads Table */}
      <DataTable
        data={leads}
        columns={tableColumns}
        isLoading={isLoading}
        selectedRows={selectedLeads}
        onSelectionChange={setSelectedLeads}
        onRowAction={(action: string, row: { id: any }) => {
          if (action === "edit") {
            // Handle edit
          } else if (action === "delete") {
            deleteLead(row.id);
          }
        }}
      />

      {/* Add Lead Modal */}
      {showLeadForm && (
        <LeadForm
          onClose={() => setShowLeadForm(false)}
          onSubmit={(leadData: any) => {
            createLead(leadData);
            setShowLeadForm(false);
          }}
        />
      )}
    </div>
  );
};

export default LeadsView;
