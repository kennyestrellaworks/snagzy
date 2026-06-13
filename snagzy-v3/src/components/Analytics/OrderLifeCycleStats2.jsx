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
import { AnalyticsStatCardMiniV2 } from "./AnalyticsStatCards";
import { amountToDecimal, formatWithCommas } from "../../utils/helpers";

export const OrderLifeCycleStats2 = ({
  processOrderLifeCycleData,
  analyticsData,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="flex mt-2 w-full pl-2 pr-2 pb-2">
      <div
        className={`${isOpen ? "h-full" : "h-15"} w-full p-3 bg-gray-50 border border-gray-200 rounded-md transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <div className="flex relative items-center justify-between">
          <div className="flex">
            <h1 className="font-semibold text-md">Order Life Cycle Stats</h1>
          </div>

          <div className="flex gap-6 border-gray-300 items-center">
            <div className="flex">
              <button
                onClick={toggleOpen}
                className={`flex ${isOpen ? "bg-gray-200" : "bg-gray-100"} rounded px-1 py-1 hover:bg-gray-200 cursor-pointer`}
              >
                <IoIosArrowDown
                  height={16}
                  width={16}
                  className={`${isOpen ? "rotate-180" : ""} transition-all duration-300 ease-in-out`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Analytics boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 mt-4">
          <AnalyticsStatCardMiniV2
            miniAnalyticsData={processOrderLifeCycleData(
              statusCompleted,
              analyticsData,
            )}
            boxTitle={"Completed"}
            boxStyle={"bg-green-200 border-green-400"}
          />
          <AnalyticsStatCardMiniV2
            miniAnalyticsData={processOrderLifeCycleData(
              statusDelivered,
              analyticsData,
            )}
            boxTitle={"Delivered"}
            boxStyle={"bg-lime-200 border-lime-400"}
          />
          <AnalyticsStatCardMiniV2
            miniAnalyticsData={processOrderLifeCycleData(
              statusOrderPlaced,
              analyticsData,
            )}
            boxTitle={"Order Placed"}
            boxStyle={"bg-amber-100 border-amber-200"}
          />
          <AnalyticsStatCardMiniV2
            miniAnalyticsData={processOrderLifeCycleData(
              statusPaymentPending,
              analyticsData,
            )}
            boxTitle={"Payment Pending"}
            boxStyle={"bg-amber-100 border-amber-200"}
          />
          <AnalyticsStatCardMiniV2
            miniAnalyticsData={processOrderLifeCycleData(
              statusPaymentConfirmed,
              analyticsData,
            )}
            boxTitle={"Payment Confirmed"}
            boxStyle={"bg-amber-100 border-amber-200"}
          />
          <AnalyticsStatCardMiniV2
            miniAnalyticsData={processOrderLifeCycleData(
              statusProcessing,
              analyticsData,
            )}
            boxTitle={"Processing"}
            boxStyle={"bg-amber-100 border-amber-200"}
          />
          <AnalyticsStatCardMiniV2
            miniAnalyticsData={processOrderLifeCycleData(
              statusPacked,
              analyticsData,
            )}
            boxTitle={"Packed"}
            boxStyle={"bg-amber-100 border-amber-200"}
          />
          <AnalyticsStatCardMiniV2
            miniAnalyticsData={processOrderLifeCycleData(
              statusShipped,
              analyticsData,
            )}
            boxTitle={"Shipped"}
            boxStyle={"bg-amber-100 border-amber-200"}
          />
          <AnalyticsStatCardMiniV2
            miniAnalyticsData={processOrderLifeCycleData(
              statusOutForDelivery,
              analyticsData,
            )}
            boxTitle={"Out For Delivery"}
            boxStyle={"bg-amber-100 border-amber-200"}
          />
          <AnalyticsStatCardMiniV2
            miniAnalyticsData={processOrderLifeCycleData(
              statusDeliveryFailed,
              analyticsData,
            )}
            boxTitle={"Delivery Failed"}
            boxStyle={"bg-amber-100 border-amber-200"}
          />
          <AnalyticsStatCardMiniV2
            miniAnalyticsData={processOrderLifeCycleData(
              statusAttemptedDelivery,
              analyticsData,
            )}
            boxTitle={"Attempted Delivery"}
            boxStyle={"bg-amber-100 border-amber-200"}
          />
          <AnalyticsStatCardMiniV2
            miniAnalyticsData={processOrderLifeCycleData(
              statusCancelledByBuyer,
              analyticsData,
            )}
            boxTitle={"Cancelled by Buyer"}
            boxStyle={"bg-red-100 border-red-200"}
          />
          <AnalyticsStatCardMiniV2
            miniAnalyticsData={processOrderLifeCycleData(
              statusCancelledBySeller,
              analyticsData,
            )}
            boxTitle={"Cancelled by Seller"}
            boxStyle={"bg-red-100 border-red-200"}
          />
          <AnalyticsStatCardMiniV2
            miniAnalyticsData={processOrderLifeCycleData(
              statusReturnRequest,
              analyticsData,
            )}
            boxTitle={"Return Request"}
            boxStyle={"bg-red-100 border-red-200"}
          />
          <AnalyticsStatCardMiniV2
            miniAnalyticsData={processOrderLifeCycleData(
              statusOrderReturned,
              analyticsData,
            )}
            boxTitle={"Returned"}
            boxStyle={"bg-red-100 border-red-200"}
          />
          <AnalyticsStatCardMiniV2
            miniAnalyticsData={processOrderLifeCycleData(
              statusRefundSuccess,
              analyticsData,
            )}
            boxTitle={"Returned Success"}
            boxStyle={"bg-red-100 border-red-200"}
          />
        </div>

        {/* Bar chart */}
        <div className="flex w-full mt-2">
          <div className="w-full p-3 border border-gray-200 rounded-md transition-all duration-300 ease-in-out overflow-hidden">
            <div className="w-full">
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
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value, name) => {
                      if (name === "Revenue")
                        return [`$${amountToDecimal(value)}`, name];
                      return [value, name];
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "60px",
                      marginTop: "20px",
                    }}
                  />
                  <Bar yAxisId="left" dataKey="Orders" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="Revenue" fill="#82ca9d" />
                  <Bar yAxisId="left" dataKey="Items" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
