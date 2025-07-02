/* eslint-disable @typescript-eslint/no-explicit-any */
// admin/components/leads/BulkActions.tsx
import React, { useState } from "react";
import {
  ChevronDown,
  UserCheck,
  RotateCcw,
  Star,
  Archive,
  Trash2,
  Download,
  Mail,
  MessageSquare,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
} from "lucide-react";
import type { LeadStatus, LeadPriority } from "../../../../lib/types/lead.type";

// ============================================================================
// INTERFACES
// ============================================================================

interface BulkActionsProps {
  selectedCount: number;
  selectedIds: string[];
  onBulkAction: (
    action: string,
    leadIds: string[],
    additionalData?: any
  ) => void;
  onClearSelection?: () => void;
  userRole?: "ADMIN" | "SALES_REP";
}

interface BulkActionOption {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  requiresConfirmation?: boolean;
  requiresInput?: boolean;
  inputType?: "status" | "priority" | "salesRep" | "note";
  description?: string;
  adminOnly?: boolean;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data?: any) => void;
  action: BulkActionOption;
  selectedCount: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "APPOINTMENT_SCHEDULED", label: "Appointment Scheduled" },
  { value: "TEST_DRIVE_COMPLETED", label: "Test Drive Completed" },
  { value: "NEGOTIATING", label: "Negotiating" },
  { value: "FINANCING_PENDING", label: "Financing Pending" },
  { value: "PAPERWORK", label: "Paperwork" },
  { value: "CLOSED_WON", label: "Closed Won" },
  { value: "CLOSED_LOST", label: "Closed Lost" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "UNRESPONSIVE", label: "Unresponsive" },
];

const PRIORITY_OPTIONS: { value: LeadPriority; label: string }[] = [
  { value: "HOT", label: "Hot" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

const SALES_REPS = [
  { id: "1", name: "Alice Johnson" },
  { id: "2", name: "Bob Martinez" },
  { id: "3", name: "Carol Davis" },
  { id: "4", name: "David Wilson" },
];

const BULK_ACTIONS: BulkActionOption[] = [
  {
    id: "change-status",
    label: "Change Status",
    icon: RotateCcw,
    color: "blue",
    requiresInput: true,
    inputType: "status",
    description: "Update the status for selected leads",
  },
  {
    id: "change-priority",
    label: "Change Priority",
    icon: Star,
    color: "yellow",
    requiresInput: true,
    inputType: "priority",
    description: "Update the priority for selected leads",
  },
  {
    id: "assign-sales-rep",
    label: "Assign Sales Rep",
    icon: UserCheck,
    color: "green",
    requiresInput: true,
    inputType: "salesRep",
    description: "Assign selected leads to a sales representative",
    adminOnly: true,
  },
  {
    id: "send-email",
    label: "Send Email",
    icon: Mail,
    color: "purple",
    requiresInput: true,
    inputType: "note",
    description: "Send a bulk email to selected leads",
  },
  {
    id: "schedule-follow-up",
    label: "Schedule Follow-up",
    icon: Calendar,
    color: "indigo",
    requiresInput: true,
    inputType: "note",
    description: "Schedule follow-up appointments for selected leads",
  },
  {
    id: "add-note",
    label: "Add Note",
    icon: MessageSquare,
    color: "gray",
    requiresInput: true,
    inputType: "note",
    description: "Add a note to selected leads",
  },
  {
    id: "export",
    label: "Export",
    icon: Download,
    color: "teal",
    description: "Export selected leads to CSV",
  },
  {
    id: "archive",
    label: "Archive",
    icon: Archive,
    color: "orange",
    requiresConfirmation: true,
    description: "Archive selected leads",
  },
  {
    id: "delete",
    label: "Delete",
    icon: Trash2,
    color: "red",
    requiresConfirmation: true,
    description: "Permanently delete selected leads",
    adminOnly: true,
  },
];

// ============================================================================
// CONFIRMATION MODAL
// ============================================================================

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  selectedCount,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [textAreaValue, setTextAreaValue] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    let data: any = undefined;

    if (action.inputType === "status") {
      data = { status: inputValue };
    } else if (action.inputType === "priority") {
      data = { priority: inputValue };
    } else if (action.inputType === "salesRep") {
      data = { salesRepId: inputValue };
    } else if (action.inputType === "note") {
      data = { message: textAreaValue };
    }

    onConfirm(data);
    setInputValue("");
    setTextAreaValue("");
  };

  const renderInput = () => {
    switch (action.inputType) {
      case "status":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Status
            </label>
            <select
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            >
              <option value="">Select Status</option>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case "priority":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Priority
            </label>
            <select
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            >
              <option value="">Select Priority</option>
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case "salesRep":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Sales Rep
            </label>
            <select
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              required
            >
              <option value="">Select Sales Rep</option>
              {SALES_REPS.map((rep) => (
                <option key={rep.id} value={rep.id}>
                  {rep.name}
                </option>
              ))}
            </select>
          </div>
        );

      case "note":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {action.id === "send-email"
                ? "Email Message"
                : action.id === "add-note"
                ? "Note"
                : "Message"}
            </label>
            <textarea
              value={textAreaValue}
              onChange={(e) => setTextAreaValue(e.target.value)}
              placeholder={
                action.id === "send-email"
                  ? "Enter your email message..."
                  : action.id === "add-note"
                  ? "Enter your note..."
                  : "Enter your message..."
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
              required
            />
          </div>
        );

      default:
        return null;
    }
  };

  const isDestructive = action.id === "delete" || action.id === "archive";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full bg-${action.color}-100`}>
              <action.icon className={`h-5 w-5 text-${action.color}-600`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {action.label}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedCount} leads selected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isDestructive && (
            <div className="flex items-start space-x-3 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">Warning</p>
                <p className="text-sm text-red-600 mt-1">
                  {action.id === "delete"
                    ? "This action cannot be undone. The selected leads will be permanently deleted."
                    : "This will archive the selected leads. They can be restored later."}
                </p>
              </div>
            </div>
          )}

          <p className="text-gray-600 mb-4">{action.description}</p>

          {action.requiresInput && renderInput()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={action.requiresInput && !inputValue && !textAreaValue}
            className={`px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
              isDestructive
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {action.label}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  selectedIds,
  onBulkAction,
  onClearSelection,
  userRole = "SALES_REP",
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    action: BulkActionOption | null;
  }>({ isOpen: false, action: null });

  // Filter actions based on user role
  const availableActions = BULK_ACTIONS.filter(
    (action) => !action.adminOnly || userRole === "ADMIN"
  );

  const handleActionClick = (action: BulkActionOption) => {
    setIsDropdownOpen(false);

    if (action.requiresConfirmation || action.requiresInput) {
      setConfirmationModal({ isOpen: true, action });
    } else {
      onBulkAction(action.id, selectedIds);
    }
  };

  const handleConfirmAction = (data?: any) => {
    if (confirmationModal.action) {
      onBulkAction(confirmationModal.action.id, selectedIds, data);
    }
    setConfirmationModal({ isOpen: false, action: null });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium text-gray-900">
              {selectedCount} lead{selectedCount !== 1 ? "s" : ""} selected
            </span>
          </div>

          {onClearSelection && (
            <button
              onClick={onClearSelection}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear selection
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                handleActionClick(
                  BULK_ACTIONS.find((a) => a.id === "send-email")!
                )
              }
              className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
              title="Send Email"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Email</span>
            </button>

            <button
              onClick={() =>
                handleActionClick(BULK_ACTIONS.find((a) => a.id === "export")!)
              }
              className="flex items-center space-x-2 px-3 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
              title="Export"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {userRole === "ADMIN" && (
              <button
                onClick={() =>
                  handleActionClick(
                    BULK_ACTIONS.find((a) => a.id === "assign-sales-rep")!
                  )
                }
                className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                title="Assign Sales Rep"
              >
                <UserCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Assign</span>
              </button>
            )}
          </div>

          {/* More Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <span>More Actions</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-2">
                  {availableActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action)}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className={`p-1.5 rounded-md bg-${action.color}-100`}
                      >
                        <action.icon
                          className={`h-4 w-4 text-${action.color}-600`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {action.label}
                        </div>
                        {action.description && (
                          <div className="text-sm text-gray-500">
                            {action.description}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal.action && (
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal({ isOpen: false, action: null })}
          onConfirm={handleConfirmAction}
          action={confirmationModal.action}
          selectedCount={selectedCount}
        />
      )}
    </>
  );
};

export default BulkActions;
