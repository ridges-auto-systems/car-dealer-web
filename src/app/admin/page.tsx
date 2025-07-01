"use client";
import React, { useState } from "react";
import {
  Users,
  Car,
  TrendingUp,
  DollarSign,
  UserPlus,
  Calendar,
  Download,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Header from "./layout/header";
import Sidebar from "./layout/sidebar";
import LeadsView from "./views/leadsView";

// Mock data for demonstration
const mockLeads = [
  {
    id: "1",
    customerName: "John Smith",
    email: "john.smith@email.com",
    phone: "+254 700 123 456",
    vehicle: "2022 Toyota Camry",
    status: "NEW",
    priority: "HIGH",
    salesRep: "Alice Johnson",
    leadScore: 85,
    created: "2024-01-15",
    lastContact: "2024-01-15",
    source: "website",
  },
  {
    id: "2",
    customerName: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    phone: "+254 700 234 567",
    vehicle: "2021 Honda Accord",
    status: "CONTACTED",
    priority: "MEDIUM",
    salesRep: "Bob Martinez",
    leadScore: 72,
    created: "2024-01-14",
    lastContact: "2024-01-16",
    source: "phone",
  },
  {
    id: "3",
    customerName: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "+254 700 345 678",
    vehicle: "2023 BMW 3 Series",
    status: "TEST_DRIVE_COMPLETED",
    priority: "HOT",
    salesRep: "Alice Johnson",
    leadScore: 94,
    created: "2024-01-12",
    lastContact: "2024-01-16",
    source: "referral",
  },
];

const mockSalesReps = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@ridgesautomotors.com",
    phone: "+254 700 111 222",
    role: "SALES_REP",
    activeLeads: 12,
    monthlyTarget: 8,
    monthlyDeals: 5,
    conversionRate: 23.5,
    totalSales: 142500,
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "Bob Martinez",
    email: "bob@ridgesautomotors.com",
    phone: "+254 700 333 444",
    role: "SALES_REP",
    activeLeads: 8,
    monthlyTarget: 8,
    monthlyDeals: 3,
    conversionRate: 18.2,
    totalSales: 89500,
    status: "ACTIVE",
  },
];

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [userRole] = useState("ADMIN"); // ADMIN or SALES_REP
  //const [selectedLeads] = useState([]);
  //const [showBulkActions, setShowBulkActions] = useState(false);

  // Dashboard metrics
  const dashboardMetrics = {
    totalLeads: 45,
    newLeads: 12,
    hotLeads: 8,
    conversion: 24.5,
    totalRevenue: 485000,
    monthlyTarget: 500000,
    activeVehicles: 38,
    soldThisMonth: 15,
  };

  type StatusBadgeProps = {
    status: string;
    priority: string;
  };

  const StatusBadge: React.FC<StatusBadgeProps> = ({ status, priority }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "NEW":
          return "bg-blue-100 text-blue-800";
        case "CONTACTED":
          return "bg-purple-100 text-purple-800";
        case "QUALIFIED":
          return "bg-green-100 text-green-800";
        case "TEST_DRIVE_COMPLETED":
          return "bg-teal-100 text-teal-800";
        case "NEGOTIATING":
          return "bg-yellow-100 text-yellow-800";
        case "CLOSED_WON":
          return "bg-green-100 text-green-800";
        case "CLOSED_LOST":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case "HOT":
          return "bg-red-500";
        case "HIGH":
          return "bg-orange-500";
        case "MEDIUM":
          return "bg-yellow-500";
        case "LOW":
          return "bg-green-500";
        default:
          return "bg-gray-500";
      }
    };

    return (
      <div className="flex items-center space-x-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            status
          )}`}
        >
          {status.replace(/_/g, " ")}
        </span>
        <div
          className={`w-2 h-2 rounded-full ${getPriorityColor(priority)}`}
          title={`${priority} Priority`}
        ></div>
      </div>
    );
  };

  type MetricCardProps = {
    title: string;
    value: string | number;
    change?: { positive: boolean; value: number };
    icon: React.ElementType;
    color?: string;
  };

  const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    change,
    icon: Icon,
    color = "blue",
  }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {change.positive ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${
                  change.positive ? "text-green-600" : "text-red-600"
                }`}
              >
                {change.value}%
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

  const DashboardView = () => (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <UserPlus className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">Add Lead</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Car className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-900">Add Vehicle</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-purple-900">
              Schedule Appointment
            </span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
            <Download className="h-5 w-5 text-red-600" />
            <span className="font-medium text-red-900">Export Data</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads"
          value={dashboardMetrics.totalLeads}
          change={{ positive: true, value: 12.5 }}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${dashboardMetrics.conversion}%`}
          change={{ positive: true, value: 3.2 }}
          icon={TrendingUp}
          color="green"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`$${(dashboardMetrics.totalRevenue / 1000).toFixed(0)}K`}
          change={{ positive: false, value: 2.1 }}
          icon={DollarSign}
          color="purple"
        />
        <MetricCard
          title="Active Vehicles"
          value={dashboardMetrics.activeVehicles}
          change={{ positive: true, value: 8.3 }}
          icon={Car}
          color="orange"
        />
      </div>

      {/* Recent Activity & Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Leads</h2>
            <button
              onClick={() => setCurrentView("leads")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {mockLeads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">
                      {lead.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {lead.customerName}
                    </p>
                    <p className="text-sm text-gray-600">{lead.vehicle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={lead.status} priority={lead.priority} />
                  <p className="text-xs text-gray-500 mt-1">{lead.salesRep}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">
            Team Performance
          </h2>
          <div className="space-y-4">
            {mockSalesReps.map((rep) => (
              <div
                key={rep.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{rep.name}</span>
                  <span className="text-sm text-green-600 font-semibold">
                    {rep.monthlyDeals}/{rep.monthlyTarget}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(rep.monthlyDeals / rep.monthlyTarget) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{rep.activeLeads} leads</span>
                  <span>{rep.conversionRate}% conversion</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        userRole={"ADMIN"}
        setUserRole={function (): void {
          throw new Error("Function not implemented.");
        }}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          userRole={userRole}
        />

        {/* Main Content */}
        <div className="flex-1 p-6">
          {currentView === "dashboard" && <DashboardView />}
          {currentView === "leads" && <LeadsView userRole={"ADMIN"} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
