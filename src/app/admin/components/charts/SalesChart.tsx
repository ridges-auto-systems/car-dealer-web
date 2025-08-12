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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SalesChartData {
  labels: string[];
  vehiclesSold: number[];
  revenue: number[];
}

interface SalesChartProps {
  data: SalesChartData;
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Vehicles Sold",
        data: data.vehiclesSold,
        borderColor: "rgb(220, 38, 38)",
        backgroundColor: "rgba(220, 38, 38, 0.5)",
        tension: 0.3,
      },
      {
        label: "Revenue (K)",
        data: data.revenue,
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        tension: 0.3,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Vehicles Sold",
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
          text: "Revenue (K)",
        },
      },
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
              label += "$" + context.raw.toLocaleString();
            } else {
              label += context.raw;
            }
            return label;
          },
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default SalesChart;
