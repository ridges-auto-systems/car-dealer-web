/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  AlertCircle,
} from "lucide-react";
import { RootState, AppDispatch } from "../../lib/store/index";
import { registerUser } from "../../lib/store/action/authActions";
import { clearError } from "@/lib/store/slices/auth.slice";

// Real useAuth hook using Redux
const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const register = async (userData: any) => {
    return dispatch(registerUser(userData));
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
    register,
    clearError: clearAuthError,
  };
};

// Register Form Component
const RegisterForm: React.FC<{ onSwitchToLogin: () => void }> = ({
  onSwitchToLogin,
}) => {
  const { register, isLoading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (
      formData.phone &&
      !/^\+?[1-9]\d{8,14}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    clearError();

    try {
      console.log("📝 Attempting registration with:", {
        ...formData,
        password: "***",
        confirmPassword: "***",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);
      console.log("✅ Registration result:", result);
    } catch (err) {
      console.error("❌ Registration failed:", err);
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
        <h2 className="text-3xl font-bold text-gray-900">
          Join Ridges Automotors
        </h2>
        <p className="mt-2 text-gray-600">Create your account to get started</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
          <span className="text-red-800 text-sm">{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${
                  formErrors.firstName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="First name"
                disabled={isLoading}
              />
            </div>
            {formErrors.firstName && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.firstName}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors ${
                formErrors.lastName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Last name"
              disabled={isLoading}
            />
            {formErrors.lastName && (
              <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors
                text-gray-900 placeholder-gray-500 bg-white
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
            Phone Number (Optional)
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors
                text-gray-900 placeholder-gray-500 bg-white
                ${formErrors.phone ? "border-red-500" : "border-gray-300"}
              `}
              placeholder="+254 700 123 456"
              disabled={isLoading}
            />
          </div>
          {formErrors.phone && (
            <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
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
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors
                text-gray-900 placeholder-gray-500 bg-white
                ${formErrors.password ? "border-red-500" : "border-gray-300"}
              `}
              placeholder="Create a password"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent transition-colors
                text-gray-900 placeholder-gray-500 bg-white
                ${
                  formErrors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }
              `}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {formErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {formErrors.confirmPassword}
            </p>
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
              Creating Account...
            </div>
          ) : (
            "Create Account"
          )}
        </button>
      </div>

      <div className="text-center">
        <span className="text-sm text-gray-600">Already have an account? </span>
        <button
          onClick={onSwitchToLogin}
          className="text-sm text-red-600 hover:text-red-500 font-medium transition-colors"
          disabled={isLoading}
        >
          Sign in here
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
