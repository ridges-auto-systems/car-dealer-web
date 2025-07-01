/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Users,
  TrendingUp,
  Star,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { useLeads } from "@/lib/store/hooks/useLeads";
import type { LeadFilters } from "@/lib/types/lead.type";

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ComponentType<any>;
  color: string;
}

export default function LeadsPage() {
  const {
    // State
    leads,
    isLoading,
    error,
    stats,
    selectedLeads,
    hasSelectedLeads,
    selectedCount,
    filters,
    pagination,

    // Actions
    loadLeads,
    setFilters,
    resetFilters,
    toggleSelection,
    clearSelection,
    updateStatus,
    updatePriority,
    bulkUpdate,
    loadStats,

    // Filter shortcuts
    showNew,
    showHot,
    showUnassigned,

    // Helpers
    isSelected,
  } = useLeads();

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");

  // Load data on mount
  useEffect(() => {
    loadLeads();
    loadStats();
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // You could implement search in the backend or filter locally
  };

  // Handle filter change
  const handleFilterChange = (newFilters: Partial<LeadFilters>) => {
    setFilters(newFilters);
  };

  // Handle status update
  const handleStatusUpdate = async (leadId: string, status: string) => {
    try {
      await updateStatus(leadId, status);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // Handle priority update
  const handlePriorityUpdate = async (leadId: string, priority: string) => {
    try {
      await updatePriority(leadId, priority);
    } catch (error) {
      console.error("Failed to update priority:", error);
    }
  };

  // Handle bulk action
  const handleBulkAction = async () => {
    if (!selectedAction || !hasSelectedLeads) return;

    try {
      switch (selectedAction) {
        case "contacted":
          await bulkUpdate(selectedLeads, { status: "CONTACTED" });
          break;
        case "qualified":
          await bulkUpdate(selectedLeads, { status: "QUALIFIED" });
          break;
        case "hot":
          await bulkUpdate(selectedLeads, { priority: "HOT", isHot: true });
          break;
        case "assign":
          // You would show a modal to select sales rep
          console.log("Show assign modal");
          break;
        default:
          break;
      }
      clearSelection();
      setSelectedAction("");
    } catch (error) {
      console.error("Bulk action failed:", error);
    }
  };

  // Stats cards data
  const statsCards: StatCard[] = [
    {
      title: "Total Leads",
      value: stats.totalLeads,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      title: "New Leads",
      value: stats.newLeads,
      change: "+8%",
      trend: "up",
      icon: UserPlus,
      color: "green",
    },
    {
      title: "Hot Leads",
      value: stats.hotLeads,
      change: "+15%",
      trend: "up",
      icon: TrendingUp,
      color: "red",
    },
    {
      title: "Conversion Rate",
      value: `${stats.conversionRate.toFixed(1)}%`,
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      color: "purple",
    },
  ];

  // Status badge styles
  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      NEW: "bg-blue-100 text-blue-800",
      CONTACTED: "bg-yellow-100 text-yellow-800",
      QUALIFIED: "bg-green-100 text-green-800",
      APPOINTMENT_SCHEDULED: "bg-purple-100 text-purple-800",
      NEGOTIATING: "bg-orange-100 text-orange-800",
      CLOSED_WON: "bg-green-100 text-green-800",
      CLOSED_LOST: "bg-red-100 text-red-800",
    };
    return statusStyles[status] || "bg-gray-100 text-gray-800";
  };

  // Priority badge styles
  const getPriorityBadge = (priority: string) => {
    const priorityStyles: Record<string, string> = {
      LOW: "bg-gray-100 text-gray-800",
      MEDIUM: "bg-yellow-100 text-yellow-800",
      HIGH: "bg-orange-100 text-orange-800",
      HOT: "bg-red-100 text-red-800",
      URGENT: "bg-red-100 text-red-800",
    };
    return priorityStyles[priority] || "bg-gray-100 text-gray-800";
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Leads
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  function selectAll() {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Leads Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and track your customer leads
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              <Link
                href="/leads/create"
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <IconComponent
                      className={`h-6 w-6 text-${stat.color}-600`}
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    vs last month
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={showNew}
              className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              <Users className="h-4 w-4 mr-2" />
              New Leads ({stats.newLeads})
            </button>
            <button
              onClick={showHot}
              className="flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Hot Leads ({stats.hotLeads})
            </button>
            <button
              onClick={showUnassigned}
              className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Unassigned
            </button>
            <button
              onClick={resetFilters}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              All Leads
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status || ""}
                  onChange={(e) =>
                    handleFilterChange({ status: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Statuses</option>
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="APPOINTMENT_SCHEDULED">Appointment Set</option>
                  <option value="NEGOTIATING">Negotiating</option>
                  <option value="CLOSED_WON">Closed Won</option>
                  <option value="CLOSED_LOST">Closed Lost</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={filters.priority || ""}
                  onChange={(e) =>
                    handleFilterChange({ priority: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Priorities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="HOT">Hot</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source
                </label>
                <select
                  value={filters.source || ""}
                  onChange={(e) =>
                    handleFilterChange({ source: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Sources</option>
                  <option value="website">Website</option>
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="referral">Referral</option>
                  <option value="social_media">Social Media</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy || "createdAt"}
                  onChange={(e) =>
                    handleFilterChange({ sortBy: e.target.value as any })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="createdAt">Date Created</option>
                  <option value="priority">Priority</option>
                  <option value="leadScore">Lead Score</option>
                  <option value="lastContactDate">Last Contact</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Search and Bulk Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Bulk Actions */}
            {hasSelectedLeads && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {selectedCount} selected
                </span>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Choose action...</option>
                  <option value="contacted">Mark as Contacted</option>
                  <option value="qualified">Mark as Qualified</option>
                  <option value="hot">Mark as Hot</option>
                  <option value="assign">Assign to Rep</option>
                </select>
                <button
                  onClick={handleBulkAction}
                  disabled={!selectedAction}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Apply
                </button>
                <button
                  onClick={clearSelection}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-3 text-gray-600">Loading leads...</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No leads found
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first lead.
              </p>
              <Link
                href="/leads/create"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Lead
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            selectAll();
                          } else {
                            clearSelection();
                          }
                        }}
                        className="h-4 w-4 text-red-600 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className={`hover:bg-gray-50 ${
                        isSelected(lead.id) ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected(lead.id)}
                          onChange={() => toggleSelection(lead.id)}
                          className="h-4 w-4 text-red-600 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {lead.customerName?.charAt(0) || "?"}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {lead.customerName || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.vehicleName || "General Inquiry"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleStatusUpdate(lead.id, e.target.value)
                          }
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                            lead.status
                          )}`}
                        >
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="QUALIFIED">Qualified</option>
                          <option value="APPOINTMENT_SCHEDULED">
                            Appointment Set
                          </option>
                          <option value="NEGOTIATING">Negotiating</option>
                          <option value="CLOSED_WON">Closed Won</option>
                          <option value="CLOSED_LOST">Closed Lost</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.priority}
                          onChange={(e) =>
                            handlePriorityUpdate(lead.id, e.target.value)
                          }
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(
                            lead.priority
                          )}`}
                        >
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                          <option value="HOT">Hot</option>
                          <option value="URGENT">Urgent</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900">
                            {lead.leadScore || "N/A"}
                          </span>
                          {lead.isHot && (
                            <Star className="h-4 w-4 text-yellow-500 ml-2" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 capitalize">
                          {lead.source?.replace("_", " ") || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              // Navigate to lead details
                              console.log("View lead:", lead.id);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              // Navigate to edit lead
                              console.log("Edit lead:", lead.id);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              // Show delete confirmation
                              console.log("Delete lead:", lead.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() =>
                      handleFilterChange({ page: pagination.page - 1 })
                    }
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      handleFilterChange({ page: pagination.page + 1 })
                    }
                    disabled={pagination.page === pagination.totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(pagination.page - 1) * pagination.limit + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          pagination.page * pagination.limit,
                          pagination.total
                        )}
                      </span>{" "}
                      of <span className="font-medium">{pagination.total}</span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() =>
                          handleFilterChange({ page: pagination.page - 1 })
                        }
                        disabled={pagination.page === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {/* Page numbers would go here */}
                      <button
                        onClick={() =>
                          handleFilterChange({ page: pagination.page + 1 })
                        }
                        disabled={pagination.page === pagination.totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
