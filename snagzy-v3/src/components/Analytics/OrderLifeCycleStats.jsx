import { useState, useMemo } from "react";
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
import { OrderLifeCycleStatsBoxes } from "./OrderLifeCycleStatsBoxes";
import { OrderLifeCycleChart } from "./OrderLifeCycleChart";
import { DisplayedOrders } from "./DisplayedOrders";
import { useData } from "../../context/DataContext";
import { useLocation, useSearchParams } from "react-router-dom";

const ITEM_INCREMENT = 2;

export const OrderLifeCycleStats = ({
  processOrderLifeCycleData,
  analyticsData,
  activeOrderLifeCycleTab,
  onOrderLifeCycleViewChange,
  orderLifeCycleView,
  ordersLimit,
  setOrdersLimit,
  itemsLimits,
  setItemsLimits,
  defaultItemsCount = 3,
  count = 6,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderLifeCycleStatsViewOpen, setOrderLifeCycleStatsViewOpen] =
    useState(true);
  const { sumOrderQuantities, getAllAttributes } = useData();
  const attributes = getAllAttributes();
  const location = useLocation();

  const toggleOrderLifeCycleStats = () =>
    setOrderLifeCycleStatsViewOpen(!orderLifeCycleStatsViewOpen);

  // Pre-process data for each card
  const amountedData = (orderLifeCycleStatus) => {
    return processOrderLifeCycleData(orderLifeCycleStatus, analyticsData);
  };

  const getOrderData = () => {
    switch (activeOrderLifeCycleTab) {
      case "order_placed":
        return amountedData(statusCompleted).ordersToProcess;
      case "payment_pending":
        return amountedData(statusPaymentPending).ordersToProcess;
      case "payment_confirmed":
        return amountedData(statusPaymentConfirmed).ordersToProcess;
      case "processing":
        return amountedData(statusProcessing).ordersToProcess;
      case "packed":
        return amountedData(statusPacked).ordersToProcess;
      case "shipped":
        return amountedData(statusShipped).ordersToProcess;
      case "out_for_delivery":
        return amountedData(statusOutForDelivery).ordersToProcess;
      case "delivered":
        return amountedData(statusDelivered).ordersToProcess;
      case "completed":
        return amountedData(statusCompleted).ordersToProcess;
      case "cancelled_by_buyer":
        return amountedData(statusCancelledByBuyer).ordersToProcess;
      case "cancelled_by_seller":
        return amountedData(statusCancelledBySeller).ordersToProcess;
      case "delivery_failed":
        return amountedData(statusDeliveryFailed).ordersToProcess;
      case "attempted_delivery":
        return amountedData(statusAttemptedDelivery).ordersToProcess;
      case "return_request":
        return amountedData(statusReturnRequest).ordersToProcess;
      case "order_returned":
        return amountedData(statusOrderReturned).ordersToProcess;
      case "refund_success":
        return amountedData(statusRefundSuccess).ordersToProcess;
      default:
        return amountedData(statusDelivered).ordersToProcess;
    }
  };

  const orderData = getOrderData();

  const displayedOrders = useMemo(() => {
    return [...orderData]
      .sort((a, b) => {
        const dateA = new Date(a.currentStatus?.timestamp || 0);
        const dateB = new Date(b.currentStatus?.timestamp || 0);
        return dateB - dateA;
      })
      .slice(0, ordersLimit);
  }, [orderData, ordersLimit]);

  // Revenue stats clickable stat cards
  const handleOrderLifeCycleTbChange = (tab) => {
    const params = new URLSearchParams(searchParams);
    params.set("orderLifeCycleTab", tab);
    params.set("orders", count.toString());
    params.delete("itemLimits");
    setSearchParams(params);
  };

  const handleLoadMoreOrders = () => {
    const totalOrdersCount = orderData.length;
    const nextLimit = Math.min(ordersLimit + count, totalOrdersCount);
    setOrdersLimit(nextLimit);
  };

  const handleLoadMoreItems = (orderId, totalItems) => {
    const currentLimit = itemsLimits[orderId] || defaultItemsCount;
    const nextLimit = Math.min(currentLimit + ITEM_INCREMENT, totalItems);
    setItemsLimits((prev) => ({ ...prev, [orderId]: nextLimit }));
  };

  const handleResetItems = (orderId) => {
    setItemsLimits((prev) => {
      const updated = { ...prev };
      delete updated[orderId];
      return updated;
    });
  };

  const getButtonClasses = (isActive, isDisabled) => {
    const base = "flex rounded text-[12px] px-3 py-1 transition-colors";
    const modeClass = isActive
      ? "bg-gray-200 text-gray-700"
      : "bg-gray-100 text-gray-400";
    const interactiveClass = isDisabled
      ? "cursor-not-allowed"
      : "hover:bg-gray-200 cursor-pointer";
    return `${base} ${modeClass} ${interactiveClass}`;
  };

  return (
    <div className="flex flex-col w-full">
      <div
        className={`${orderLifeCycleStatsViewOpen ? "h-full" : "h-15"} bg-gray-50 w-full p-3 border border-[#C2C2C2] rounded-md transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <div className="flex relative items-center justify-between">
          <div className="flex">
            <h1 className="font-semibold text-md">Order Life Cycle Stats</h1>
          </div>

          <div className="flex gap-6 border-gray-300 items-center">
            <div className="flex gap-2">
              <button
                className={getButtonClasses(
                  orderLifeCycleView === "list",
                  !orderLifeCycleStatsViewOpen,
                )}
                onClick={() => onOrderLifeCycleViewChange("list")}
                disabled={!orderLifeCycleStatsViewOpen}
              >
                LIST
              </button>

              <button
                className={getButtonClasses(
                  orderLifeCycleView === "chart",
                  !orderLifeCycleStatsViewOpen,
                )}
                onClick={() => onOrderLifeCycleViewChange("chart")}
                disabled={!orderLifeCycleStatsViewOpen}
              >
                CHART
              </button>

              <button
                onClick={toggleOrderLifeCycleStats}
                className={`flex ${orderLifeCycleStatsViewOpen ? "bg-gray-200" : "bg-gray-100"} rounded px-1 py-1 hover:bg-gray-200 cursor-pointer`}
              >
                <IoIosArrowDown
                  height={16}
                  width={16}
                  className={`${orderLifeCycleStatsViewOpen ? "rotate-180" : ""} transition-all duration-300 ease-in-out`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Analytics boxes */}
        <OrderLifeCycleStatsBoxes
          onOrderLifeCycleTabChange={handleOrderLifeCycleTbChange}
          processOrderLifeCycleData={processOrderLifeCycleData}
          analyticsData={analyticsData}
          statusCompleted={statusCompleted}
          statusDelivered={statusDelivered}
          statusOrderPlaced={statusOrderPlaced}
          statusPaymentPending={statusPaymentPending}
          statusPaymentConfirmed={statusPaymentConfirmed}
          statusProcessing={statusProcessing}
          statusPacked={statusPacked}
          statusShipped={statusShipped}
          statusOutForDelivery={statusOutForDelivery}
          statusDeliveryFailed={statusDeliveryFailed}
          statusAttemptedDelivery={statusAttemptedDelivery}
          statusCancelledByBuyer={statusCancelledByBuyer}
          statusCancelledBySeller={statusCancelledBySeller}
          statusReturnRequest={statusReturnRequest}
          statusOrderReturned={statusOrderReturned}
          statusRefundSuccess={statusRefundSuccess}
        />

        {orderLifeCycleView === "chart" && (
          <OrderLifeCycleChart
            activeOrderLifeCycleTab={activeOrderLifeCycleTab}
            orderLifeCycle={orderLifeCycle}
            processOrderLifeCycleData={processOrderLifeCycleData}
            analyticsData={analyticsData}
          />
        )}

        {orderLifeCycleView === "list" && (
          <DisplayedOrders
            displayedOrders={displayedOrders}
            tableHeaderBg="#E5E7EB"
            itemsLimits={itemsLimits}
            onLoadMoreItems={handleLoadMoreItems}
            onResetItems={handleResetItems}
            ordersLimit={ordersLimit}
            totalOrdersCount={orderData.length}
            onLoadMoreOrders={handleLoadMoreOrders}
            defaultItemsCount={defaultItemsCount}
            attributes={attributes}
            location={location}
            sumOrderQuantities={sumOrderQuantities}
          />
        )}
      </div>
    </div>
  );
};
