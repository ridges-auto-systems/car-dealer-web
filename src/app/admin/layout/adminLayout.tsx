"use client";
import React, { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import LeadsView from "../views/leadsView";
import { ReduxProvider } from "@/lib/store/provider";
import VehiclesView from "../views/vehicleView";
import DashboardView from "../views/dashboardView";
import UsersView from "../views/usersView";
import ReportsView from "../views/reportViews";
import SettingsView from "../views/settingsView";

const AdminLayout = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [userRole, setUserRole] = useState<"ADMIN" | "SALES_REP">("ADMIN");

  const renderCurrentView = () => {
    switch (currentView) {
      case "leads":
        return <LeadsView />;
      case "vehicles":
        return <VehiclesView />;
      case "dashboard":
        return <DashboardView userRole={userRole} />;
      case "users":
        return <UsersView userRole={userRole} />;
      case "reports":
        return <ReportsView userRole={userRole} />;
      case "settings":
        return <SettingsView userRole={userRole} />;
      default:
        return <DashboardView userRole={userRole} />;
    }
  };

  return (
    <ReduxProvider>
      <div className="min-h-screen bg-gray-50">
        <Header userRole={userRole} setUserRole={setUserRole} />
        <div className="flex">
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
            userRole={userRole}
          />
          <main className="flex-1 p-6">{renderCurrentView()}</main>
        </div>
      </div>
    </ReduxProvider>
  );
};

export default AdminLayout;
