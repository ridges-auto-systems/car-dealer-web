import React from "react";
import { X, Copy, Eye, EyeOff } from "lucide-react";
import { UserCredentials } from "@/lib/types/user.type";

interface UserCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: UserCredentials;
  userName: string;
}

const UserCredentialsModal: React.FC<UserCredentialsModalProps> = ({
  isOpen,
  onClose,
  credentials,
  userName,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const copyCredentials = () => {
    const credentialsText = `Email: ${credentials.email}\nPassword: ${credentials.temporaryPassword}`;
    copyToClipboard(credentialsText);
  };

  if (!isOpen) return null;

  return (
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
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                User Credentials Created
              </h3>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-800 mb-2">
                  ✅ User account created successfully for{" "}
                  <strong>{userName}</strong>
                </p>
                <p className="text-sm text-green-700">
                  Please share these credentials securely with the user:
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={credentials.email}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(credentials.email)}
                      className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                      title="Copy email"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temporary Password
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={credentials.temporaryPassword}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() =>
                        copyToClipboard(credentials.temporaryPassword)
                      }
                      className="p-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                      title="Copy password"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={copyCredentials}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                    copied
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-blue-600 text-white border-transparent hover:bg-blue-700"
                  }`}
                >
                  {copied ? "✓ Copied!" : "Copy All Credentials"}
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-xs text-yellow-800">
                  <strong>Security Note:</strong> The user should change this
                  temporary password on first login. These credentials will not
                  be shown again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCredentialsModal;
