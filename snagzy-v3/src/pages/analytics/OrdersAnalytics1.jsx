import { useMemo, useState } from "react";
import { useOrdersAnalytics } from "../../context/OrdersAnalyticsContext";
import { useSearchParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { RevenueStats } from "../../components/Analytics/RevenueStats";

export const OrdersAnalytics1 = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { ordersAnalyticsValue } = useOrdersAnalytics();
  const { getAllOrders } = useData();

  const count = 6;
  const ITEMS_COUNT = 3;

  // Helper functions to serialize/deserialize item limits for the URL
  const serializeItemLimits = (limitsObj) => {
    return Object.entries(limitsObj)
      .map(([id, lim]) => `${id}:${lim}`)
      .join(",");
  };

  const deserializeItemLimits = (str) => {
    if (!str) return {};
    const obj = {};
    str.split(",").forEach((pair) => {
      const [id, lim] = pair.split(":");
      if (id && lim) {
        obj[id] = parseInt(lim, 10);
      }
    });
    return obj;
  };

  const orders = getAllOrders();

  // --- FIX: Read directly from URL parameters (Single Source of Truth) ---
  const selectedYear = searchParams.get("year") || "all";
  const selectedMonth = searchParams.get("month") || "all";
  const selectedDay = searchParams.get("day") || "all";

  const urlOrders = parseInt(searchParams.get("orders") || "0");
  const urlRevenueTab = searchParams.get("revenueTab");
  const urlItemLimits = searchParams.get("itemLimits");

  // Keep internal states for pagination/limits, as these are local component view states
  const [ordersParams, setOrdersParams] = useState(urlOrders || count);
  const [itemsLimitsParams, setItemsLimitsParams] = useState(() =>
    deserializeItemLimits(urlItemLimits),
  );

  // RevenueStats tab state from URL params
  const [activeRevenueTab, setActiveRevenueTab] = useState(() => {
    return urlRevenueTab &&
      ["total-sales", "pending-sales", "cancellations"].includes(urlRevenueTab)
      ? urlRevenueTab
      : "total-sales";
  });

  // Filter orders based on URL parameters directly
  const filteredOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];

    let result = [...orders];

    if (selectedYear !== "all") {
      result = result.filter((order) => {
        const date = new Date(order.currentStatus.timestamp);
        return date.getFullYear() === parseInt(selectedYear);
      });
    }

    if (selectedMonth !== "all") {
      result = result.filter((order) => {
        const date = new Date(order.currentStatus.timestamp);
        return date.getMonth() === parseInt(selectedMonth);
      });
    }

    if (
      selectedDay !== "all" &&
      selectedYear !== "all" &&
      selectedMonth !== "all"
    ) {
      result = result.filter((order) => {
        const date = new Date(order.currentStatus.timestamp);
        return date.getDate() === parseInt(selectedDay);
      });
    }

    result.sort(
      (a, b) =>
        new Date(b.currentStatus.timestamp) -
        new Date(a.currentStatus.timestamp),
    );

    return result;
  }, [orders, selectedYear, selectedMonth, selectedDay]);

  const analyticsData =
    selectedYear !== "all" || selectedMonth !== "all" || selectedDay !== "all"
      ? filteredOrders
      : orders;

  const processOrderLifeCycleData = (statusSlug, data) => {
    const ordersToProcess = ordersAnalyticsValue.getOrdersByStatusSlug(
      statusSlug,
      data,
    );

    const sumOfTotalPrices = ordersToProcess.reduce((sum, order) => {
      const raw = order?.summary?.orderTotalPrice;
      const price = Number(raw || 0);
      return sum + (isNaN(price) ? 0 : price);
    }, 0);

    const sumOfAllQuantities =
      ordersAnalyticsValue.getSumOrderedItemsQuantity(ordersToProcess);

    return { ordersToProcess, sumOfTotalPrices, sumOfAllQuantities };
  };

  const handleRevenueTabChange = (tab) => {
    setActiveRevenueTab(tab);
    setOrdersParams(count);
    setItemsLimitsParams({});
  };

  return (
    <div className="flex flex-col w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
      <div className="flex w-full flex-col gap-2">
        <RevenueStats
          processOrderLifeCycleData={processOrderLifeCycleData}
          analyticsData={analyticsData}
          activeTab={activeRevenueTab}
          onTabChange={handleRevenueTabChange}
          ordersLimit={ordersParams}
          setOrdersLimit={setOrdersParams}
          itemsLimits={itemsLimitsParams}
          setItemsLimits={setItemsLimitsParams}
          defaultItemsCount={ITEMS_COUNT}
          count={count}
        />
        <div className="flex w-full bg-white border border-[#C2C2C2] rounded-md">
          <div className="flex p-2">OrdersAnalytics</div>
        </div>
      </div>
    </div>
  );
};
