import { amountToDecimal, formatWithCommas } from "../../utils/helpers";
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

export const OrderLifeCycleChart = ({
  orderLifeCycle,
  processOrderLifeCycleData,
  analyticsData,
}) => {
  return (
    <div className="flex w-full mt-2">
      <div className="w-full p-3 bg-white border border-[#C2C2C2] rounded-md transition-all duration-300 ease-in-out overflow-hidden">
        <div className="w-full">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={orderLifeCycle.map((status) => {
                const {
                  ordersToProcess,
                  sumOfTotalPrices,
                  sumOfAllQuantities,
                } = processOrderLifeCycleData(status.slug, analyticsData);
                return {
                  name: status.label,
                  Orders: ordersToProcess?.length || 0,
                  Revenue: Number(sumOfTotalPrices) || 0,
                  Items: Number(sumOfAllQuantities) || 0,
                };
              })}
              margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                angle={-35}
                textAnchor="end"
                height={75}
                interval={0}
                stroke="#6b7280"
                tick={{ fontSize: 13, fontWeight: 500 }}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#6b7280"
                tick={{ fontSize: 13 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#6b7280"
                tick={{ fontSize: 13 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) =>
                  `$${val >= 1000 ? (val / 1000).toFixed(0) + "k" : val}`
                }
              />
              <Tooltip
                cursor={{ fill: "#f9fafb" }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/95 backdrop-blur-xs p-4 border border-gray-200 shadow-xl rounded-xl font-sans text-xs min-w-[180px]">
                        <p className="font-bold text-gray-800 border-b border-gray-100 pb-2 mb-2 text-sm">
                          {label}
                        </p>
                        <div className="space-y-2">
                          {payload.map((entry, index) => {
                            const isRevenue = entry.name === "Revenue";
                            const formattedValue = isRevenue
                              ? `$${amountToDecimal(entry.value)}`
                              : entry.name === "Items"
                                ? formatWithCommas(entry.value)
                                : entry.value;
                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between gap-4"
                              >
                                <div className="flex items-center gap-2 text-gray-600 font-medium">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full inline-block"
                                    style={{
                                      backgroundColor: entry.color,
                                    }}
                                  />
                                  <span>{entry.name}</span>
                                </div>
                                <span className="font-bold text-gray-900">
                                  {formattedValue}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="top"
                height={40}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#374151",
                  paddingBottom: "15px",
                }}
              />
              <Bar
                yAxisId="left"
                dataKey="Orders"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                maxBarSize={35}
                name="Orders"
              />
              <Bar
                yAxisId="right"
                dataKey="Revenue"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                maxBarSize={35}
                name="Revenue"
              />
              <Bar
                yAxisId="left"
                dataKey="Items"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
                maxBarSize={35}
                name="Items"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
