// RevenueStats.jsx (refactored)
import { useState, useMemo } from "react";
import { useData } from "../../context/DataContext";
import { IoIosArrowDown } from "../../components/SVG";
import {
  DollarSign,
  TbCalendarDollar,
  TbCurrencyDollarOff,
} from "../../components/SVG";
import { AnalyticsStatCardMedium } from "../../components/Analytics/AnalyticsStatCards";
import {
  successfulOrderStatuses,
  pendingOrderStatuses,
  unsuccessfulOrderStatuses,
} from "../../data/orderLifeCycle";
import { RevenueOverTimeChart } from "./RevenueOverTimeChart";
import { DisplayedOrders } from "./DisplayedOrders";
import { useLocation } from "react-router-dom";
import { TopByNumberStats } from "./TopByNumberStats";
import { getButtonClasses } from "../../utils/helpers";

const ITEM_INCREMENT = 2;

export const RevenueStats = ({
  processOrderLifeCycleData,
  analyticsData,
  activeRevenueTab,
  onRevenueTabClick,
  onRevenueStatsViewChange,
  revenueStatsView,
  ordersLimit,
  setOrdersLimit,
  itemsLimits,
  setItemsLimits,
  defaultItemsCount = 3,
  count = 6,
  // Top limits (from URL via parent)
  revenueTopProducts = 5,
  onRevenueTopProductsChange,
  revenueTopBuyers = 5,
  onRevenueTopBuyersChange,
  revenueTopStores = 5,
  onRevenueTopStoresChange,
}) => {
  const [revenueStatsOpen, setRevenueStatsOpen] = useState(true);
  const { sumOrderQuantities, getAllAttributes } = useData();
  const attributes = getAllAttributes();
  const location = useLocation();

  const toggleRevenueStats = () => setRevenueStatsOpen(!revenueStatsOpen);

  // Pre-process data for each card
  const amountedData = (orderLifeCycleStatus) => {
    return processOrderLifeCycleData(orderLifeCycleStatus, analyticsData);
  };

  const getOrderData = () => {
    switch (activeRevenueTab) {
      case "total-sales":
        return amountedData(successfulOrderStatuses).ordersToProcess;
      case "pending-sales":
        return amountedData(pendingOrderStatuses).ordersToProcess;
      case "cancellations":
        return amountedData(unsuccessfulOrderStatuses).ordersToProcess;
      default:
        return amountedData(successfulOrderStatuses).ordersToProcess;
    }
  };

  const orderData = getOrderData();

  const tableHeaderBg = useMemo(() => {
    switch (activeRevenueTab) {
      case "total-sales":
        return "#22c55e";
      case "pending-sales":
        return "#fbbf24";
      case "cancellations":
        return "#ef4444";
      default:
        return "#22c55e";
    }
  }, [activeRevenueTab]);

  const displayedOrders = useMemo(() => {
    return [...orderData]
      .sort((a, b) => {
        const dateA = new Date(a.currentStatus?.timestamp || 0);
        const dateB = new Date(b.currentStatus?.timestamp || 0);
        return dateB - dateA;
      })
      .slice(0, ordersLimit);
  }, [orderData, ordersLimit]);

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
        className={`${revenueStatsOpen ? "h-full" : "h-15"} bg-gray-50 w-full p-3 border border-[#C2C2C2] rounded-md transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <div className="flex relative items-center justify-between">
          <div className="flex">
            <h1 className="font-semibold text-md">Revenue Stats</h1>
          </div>
          <div className="flex border-gray-300 items-center">
            <div className="flex gap-2">
              <button
                className={getButtonClasses(
                  revenueStatsView === "ranking",
                  !revenueStatsOpen,
                )}
                onClick={() => onRevenueStatsViewChange("ranking")}
                disabled={!revenueStatsOpen}
              >
                RANKING
              </button>

              <button
                className={getButtonClasses(
                  revenueStatsView === "list",
                  !revenueStatsOpen,
                )}
                onClick={() => onRevenueStatsViewChange("list")}
                disabled={!revenueStatsOpen}
              >
                LIST
              </button>

              <button
                className={getButtonClasses(
                  revenueStatsView === "chart",
                  !revenueStatsOpen,
                )}
                onClick={() => onRevenueStatsViewChange("chart")}
                disabled={!revenueStatsOpen}
              >
                CHART
              </button>

              <button
                onClick={toggleRevenueStats}
                className={`flex ${revenueStatsOpen ? "bg-gray-200" : "bg-gray-100"} rounded px-1 py-1 hover:bg-gray-200 cursor-pointer`}
              >
                <IoIosArrowDown
                  height={16}
                  width={16}
                  className={`${revenueStatsOpen ? "rotate-180" : ""} transition-all duration-300 ease-in-out`}
                />
              </button>
            </div>
          </div>
        </div>

        {revenueStatsOpen && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-4 mt-4 cursor-pointer">
              <div onClick={() => onRevenueTabClick("total-sales")}>
                <AnalyticsStatCardMedium
                  miniAnalyticsData={amountedData(successfulOrderStatuses)}
                  boxTitle="Total Sales"
                  boxStyle={`bg-green-100 border-green-500 ${
                    activeRevenueTab === "total-sales"
                      ? "ring-2 ring-green-500 ring-offset-2"
                      : ""
                  } transition-all duration-200`}
                  icon={DollarSign}
                  iconStyle="bg-green-600 text-white"
                  amountStyle="text-green-600"
                />
              </div>
              <div onClick={() => onRevenueTabClick("pending-sales")}>
                <AnalyticsStatCardMedium
                  miniAnalyticsData={amountedData(pendingOrderStatuses)}
                  boxTitle="Pending Sales"
                  boxStyle={`bg-amber-100 border-amber-400 ${
                    activeRevenueTab === "pending-sales"
                      ? "ring-2 ring-amber-500 ring-offset-2"
                      : ""
                  } transition-all duration-200`}
                  icon={TbCalendarDollar}
                  iconStyle="bg-amber-600 text-white"
                  amountStyle="text-amber-600"
                />
              </div>
              <div onClick={() => onRevenueTabClick("cancellations")}>
                <AnalyticsStatCardMedium
                  miniAnalyticsData={amountedData(unsuccessfulOrderStatuses)}
                  boxTitle="Cancellations"
                  boxStyle={`bg-red-100 border-red-400 ${
                    activeRevenueTab === "cancellations"
                      ? "ring-2 ring-red-500 ring-offset-2"
                      : ""
                  } transition-all duration-200`}
                  icon={TbCurrencyDollarOff}
                  iconStyle="bg-red-600 text-white"
                  amountStyle="text-red-600"
                />
              </div>
            </div>

            {revenueStatsView === "chart" && (
              <RevenueOverTimeChart
                totalSalesData={amountedData(successfulOrderStatuses)}
                pendingSalesData={amountedData(pendingOrderStatuses)}
                cancellationsData={amountedData(unsuccessfulOrderStatuses)}
              />
            )}

            {revenueStatsView === "list" && (
              <DisplayedOrders
                displayedOrders={displayedOrders}
                tableHeaderBg={tableHeaderBg}
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

            {revenueStatsView === "ranking" && (
              <TopByNumberStats
                analyticsData={analyticsData}
                topLimitProducts={revenueTopProducts}
                setTopLimitProducts={onRevenueTopProductsChange}
                topLimitBuyers={revenueTopBuyers}
                setTopLimitBuyers={onRevenueTopBuyersChange}
                topLimitStores={revenueTopStores}
                setTopLimitStores={onRevenueTopStoresChange}
                activeOrderLifeCycleTab={activeRevenueTab}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
