import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { AlertCircle, BarChart2, FileText, TrendingUp } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SalesReportData {
  totalSales: number;
  totalRevenue: number;
  avgSalePrice: number;
  salesByMonth: Array<{
    month: string;
    sales: number;
    revenue: number;
  }>;
  topPerformers: Array<{
    salesRep: string;
    sales: number;
    revenue: number;
  }>;
  vehiclesSold: Array<{
    make: string;
    model: string;
    year: number;
    price: number;
    saleDate: string;
    salesRep: string;
  }>;
}

// Inventory Report Component
const SalesReport: React.FC<{ data: SalesReportData }> = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800">Total Sales</h3>
        <p className="text-2xl font-bold text-blue-900">{data.totalSales}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-green-800">Total Revenue</h3>
        <p className="text-2xl font-bold text-green-900">
          ${data.totalRevenue.toLocaleString()}
        </p>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-purple-800">Avg Sale Price</h3>
        <p className="text-2xl font-bold text-purple-900">
          ${data.avgSalePrice.toLocaleString()}
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Sales Chart */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Monthly Sales</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          {data.salesByMonth.length > 0 ? (
            <div className="text-center text-gray-600">
              <BarChart2 className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Sales chart would render here</p>
              <p className="text-sm">
                ({data.salesByMonth.length} data points)
              </p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No sales data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Performers */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Top Performers</h3>
        <div className="space-y-2">
          {data.topPerformers.length > 0 ? (
            data.topPerformers.map((performer, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium">{performer.salesRep}</span>
                <div className="text-right">
                  <div className="font-bold">{performer.sales} sales</div>
                  <div className="text-sm text-gray-600">
                    ${performer.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No performance data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default SalesReport;
