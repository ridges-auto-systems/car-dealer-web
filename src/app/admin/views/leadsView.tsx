// admin/views/LeadsView.tsx
import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  MoreVertical,
  Eye,
  Edit,
  Phone,
  Mail,
  TrendingUp,
  Target,
  UserCheck,
  Star,
  Grid3X3,
  List,
  RefreshCw,
  UserPlus,
  Car,
} from "lucide-react";
import { useLeads } from "../hooks/useLeads";
import LeadForm from "../components/leads/LeadForm";
import LeadDetails from "../components/leads/LeadDetails";
import BulkActions from "../components/leads/BulkActions";
import type {
  Lead,
  LeadStatus,
  LeadPriority,
} from "../../../lib/types/lead.type";

interface LeadsViewProps {
  userRole: "ADMIN" | "SALES_REP";
}

interface LeadMetrics {
  total: number;
  new: number;
  hot: number;
  qualified: number;
  converted: number;
  conversionRate: number;
}

interface ViewMode {
  type: "table" | "cards";
  density: "compact" | "comfortable" | "spacious";
}

const STATUS_OPTIONS: {
  value: LeadStatus | "";
  label: string;
  color: string;
}[] = [
  { value: "", label: "All Status", color: "gray" },
  { value: "NEW", label: "New", color: "blue" },
  { value: "CONTACTED", label: "Contacted", color: "purple" },
  { value: "QUALIFIED", label: "Qualified", color: "green" },
  { value: "APPOINTMENT_SCHEDULED", label: "Appointment", color: "orange" },
  { value: "TEST_DRIVE_COMPLETED", label: "Test Drive", color: "teal" },
  { value: "NEGOTIATING", label: "Negotiating", color: "yellow" },
  { value: "CLOSED_WON", label: "Won", color: "green" },
  { value: "CLOSED_LOST", label: "Lost", color: "red" },
];

const PRIORITY_OPTIONS: {
  value: LeadPriority | "";
  label: string;
  color: string;
}[] = [
  { value: "", label: "All Priority", color: "gray" },
  { value: "HOT", label: "Hot", color: "red" },
  { value: "HIGH", label: "High", color: "orange" },
  { value: "MEDIUM", label: "Medium", color: "yellow" },
  { value: "LOW", label: "Low", color: "green" },
];

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest First" },
  { value: "createdAt:asc", label: "Oldest First" },
  { value: "leadScore:desc", label: "Highest Score" },
  { value: "leadScore:asc", label: "Lowest Score" },
  { value: "customerName:asc", label: "Name A-Z" },
  { value: "customerName:desc", label: "Name Z-A" },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const LeadsView: React.FC<LeadsViewProps> = ({ userRole }) => {
  // State management
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>({
    type: "table",
    density: "comfortable",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Custom hook for lead management
  const { leads, isLoading, filters, setFilters, deleteLead, refetch } =
    useLeads();

  // Load leads on component mount
  useEffect(() => {
    console.log("LeadsView mounted, loading leads...");
    refetch();
  }, []);

  // Debug logging
  useEffect(() => {
    console.log("LeadsView state:", {
      leads: leads?.length,
      isLoading,
      filters,
    });
  }, [leads, isLoading, filters]);

  // Ensure leads is always an array
  const safeLeads: Lead[] = Array.isArray(leads) ? leads : [];

  // Filter leads based on search query
  const filteredLeads = useMemo<Lead[]>(() => {
    if (!searchQuery) return safeLeads;
    return safeLeads.filter(
      (lead: Lead) =>
        lead.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone?.includes(searchQuery) ||
        lead.vehicleName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [safeLeads, searchQuery]);

  // Calculate metrics
  const metrics: LeadMetrics = useMemo(() => {
    const leadsArr = Array.isArray(filteredLeads) ? filteredLeads : [];
    const total = leadsArr.length;
    const newLeads = leadsArr.filter((lead) => lead.status === "NEW").length;
    const hotLeads = leadsArr.filter(
      (lead) => lead.priority === "HOT" || lead.isHot
    ).length;
    const qualified = leadsArr.filter(
      (lead) => lead.status === "QUALIFIED"
    ).length;
    const converted = leadsArr.filter(
      (lead) => lead.status === "CLOSED_WON"
    ).length;
    const conversionRate = total > 0 ? (converted / total) * 100 : 0;

    return {
      total,
      new: newLeads,
      hot: hotLeads,
      qualified,
      converted,
      conversionRate,
    };
  }, [filteredLeads]);

  const handleRefresh = () => {
    console.log("Refreshing leads...");
    refetch();
  };

  const handleSelectLead = (leadId: string) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    setSelectedLeads(
      selectedLeads.length === filteredLeads.length
        ? []
        : filteredLeads.map((lead) => lead.id)
    );
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadForm(true);
  };

  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteLead(leadId);
      } catch (error) {
        console.error("Error deleting lead:", error);
      }
    }
  };

  const handleBulkAction = (action: string, leadIds: string[]) => {
    console.log("Bulk action:", action, leadIds);
    // Implement bulk operations
    setSelectedLeads([]);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters({
      ...filters,
      [filterType]: value || undefined,
      page: 1, // Reset to first page when filtering
    });
  };

  const MetricCard: React.FC<{
    title: string;
    value: number | string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: React.ComponentType<any>;
    color: string;
    trend?: { value: number; isPositive: boolean };
  }> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-500 mr-1 transform rotate-180" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const StatusBadge: React.FC<{ status: LeadStatus; size?: "sm" | "md" }> = ({
    status,
    size = "md",
  }) => {
    const statusConfig = STATUS_OPTIONS.find((opt) => opt.value === status);
    const sizeClasses =
      size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1";

    return (
      <span
        className={`${sizeClasses} rounded-full font-medium bg-${statusConfig?.color}-100 text-${statusConfig?.color}-800`}
      >
        {statusConfig?.label || status}
      </span>
    );
  };

  const PriorityBadge: React.FC<{
    priority: LeadPriority;
    isHot?: boolean;
  }> = ({ priority, isHot }) => {
    const priorityConfig = PRIORITY_OPTIONS.find(
      (opt) => opt.value === priority
    );

    return (
      <div className="flex items-center space-x-1">
        <div
          className={`w-2 h-2 rounded-full bg-${priorityConfig?.color}-500`}
        ></div>
        {isHot && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
      </div>
    );
  };

  const LeadTableRow: React.FC<{ lead: Lead }> = ({ lead }) => (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selectedLeads.includes(lead.id)}
          onChange={() => handleSelectLead(lead.id)}
          className="rounded border-gray-300 text-red-600 focus:ring-red-600"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {lead.customerName
                ? lead.customerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : lead.firstName && lead.lastName
                ? `${lead.firstName[0]}${lead.lastName[0]}`
                : "UN"}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {lead.customerName
                ? lead.customerName
                : lead.firstName && lead.lastName
                ? `${lead.firstName} ${lead.lastName}`
                : ""}
            </div>
            <div className="text-sm text-gray-500">{lead.email}</div>
            <div className="text-sm text-gray-500">{lead.phone}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <Car className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-900">
            {lead.vehicleName ||
              (typeof lead.vehicle === "object" && lead.vehicle?.model) ||
              "General Inquiry"}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={lead.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <PriorityBadge priority={lead.priority} isHot={lead.isHot} />
          <span className="text-sm text-gray-700">{lead.priority}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {lead.salesRepName ||
            (typeof lead.salesRep === "object" && lead.salesRep?.name) ||
            "Unassigned"}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${lead.leadScore || 0}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-900">{lead.leadScore || 0}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {lead.createdAt
          ? new Date(lead.createdAt).toISOString().slice(0, 10)
          : "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewLead(lead)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditLead(lead)}
            className="text-gray-600 hover:text-gray-900 p-1 rounded"
            title="Edit Lead"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            className="text-green-600 hover:text-green-900 p-1 rounded"
            title="Call Customer"
          >
            <Phone className="h-4 w-4" />
          </button>
          <button
            className="text-purple-600 hover:text-purple-900 p-1 rounded"
            title="Send Email"
          >
            <Mail className="h-4 w-4" />
          </button>
          <div className="relative group">
            <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
              <MoreVertical className="h-4 w-4" />
            </button>
            <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Schedule Appointment
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Add Note
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Change Status
                </button>
                <button
                  onClick={() => handleDeleteLead(lead.id)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );

  const LeadCard: React.FC<{ lead: Lead }> = ({ lead }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">
              {lead.customerName
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "UN"}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {lead.customerName}
            </h3>
            <p className="text-sm text-gray-500">{lead.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <PriorityBadge priority={lead.priority} isHot={lead.isHot} />
          <input
            type="checkbox"
            checked={selectedLeads.includes(lead.id)}
            onChange={() => handleSelectLead(lead.id)}
            className="rounded border-gray-300 text-red-600 focus:ring-red-600"
          />
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <StatusBadge status={lead.status} size="sm" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Vehicle:</span>
          <span className="text-sm font-medium text-gray-900">
            {lead.vehicleName || "General"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Lead Score:</span>
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${lead.leadScore || 0}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{lead.leadScore || 0}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Sales Rep:</span>
          <span className="text-sm text-gray-900">
            {lead.salesRepName || "Unassigned"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewLead(lead)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Call Customer"
          >
            <Phone className="h-4 w-4" />
          </button>
          <button
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Send Email"
          >
            <Mail className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEditLead(lead)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            title="Edit Lead"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
        <span className="text-xs text-gray-500">
          {lead.createdAt
            ? new Date(lead.createdAt).toISOString().slice(0, 10)
            : ""}
        </span>
      </div>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
          <p className="text-gray-600 mt-1">
            {userRole === "ADMIN"
              ? "Manage all customer leads"
              : "Manage your assigned leads"}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Import</span>
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowLeadForm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Leads"
          value={metrics.total}
          icon={Users}
          color="blue"
          trend={{ value: 12.5, isPositive: true }}
        />
        <MetricCard
          title="New Leads"
          value={metrics.new}
          icon={UserPlus}
          color="green"
          trend={{ value: 8.3, isPositive: true }}
        />
        <MetricCard
          title="Hot Leads"
          value={metrics.hot}
          icon={Star}
          color="red"
        />
        <MetricCard
          title="Qualified"
          value={metrics.qualified}
          icon={UserCheck}
          color="purple"
        />
        <MetricCard
          title="Conversion"
          value={`${metrics.conversionRate.toFixed(1)}%`}
          icon={Target}
          color="orange"
          trend={{ value: 2.1, isPositive: false }}
        />
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            {/* Quick Filters */}
            <select
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={filters.priority || ""}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort */}
            <select className="border border-gray-300 rounded-lg px-3 py-2">
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode({ ...viewMode, type: "table" })}
                className={`p-2 rounded-md transition-colors ${
                  viewMode.type === "table"
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode({ ...viewMode, type: "cards" })}
                className={`p-2 rounded-md transition-colors ${
                  viewMode.type === "cards"
                    ? "bg-white text-red-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleRefresh}
              className="p-2 rounded-md transition-colors text-gray-600 hover:text-gray-900"
              title="Refresh"
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Selected Items Actions */}
        {selectedLeads.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <BulkActions
              selectedCount={selectedLeads.length}
              onBulkAction={handleBulkAction}
              selectedIds={selectedLeads}
            />
          </div>
        )}
      </div>

      {/* Leads Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading leads...</span>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-lg border border-gray-200 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No leads found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "Get started by adding your first lead"}
          </p>
          <button
            onClick={() => setShowLeadForm(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add First Lead</span>
          </button>
        </div>
      ) : viewMode.type === "table" ? (
        /* Table View */
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={
                        selectedLeads.length === filteredLeads.length &&
                        filteredLeads.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-600"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle Interest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales Rep
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <LeadTableRow key={lead.id} lead={lead} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}

      {/* Modals */}
      <LeadForm
        isOpen={showLeadForm}
        onClose={() => {
          setShowLeadForm(false);
          setSelectedLead(null);
        }}
        mode={selectedLead ? "edit" : "create"}
        initialData={selectedLead}
      />

      {selectedLead && (
        <LeadDetails
          isOpen={showLeadDetails}
          onClose={() => {
            setShowLeadDetails(false);
            setSelectedLead(null);
          }}
          lead={selectedLead}
          onEdit={() => {
            setShowLeadDetails(false);
            setShowLeadForm(true);
          }}
        />
      )}
    </div>
  );
};

export default LeadsView;
