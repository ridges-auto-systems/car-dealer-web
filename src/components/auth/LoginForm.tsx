"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { RootState, AppDispatch } from "../../lib/store/index";
import { loginUser } from "../../lib/store/action/authActions";
import { clearError } from "@/lib/store/slices/auth.slice";

// Real useAuth hook using Redux
const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = (credentials: { email: string; password: string }) => {
    return dispatch(loginUser(credentials));
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const isAdmin = user?.role === "ADMIN";
  const isSalesRep = user?.role === "SALES_REP";
  const isCustomer = user?.role === "CUSTOMER";

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    isAdmin,
    isSalesRep,
    isCustomer,
    login,
    clearError: clearAuthError,
  };
};

const LoginForm: React.FC<{ onSwitchToRegister: () => void }> = ({
  onSwitchToRegister,
}) => {
  const { login, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    clearError();

    try {
      console.log("🔐 Attempting login with:", { email: formData.email });
      const result = await login(formData);
      console.log("✅ Login result:", result);
    } catch (err) {
      console.error("❌ Login failed:", err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
        <p className="mt-2 text-gray-600">
          Sign in to your Rides Automotors account
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
          <span className="text-red-800 text-sm">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500 bg-white
                ${formErrors.email ? "border-red-500" : "border-gray-300"}
              `}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors
                text-gray-900 placeholder-gray-500 bg-white
                ${formErrors.password ? "border-red-500" : "border-gray-300"}
              `}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {formErrors.password && (
            <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Signing In...
            </div>
          ) : (
            "Sign In"
          )}
        </button>
      </div>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Don&apos;t have an account?{" "}
        </span>
        <button
          onClick={onSwitchToRegister}
          className="text-sm text-red-600 hover:text-red-500 font-medium transition-colors"
          disabled={isLoading}
        >
          Create one here
        </button>
      </div>
    </div>
  );
};
export default LoginForm;
