import React from "react";
import { SalesDataPoint } from "@/lib/types/sales.type";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SalesChart: React.FC<{ data: SalesDataPoint[] }> = ({ data }) => (
  <div className="bg-white p-6 rounded-lg shadow h-80">
    <h3 className="text-lg font-semibold mb-4">Sales Performance</h3>
    <ResponsiveContainer width="100%" height="90%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="vehicles" fill="#8884d8" name="Vehicles Sold" />
        <Bar dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default SalesChart;
