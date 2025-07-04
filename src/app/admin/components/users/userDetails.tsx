// admin/components/users/UserDetails.tsx
import React, { useState } from "react";
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Shield,
  Edit,
  Star,
  DollarSign,
  Target,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Car,
  CreditCard,
  Award,
  Users,
  MessageSquare,
  FileText,
  Eye,
  Settings,
  MoreVertical,
  UserRound,
} from "lucide-react";
import type { User } from "@/lib/types/user.type";
import { USER_ROLES, UserRole } from "@/lib/types/user.type";

// ============================================================================
// INTERFACES
// ============================================================================

interface UserDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onEdit: () => void;
  userRole: "ADMIN" | "SALES_REP";
}

interface ActivityLog {
  id: string;
  type:
    | "login"
    | "logout"
    | "sale"
    | "lead_created"
    | "profile_updated"
    | "password_changed";
  description: string;
  timestamp: string;
  details?: string;
}

interface SalesMetric {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockActivityLogs: ActivityLog[] = [
  {
    id: "1",
    type: "sale",
    description: "Completed sale of 2022 Toyota Camry",
    timestamp: "2024-01-16T14:30:00Z",
    details: "Sale value: $28,500 - Customer: John Smith",
  },
  {
    id: "2",
    type: "lead_created",
    description: "Created new lead",
    timestamp: "2024-01-16T11:15:00Z",
    details: "Lead for Jane Doe - interested in Honda Civic",
  },
  {
    id: "3",
    type: "login",
    description: "Logged into system",
    timestamp: "2024-01-16T09:00:00Z",
  },
  {
    id: "4",
    type: "profile_updated",
    description: "Updated profile information",
    timestamp: "2024-01-15T16:45:00Z",
    details: "Updated phone number and address",
  },
  {
    id: "5",
    type: "sale",
    description: "Completed sale of 2021 Honda Accord",
    timestamp: "2024-01-14T13:20:00Z",
    details: "Sale value: $25,800 - Customer: Mike Johnson",
  },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const UserDetails: React.FC<UserDetailsProps> = ({
  isOpen,
  onClose,
  user,
  onEdit,
  userRole = "ADMIN",
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "activity" | "performance"
  >("overview");

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const getRoleColor = (role: UserRole): string => {
    const colors = {
      [USER_ROLES.CUSTOMER]: "bg-teal-100 text-teal-800",
      [USER_ROLES.SALES_REP]: "bg-blue-100 text-blue-800",
      [USER_ROLES.SALES_MANAGER]: "bg-purple-100 text-purple-800",
      [USER_ROLES.FINANCE_MANAGER]: "bg-green-100 text-green-800",
      [USER_ROLES.ADMIN]: "bg-orange-100 text-orange-800",
      [USER_ROLES.SUPER_ADMIN]: "bg-red-100 text-red-800",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getRoleIcon = (role: UserRole) => {
    const icons = {
      [USER_ROLES.CUSTOMER]: Users,
      [USER_ROLES.SALES_REP]: UserRound,
      [USER_ROLES.SALES_MANAGER]: Star,
      [USER_ROLES.FINANCE_MANAGER]: DollarSign,
      [USER_ROLES.ADMIN]: Shield,
      [USER_ROLES.SUPER_ADMIN]: Award,
    } as const;
    return icons[role as keyof typeof icons] || UserRound;
  };

  const getActivityIcon = (type: ActivityLog["type"]) => {
    const icons = {
      login: CheckCircle,
      logout: XCircle,
      sale: Car,
      lead_created: UserRound,
      profile_updated: Settings,
      password_changed: Shield,
    };
    return icons[type] || Activity;
  };

  const getActivityColor = (type: ActivityLog["type"]): string => {
    const colors = {
      login: "text-green-600",
      logout: "text-gray-600",
      sale: "text-blue-600",
      lead_created: "text-purple-600",
      profile_updated: "text-orange-600",
      password_changed: "text-red-600",
    };
    return colors[type] || "text-gray-600";
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isEmployeeRole = [
    USER_ROLES.SALES_REP,
    USER_ROLES.SALES_MANAGER,
    USER_ROLES.FINANCE_MANAGER,
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
  ].includes(user.role as any);
  const isSalesRole = [USER_ROLES.SALES_REP, USER_ROLES.SALES_MANAGER].includes(
    user.role as any
  );
  const isCustomer = user.role === USER_ROLES.CUSTOMER;

  // ============================================================================
  // SALES METRICS (for sales roles)
  // ============================================================================

  const salesMetrics: SalesMetric[] = isSalesRole
    ? [
        {
          label: "This Month Sales",
          value: user.totalSales || 0,
          icon: TrendingUp,
          color: "text-blue-600",
          trend: { value: 12, direction: "up" },
        },
        {
          label: "Monthly Goal",
          value: user.salesGoal || 0,
          icon: Target,
          color: "text-green-600",
        },
        {
          label: "Average Rating",
          value: user.averageRating ? `${user.averageRating}/5.0` : "N/A",
          icon: Star,
          color: "text-yellow-600",
        },
        {
          label: "Commission Rate",
          value: user.commission ? `${user.commission}%` : "N/A",
          icon: DollarSign,
          color: "text-green-600",
        },
      ]
    : [];

  // ============================================================================
  // CUSTOMER METRICS (for customer role)
  // ============================================================================

  const customerMetrics: SalesMetric[] = isCustomer
    ? [
        {
          label: "Vehicles Purchased",
          value: user.vehiclesPurchased || 0,
          icon: Car,
          color: "text-blue-600",
        },
        {
          label: "Total Spent",
          value: `$${(user.totalSpent || 0).toLocaleString()}`,
          icon: CreditCard,
          color: "text-green-600",
        },
        {
          label: "Loyalty Points",
          value: `${user.loyaltyPoints || 0} pts`,
          icon: Award,
          color: "text-purple-600",
        },
        {
          label: "Member Since",
          value: formatDate(user.createdAt),
          icon: Calendar,
          color: "text-gray-600",
        },
      ]
    : [];

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {user.firstName[0]}
                {user.lastName[0]}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <div className="flex items-center space-x-3 mt-1">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRoleColor(
                    user.role
                  )}`}
                >
                  {user.role.replace("_", " ")}
                </span>
                <div className="flex items-center space-x-1">
                  {user.isActive ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm ${
                      user.isActive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {userRole === "ADMIN" && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            {[
              { id: "overview", label: "Overview", icon: Eye },
              { id: "activity", label: "Activity", icon: Activity },
              ...(isSalesRole
                ? [
                    {
                      id: "performance",
                      label: "Performance",
                      icon: TrendingUp,
                    },
                  ]
                : []),
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`${
                    isActive
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserRound className="h-5 w-5 mr-2 text-gray-600" />
                  Contact Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-sm font-medium text-gray-900">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {user.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="text-sm font-medium text-gray-900">
                            {user.phone}
                          </p>
                        </div>
                      </div>
                    )}
                    {(user.address || user.city || user.state) && (
                      <div className="flex items-start space-x-3 md:col-span-2">
                        <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="text-sm font-medium text-gray-900">
                            {user.address && `${user.address}, `}
                            {user.city && `${user.city}, `}
                            {user.state} {user.zipCode}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                    {user.lastLogin && (
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Last Login</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDateTime(user.lastLogin)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Employment Information (for employees) */}
              {isEmployeeRole && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-gray-600" />
                    Employment Information
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {user.department && (
                        <div className="flex items-center space-x-3">
                          <Building className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Department</p>
                            <p className="text-sm font-medium text-gray-900">
                              {user.department}
                            </p>
                          </div>
                        </div>
                      )}
                      {user.position && (
                        <div className="flex items-center space-x-3">
                          <UserRound className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Position</p>
                            <p className="text-sm font-medium text-gray-900">
                              {user.position}
                            </p>
                          </div>
                        </div>
                      )}
                      {user.hireDate && (
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Hire Date</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(user.hireDate)}
                            </p>
                          </div>
                        </div>
                      )}
                      {isSalesRole && user.commission && (
                        <div className="flex items-center space-x-3">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">
                              Commission Rate
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {user.commission}%
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Metrics */}
              {(isSalesRole || isCustomer) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-gray-600" />
                    {isSalesRole ? "Sales Metrics" : "Customer Metrics"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {(isSalesRole ? salesMetrics : customerMetrics).map(
                      (metric, index) => {
                        const Icon = metric.icon;
                        return (
                          <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-lg p-6"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Icon className={`h-6 w-6 ${metric.color}`} />
                              {metric.trend && (
                                <span
                                  className={`text-xs font-medium ${
                                    metric.trend.direction === "up"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {metric.trend.direction === "up" ? "+" : "-"}
                                  {metric.trend.value}%
                                </span>
                              )}
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                              {metric.value}
                            </p>
                            <p className="text-sm text-gray-600">
                              {metric.label}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

              {/* Preferences (for customers) */}
              {isCustomer && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-gray-600" />
                    Preferences
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Marketing Opt-in
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {user.preferredContact ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-gray-600" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                {mockActivityLogs.map((log) => {
                  const Icon = getActivityIcon(log.type);
                  return (
                    <div
                      key={log.id}
                      className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div
                        className={`p-2 rounded-full bg-white ${getActivityColor(
                          log.type
                        )}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {log.description}
                        </p>
                        {log.details && (
                          <p className="text-sm text-gray-600 mt-1">
                            {log.details}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDateTime(log.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "performance" && isSalesRole && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-gray-600" />
                  Sales Performance
                </h3>

                {/* Performance Chart Placeholder */}
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Performance charts would be displayed here
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Integration with charting library required
                  </p>
                </div>
              </div>

              {/* Performance Summary */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">
                  Performance Summary
                </h4>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">
                        {user.totalSales || 0}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total Sales This Month
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">
                        {user.salesGoal && user.totalSales
                          ? Math.round((user.totalSales / user.salesGoal) * 100)
                          : 0}
                        %
                      </p>
                      <p className="text-sm text-gray-600">Goal Achievement</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-yellow-600">
                        {user.averageRating || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
