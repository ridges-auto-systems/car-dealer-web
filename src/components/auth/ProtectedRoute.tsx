import React, { useEffect, useState } from "react";
import { Shield, Loader2, AlertTriangle } from "lucide-react";

// Mock useAuth hook for demo - replace with your actual hook
type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

const useAuth = () => {
  const [state, setState] = useState<{
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Simulate auth check
    setTimeout(() => {
      // For demo purposes, let's say user is authenticated
      setState({
        user: {
          id: "1",
          email: "admin@ridesautomotors.com",
          firstName: "Admin",
          lastName: "User",
          role: "ADMIN",
        },
        isAuthenticated: true,
        isLoading: false,
      });
    }, 1000);
  }, []);

  return state;
};

// Simple Auth Page component for demo
const SimpleAuthPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
        <span className="text-white font-bold text-2xl">R</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Rides Automotors
      </h1>
      <p className="text-gray-600 mb-6">Please sign in to continue</p>
      <button className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors">
        Sign In
      </button>
    </div>
  </div>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = [],
  fallback,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <SimpleAuthPage />;
  }

  // Check role requirements
  if (requiredRole.length > 0 && user && !requiredRole.includes(user.role)) {
    // Show fallback component if provided
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default access denied screen
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to access this resource.
          </p>
          <div className="space-y-2 text-sm text-gray-500 mb-6">
            <p>
              <strong>Required role:</strong> {requiredRole.join(" or ")}
            </p>
            <p>
              <strong>Your role:</strong> {user?.role}
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // All checks passed - render protected content
  return <>{children}</>;
};

// Example Dashboard Component
const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Rides Automotors
                </h1>
                <p className="text-sm text-gray-600">Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome, {user?.firstName} {user?.lastName}
              </div>
              <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                {user?.role}
              </div>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to your dashboard!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">
                  ✅ Authentication
                </h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• User authenticated successfully</li>
                  <li>• JWT token stored securely</li>
                  <li>• Role-based access working</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">
                  👤 User Info
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Email: {user?.email}</li>
                  <li>• Role: {user?.role}</li>
                  <li>• Status: Active</li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-800 mb-2">
                  🚀 Next Steps
                </h3>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Integrate with your components</li>
                  <li>• Add API interceptors</li>
                  <li>• Implement refresh tokens</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Role-based content examples */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Admin-only content */}
            <ProtectedRoute requiredRole={["ADMIN"]}>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 text-purple-800">
                  Admin Only Section
                </h3>
                <p className="text-gray-600 mb-4">
                  This content is only visible to administrators.
                </p>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors">
                    Manage Users
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors">
                    System Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors">
                    View Reports
                  </button>
                </div>
              </div>
            </ProtectedRoute>

            {/* Sales Rep + Admin content */}
            <ProtectedRoute
              requiredRole={["ADMIN", "SALES_REP"]}
              fallback={
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    Sales content not available for your role
                  </p>
                </div>
              }
            >
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-800">
                  Sales Dashboard
                </h3>
                <p className="text-gray-600 mb-4">
                  Available to Sales Reps and Administrators.
                </p>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
                    Manage Leads
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
                    Vehicle Inventory
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
                    Sales Reports
                  </button>
                </div>
              </div>
            </ProtectedRoute>
          </div>
        </div>
      </div>
    </div>
  );
};

// Demo App showing how to use ProtectedRoute
const ProtectedApp: React.FC = () => {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
};

export default ProtectedApp;
export { ProtectedRoute };
