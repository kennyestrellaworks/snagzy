export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend && (
            <p
              className={`text-xs mt-2 ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend === "up" ? "↑" : "↓"} {Math.abs(trendValue).toFixed(1)}%
              from last month
            </p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};
