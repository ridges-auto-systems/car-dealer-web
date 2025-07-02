"use client";
import React from "react";
import {
  BarChart3,
  Users,
  Car,
  UserPlus,
  TrendingUp,
  Settings,
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  userRole: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  userRole,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3, badge: null },
    { id: "leads", label: "Leads", icon: Users, badge: 12 },
    ...(userRole === "ADMIN"
      ? [
          { id: "vehicles", label: "Vehicles", icon: Car, badge: null },
          { id: "users", label: "Users", icon: UserPlus, badge: null },
        ]
      : []),
    { id: "reports", label: "Reports", icon: TrendingUp, badge: null },
    ...(userRole === "ADMIN"
      ? [{ id: "settings", label: "Settings", icon: Settings, badge: null }]
      : []),
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="mt-6 px-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isActive={currentView === item.id}
              onClick={() => setCurrentView(item.id)}
            />
          ))}
        </div>
      </nav>
    </div>
  );
};

interface SidebarItemProps {
  item: {
    id: string;
    label: string;
    icon: React.ElementType;
    badge: number | null;
  };
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  isActive,
  onClick,
}) => {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{item.label}</span>
      {item.badge && (
        <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
          {item.badge}
        </span>
      )}
    </button>
  );
};

export default Sidebar;
