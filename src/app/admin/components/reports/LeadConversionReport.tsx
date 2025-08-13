import React from "react";
import { Bar } from "react-chartjs-2";
import { format } from "date-fns"; // Add this import
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { LineChart } from "lucide-react";

// Register all necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
interface LeadConversionData {
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  avgConversionTime: number;
  leadsBySource: Array<{
    source: string;
    leads: number;
    conversions: number;
    conversionRate: number;
  }>;
  conversionFunnel: Array<{
    stage: string;
    count: number;
    percentage: number;
  }>;
}

const LeadConversionReport: React.FC<{ data: LeadConversionData }> = ({
  data,
}) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800">Total Leads</h3>
        <p className="text-2xl font-bold text-blue-900">{data.totalLeads}</p>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-green-800">Converted</h3>
        <p className="text-2xl font-bold text-green-900">
          {data.convertedLeads}
        </p>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-purple-800">Conversion Rate</h3>
        <p className="text-2xl font-bold text-purple-900">
          {data.conversionRate}%
        </p>
      </div>
      <div className="bg-orange-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-orange-800">
          Avg Conversion Time
        </h3>
        <p className="text-2xl font-bold text-orange-900">
          {data.avgConversionTime} days
        </p>
      </div>
    </div>

    {/* Lead Sources */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Lead Sources Performance</h3>
      {data.leadsBySource.length > 0 ? (
        <div className="space-y-2">
          {data.leadsBySource.map((source, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <span className="font-medium">{source.source}</span>
              <div className="text-right">
                <div className="font-bold">{source.leads} leads</div>
                <div className="text-sm text-gray-600">
                  {source.conversions} conversions ({source.conversionRate}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <LineChart className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p>No lead source data available</p>
        </div>
      )}
    </div>
  </div>
);

export default LeadConversionReport;
