import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SalesOverTimeChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get("http://localhost:7000/api/v1/payment/getsales", {
          withCredentials: true,
        });

        const transformed = response.data.data.map((item) => ({
          weekLabel: `Week ${item._id.week}, ${item._id.year}`,
          totalSales: item.totalSales,
          count: item.count,
        }));

        console.log("Chart Data:", transformed);
        setData(transformed);
      } catch (error) {
        console.error("Error fetching sales data", error);
      }
    };

    fetchSalesData();
  }, []);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2 className="text-lg font-semibold mb-4">📊 Weekly Sales Overview</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#e5e7eb" />
          <XAxis dataKey="weekLabel" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalSales" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesOverTimeChart;
