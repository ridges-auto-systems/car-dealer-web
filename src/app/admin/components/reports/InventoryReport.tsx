import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const InventoryReport = () => {
  const data = {
    labels: [
      "New Vehicles",
      "Used Vehicles",
      "Certified Pre-Owned",
      "Commercial",
    ],
    datasets: [
      {
        data: [45, 28, 15, 12],
        backgroundColor: [
          "rgba(16, 185, 129, 0.7)",
          "rgba(59, 130, 246, 0.7)",
          "rgba(168, 85, 247, 0.7)",
          "rgba(245, 158, 11, 0.7)",
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(168, 85, 247, 1)",
          "rgba(245, 158, 11, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce(
              (acc: number, data: number) => acc + data,
              0
            );
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-96">
      <h4 className="text-lg font-semibold mb-4">Inventory Distribution</h4>
      <Pie data={data} options={options} />
    </div>
  );
};

export default InventoryReport;
