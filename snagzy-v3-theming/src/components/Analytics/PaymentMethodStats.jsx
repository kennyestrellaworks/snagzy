import React from "react";
import { useTopAnalytics } from "../../context/TopAnalyticsContext";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CustomTooltipV1 } from "./CustomTooltip";

export const PaymentMethodStats = ({ analyticsData }) => {
  const { topAnalyticsValue } = useTopAnalytics();

  const paymentMethodDist =
    topAnalyticsValue.getPaymentMethodList(analyticsData);

  const PAYMENT_COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
  ];

  return (
    <div className="flex flex-col w-full p-4">
      <div className="mb-4">
        <h2 className="text-md font-bold text-gray-900">Payment Methods</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Breakdown by payment provider
        </p>
      </div>

      <div className="flex items-center gap-6 w-full">
        <div className="grid grid-cols-[1fr_1fr] w-full h-full bg-white border border-gray-200 rounded-md p-4">
          <div className="w-full h-90 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodDist}
                  cx="50%"
                  cy="50%"
                  /* Increased innerRadius from 55 to 65, and outerRadius from 90 to 105 */
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {paymentMethodDist.map((_, i) => (
                    <Cell
                      key={i}
                      fill={PAYMENT_COLORS[i % PAYMENT_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltipV1 />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-full pr-1">
            {paymentMethodDist.map((m, i) => (
              <div key={m.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        PAYMENT_COLORS[i % PAYMENT_COLORS.length],
                    }}
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    {m.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">
                    {m.value}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
