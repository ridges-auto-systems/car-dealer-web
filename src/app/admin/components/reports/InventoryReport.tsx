import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FileText } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);
interface InventoryReportData {
  totalVehicles: number;
  totalValue: number;
  avgDaysOnLot: number;
  lowStockAlert: number;
  vehiclesByCategory: Array<{
    category: string;
    count: number;
    value: number;
  }>;
  agingInventory: Array<{
    vehicleId: string;
    make: string;
    model: string;
    year: number;
    daysOnLot: number;
    currentPrice: number;
  }>;
}

// Inventory Report Component
const InventoryReport: React.FC<{ data: InventoryReportData }> = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800">Total Vehicles</h3>
        <p className="text-2xl font-bold text-blue-900">{data.totalVehicles}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-green-800">Total Value</h3>
        <p className="text-2xl font-bold text-green-900">
          ${data.totalValue.toLocaleString()}
        </p>
      </div>
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-orange-800">Avg Days on Lot</h3>
        <p className="text-2xl font-bold text-orange-900">
          {data.avgDaysOnLot}
        </p>
      </div>
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-red-800">Low Stock Alerts</h3>
        <p className="text-2xl font-bold text-red-900">{data.lowStockAlert}</p>
      </div>
    </div>

    {/* Aging Inventory */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Aging Inventory (30+ days)</h3>
      {data.agingInventory.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Vehicle
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Days on Lot
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                  Current Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.agingInventory.map((vehicle, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-sm">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {vehicle.daysOnLot} days
                  </td>
                  <td className="px-4 py-2 text-sm">
                    ${vehicle.currentPrice.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No aging inventory data available</p>
        </div>
      )}
    </div>
  </div>
);

export default InventoryReport;
