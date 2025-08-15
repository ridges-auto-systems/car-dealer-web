// components/AuthProvider.tsx
"use client";
import React, { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { restoreAuth } from "@/lib/store/slices/auth.slice";
import { initializeAuth } from "@/lib/store/action/authActions";

interface AuthContextType {
  role: "ADMIN" | "MANAGER" | "SALES_REP" | "CUSTOMER";
  isLoading: boolean;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType>({
  role: "SALES_REP",
  isLoading: true,
  initialized: false,
});

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { initialized, isLoading, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const initializeAuthentication = async () => {
      if (initialized) return;

      try {
        const storedToken = localStorage.getItem("Ridges_auth_token");
        const storedUserData = localStorage.getItem("Ridges_user_data");

        if (storedToken && storedUserData) {
          const user = JSON.parse(storedUserData);
          dispatch(restoreAuth({ token: storedToken, user }));
        } else {
          dispatch(initializeAuth());
        }
      } catch (error) {
        console.error("❌ Error initializing auth:", error);
        localStorage.removeItem("Ridges_auth_token");
        localStorage.removeItem("Ridges_user_data");
      }
    };

    if (typeof window !== "undefined") {
      initializeAuthentication();
    }
  }, [dispatch, initialized]);

  const role = user?.role || "SALES_REP";

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

  return (
    <AuthContext.Provider value={{ role, isLoading, initialized }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
