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

interface LeadConversionReportProps {
  dateRange: {
    start: Date;
    end: Date;
  };
}

const LeadConversionReport: React.FC<LeadConversionReportProps> = ({
  dateRange,
}) => {
  // In a real app, you would fetch data based on dateRange
  const data = {
    labels: [
      "New",
      "Contacted",
      "Qualified",
      "Test Drive",
      "Negotiating",
      "Sold",
    ],
    datasets: [
      {
        type: "bar" as const, // Explicitly set type
        label: "Leads",
        data: [120, 80, 60, 40, 25, 15],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        order: 2, // Ensure bars appear behind lines
      },
      {
        type: "line" as const, // Explicitly set type
        label: "Conversion Rate",
        data: [100, 66.7, 50, 33.3, 20.8, 12.5],
        borderColor: "rgba(16, 185, 129, 0.7)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        tension: 0.1,
        yAxisID: "y1",
        order: 1, // Ensure line appears in front
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.datasetIndex === 1) {
              label += context.raw + "%";
            } else {
              label += context.raw;
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Number of Leads",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "Conversion Rate (%)",
        },
      },
    },
  };

  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">
        Lead Conversion Funnel ({format(dateRange.start, "MMM d")} -{" "}
        {format(dateRange.end, "MMM d")})
      </h4>
      <div className="h-96">
        {/* @ts-ignore - We're using a mixed chart which isn't perfectly typed */}
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default LeadConversionReport;
