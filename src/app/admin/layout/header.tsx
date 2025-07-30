"use client";
import React from "react";
import { Bell, ChevronDown, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/store/hooks/useAuth";

type HeaderProps = {
  userRole: "ADMIN" | "SALES_REP";
  setUserRole: React.Dispatch<React.SetStateAction<"ADMIN" | "SALES_REP">>;
};

const Header: React.FC<HeaderProps> = ({ userRole, setUserRole }) => {
  const { user, logout, isLoading } = useAuth();

  // Get user initials
  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "U";
    return `${firstName.charAt(0).toUpperCase()}${lastName
      .charAt(0)
      .toUpperCase()}`;
  };

  // Get full name
  const getFullName = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "Unknown User";
    return `${firstName} ${lastName}`;
  };

  const handleLogout = () => {
    logout();
    // Optionally redirect to login page
    // window.location.href = '/login';
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Ridges Automotors
                </h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Role Switcher */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Role:</span>
              <select
                value={userRole}
                onChange={(e) =>
                  setUserRole(e.target.value as "ADMIN" | "SALES_REP")
                }
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
              >
                <option value="SALES_REP">Sales Rep</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>

            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Profile Section */}
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-2 relative group">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {getUserInitials(user.firstName, user.lastName)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {getFullName(user.firstName, user.lastName)}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-500" />

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">
                      {getFullName(user.firstName, user.lastName)}
                    </div>
                    <div className="text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Role: {user.role}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Not logged in
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
