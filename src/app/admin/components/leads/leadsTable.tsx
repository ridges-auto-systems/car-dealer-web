// Responsive Table Component with Mobile/Desktop Views
import React from "react";

interface ResponsiveTableProps {
  leads: any[];
  selectedLeads: string[];
  filteredLeads: any[];
  handleSelectAll: () => void;
  handleSelectLead: (id: string) => void;
  handleViewLead: (lead: any) => void;
  handleEditLead: (lead: any) => void;
  handleDeleteLead: (id: string) => void;
  StatusBadge: React.ComponentType<any>;
  PriorityBadge: React.ComponentType<any>;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  leads,
  selectedLeads,
  filteredLeads,
  handleSelectAll,
  handleSelectLead,
  handleViewLead,
  handleEditLead,
  handleDeleteLead,
  StatusBadge,
  PriorityBadge,
}) => {
  return (
    <>
      {/* Desktop Table - shows all columns */}
      <div className="hidden lg:block">
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
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <DesktopTableRow
                  key={lead.id}
                  lead={lead}
                  selectedLeads={selectedLeads}
                  handleSelectLead={handleSelectLead}
                  handleViewLead={handleViewLead}
                  handleEditLead={handleEditLead}
                  handleDeleteLead={handleDeleteLead}
                  StatusBadge={StatusBadge}
                  PriorityBadge={PriorityBadge}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Table - shows essential columns only */}
      <div className="block lg:hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <MobileTableRow
                  key={lead.id}
                  lead={lead}
                  selectedLeads={selectedLeads}
                  handleSelectLead={handleSelectLead}
                  handleViewLead={handleViewLead}
                  handleEditLead={handleEditLead}
                  StatusBadge={StatusBadge}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// Desktop Table Row Component - All Columns
const DesktopTableRow: React.FC<any> = ({
  lead,
  selectedLeads,
  handleSelectLead,
  handleViewLead,
  handleEditLead,
  handleDeleteLead,
  StatusBadge,
  PriorityBadge,
}) => {
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
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-sm">
              {initials}
            </span>
          </div>
          <div>
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
        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "N/A"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => handleViewLead(lead)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded"
            title="View"
          >
            👁️
          </button>
          <button
            onClick={() => handleEditLead(lead)}
            className="text-gray-600 hover:text-gray-900 p-1 rounded"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => handleDeleteLead(lead.id)}
            className="text-red-600 hover:text-red-900 p-1 rounded"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
};

// Mobile Table Row Component - Essential Columns Only
const MobileTableRow: React.FC<any> = ({
  lead,
  selectedLeads,
  handleSelectLead,
  handleViewLead,
  handleEditLead,
  StatusBadge,
}) => {
  const customerName =
    lead.customerName ||
    `${lead.firstName || ""} ${lead.lastName || ""}`.trim() ||
    "Unknown Customer";
  const initials =
    `${lead.firstName?.[0] || ""}${lead.lastName?.[0] || ""}` || "UN";

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selectedLeads.includes(lead.id)}
          onChange={() => handleSelectLead(lead.id)}
          className="rounded border-gray-300 text-red-600 focus:ring-red-600"
        />
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-xs">
              {initials}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">
              {customerName}
            </div>
            <div className="text-xs text-gray-500">
              {lead.email || "No email"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 whitespace-nowrap">
        <StatusBadge status={lead.status || "NEW"} size="sm" />
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end space-x-1">
          <button
            onClick={() => handleViewLead(lead)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded text-xs"
          >
            👁️
          </button>
          <button
            onClick={() => handleEditLead(lead)}
            className="text-gray-600 hover:text-gray-900 p-1 rounded text-xs"
          >
            ✏️
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ResponsiveTable;
