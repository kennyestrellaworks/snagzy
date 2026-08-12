import { useTopAnalytics } from "../../context/TopAnalyticsContext";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import {
  successfulOrderStatuses,
  pendingOrderStatuses,
  unsuccessfulOrderStatuses,
} from "../../data/orderLifeCycle";
import { formatWithCommas } from "../../utils/helpers";
// import { CustomTooltipV1 } from "./CustomTooltip";

export const OrderLifeCycleDistribution = ({ analyticsData }) => {
  const { topAnalyticsValue } = useTopAnalytics();

  // Dynamically generated distribution array from your simplified method
  const lifecycleDist = [
    topAnalyticsValue.getOrderStatusDistribution(
      successfulOrderStatuses,
      analyticsData,
    ),
    topAnalyticsValue.getOrderStatusDistribution(
      pendingOrderStatuses,
      analyticsData,
    ),
    topAnalyticsValue.getOrderStatusDistribution(
      unsuccessfulOrderStatuses,
      analyticsData,
    ),
  ];

  const LIFECYCLE_COLORS = ["#22c55e", "#eab308", "#ef4444"];

  const hasData = lifecycleDist.some((item) => item.value > 0);

  // Format revenue to 2 decimal places
  const formatRevenue = (revenue) => {
    return revenue?.toFixed(2) || "0.00";
  };

  // Custom label showing both order count and revenue
  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    value,
    revenue,
    name,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#374151"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="middle"
      >
        <tspan x={x} dy="-0.5em" fontSize="12">
          {value} Orders
        </tspan>
        <tspan x={x} dy="1.2em" fontSize="14" fontWeight="bold" fill="#6b7280">
          ${formatWithCommas(formatRevenue(revenue))}
        </tspan>
      </text>
    );
  };

  return (
    <div className="flex flex-col w-full p-4">
      <div className="mb-4">
        <h2 className="text-md font-bold text-gray-900">
          Order Lifecycle Distribution
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Fulfillment pipelines, successful deliveries, and cancellations
        </p>
      </div>

      <div className="flex items-start w-full gap-6">
        <div className="flex w-full bg-white border border-gray-200 rounded-md p-4">
          <div className="flex h-70 flex-col w-full justify-center items-center">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lifecycleDist}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={75}
                    dataKey="value"
                    label={renderLabel}
                    labelLine={true}
                  >
                    {lifecycleDist.map((_, i) => {
                      return (
                        <Cell
                          key={`cell-${i}`}
                          fill={LIFECYCLE_COLORS[i % LIFECYCLE_COLORS.length]}
                        />
                      );
                    })}
                  </Pie>
                  {/* <Tooltip content={<CustomTooltipV1 />} /> */}
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="square"
                    iconSize={12}
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-400">
                No order status data available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
