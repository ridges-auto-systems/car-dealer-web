// admin/components/users/BulkUserActions.tsx
import React, { useState } from "react";
import {
  X,
  Mail,
  UserCheck,
  UserX,
  Trash2,
  Shield,
  Building,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Loader,
} from "lucide-react";
import type {
  User,
  CreateUserData,
  UpdateUserData,
} from "@/lib/types/user.type";
import { USER_ROLES, UserRole } from "@/lib/types/user.type";

// ============================================================================
// INTERFACES
// ============================================================================

interface BulkUserActionsProps {
  selectedUsers: User[];
  onClose: () => void;
  onBulkUpdate: (userIds: string[], updates: any) => Promise<boolean>;
  onBulkEmail: (
    userIds: string[],
    subject: string,
    message: string
  ) => Promise<boolean>;
  onBulkExport: (userIds: string[], format: "csv" | "xlsx") => Promise<boolean>;
  userRole: "ADMIN" | "SALES_REP";
}

interface BulkAction {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
  requiresConfirmation?: boolean;
  adminOnly?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const BULK_ACTIONS: BulkAction[] = [
  {
    id: "activate",
    label: "Activate Users",
    icon: UserCheck,
    color: "text-green-600",
    description: "Activate selected user accounts",
    requiresConfirmation: true,
    adminOnly: true,
  },
  {
    id: "deactivate",
    label: "Deactivate Users",
    icon: UserX,
    color: "text-red-600",
    description: "Deactivate selected user accounts",
    requiresConfirmation: true,
    adminOnly: true,
  },
  {
    id: "change_role",
    label: "Change Role",
    icon: Shield,
    color: "text-purple-600",
    description: "Update role for selected users",
    requiresConfirmation: true,
    adminOnly: true,
  },
  {
    id: "change_department",
    label: "Change Department",
    icon: Building,
    color: "text-blue-600",
    description: "Update department for selected users",
    requiresConfirmation: true,
    adminOnly: true,
  },
  {
    id: "send_email",
    label: "Send Email",
    icon: Mail,
    color: "text-indigo-600",
    description: "Send bulk email to selected users",
  },
  {
    id: "export",
    label: "Export Data",
    icon: Download,
    color: "text-gray-600",
    description: "Export selected user data",
  },
  {
    id: "delete",
    label: "Delete Users",
    icon: Trash2,
    color: "text-red-600",
    description: "Permanently delete selected users",
    requiresConfirmation: true,
    adminOnly: true,
  },
];

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: USER_ROLES.CUSTOMER, label: "Customer" },
  { value: USER_ROLES.SALES_REP, label: "Sales Representative" },
  { value: USER_ROLES.SALES_MANAGER, label: "Sales Manager" },
  { value: USER_ROLES.FINANCE_MANAGER, label: "Finance Manager" },
  { value: USER_ROLES.ADMIN, label: "Administrator" },
  { value: USER_ROLES.SUPER_ADMIN, label: "Super Administrator" },
];

const DEPARTMENT_OPTIONS = [
  "Sales",
  "Finance",
  "Service",
  "Parts",
  "Management",
  "IT",
  "Marketing",
  "Customer Service",
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const BulkUserActions: React.FC<BulkUserActionsProps> = ({
  selectedUsers,
  onClose,
  onBulkUpdate,
  onBulkEmail,
  onBulkExport,
  userRole,
}) => {
  const [selectedAction, setSelectedAction] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [showExportForm, setShowExportForm] = useState(false);

  // Form states
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [newRole, setNewRole] = useState<UserRole>(USER_ROLES.CUSTOMER);
  const [newDepartment, setNewDepartment] = useState("");
  const [exportFormat, setExportFormat] = useState<"csv" | "xlsx">("csv");

  const selectedUserIds = selectedUsers.map((user) => user.id);
  const availableActions = BULK_ACTIONS.filter(
    (action) => !action.adminOnly || userRole === "ADMIN"
  );

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleActionSelect = (actionId: string) => {
    setSelectedAction(actionId);

    switch (actionId) {
      case "send_email":
        setShowEmailForm(true);
        break;
      case "change_role":
        setShowRoleForm(true);
        break;
      case "change_department":
        setShowDepartmentForm(true);
        break;
      case "export":
        setShowExportForm(true);
        break;
      case "activate":
      case "deactivate":
      case "delete":
        setShowConfirmation(true);
        break;
      default:
        break;
    }
  };

  const executeAction = async () => {
    setIsProcessing(true);
    let success = false;

    try {
      switch (selectedAction) {
        case "activate":
          success = await onBulkUpdate(selectedUserIds, { isActive: true });
          break;
        case "deactivate":
          success = await onBulkUpdate(selectedUserIds, { isActive: false });
          break;
        case "change_role":
          success = await onBulkUpdate(selectedUserIds, { role: newRole });
          break;
        case "change_department":
          success = await onBulkUpdate(selectedUserIds, {
            department: newDepartment,
          });
          break;
        case "send_email":
          success = await onBulkEmail(
            selectedUserIds,
            emailSubject,
            emailMessage
          );
          break;
        case "export":
          success = await onBulkExport(selectedUserIds, exportFormat);
          break;
        case "delete":
          // This would need a special delete handler
          success = await onBulkUpdate(selectedUserIds, { deleted: true });
          break;
        default:
          break;
      }

      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Bulk action failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForms = () => {
    setSelectedAction("");
    setShowConfirmation(false);
    setShowEmailForm(false);
    setShowRoleForm(false);
    setShowDepartmentForm(false);
    setShowExportForm(false);
    setEmailSubject("");
    setEmailMessage("");
    setNewRole(USER_ROLES.CUSTOMER);
    setNewDepartment("");
    setExportFormat("csv");
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================

  const renderActionSelection = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Select Action for {selectedUsers.length} Users
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {availableActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleActionSelect(action.id)}
              className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <Icon className={`h-5 w-5 mt-0.5 ${action.color}`} />
              <div>
                <p className="font-medium text-gray-900">{action.label}</p>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderConfirmation = () => {
    const action = BULK_ACTIONS.find((a) => a.id === selectedAction);
    if (!action) return null;

    const Icon = action.icon;
    const isDestructive = ["delete", "deactivate"].includes(selectedAction);

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div
            className={`p-3 rounded-full ${
              isDestructive ? "bg-red-100" : "bg-blue-100"
            }`}
          >
            <Icon
              className={`h-6 w-6 ${
                isDestructive ? "text-red-600" : "text-blue-600"
              }`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Confirm Action
            </h3>
            <p className="text-gray-600">{action.description}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            This action will affect <strong>{selectedUsers.length}</strong>{" "}
            users:
          </p>
          <div className="mt-2 max-h-32 overflow-y-auto">
            {selectedUsers.slice(0, 5).map((user) => (
              <p key={user.id} className="text-sm text-gray-600">
                • {user.firstName} {user.lastName} ({user.email})
              </p>
            ))}
            {selectedUsers.length > 5 && (
              <p className="text-sm text-gray-500">
                ...and {selectedUsers.length - 5} more users
              </p>
            )}
          </div>
        </div>

        {isDestructive && (
          <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Warning</p>
              <p className="text-sm text-red-700">
                This action cannot be undone. Please confirm you want to
                proceed.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderEmailForm = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Send Bulk Email</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <input
          type="text"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          placeholder="Enter email subject..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          value={emailMessage}
          onChange={(e) => setEmailMessage(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          placeholder="Enter your message..."
        />
      </div>
      <p className="text-sm text-gray-600">
        This email will be sent to {selectedUsers.length} users.
      </p>
    </div>
  );

  const renderRoleForm = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Change User Role</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Role
        </label>
        <select
          value={newRole}
          onChange={(e) => setNewRole(e.target.value as UserRole)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          {ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <p className="text-sm text-gray-600">
        This will change the role for {selectedUsers.length} users to{" "}
        {ROLE_OPTIONS.find((r) => r.value === newRole)?.label}.
      </p>
    </div>
  );

  const renderDepartmentForm = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Change Department</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          New Department
        </label>
        <select
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          <option value="">Select Department</option>
          {DEPARTMENT_OPTIONS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
      <p className="text-sm text-gray-600">
        This will update the department for {selectedUsers.length} users.
      </p>
    </div>
  );

  const renderExportForm = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Export User Data</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Export Format
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="csv"
              checked={exportFormat === "csv"}
              onChange={(e) =>
                setExportFormat(e.target.value as "csv" | "xlsx")
              }
              className="text-red-600 focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-700">CSV</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="xlsx"
              checked={exportFormat === "xlsx"}
              onChange={(e) =>
                setExportFormat(e.target.value as "csv" | "xlsx")
              }
              className="text-red-600 focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-700">Excel (XLSX)</span>
          </label>
        </div>
      </div>
      <p className="text-sm text-gray-600">
        This will export data for {selectedUsers.length} selected users.
      </p>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  const canProceed = () => {
    switch (selectedAction) {
      case "send_email":
        return emailSubject.trim() && emailMessage.trim();
      case "change_role":
        return newRole;
      case "change_department":
        return newDepartment;
      case "export":
        return exportFormat;
      default:
        return true;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Bulk Actions</h2>
              <p className="text-sm text-gray-600">
                Manage {selectedUsers.length} selected users
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {!selectedAction && renderActionSelection()}
          {showConfirmation && renderConfirmation()}
          {showEmailForm && renderEmailForm()}
          {showRoleForm && renderRoleForm()}
          {showDepartmentForm && renderDepartmentForm()}
          {showExportForm && renderExportForm()}
        </div>

        {/* Footer */}
        {selectedAction && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <button
              onClick={resetForms}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back
            </button>
            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                disabled={!canProceed() || isProcessing}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isProcessing ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <span>{isProcessing ? "Processing..." : "Execute Action"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkUserActions;
