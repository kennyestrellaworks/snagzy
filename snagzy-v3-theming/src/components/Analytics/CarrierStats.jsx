import React from "react";
import { useTopAnalytics } from "../../context/TopAnalyticsContext";
import { useData } from "../../context/DataContext";

export const CarrierStats = ({ analyticsData }) => {
  const { getAllShippingMethods } = useData();
  const { topAnalyticsValue } = useTopAnalytics();

  const carrierDist = topAnalyticsValue.getCarrierDist(analyticsData);
  const shippingMethods = getAllShippingMethods();

  // console.log("shippingMethods", shippingMethods);

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
        <h2 className="text-md font-bold text-gray-900">Carriers</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Orders fulfilled per carrier
        </p>
      </div>

      <div className="flex items-start w-full h-full gap-6 ">
        <div className="flex w-full bg-white border border-gray-200 rounded-md p-4">
          <div className="flex h-70 flex-col w-full gap-3">
            {carrierDist.map((c, i) => {
              const pct = Math.round((c.value / analyticsData.length) * 100);
              return (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {c.name}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {c.value}{" "}
                      <span className="text-gray-600 font-normal text-xs">
                        ({pct}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor:
                          PAYMENT_COLORS[i % PAYMENT_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* <div className="space-y-3 flex-1 overflow-y-auto max-h-full pr-1">
        {carrierDist.map((c, i) => {
          const pct = Math.round((c.value / analyticsData.length) * 100);
          return (
            <div key={c.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {c.name}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {c.value}{" "}
                  <span className="text-gray-400 font-normal text-xs">
                    ({pct}%)
                  </span>
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: PAYMENT_COLORS[i % PAYMENT_COLORS.length],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div> */}
    </div>
  );
};
