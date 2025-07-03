// Complete Working LeadsView Component
import React, { useState, useMemo } from "react";
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
  Menu,
} from "lucide-react";

// Use your working hook
import { useLeads } from "../../../lib/store/hooks/useLeads";
// Import the form and bulk actions components
import LeadForm from "../components/leads/LeadForm";
import BulkActions from "../components/leads/BulkActions";

import type {
  Lead,
  LeadStatus,
  LeadPriority,
} from "../../../lib/types/lead.type";

interface LeadsViewProps {
  userRole?: "ADMIN" | "SALES_REP";
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
];

const LeadsView: React.FC<LeadsViewProps> = ({ userRole = "ADMIN" }) => {
  // Your working hook
  const {
    leads,
    isLoading,
    error,
    stats,
    pagination,
    fetchLeads,
    clearError,
    setFilters,
    isEmpty,
    isError,
  } = useLeads();

  // Debug the leads data
  console.log("🐛 LeadsView Debug:", {
    leads,
    leadsLength: leads?.length,
    firstLead: leads?.[0],
    isLoading,
    error,
    stats,
  });

  // Local UI state
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
    status: "",
    priority: "",
    sortBy: "createdAt:desc",
  });

  // Ensure leads is always an array and filter leads based on search query
  const safeLeads = Array.isArray(leads) ? leads : [];
  const filteredLeads = useMemo(() => {
    if (!searchQuery) return safeLeads;
    return safeLeads.filter((lead: Lead) => {
      const fullName = `${lead.firstName || ""} ${
        lead.lastName || ""
      }`.toLowerCase();
      const email = (lead.email || "").toLowerCase();
      const phone = lead.phone || "";
      return (
        fullName.includes(searchQuery.toLowerCase()) ||
        email.includes(searchQuery.toLowerCase()) ||
        phone.includes(searchQuery)
      );
    });
  }, [safeLeads, searchQuery]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

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
      console.log("Delete lead:", leadId);
    }
  };

  const handleBulkAction = (
    action: string,
    leadIds: string[],
    additionalData?: any
  ) => {
    console.log("Bulk action:", action, leadIds, additionalData);

    switch (action) {
      case "change-status":
        if (additionalData?.status) {
          console.log(
            `Changing status to ${additionalData.status} for ${leadIds.length} leads`
          );
          // TODO: Implement bulk status update
          // You could call your updateLead function for each lead or implement a bulk update API
        }
        break;

      case "change-priority":
        if (additionalData?.priority) {
          console.log(
            `Changing priority to ${additionalData.priority} for ${leadIds.length} leads`
          );
          // TODO: Implement bulk priority update
        }
        break;

      case "assign-sales-rep":
        if (additionalData?.salesRepId) {
          console.log(
            `Assigning sales rep ${additionalData.salesRepId} to ${leadIds.length} leads`
          );
          // TODO: Implement bulk sales rep assignment
        }
        break;

      case "send-email":
        if (additionalData?.message) {
          console.log(
            `Sending email to ${leadIds.length} leads:`,
            additionalData.message
          );
          // TODO: Implement bulk email sending
        }
        break;

      case "export":
        console.log(`Exporting ${leadIds.length} leads`);
        // TODO: Implement export functionality
        break;

      case "archive":
        console.log(`Archiving ${leadIds.length} leads`);
        // TODO: Implement bulk archiving
        break;

      case "delete":
        console.log(`Deleting ${leadIds.length} leads`);
        // TODO: Implement bulk deletion
        break;

      default:
        console.log(`Unknown bulk action: ${action}`);
    }

    // Clear selection after action
    setSelectedLeads([]);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...currentFilters, [key]: value };
    setCurrentFilters(newFilters);

    const filterObj: any = {};
    if (newFilters.status) filterObj.status = newFilters.status;
    if (newFilters.priority) filterObj.priority = newFilters.priority;

    const [sortBy, sortOrder] = newFilters.sortBy.split(":");
    filterObj.sortBy = sortBy;
    filterObj.sortOrder = sortOrder;

    setFilters(filterObj);
  };

  const handleRefresh = () => {
    fetchLeads().catch((err) => {
      console.error("Refresh failed:", err);
    });
  };

  const handleLeadFormSubmit = () => {
    // Refresh leads data after form submission
    handleRefresh();

    // Show success message (you can implement a toast notification here)
    console.log("Lead saved successfully!");

    // Close form and clear selected lead
    setShowLeadForm(false);
    setSelectedLead(null);
  };

  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================

  const MetricCard: React.FC<{
    title: string;
    value: number | string;
    icon: React.ComponentType<any>;
    color: string;
    trend?: { value: number; isPositive: boolean };
  }> = ({ title, value, icon: Icon, color, trend }) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      red: "bg-red-100 text-red-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
    };

    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 h-full">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600 truncate">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {trend && (
              <div className="flex items-center mt-2">
                <TrendingUp
                  className={`h-4 w-4 mr-1 ${
                    trend.isPositive
                      ? "text-green-500"
                      : "text-red-500 transform rotate-180"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trend.value}%
                </span>
                <span className="text-sm text-gray-500 ml-1 hidden sm:inline">
                  vs last month
                </span>
              </div>
            )}
          </div>
          <div
            className={`p-3 rounded-full flex-shrink-0 ml-3 ${
              colorMap[color] || colorMap.blue
            }`}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </div>
    );
  };

  const StatusBadge: React.FC<{ status: LeadStatus; size?: "sm" | "md" }> = ({
    status,
    size = "md",
  }) => {
    const statusConfig = STATUS_OPTIONS.find((opt) => opt.value === status);
    const sizeClasses =
      size === "sm" ? "text-xs px-2 py-1" : "text-sm px-3 py-1";

    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      red: "bg-red-100 text-red-800",
      purple: "bg-purple-100 text-purple-800",
      orange: "bg-orange-100 text-orange-800",
      yellow: "bg-yellow-100 text-yellow-800",
      gray: "bg-gray-100 text-gray-800",
      teal: "bg-teal-100 text-teal-800",
    };

    return (
      <span
        className={`${sizeClasses} rounded-full font-medium ${
          colorMap[statusConfig?.color || "gray"]
        }`}
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

    const colorMap: Record<string, string> = {
      red: "bg-red-500",
      orange: "bg-orange-500",
      yellow: "bg-yellow-500",
      green: "bg-green-500",
      gray: "bg-gray-500",
    };

    return (
      <div className="flex items-center space-x-1">
        <div
          className={`w-2 h-2 rounded-full ${
            colorMap[priorityConfig?.color || "gray"]
          }`}
        ></div>
        {isHot && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
      </div>
    );
  };

  // Fixed LeadTableRow component
  const LeadTableRow: React.FC<{ lead: Lead }> = ({ lead }) => {
    console.log("🐛 Rendering lead row:", lead);

    // Get customer name safely
    const customerName =
      lead.customerName ||
      `${lead.firstName || ""} ${lead.lastName || ""}`.trim() ||
      "Unknown Customer";
    const email = lead.email || "No email";
    const phone = lead.phone || "No phone";
    const initials =
      `${lead.firstName?.[0] || ""}${lead.lastName?.[0] || ""}` || "UN";

    return (
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
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-semibold text-sm">
                {initials}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900">
                {customerName}
              </div>
              <div className="text-sm text-gray-500">{email}</div>
              <div className="text-sm text-gray-500">{phone}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-2">
            <Car className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-900">
              {lead.vehicleName || lead.vehicle || "General Inquiry"}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <StatusBadge status={lead.status || "NEW"} />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-2">
            <PriorityBadge
              priority={lead.priority || "MEDIUM"}
              isHot={lead.isHot}
            />
            <span className="text-sm text-gray-700">
              {lead.priority || "MEDIUM"}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">
            {lead.salesRepName || lead.salesRep || "Unassigned"}
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
            ? new Date(lead.createdAt).toLocaleDateString()
            : "N/A"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <div className="flex items-center justify-end space-x-1">
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
            <div className="relative group">
              <button className="text-gray-600 hover:text-gray-900 p-1 rounded">
                <MoreVertical className="h-4 w-4" />
              </button>
              <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Call Customer
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Send Email
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
  };

  const LeadCard: React.FC<{ lead: Lead }> = ({ lead }) => {
    const customerName =
      lead.customerName ||
      `${lead.firstName || ""} ${lead.lastName || ""}`.trim() ||
      "Unknown Customer";
    const initials =
      `${lead.firstName?.[0] || ""}${lead.lastName?.[0] || ""}` || "UN";

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold text-sm">
                {initials}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {customerName}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {lead.email || "No email"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <PriorityBadge
              priority={lead.priority || "MEDIUM"}
              isHot={lead.isHot}
            />
            <input
              type="checkbox"
              checked={selectedLeads.includes(lead.id)}
              onChange={() => handleSelectLead(lead.id)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-600"
            />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Status:</span>
            <StatusBadge status={lead.status || "NEW"} size="sm" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Priority:</span>
            <span className="text-sm font-medium text-gray-900">
              {lead.priority || "MEDIUM"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Score:</span>
            <span className="text-sm font-medium">{lead.leadScore || 0}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-1">
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
          </div>
          <span className="text-xs text-gray-500">
            {lead.createdAt
              ? new Date(lead.createdAt).toLocaleDateString()
              : ""}
          </span>
        </div>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  // Show error state if there's an error
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Leads
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={clearError}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Lead Management
            </h1>
            <p className="text-gray-600 mt-1">
              {userRole === "ADMIN"
                ? "Manage all customer leads"
                : "Manage your assigned leads"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex gap-3">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Import</span>
              </button>
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Total Leads"
            value={stats.totalLeads}
            icon={Users}
            color="blue"
            trend={{ value: 12.5, isPositive: true }}
          />
          <MetricCard
            title="New Leads"
            value={stats.newLeads}
            icon={UserPlus}
            color="green"
            trend={{ value: 8.3, isPositive: true }}
          />
          <MetricCard
            title="Hot Leads"
            value={stats.hotLeads}
            icon={Star}
            color="red"
          />
          <MetricCard
            title="Qualified"
            value={safeLeads.filter((l) => l.status === "QUALIFIED").length}
            icon={UserCheck}
            color="purple"
          />
          <MetricCard
            title="Conversion"
            value={`${stats.conversionRate.toFixed(1)}%`}
            icon={Target}
            color="orange"
            trend={{ value: 2.1, isPositive: false }}
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex flex-col space-y-4">
            {/* Top Row - Search and Mobile Menu */}
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            {/* Filters Row */}
            <div className={`${showMobileMenu ? "block" : "hidden"} lg:block`}>
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Left side - Filters */}
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <select
                    value={currentFilters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={currentFilters.priority}
                    onChange={(e) =>
                      handleFilterChange("priority", e.target.value)
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    {PRIORITY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    value={currentFilters.sortBy}
                    onChange={(e) =>
                      handleFilterChange("sortBy", e.target.value)
                    }
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Right side - View controls */}
                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() =>
                        setViewMode({ ...viewMode, type: "table" })
                      }
                      className={`p-2 rounded-md transition-colors ${
                        viewMode.type === "table"
                          ? "bg-white text-red-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        setViewMode({ ...viewMode, type: "cards" })
                      }
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
            </div>

            {/* Selected Items Actions */}
            {selectedLeads.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <BulkActions
                  selectedCount={selectedLeads.length}
                  selectedIds={selectedLeads}
                  onBulkAction={handleBulkAction}
                  onClearSelection={() => setSelectedLeads([])}
                  userRole={userRole}
                />
              </div>
            )}
          </div>
        </div>

        {/* Leads Content */}
        {isLoading && filteredLeads.length === 0 ? (
          <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading leads...</span>
            </div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Vehicle Interest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Sales Rep
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Lead Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Created
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

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-gray-700">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total} results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters({ page: pagination.page - 1 })}
                    disabled={pagination.page <= 1}
                    className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setFilters({ page: pagination.page + 1 })}
                    disabled={pagination.page >= pagination.totalPages}
                    className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Cards View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        )}

        {/* Lead Form Modal */}
        <LeadForm
          isOpen={showLeadForm}
          onClose={() => {
            setShowLeadForm(false);
            setSelectedLead(null);
          }}
          onSubmit={handleLeadFormSubmit}
          initialData={selectedLead}
          mode={selectedLead ? "edit" : "create"}
        />

        {/* Lead Details Modal */}
        {showLeadDetails && selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Lead Details</h2>
                <button
                  onClick={() => setShowLeadDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLead.firstName} {selectedLead.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLead.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLead.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      <StatusBadge status={selectedLead.status} size="sm" />
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Priority
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLead.priority}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Lead Score
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLead.leadScore || 0}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Vehicle Interest
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLead.vehicleName ||
                        selectedLead.vehicle ||
                        "General Inquiry"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sales Rep
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLead.salesRepName ||
                        selectedLead.salesRep ||
                        "Unassigned"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Source
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLead.source || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Created
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedLead.createdAt
                        ? new Date(selectedLead.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {selectedLead.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                      {selectedLead.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowLeadDetails(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowLeadDetails(false);
                    setShowLeadForm(true);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Edit Lead
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsView;
