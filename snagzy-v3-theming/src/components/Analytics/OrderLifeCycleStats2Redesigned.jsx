import { useState } from "react";
import { IoIosArrowDown } from "../SVG";
import {
  statusCompleted,
  statusDelivered,
  statusOrderPlaced,
  statusPaymentPending,
  statusPaymentConfirmed,
  statusProcessing,
  statusPacked,
  statusShipped,
  statusOutForDelivery,
  statusDeliveryFailed,
  statusAttemptedDelivery,
  statusCancelledByBuyer,
  statusCancelledBySeller,
  statusReturnRequest,
  statusOrderReturned,
  statusRefundSuccess,
  orderLifeCycle,
} from "../../data/orderLifeCycle";
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
import { MiniAnalyticsStatCard } from "./AnalyticsStatCards";
import { amountToDecimal, formatWithCommas } from "../../utils/helpers";

export const OrderLifeCycleStats2Redesigned = ({
  processOrderLifeCycleData,
  analyticsData,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => setIsOpen(!isOpen);

  // Grouped status mappings for rendering clean clean layouts
  const statCardsConfig = [
    {
      target: statusCompleted,
      label: "Completed",
      style:
        "bg-emerald-50/60 border-emerald-100 hover:border-emerald-200 text-emerald-900",
    },
    {
      target: statusDelivered,
      label: "Delivered",
      style:
        "bg-teal-50/60 border-teal-100 hover:border-teal-200 text-teal-900",
    },
    {
      target: statusOrderPlaced,
      label: "Order Placed",
      style:
        "bg-slate-50/60 border-slate-100 hover:border-slate-200 text-slate-800",
    },
    {
      target: statusPaymentPending,
      label: "Payment Pending",
      style:
        "bg-slate-50/60 border-slate-100 hover:border-slate-200 text-slate-800",
    },
    {
      target: statusPaymentConfirmed,
      label: "Payment Confirmed",
      style:
        "bg-slate-50/60 border-slate-100 hover:border-slate-200 text-slate-800",
    },
    {
      target: statusProcessing,
      label: "Processing",
      style:
        "bg-slate-50/60 border-slate-100 hover:border-slate-200 text-slate-800",
    },
    {
      target: statusPacked,
      label: "Packed",
      style:
        "bg-slate-50/60 border-slate-100 hover:border-slate-200 text-slate-800",
    },
    {
      target: statusShipped,
      label: "Shipped",
      style:
        "bg-slate-50/60 border-slate-100 hover:border-slate-200 text-slate-800",
    },
    {
      target: statusOutForDelivery,
      label: "Out For Delivery",
      style:
        "bg-slate-50/60 border-slate-100 hover:border-slate-200 text-slate-800",
    },
    {
      target: statusDeliveryFailed,
      label: "Delivery Failed",
      style:
        "bg-amber-50/40 border-amber-100 hover:border-amber-200 text-amber-900",
    },
    {
      target: statusAttemptedDelivery,
      label: "Attempted Delivery",
      style:
        "bg-amber-50/40 border-amber-100 hover:border-amber-200 text-amber-900",
    },
    {
      target: statusCancelledByBuyer,
      label: "Cancelled by Buyer",
      style:
        "bg-rose-50/40 border-rose-100 hover:border-rose-200 text-rose-900",
    },
    {
      target: statusCancelledBySeller,
      label: "Cancelled by Seller",
      style:
        "bg-rose-50/40 border-rose-100 hover:border-rose-200 text-rose-900",
    },
    {
      target: statusReturnRequest,
      label: "Return Request",
      style:
        "bg-rose-50/40 border-rose-100 hover:border-rose-200 text-rose-900",
    },
    {
      target: statusOrderReturned,
      label: "Returned",
      style:
        "bg-rose-50/40 border-rose-100 hover:border-rose-200 text-rose-900",
    },
    {
      target: statusRefundSuccess,
      label: "Returned Success",
      style:
        "bg-rose-50/40 border-rose-100 hover:border-rose-200 text-rose-900",
    },
  ];

  return (
    <div className="w-full px-4 py-3">
      <div
        className={`w-full p-5 bg-white border border-slate-200/80 rounded-xl shadow-sm transition-all duration-300 ease-in-out ${
          isOpen ? "h-full" : "h-16 overflow-hidden"
        }`}
      >
        {/* Module Title Row */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h1 className="font-semibold text-lg text-slate-800 tracking-tight">
            Order Life Cycle Stats
          </h1>
          <button
            onClick={toggleOpen}
            className={`p-1.5 rounded-lg transition-colors duration-200 cursor-pointer ${
              isOpen
                ? "bg-slate-100 text-slate-600"
                : "bg-slate-50 text-slate-400 hover:bg-slate-100"
            }`}
          >
            <IoIosArrowDown
              height={18}
              width={18}
              className={`transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Mini Analytics grid panels */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 mt-5">
          {statCardsConfig.map((card, idx) => (
            <MiniAnalyticsStatCard
              key={idx}
              miniAnalyticsData={processOrderLifeCycleData(
                card.target,
                analyticsData,
              )}
              boxTitle={card.label}
              boxStyle={`border rounded-xl shadow-2xs p-3 transition-all duration-200 hover:shadow-xs ${card.style}`}
            />
          ))}
        </div>

        {/* Data Visualization Chart Layout Wrapper */}
        <div className="w-full mt-6">
          <div className="w-full p-4 bg-slate-50/40 border border-slate-200 rounded-xl shadow-inner">
            <div className="w-full bg-white p-4 rounded-lg shadow-2xs border border-slate-100">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={orderLifeCycle.map((status) => {
                    const {
                      ordersToProcess,
                      sumOfTotalPrices,
                      sumOfAllQuantities,
                    } = processOrderLifeCycleData([status.slug], analyticsData);
                    return {
                      name: status.label,
                      Orders: ordersToProcess?.length || 0,
                      Revenue: amountToDecimal(sumOfTotalPrices) || 0,
                      Items: formatWithCommas(sumOfAllQuantities) || 0,
                    };
                  })}
                  margin={{ top: 20, right: 15, left: 0, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f1f5f9"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={90}
                    interval={0}
                    tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                    stroke="#cbd5e1"
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    stroke="#cbd5e1"
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    stroke="#cbd5e1"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      borderColor: "#e2e8f0",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    labelStyle={{
                      fontWeight: 600,
                      color: "#1e293b",
                      marginBottom: "4px",
                    }}
                    formatter={(value, name) => {
                      if (name === "Revenue")
                        return [`$${amountToDecimal(value)}`, name];
                      return [value, name];
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={40}
                    wrapperStyle={{
                      paddingBottom: "20px",
                      fontSize: "13px",
                      fontWeight: 500,
                    }}
                  />
                  {/* Refined chart palette colors: Indigo, Emerald, Amber */}
                  <Bar
                    yAxisId="left"
                    dataKey="Orders"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    barSize={24}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="Revenue"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    barSize={24}
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="Items"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
