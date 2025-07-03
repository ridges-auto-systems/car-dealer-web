// hooks/useAuth.ts (or wherever you have your useAuth hook)
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/index";
import {
  loginUser,
  registerUser,
  fetchUserProfile,
  logoutUser,
} from "@/lib/store/action/authActions";
import { clearError } from "@/lib/store/slices/auth.slice";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading, error, initialized } =
    useSelector((state: RootState) => state.auth);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const result = await dispatch(loginUser(credentials));

      if (loginUser.fulfilled.match(result)) {
        return { success: true, data: result.payload };
      } else {
        return { success: false, error: result.payload };
      }
    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    try {
      const result = await dispatch(registerUser(userData));

      if (registerUser.fulfilled.match(result)) {
        return { success: true, data: result.payload };
      } else {
        return { success: false, error: result.payload };
      }
    } catch (error) {
      return { success: false, error: "Registration failed" };
    }
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const refreshProfile = async () => {
    try {
      const result = await dispatch(fetchUserProfile());
      return fetchUserProfile.fulfilled.match(result);
    } catch (error) {
      return false;
    }
  };

  // Role checks
  const isAdmin = user?.role === "ADMIN";
  const isSalesRep = user?.role === "SALES_REP";
  const isCustomer = user?.role === "CUSTOMER";

  // Permission checks
  const canAccessAdminPanel = isAdmin || isSalesRep;
  const canManageUsers = isAdmin;
  const canManageLeads = isAdmin || isSalesRep;
  const canManageVehicles = isAdmin || isSalesRep;

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    initialized,

    // Actions
    login,
    register,
    logout,
    clearError: clearAuthError,
    refreshProfile,

    // Role checks
    isAdmin,
    isSalesRep,
    isCustomer,

    // Permission checks
    canAccessAdminPanel,
    canManageUsers,
    canManageLeads,
    canManageVehicles,
  };
};
