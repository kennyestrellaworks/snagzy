import { amountToDecimal } from "../../utils/helpers";

export const CustomTooltipV1 = ({ active, payload, label, prefix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p
          key={i}
          style={{ color: p.color }}
          className="flex items-center gap-1"
        >
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: p.color }}
          />
          {p.name}:{" "}
          <span className="font-semibold ml-1">
            {prefix}
            {typeof p.value === "number"
              ? p.value.toLocaleString("en-US", {
                  minimumFractionDigits: p.name
                    ?.toLowerCase()
                    .includes("revenue")
                    ? 2
                    : 0,
                })
              : p.value}
          </span>
        </p>
      ))}
    </div>
  );
};

export const CustomTooltipV2 = ({ active, payload, lifecycleDist }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900">{data.name}</p>
        <p className="text-sm text-gray-600">Orders: {data.value}</p>
        <p className="text-sm text-gray-600">
          Revenue: ${amountToDecimal(data.revenue)}
        </p>
        <p className="text-sm text-gray-600">
          Percentage:{" "}
          {(
            (data.value / lifecycleDist.reduce((sum, d) => sum + d.value, 0)) *
            100
          ).toFixed(1)}
          %
        </p>
      </div>
    );
  }
  return null;
};
