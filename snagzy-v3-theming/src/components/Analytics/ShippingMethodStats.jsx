import { useTopAnalytics } from "../../context/TopAnalyticsContext";
import {
  Cell,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { CustomTooltipV1 } from "./CustomTooltip";
import { useData } from "../../context/DataContext";

export const ShippingMethodStats = ({ analyticsData }) => {
  const { getAllShippingMethods } = useData();
  const { topAnalyticsValue } = useTopAnalytics();

  const shippingMethods = getAllShippingMethods();

  const shippingMethodDist = topAnalyticsValue.getShippingMethodDist(
    analyticsData,
    shippingMethods,
  );

  const SHIPPING_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  return (
    <div className="flex flex-col w-full p-4">
      <div className="mb-4">
        <h2 className="text-md font-bold text-gray-900">Shipping Methods</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Distribution by delivery method
        </p>
      </div>
      <div className="flex items-center gap-6 w-full h-full">
        <div className="flex w-full bg-white border border-gray-200 rounded-md p-4">
          <div className="w-full h-90 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={shippingMethodDist}
                margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltipV1 />} />
                <Bar
                  dataKey="value"
                  name="Orders"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                >
                  {shippingMethodDist.map((_, i) => (
                    <Cell
                      key={i}
                      fill={SHIPPING_COLORS[i % SHIPPING_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
