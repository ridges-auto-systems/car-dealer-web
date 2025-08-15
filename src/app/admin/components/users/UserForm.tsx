// src/components/users/UserForm.tsx
import React, { useState, useEffect } from "react";
import { X, Save, AlertCircle, RefreshCw } from "lucide-react";
import { useUsers } from "@/lib/store/hooks/useUsers";
import {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserCredentials,
} from "@/lib/types/user.type";
import UserCredentialsModal from "./UserCredentialsModal";

type AdminUserRole =
  | "ADMIN"
  | "SALES_REP"
  | "SALES_MANAGER"
  | "FINANCE_MANAGER"
  | "SUPER_ADMIN";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, user }) => {
  const { createUser, updateUser, loading, error, clearError, selectedUser } =
    useUsers();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "SALES_REP" as AdminUserRole,
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [showCredentials, setShowCredentials] = useState(false);
  const [newUserCredentials, setNewUserCredentials] =
    useState<UserCredentials | null>(null);

  // Use selectedUser from hook if available, otherwise use prop
  const currentUser = selectedUser || user;

  // Initialize form data when user prop changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phone: currentUser.phone || "",
        role: currentUser.role as AdminUserRole,
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "SALES_REP",
      });
    }
    setValidationErrors({});
  }, [currentUser, isOpen]);

  // Clear errors when form opens
  useEffect(() => {
    if (isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\+254[0-9]{9}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Phone must be in format +254XXXXXXXXX";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (currentUser) {
        // Update existing user
        const updateData: UpdateUserRequest = {
          id: currentUser.id,
          ...formData,
        };

        const result = await updateUser(updateData);

        if (result.type === "users/updateUser/fulfilled") {
          onClose();
        }
      } else {
        // Create new user
        const createData: CreateUserRequest = formData;

        const result = await createUser(createData);

        if (result.type === "users/createUser/fulfilled") {
          // Show credentials modal for new user
          const response = result.payload as any;
          if (response.credentials) {
            setNewUserCredentials(response.credentials);
            setShowCredentials(true);
          }
          onClose();
        }
      }
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Handle Kenya format
    if (digits.startsWith("254")) {
      return `+${digits}`;
    } else if (digits.startsWith("0")) {
      return `+254${digits.slice(1)}`;
    } else if (digits.startsWith("7") || digits.startsWith("1")) {
      return `+254${digits}`;
    }

    return value;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange("phone", formatted);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
          <div
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={onClose}
          />

          <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div className="absolute top-0 right-0 pt-4 pr-4">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                  {currentUser ? "Edit User" : "Add New User"}
                </h3>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800">{error}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent ${
                          validationErrors.firstName
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter first name"
                      />
                      {validationErrors.firstName && (
                        <p className="mt-1 text-xs text-red-600">
                          {validationErrors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent ${
                          validationErrors.lastName
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter last name"
                      />
                      {validationErrors.lastName && (
                        <p className="mt-1 text-xs text-red-600">
                          {validationErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent ${
                        validationErrors.email
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="user@ridgesautomotors.com"
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-xs text-red-600">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent ${
                        validationErrors.phone
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="+254712345678"
                    />
                    {validationErrors.phone && (
                      <p className="mt-1 text-xs text-red-600">
                        {validationErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        handleInputChange(
                          "role",
                          e.target.value as AdminUserRole
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    >
                      <option value="SALES_REP">Sales Representative</option>
                      <option value="SALES_MANAGER">Sales Manager</option>
                      <option value="FINANCE_MANAGER">Finance Manager</option>
                      <option value="ADMIN">Administrator</option>
                      <option value="SUPER_ADMIN">Super Administrator</option>
                    </select>
                  </div>

                  {!currentUser && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> A temporary password will be
                        generated for this user. They will receive login
                        credentials after account creation.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>
                            {currentUser ? "Updating..." : "Creating..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>
                            {currentUser ? "Update User" : "Create User"}
                          </span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credentials Modal */}
      {newUserCredentials && (
        <UserCredentialsModal
          isOpen={showCredentials}
          onClose={() => {
            setShowCredentials(false);
            setNewUserCredentials(null);
          }}
          credentials={newUserCredentials}
          userName={`${formData.firstName} ${formData.lastName}`}
        />
      )}
    </>
  );
};

export default UserForm;
