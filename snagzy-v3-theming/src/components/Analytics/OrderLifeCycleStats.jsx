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
  successfulOrderStatuses,
  pendingOrderStatuses,
  unsuccessfulOrderStatuses,
} from "../../data/orderLifeCycle";
import { OrderLifeCycleStatsBoxes } from "./OrderLifeCycleStatsBoxes";
import { OrderLifeCycleChart } from "./OrderLifeCycleChart";
import { DisplayedOrders } from "./DisplayedOrders";
import { useData } from "../../context/DataContext";
import { useLocation } from "react-router-dom";
import { TopByNumberStats } from "./TopByNumberStats";
import { getButtonClasses } from "../../utils/helpers";

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
  // Top limits (from URL via parent)
  orderLifeCycleTopProducts = 5,
  onOrderLifeCycleTopProductsChange,
  orderLifeCycleTopBuyers = 5,
  onOrderLifeCycleTopBuyersChange,
  orderLifeCycleTopStores = 5,
  onOrderLifeCycleTopStoresChange,
}) => {
  const [orderLifeCycleStatsViewOpen, setOrderLifeCycleStatsViewOpen] =
    useState(true);
  const { sumOrderQuantities, getAllAttributes } = useData();
  const attributes = getAllAttributes();
  const location = useLocation();

  const toggleOrderLifeCycleStats = () =>
    setOrderLifeCycleStatsViewOpen(!orderLifeCycleStatsViewOpen);

  // Determine table header background color (hex) based on active tab's status group
  const getTableHeaderBgColor = (status) => {
    if (successfulOrderStatuses.includes(status)) return "#22c55e"; // green-500
    if (pendingOrderStatuses.includes(status)) return "#fbbf24"; // amber-400
    if (unsuccessfulOrderStatuses.includes(status)) return "#ef4444"; // red-500
    return "#9ca3af"; // gray-400 fallback
  };

  const tableHeaderBgColor = getTableHeaderBgColor(activeOrderLifeCycleTab);

  // Pre-process data for each card
  const amountedData = (orderLifeCycleStatus) => {
    return processOrderLifeCycleData(orderLifeCycleStatus, analyticsData);
  };

  const getOrderData = () => {
    switch (activeOrderLifeCycleTab) {
      case "order_placed":
        return amountedData(statusOrderPlaced).ordersToProcess;
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

  const handleOrderLifeCycleTabChange = (tab) => {
    // This is used by OrderLifeCycleStatsBoxes; we reuse the same handler pattern
    const params = new URLSearchParams(window.location.search);
    params.set("orderLifeCycleTab", tab);
    params.set("orders", count.toString());
    params.delete("itemLimits");
    window.history.pushState({}, "", `?${params.toString()}`);
    // Force re-render by calling the parent's handler? Actually we rely on URL changes.
    // For simplicity, we assume the parent component will handle URL changes.
    // But the parent already passed onOrderLifeCycleTabChange? Wait, we don't have that prop.
    // In the original, the parent passed onOrderLifeCycleTabClick, but that is not present here.
    // We'll keep the original behavior: the parent passes a tab change handler via props? Actually no.
    // Looking back at OrdersAnalytics, it passes onOrderLifeCycleViewChange, but not a tab click handler.
    // However OrderLifeCycleStatsBoxes expects onOrderLifeCycleTabChange. In the original file, it used handleOrderLifeCycleTbChange defined inside.
    // To keep consistency, we define a local function that updates URL directly.
    const event = new Event("popstate");
    window.dispatchEvent(event);
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
                  orderLifeCycleView === "ranking",
                  !orderLifeCycleStatsViewOpen,
                )}
                onClick={() => onOrderLifeCycleViewChange("ranking")}
                disabled={!orderLifeCycleStatsViewOpen}
              >
                RANKING
              </button>

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
          onOrderLifeCycleTabChange={handleOrderLifeCycleTabChange}
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
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
        />

        {orderLifeCycleView === "chart" && (
          <OrderLifeCycleChart
            orderLifeCycle={orderLifeCycle}
            processOrderLifeCycleData={processOrderLifeCycleData}
            analyticsData={analyticsData}
          />
        )}

        {orderLifeCycleView === "list" && (
          <DisplayedOrders
            displayedOrders={displayedOrders}
            tableHeaderBg={tableHeaderBgColor}
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

        {orderLifeCycleView === "ranking" && (
          <TopByNumberStats
            analyticsData={displayedOrders}
            topLimitProducts={orderLifeCycleTopProducts}
            setTopLimitProducts={onOrderLifeCycleTopProductsChange}
            topLimitBuyers={orderLifeCycleTopBuyers}
            setTopLimitBuyers={onOrderLifeCycleTopBuyersChange}
            topLimitStores={orderLifeCycleTopStores}
            setTopLimitStores={onOrderLifeCycleTopStoresChange}
            activeOrderLifeCycleTab={activeOrderLifeCycleTab}
          />
        )}
      </div>
    </div>
  );
};
