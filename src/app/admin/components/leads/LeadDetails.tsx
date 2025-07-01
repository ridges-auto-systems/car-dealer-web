/* eslint-disable @typescript-eslint/no-explicit-any */
// admin/components/leads/LeadDetails.tsx
import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Car,
  Calendar,
  MessageSquare,
  Edit,
  Star,
  Clock,
  RefreshCw,
  CreditCard,
  FileText,
  Activity,
  Target,
  Phone as PhoneIcon,
  Plus,
  Eye,
  UserCheck,
  ChevronRight,
  Info,
} from "lucide-react";
import type {
  Lead,
  LeadStatus,
  LeadPriority,
} from "../../../../lib/types/lead.type";

// ============================================================================
// INTERFACES
// ============================================================================

interface LeadDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onEdit: () => void;
  userRole?: "ADMIN" | "SALES_REP";
}

interface CommunicationLog {
  id: string;
  type: "call" | "email" | "sms" | "note" | "meeting" | "system";
  direction: "inbound" | "outbound" | "internal";
  subject?: string;
  content: string;
  timestamp: string;
  duration?: number;
  outcome?: string;
  salesRep: string;
}

interface Activity {
  id: string;
  type:
    | "status_change"
    | "priority_change"
    | "assignment"
    | "note_added"
    | "appointment_scheduled";
  description: string;
  timestamp: string;
  user: string;
  oldValue?: string;
  newValue?: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockCommunications: CommunicationLog[] = [
  {
    id: "1",
    type: "call",
    direction: "outbound",
    content:
      "Initial contact call - customer interested in Toyota Camry, discussed pricing and financing options",
    timestamp: "2024-01-16T10:30:00Z",
    duration: 12,
    outcome: "Scheduled showroom visit",
    salesRep: "Alice Johnson",
  },
  {
    id: "2",
    type: "email",
    direction: "outbound",
    subject: "Vehicle Information - 2022 Toyota Camry",
    content:
      "Sent detailed brochure and pricing information for the Toyota Camry as requested",
    timestamp: "2024-01-16T11:15:00Z",
    salesRep: "Alice Johnson",
  },
  {
    id: "3",
    type: "note",
    direction: "internal",
    content:
      "Customer mentioned they need to trade in their 2018 Honda Civic. Estimated trade value around $18,000",
    timestamp: "2024-01-16T14:20:00Z",
    salesRep: "Alice Johnson",
  },
];

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "status_change",
    description: "Status changed from NEW to CONTACTED",
    timestamp: "2024-01-16T10:30:00Z",
    user: "Alice Johnson",
    oldValue: "NEW",
    newValue: "CONTACTED",
  },
  {
    id: "2",
    type: "priority_change",
    description: "Priority upgraded to HIGH",
    timestamp: "2024-01-16T10:35:00Z",
    user: "Alice Johnson",
    oldValue: "MEDIUM",
    newValue: "HIGH",
  },
  {
    id: "3",
    type: "note_added",
    description: "Added note about trade-in vehicle",
    timestamp: "2024-01-16T14:20:00Z",
    user: "Alice Johnson",
  },
];

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const StatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => {
  const getStatusConfig = (status: LeadStatus) => {
    switch (status) {
      case "NEW":
        return { color: "blue", label: "New" };
      case "CONTACTED":
        return { color: "purple", label: "Contacted" };
      case "QUALIFIED":
        return { color: "green", label: "Qualified" };
      case "APPOINTMENT_SCHEDULED":
        return { color: "orange", label: "Appointment" };
      case "TEST_DRIVE_COMPLETED":
        return { color: "teal", label: "Test Drive" };
      case "NEGOTIATING":
        return { color: "yellow", label: "Negotiating" };
      case "CLOSED_WON":
        return { color: "green", label: "Won" };
      case "CLOSED_LOST":
        return { color: "red", label: "Lost" };
      default:
        return { color: "gray", label: status };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium bg-${config.color}-100 text-${config.color}-800`}
    >
      {config.label}
    </span>
  );
};

const PriorityIndicator: React.FC<{
  priority: LeadPriority;
  isHot?: boolean;
}> = ({ priority, isHot }) => {
  const getPriorityConfig = (priority: LeadPriority) => {
    switch (priority) {
      case "HOT":
        return { color: "red", label: "Hot Lead" };
      case "HIGH":
        return { color: "orange", label: "High Priority" };
      case "MEDIUM":
        return { color: "yellow", label: "Medium Priority" };
      case "LOW":
        return { color: "green", label: "Low Priority" };
      default:
        return { color: "gray", label: priority };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full bg-${config.color}-500`}></div>
      <span className="text-sm font-medium text-gray-900">{config.label}</span>
      {isHot && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
    </div>
  );
};

const InfoCard: React.FC<{
  title: string;
  children: React.ReactNode;
  icon?: React.ComponentType<any>;
  action?: React.ReactNode;
}> = ({ title, children, icon: Icon, action }) => (
  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        {Icon && <Icon className="h-5 w-5 text-gray-600" />}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {action}
    </div>
    {children}
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const LeadDetails: React.FC<LeadDetailsProps> = ({
  isOpen,
  onClose,
  lead,
  onEdit,
  userRole = "SALES_REP",
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "communications" | "activity"
  >("overview");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showQuickActions, setShowQuickActions] = useState(false);

  if (!isOpen) return null;

  const handleQuickAction = (action: string) => {
    console.log("Quick action:", action, "for lead:", lead.id);
    setShowQuickActions(false);
    // Implement quick actions
  };

  const calculateDaysAsLead = () => {
    const created = new Date(lead.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "call":
        return PhoneIcon;
      case "email":
        return Mail;
      case "sms":
        return MessageSquare;
      case "note":
        return FileText;
      case "meeting":
        return Calendar;
      case "system":
        return Activity;
      default:
        return Info;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Customer Information */}
      <InfoCard title="Customer Information" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Full Name</div>
                <div className="font-medium text-gray-900">
                  {lead.customerName}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="font-medium text-gray-900">{lead.email}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Phone</div>
                <div className="font-medium text-gray-900">{lead.phone}</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Lead Created</div>
                <div className="font-medium text-gray-900">
                  {formatDate(lead.createdAt)}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Days as Lead</div>
                <div className="font-medium text-gray-900">
                  {calculateDaysAsLead()} days
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Activity className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-sm text-gray-600">Last Contact</div>
                <div className="font-medium text-gray-900">
                  {lead.lastContact ? formatDate(lead.lastContact) : "Never"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </InfoCard>

      {/* Lead Status & Progress */}
      <InfoCard title="Lead Status & Progress" icon={Target}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Current Status</div>
            <StatusBadge status={lead.status} />
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Priority</div>
            <PriorityIndicator priority={lead.priority} isHot={lead.isHot} />
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">Lead Score</div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${lead.leadScore || 0}%` }}
                ></div>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {lead.leadScore || 0}
              </span>
            </div>
          </div>
        </div>
      </InfoCard>

      {/* Vehicle Interest */}
      {lead.vehicle && (
        <InfoCard title="Vehicle Interest" icon={Car}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Car className="h-8 w-8 text-blue-600" />
              <div>
                <div className="font-semibold text-gray-900">
                  {lead.vehicle}
                </div>
                <div className="text-sm text-gray-600">Interested Vehicle</div>
              </div>
            </div>
            <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors">
              View Vehicle
            </button>
          </div>
        </InfoCard>
      )}

      {/* Sales Representative */}
      <InfoCard title="Sales Representative" icon={UserCheck}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {lead.salesRep
                  ? lead.salesRep
                      .split(" ")
                      .map((n: any[]) => n[0])
                      .join("")
                  : "UA"}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {lead.salesRep || "Unassigned"}
              </div>
              <div className="text-sm text-gray-600">
                {lead.salesRep
                  ? "Assigned Sales Representative"
                  : "No assignment yet"}
              </div>
            </div>
          </div>
          {userRole === "ADMIN" && (
            <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors">
              {lead.salesRep ? "Reassign" : "Assign Rep"}
            </button>
          )}
        </div>
      </InfoCard>

      {/* Trade-in Information */}
      {lead.interestedInTrade && lead.tradeVehicleInfo && (
        <InfoCard title="Trade-in Vehicle" icon={RefreshCw}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Make</div>
              <div className="font-medium text-gray-900">
                {lead.tradeVehicleInfo.make}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Model</div>
              <div className="font-medium text-gray-900">
                {lead.tradeVehicleInfo.model}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Year</div>
              <div className="font-medium text-gray-900">
                {lead.tradeVehicleInfo.year}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Mileage</div>
              <div className="font-medium text-gray-900">
                {lead.tradeVehicleInfo.mileage?.toLocaleString()} km
              </div>
            </div>
          </div>
          {lead.tradeVehicleInfo.details && (
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-1">
                Additional Details
              </div>
              <div className="text-gray-900">
                {lead.tradeVehicleInfo.details}
              </div>
            </div>
          )}
        </InfoCard>
      )}

      {/* Financing */}
      {lead.financingNeeded && (
        <InfoCard title="Financing Requirements" icon={CreditCard}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Financing Needed</div>
              <div className="font-medium text-green-600">Yes</div>
            </div>
            {lead.budgetRange && (
              <div>
                <div className="text-sm text-gray-600">Budget Range</div>
                <div className="font-medium text-gray-900">
                  {lead.budgetRange}
                </div>
              </div>
            )}
          </div>
        </InfoCard>
      )}

      {/* Lead Notes */}
      {lead.notes && (
        <InfoCard title="Initial Message" icon={MessageSquare}>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700 leading-relaxed">{lead.notes}</p>
          </div>
        </InfoCard>
      )}
    </div>
  );

  const renderCommunicationsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Communication History
        </h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Communication</span>
        </button>
      </div>

      <div className="space-y-4">
        {mockCommunications.map((comm) => {
          const IconComponent = getTimelineIcon(comm.type);
          return (
            <div
              key={comm.id}
              className="bg-white border border-gray-200 rounded-xl p-6"
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-2 rounded-full ${
                    comm.type === "call"
                      ? "bg-green-100"
                      : comm.type === "email"
                      ? "bg-blue-100"
                      : comm.type === "sms"
                      ? "bg-purple-100"
                      : "bg-gray-100"
                  }`}
                >
                  <IconComponent
                    className={`h-4 w-4 ${
                      comm.type === "call"
                        ? "text-green-600"
                        : comm.type === "email"
                        ? "text-blue-600"
                        : comm.type === "sms"
                        ? "text-purple-600"
                        : "text-gray-600"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 capitalize">
                        {comm.type}
                      </span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500 capitalize">
                        {comm.direction}
                      </span>
                      {comm.duration && (
                        <>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">
                            {comm.duration} min
                          </span>
                        </>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(comm.timestamp)}
                    </span>
                  </div>
                  {comm.subject && (
                    <div className="font-medium text-gray-900 mb-2">
                      {comm.subject}
                    </div>
                  )}
                  <p className="text-gray-700 mb-2">{comm.content}</p>
                  {comm.outcome && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="text-sm text-green-800">
                        <strong>Outcome:</strong> {comm.outcome}
                      </div>
                    </div>
                  )}
                  <div className="text-sm text-gray-500 mt-2">
                    by {comm.salesRep}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>

      <div className="space-y-3">
        {mockActivities.map((activity, index) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              {index < mockActivities.length - 1 && (
                <div className="w-px h-12 bg-gray-300 mt-2"></div>
              )}
            </div>
            <div className="flex-1 pb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    {activity.description}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(activity.timestamp)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">by {activity.user}</div>
                {activity.oldValue && activity.newValue && (
                  <div className="mt-2 text-sm">
                    <span className="text-red-600">{activity.oldValue}</span>
                    <ChevronRight className="h-4 w-4 inline mx-1 text-gray-400" />
                    <span className="text-green-600">{activity.newValue}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">
                {lead.customerName
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "UN"}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {lead.customerName}
              </h2>
              <p className="text-gray-600">{lead.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuickAction("call")}
                className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                title="Call Customer"
              >
                <Phone className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleQuickAction("email")}
                className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                title="Send Email"
              >
                <Mail className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleQuickAction("sms")}
                className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                title="Send SMS"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              <button
                onClick={onEdit}
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                title="Edit Lead"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "overview", label: "Overview", icon: Eye },
              {
                id: "communications",
                label: "Communications",
                icon: MessageSquare,
              },
              { id: "activity", label: "Activity", icon: Activity },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "communications" && renderCommunicationsTab()}
          {activeTab === "activity" && renderActivityTab()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Lead ID: {lead.id}</span>
            <span className="text-sm text-gray-600">•</span>
            <span className="text-sm text-gray-600">
              Created: {new Date(lead.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Export PDF
            </button>
            <button
              onClick={onEdit}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Edit Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
