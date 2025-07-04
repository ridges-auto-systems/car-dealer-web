"use client";
import React, { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
//import DashboardView from "../views/DashboardView";
import LeadsView from "../views/leadsView";
import { ReduxProvider } from "@/lib/store/provider";
import VehiclesView from "../views/vehicleView";
import UsersView from "../views/userViews";
//import ReportsView from "../views/ReportsView";
//import SettingsView from "../views/SettingsView";

const AdminLayout = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [userRole, setUserRole] = useState<"ADMIN" | "SALES_REP">("ADMIN");

  const renderCurrentView = () => {
    switch (currentView) {
      case "leads":
        return <LeadsView />;
      case "vehicles":
        return <VehiclesView />;
      case "users":
        return <UsersView />;
      /*
       case "dashboard":
        return <DashboardView userRole={userRole} />;
      
      
      case "reports":
        return <ReportsView userRole={userRole} />;
      case "settings":
        return <SettingsView userRole={userRole} />;
      default:
        return <DashboardView userRole={userRole} />;
        */
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
