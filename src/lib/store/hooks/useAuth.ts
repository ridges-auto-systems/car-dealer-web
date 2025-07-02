// hooks/useAuth.ts

import { useSelector, useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import { RootState, AppDispatch } from "../index";
import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  initializeAuth,
} from "../action/authActions";
import { clearError } from "../slices/auth.slice";
import { LoginCredentials, RegisterData } from "../../types/auth.type";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Get auth state from Redux
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // Login function
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      return dispatch(loginUser(credentials));
    },
    [dispatch]
  );

  // Register function
  const register = useCallback(
    async (userData: RegisterData) => {
      return dispatch(registerUser(userData));
    },
    [dispatch]
  );

  // Logout function
  const logout = useCallback(async () => {
    return dispatch(logoutUser());
  }, [dispatch]);

  // Get current user function
  const fetchUser = useCallback(async () => {
    return dispatch(getCurrentUser());
  }, [dispatch]);

  // Clear error function
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Initialize auth on app start
  const initialize = useCallback(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Auto-initialize on hook mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Helper functions
  const isAdmin = user?.role === "ADMIN";
  const isSalesRep = user?.role === "SALES_REP";
  const isCustomer = user?.role === "CUSTOMER";

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Helper booleans
    isAdmin,
    isSalesRep,
    isCustomer,

    // Actions
    login,
    register,
    logout,
    fetchUser,
    clearError: clearAuthError,
    initialize,
  };
};
