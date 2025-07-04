// Example of how to use the fixed types in your UserForm component
import React, { useState } from "react";
import {
  User,
  CreateUserData,
  UpdateUserData,
  USER_ROLES,
  USER_ROLE_OPTIONS,
} from "@/lib/types/user.type";
import { useUserForm } from "@/lib/store/hooks/useUsers";

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  user?: User | null; // Changed from initialData to user
  onSubmit: (userData: CreateUserData | UpdateUserData) => Promise<void>; // Added missing onSubmit
  userRole: "ADMIN" | "SALES_REP";
}

const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, user, mode }) => {
  const { createUser, updateUser, isLoading, error } = useUserForm();

  const [formData, setFormData] = useState<CreateUserData>({
    email: user?.email || "",
    password: "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    role: user?.role || USER_ROLES.CUSTOMER, // Use the constant, not the type
    preferredContact: user?.preferredContact || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    zipCode: user?.zipCode || "",
    department: user?.department || "",
    position: user?.position || "",
    hireDate: user?.hireDate || "",
    commission: user?.commission || 0,
    salesGoal: user?.salesGoal || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "create") {
        await createUser(formData);
      } else if (mode === "edit" && user) {
        // Convert CreateUserData to UpdateUserData (remove password for updates)
        const { password, ...updateData } = formData;
        await updateUser(user.id, updateData);
      }
      onClose();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  // Example of role validation using the constants
  const isEmployeeRole = (role: string) => {
    return [
      USER_ROLES.SALES_REP,
      USER_ROLES.ADMIN,
      USER_ROLES.MANAGER,
    ].includes(role as any);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, firstName: e.target.value }))
          }
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, lastName: e.target.value }))
          }
          required
        />
      </div>

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
        required
      />

      {mode === "create" && (
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
          required
        />
      )}

      <input
        type="tel"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, phone: e.target.value }))
        }
      />

      {/* Role Selection - Using the constant values */}
      <select
        value={formData.role}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, role: e.target.value as any }))
        }
        required
      >
        {USER_ROLE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {/* Conditional fields for employee roles */}
      {isEmployeeRole(formData.role) && (
        <div className="space-y-4 border-t pt-4">
          <h3 className="font-semibold">Employee Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, department: e.target.value }))
              }
            />
            <input
              type="text"
              placeholder="Position"
              value={formData.position}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, position: e.target.value }))
              }
            />
          </div>

          <input
            type="date"
            placeholder="Hire Date"
            value={formData.hireDate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, hireDate: e.target.value }))
            }
          />

          {formData.role === USER_ROLES.SALES_REP && (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Commission Rate (%)"
                value={formData.commission}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    commission: parseFloat(e.target.value),
                  }))
                }
              />
              <input
                type="number"
                placeholder="Sales Goal"
                value={formData.salesGoal}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    salesGoal: parseFloat(e.target.value),
                  }))
                }
              />
            </div>
          )}
        </div>
      )}

      {/* Address Information */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="font-semibold">Address Information</h3>

        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, address: e.target.value }))
          }
        />

        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, city: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="State"
            value={formData.state}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, state: e.target.value }))
            }
          />
          <input
            type="text"
            placeholder="Zip Code"
            value={formData.zipCode}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, zipCode: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {isLoading
            ? "Saving..."
            : mode === "create"
            ? "Create User"
            : "Update User"}
        </button>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
};

export default UserForm;
