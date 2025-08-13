import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SalesDataPoint {
  month: string;
  vehicles: number;
  revenue: number;
}

interface SalesChartProps {
  data: SalesDataPoint[];
  isLoading?: boolean;
  height?: string;
}

const SalesChart: React.FC<SalesChartProps> = ({
  data,
  isLoading = false,
  height = "320px",
}) => {
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="animate-pulse flex space-x-4 w-full">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-gray-500"
        style={{ height }}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium">No sales data available</p>
          <p className="text-xs text-gray-400 mt-1">
            Data will appear here once available
          </p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Vehicles Sold",
        data: data.map((item) => item.vehicles),
        borderColor: "rgb(59, 130, 246)", // Blue-500
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "rgb(255, 255, 255)",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "rgb(59, 130, 246)",
        pointHoverBorderColor: "rgb(255, 255, 255)",
        pointHoverBorderWidth: 3,
      },
      {
        label: "Revenue ($K)",
        data: data.map((item) => item.revenue),
        borderColor: "rgb(16, 185, 129)", // Emerald-500
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "rgb(16, 185, 129)",
        pointBorderColor: "rgb(255, 255, 255)",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "rgb(16, 185, 129)",
        pointHoverBorderColor: "rgb(255, 255, 255)",
        pointHoverBorderWidth: 3,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    layout: {
      padding: {
        top: 10,
        bottom: 10,
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(229, 231, 235, 0.3)",
          drawBorder: false,
        },
        ticks: {
          color: "rgb(107, 114, 128)",
          font: {
            size: 12,
            weight: 500 as const, // Changed to number
          },
          padding: 10,
        },
        border: {
          display: false,
        },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Vehicles Sold",
          color: "rgb(75, 85, 99)",
          font: {
            size: 12,
            weight: 600 as const, // Changed to number
          },
          padding: { bottom: 10 },
        },
        grid: {
          color: "rgba(229, 231, 235, 0.3)",
          drawBorder: false,
        },
        ticks: {
          color: "rgb(107, 114, 128)",
          font: {
            size: 11,
          },
          padding: 8,
          callback: function (value: any) {
            return Math.round(value).toString();
          },
        },
        border: {
          display: false,
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: "Revenue ($K)",
          color: "rgb(75, 85, 99)",
          font: {
            size: 12,
            weight: 600 as const, // Changed to number
          },
          padding: { bottom: 10 },
        },
        ticks: {
          color: "rgb(107, 114, 128)",
          font: {
            size: 11,
          },
          padding: 8,
          callback: function (value: any) {
            return "$" + Math.round(value).toLocaleString() + "K";
          },
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: {
          color: "rgb(75, 85, 99)",
          font: {
            size: 13,
            weight: 500 as const, // Changed to number
          },
          usePointStyle: true,
          pointStyle: "circle",
          padding: 25,
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.95)",
        titleColor: "rgb(255, 255, 255)",
        bodyColor: "rgb(255, 255, 255)",
        borderColor: "rgba(75, 85, 99, 0.2)",
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 600 as const, // Changed to number
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: function (context: any) {
            return context[0].label;
          },
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.datasetIndex === 1) {
              label += "$" + context.raw.toLocaleString() + "K";
            } else {
              label += context.raw.toLocaleString() + " units";
            }
            return label;
          },
          afterBody: function (context: any) {
            if (context.length > 0 && context[0].dataIndex > 0) {
              const currentIndex = context[0].dataIndex;
              const prevIndex = currentIndex - 1;

              const currentVehicles = data[currentIndex].vehicles;
              const prevVehicles = data[prevIndex].vehicles;
              const vehicleChange = prevVehicles
                ? ((currentVehicles - prevVehicles) / prevVehicles) * 100
                : 0;

              const currentRevenue = data[currentIndex].revenue;
              const prevRevenue = data[prevIndex].revenue;
              const revenueChange = prevRevenue
                ? ((currentRevenue - prevRevenue) / prevRevenue) * 100
                : 0;

              return [
                "",
                `Vehicles: ${
                  vehicleChange >= 0 ? "+" : ""
                }${vehicleChange.toFixed(1)}% vs prev month`,
                `Revenue: ${
                  revenueChange >= 0 ? "+" : ""
                }${revenueChange.toFixed(1)}% vs prev month`,
              ];
            }
            return [];
          },
        },
      },
    },
    elements: {
      line: {
        borderWidth: 3,
      },
      point: {
        hoverBorderWidth: 3,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuart" as const,
    },
  };

  return (
    <div style={{ height }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default SalesChart;
