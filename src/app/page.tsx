"use client";

import { useState, useEffect } from "react";
import { testApiConnection } from "@/lib/api-test";

export default function HomePage() {
  const [apiStatus, setApiStatus] = useState("Testing...");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    // Test API connection when page loads
    testApiConnection().then((success) => {
      if (success) {
        setApiStatus("✅ Connected to backend API!");
      } else {
        setApiStatus("❌ Cannot connect to backend API");
      }
    });

    // Get company name from environment
    setCompanyName(process.env.NEXT_PUBLIC_COMPANY_NAME || "Ridgeways Motors");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🚗 {companyName}
        </h1>

        <p className="text-lg text-gray-600 mb-6">Frontend Development Setup</p>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">API Connection Status:</h2>
          <p className="text-lg">{apiStatus}</p>
        </div>

        <div className="text-sm text-gray-500">
          <p>API URL: {process.env.NEXT_PUBLIC_API_URL}</p>
        </div>
      </div>
    </div>
  );
}
