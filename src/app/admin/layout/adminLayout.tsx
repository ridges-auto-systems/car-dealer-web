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
import AuthProvider, { useAuth } from "@/components/auth/authProvider";
import SalesDashboard from "../views/salesView";

const AdminLayout = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const { role } = useAuth();

  const renderCurrentView = () => {
    switch (currentView) {
      case "leads":
        return <LeadsView />;
      case "vehicles":
        return role === "ADMIN" || role === "MANAGER" ? <VehiclesView /> : null;
      case "dashboard":
        return role === "SALES_REP" ? <SalesDashboard /> : <DashboardView />;
      case "users":
        return role === "ADMIN" ? <UsersView /> : null;
      case "reports":
        return <ReportsView />;
      case "settings":
        return role === "ADMIN" || role === "SALES_REP" ? (
          <SettingsView userRole={role} />
        ) : null;
      default:
        return role === "SALES_REP" ? <SalesDashboard /> : <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          userRole={role}
        />
        <main className="flex-1 p-6">{renderCurrentView()}</main>
      </div>
    </div>
  );
};

const AdminLayoutWrapper = () => (
  <ReduxProvider>
    <AuthProvider>
      <AdminLayout />
    </AuthProvider>
  </ReduxProvider>
);

export default AdminLayoutWrapper;
