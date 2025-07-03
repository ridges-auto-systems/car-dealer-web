// components/AuthProvider.tsx
"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { restoreAuth } from "@/lib/store/slices/auth.slice";
import { initializeAuth } from "@/lib/store/action/authActions";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { initialized, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const initializeAuthentication = async () => {
      if (initialized) return;

      try {
        // Check if we have stored auth data
        const storedToken = localStorage.getItem("rides_auth_token");
        const storedUserData = localStorage.getItem("rides_user_data");

        if (storedToken && storedUserData) {
          console.log("🔄 Restoring auth from localStorage");
          const user = JSON.parse(storedUserData);

          // Restore auth state immediately
          dispatch(restoreAuth({ token: storedToken, user }));

          // Optionally verify token with backend
          // You can uncomment this if you want to verify the token is still valid
          // dispatch(initializeAuth());
        } else {
          console.log("🔄 No stored auth data found, calling initializeAuth");
          // No stored data, try to initialize auth (this will fail gracefully)
          dispatch(initializeAuth());
        }
      } catch (error) {
        console.error("❌ Error initializing auth:", error);
        // If there's an error, clear any corrupted data
        localStorage.removeItem("rides_auth_token");
        localStorage.removeItem("rides_user_data");
      }
    };

    // Only run on client side
    if (typeof window !== "undefined") {
      initializeAuthentication();
    }
  }, [dispatch, initialized]);

  // Show loading screen while initializing
  if (!initialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
