"use client";
import React, { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Palette,
  Database,
  Mail,
  Lock,
  Globe,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Building2,
  Camera,
} from "lucide-react";

interface SettingsViewProps {
  userRole: "ADMIN" | "SALES_REP";
}

const SettingsView: React.FC<SettingsViewProps> = ({ userRole }) => {
  const [activeTab, setActiveTab] = useState("general");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  // Form state
  const [settings, setSettings] = useState({
    // Company Settings (Admin only)
    dealershipName: "Ridges Automotors",
    dealershipAddress: "123 Auto Lane, City, State 12345",
    dealershipPhone: "(555) 123-4567",
    dealershipEmail: "info@ridgesauto.com",
    timezone: "America/New_York",
    currency: "USD",

    // Profile Settings
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@ridgesauto.com",
    phone: "(555) 987-6543",
    jobTitle: userRole === "ADMIN" ? "General Manager" : "Sales Representative",
    department: userRole === "ADMIN" ? "Management" : "Sales",
    bio: "Experienced automotive professional with a passion for customer service.",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    leadNotifications: true,
    salesNotifications: true,
    inventoryAlerts: true,

    // Security Settings
    requireTwoFactor: false,
    sessionTimeout: 30,
    passwordExpiry: 90,

    // System Settings
    autoBackup: true,
    backupFrequency: "daily",
    maintenanceMode: false,

    // Appearance
    theme: "light",
    compactMode: false,
    showQuickStats: true,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    setSaveStatus("saving");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const adminTabs = [
    { id: "general", label: "Company", icon: Building2, adminOnly: true },
    { id: "profile", label: "Profile", icon: User, adminOnly: false },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      adminOnly: false,
    },
    { id: "security", label: "Security", icon: Lock, adminOnly: true },
    { id: "system", label: "System", icon: Database, adminOnly: true },
    { id: "appearance", label: "Appearance", icon: Palette, adminOnly: false },
  ];

  const salesTabs = [
    { id: "general", label: "Profile", icon: User, adminOnly: false },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      adminOnly: false,
    },
    { id: "appearance", label: "Appearance", icon: Palette, adminOnly: false },
  ];

  const tabs = userRole === "ADMIN" ? adminTabs : salesTabs;
  const filteredTabs = tabs.filter(
    (tab) => !tab.adminOnly || userRole === "ADMIN"
  );

  const renderCompanySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Building2 className="h-6 w-6 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900">
          Company Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dealership Name
          </label>
          <input
            type="text"
            value={settings.dealershipName}
            onChange={(e) =>
              handleSettingChange("dealershipName", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={settings.dealershipPhone}
            onChange={(e) =>
              handleSettingChange("dealershipPhone", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <input
          type="text"
          value={settings.dealershipAddress}
          onChange={(e) =>
            handleSettingChange("dealershipAddress", e.target.value)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={settings.dealershipEmail}
            onChange={(e) =>
              handleSettingChange("dealershipEmail", e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => handleSettingChange("timezone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Currency
        </label>
        <select
          value={settings.currency}
          onChange={(e) => handleSettingChange("currency", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:w-1/2"
        >
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="CAD">CAD - Canadian Dollar</option>
        </select>
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <User className="h-6 w-6 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900">
          Profile Information
        </h2>
      </div>

      {/* Profile Picture */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-gray-600" />
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
            <Camera className="h-3 w-3" />
          </button>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900">Profile Photo</h3>
          <p className="text-sm text-gray-500">
            Click the camera icon to update your photo
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={settings.firstName}
            onChange={(e) => handleSettingChange("firstName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={settings.lastName}
            onChange={(e) => handleSettingChange("lastName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={settings.email}
            onChange={(e) => handleSettingChange("email", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={settings.phone}
            onChange={(e) => handleSettingChange("phone", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title
          </label>
          <input
            type="text"
            value={settings.jobTitle}
            onChange={(e) => handleSettingChange("jobTitle", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <select
            value={settings.department}
            onChange={(e) => handleSettingChange("department", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={userRole !== "ADMIN"}
          >
            <option value="Sales">Sales</option>
            <option value="Management">Management</option>
            <option value="Finance">Finance</option>
            <option value="Service">Service</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          value={settings.bio}
          onChange={(e) => handleSettingChange("bio", e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tell us a bit about yourself..."
        />
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Password & Security
        </h3>
        <div className="space-y-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>Change Password</span>
          </button>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-gray-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireTwoFactor}
                onChange={(e) =>
                  handleSettingChange("requireTwoFactor", e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Bell className="h-6 w-6 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900">
          Notification Preferences
        </h2>
      </div>

      <div className="space-y-4">
        {[
          {
            key: "emailNotifications",
            label: "Email Notifications",
            description: "Receive notifications via email",
          },
          {
            key: "smsNotifications",
            label: "SMS Notifications",
            description: "Receive notifications via text message",
          },
          {
            key: "leadNotifications",
            label: "New Lead Alerts",
            description: "Get notified when new leads are assigned to you",
          },
          {
            key: "salesNotifications",
            label: "Sales Updates",
            description: "Receive updates on your sales activities",
          },
          ...(userRole === "ADMIN"
            ? [
                {
                  key: "inventoryAlerts",
                  label: "Inventory Alerts",
                  description: "Get notified about low inventory levels",
                },
              ]
            : []),
        ].map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div>
              <h4 className="font-medium text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[item.key as keyof typeof settings] as boolean}
                onChange={(e) =>
                  handleSettingChange(item.key, e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="h-6 w-6 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800">
              System Security
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Changes to security settings will affect all users and may require
              re-authentication.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">
              Require Two-Factor Authentication
            </h4>
            <p className="text-sm text-gray-500">
              Enforce 2FA for all user accounts
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.requireTwoFactor}
              onChange={(e) =>
                handleSettingChange("requireTwoFactor", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) =>
                handleSettingChange("sessionTimeout", parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="5"
              max="480"
            />
            <p className="text-xs text-gray-500 mt-1">
              Automatically log out users after this period of inactivity
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Expiry (days)
            </label>
            <input
              type="number"
              value={settings.passwordExpiry}
              onChange={(e) =>
                handleSettingChange("passwordExpiry", parseInt(e.target.value))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min="30"
              max="365"
            />
            <p className="text-xs text-gray-500 mt-1">
              Require users to change passwords after this period
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Database className="h-6 w-6 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900">System Settings</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Automatic Backups</h4>
            <p className="text-sm text-gray-500">
              Automatically backup system data
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoBackup}
              onChange={(e) =>
                handleSettingChange("autoBackup", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
            <p className="text-sm text-gray-500">
              Put the system in maintenance mode
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) =>
                handleSettingChange("maintenanceMode", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>

        {settings.autoBackup && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup Frequency
            </label>
            <select
              value={settings.backupFrequency}
              onChange={(e) =>
                handleSettingChange("backupFrequency", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 md:w-1/2"
            >
              <option value="hourly">Every Hour</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Database Actions
        </h3>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Backup Now</span>
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Optimize Database</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Palette className="h-6 w-6 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900">
          Appearance & Layout
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-4">
            {["light", "dark", "auto"].map((theme) => (
              <div
                key={theme}
                onClick={() => handleSettingChange("theme", theme)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  settings.theme === theme
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <div className="text-center">
                  <div className="text-sm font-medium capitalize">{theme}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Compact Mode</h4>
            <p className="text-sm text-gray-500">
              Use a more compact layout to fit more content
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) =>
                handleSettingChange("compactMode", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Show Quick Stats</h4>
            <p className="text-sm text-gray-500">
              Display quick statistics in the dashboard
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showQuickStats}
              onChange={(e) =>
                handleSettingChange("showQuickStats", e.target.checked)
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (userRole === "SALES_REP") {
      // For sales reps, "general" tab shows profile settings
      switch (activeTab) {
        case "general":
          return renderProfileSettings();
        case "notifications":
          return renderNotificationSettings();
        case "appearance":
          return renderAppearanceSettings();
        default:
          return renderProfileSettings();
      }
    } else {
      // For admins, separate tabs for company and profile
      switch (activeTab) {
        case "general":
          return renderCompanySettings();
        case "profile":
          return renderProfileSettings();
        case "notifications":
          return renderNotificationSettings();
        case "security":
          return renderSecuritySettings();
        case "system":
          return renderSystemSettings();
        case "appearance":
          return renderAppearanceSettings();
        default:
          return renderCompanySettings();
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          {userRole === "ADMIN"
            ? "Manage your dealership settings and preferences"
            : "Manage your profile and preferences"}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Tab Navigation */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6 py-4">
            {filteredTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">{renderTabContent()}</div>

        {/* Save Button */}
        <div className="border-t bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {saveStatus === "saved" && (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-600">
                  Settings saved successfully!
                </span>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-600">
                  Error saving settings. Please try again.
                </span>
              </>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {saveStatus === "saving" ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
