import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const RevenueOverTimeChart = ({
  totalSalesData,
  pendingSalesData,
  cancellationsData,
}) => {
  // Aggregate orders from all categories by their status timestamp or creation date
  const chartData = useMemo(() => {
    const dataMap = {};

    const processOrders = (orders, key) => {
      if (!orders || !Array.isArray(orders)) return;
      orders.forEach((order) => {
        const dateStr = order.currentStatus?.timestamp || order.createdAt;
        if (!dateStr) return;

        const dateObj = new Date(dateStr);
        if (isNaN(dateObj.getTime())) return;

        // Group by YYYY-MM-DD for sorting, and create a user-friendly label
        const keyDate = dateObj.toISOString().split("T")[0];
        const label = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const amount = Number(order.summary?.orderTotalPrice) || 0;

        if (!dataMap[keyDate]) {
          dataMap[keyDate] = {
            date: keyDate,
            label: label,
            "Total Sales": 0,
            "Pending Sales": 0,
            Cancellations: 0,
          };
        }
        dataMap[keyDate][key] += amount;
      });
    };

    processOrders(totalSalesData?.ordersToProcess, "Total Sales");
    processOrders(pendingSalesData?.ordersToProcess, "Pending Sales");
    processOrders(cancellationsData?.ordersToProcess, "Cancellations");

    // Convert the map object to an array and sort chronologically
    return Object.values(dataMap).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [totalSalesData, pendingSalesData, cancellationsData]);

  // Formatter function for Currency values on tooltips and axes
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 border border-gray-200 rounded-md mt-6 text-gray-400 text-sm">
        No metric timeline data available for chart visualization.
      </div>
    );
  }

  return (
    <div className="flex w-full mt-4 overflow-hidden">
      <div className="w-full p-3 bg-white border border-[#C2C2C2] rounded-md transition-all duration-300 ease-in-out overflow-hidden">
        <div className="w-full">
          <div className="mb-4">
            <h2 className="text-md font-semibold text-gray-800">
              Revenue Over Time
            </h2>
            <p className="text-xs text-gray-500">
              Daily pipeline value distribution across key lifecycle states
            </p>
          </div>
          <div className="w-full h-100">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F3F4F6"
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  stroke="#6B7280"
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  stroke="#6B7280"
                  fontSize={12}
                  tickFormatter={formatCurrency}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), undefined]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "0.375rem",
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                {/* To change to a stacked layout instead of side-by-side grouped bars,
              simply add a matching stackId="revenue" attribute to all three <Bar /> components below.
            */}
                <Bar
                  dataKey="Total Sales"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Pending Sales"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Cancellations"
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
