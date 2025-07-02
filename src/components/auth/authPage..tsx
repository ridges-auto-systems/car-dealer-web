"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { useAuth } from "@/lib/store/hooks/useAuth"; // Adjust the import path as necessary

const AuthPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isAuthenticated, user, isAdmin, isSalesRep } = useAuth();
  const router = useRouter();

  // Handle redirection when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("✅ User authenticated, redirecting...");

      // Redirect based on user role
      if (isAdmin || isSalesRep) {
        // Redirect to dashboard for admin/sales
        router.push("/dashboard");
      } else {
        // Redirect to homepage for customers
        router.push("/");
      }
    }
  }, [isAuthenticated, user, isAdmin, isSalesRep, router]);

  // Show loading state during redirect
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <p className="text-gray-600 mb-4">
            Successfully logged in as {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Redirecting to {isAdmin || isSalesRep ? "dashboard" : "homepage"}...
          </p>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-sm text-green-800">
            Role: {user.role}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Logo & Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">R</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Rides Automotors</h1>
          <p className="text-gray-600 mt-1">
            Quality vehicles, trusted service
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {isLoginMode ? (
            <LoginForm onSwitchToRegister={() => setIsLoginMode(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLoginMode(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
