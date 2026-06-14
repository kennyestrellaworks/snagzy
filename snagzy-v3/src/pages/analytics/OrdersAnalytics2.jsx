import { useMemo } from "react";
import { useOrdersAnalytics } from "../../context/OrdersAnalyticsContext";
import { useSearchParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { RevenueStats } from "../../components/Analytics/RevenueStats";
import { OrderLifeCycleStats } from "../../components/Analytics/OrderLifeCycleStats";

export const OrdersAnalytics2 = () => {
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

  // Get all URL params
  const selectedYear = searchParams.get("year") || "all";
  const selectedMonth = searchParams.get("month") || "all";
  const selectedDay = searchParams.get("day") || "all";

  const urlOrders = parseInt(searchParams.get("orders") || "0");

  const urlRevenueTab = searchParams.get("revenueTab");
  const urlOrderLifeCycleTab = searchParams.get("orderLifeCycleTab");

  const urlItemLimits = searchParams.get("itemLimits");

  const urlRevenueStatsView = searchParams.get("revenueStatsView");
  const revenueStatsViewParams =
    urlRevenueStatsView === "chart" ? "chart" : "list";
  const urlorderLifeCycleView = searchParams.get("orderLifeCycleView");
  const orderLifeCycleViewParams =
    urlorderLifeCycleView === "chart" ? "chart" : "list";

  // Derive value settings directly from URL instead of local state hooks
  const ordersParams = urlOrders || count;

  const itemsLimitsParams = useMemo(() => {
    return deserializeItemLimits(urlItemLimits);
  }, [urlItemLimits]);

  // Single Source of truth derived directly from URL for the tab selection
  const activeRevenueTab = useMemo(() => {
    // urlRevenueTab = "total-sales", "pending-sales", "cancellations"
    return urlRevenueTab &&
      ["total-sales", "pending-sales", "cancellations"].includes(urlRevenueTab)
      ? urlRevenueTab
      : "total-sales";
  }, [urlRevenueTab]);

  // Single Source of truth derived directly from URL for the tab selection
  const activeOrderLifeCycleTab = useMemo(() => {
    return urlOrderLifeCycleTab &&
      [
        "completed",
        "delivered",
        "order_placed",
        "payment_pending",
        "payment_confirmed",
        "processing",
        "packed",
        "shipped",
        "out_for_delivery",
        "delivery_failed",
        "attempted_delivery",
        "cancelled_by_buyer",
        "cancelled_by_buyer",
        "cancelled_by_seller",
        "return_request",
        "order_returned",
        "refund_success",
      ].includes(urlOrderLifeCycleTab)
      ? urlOrderLifeCycleTab
      : "completed";
  }, [urlOrderLifeCycleTab]);

  // Filter orders based on selected year, month, and day
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

  // Revenue stats clickable stat cards
  const handleRevenueTabChange = (tab) => {
    const params = new URLSearchParams(searchParams);
    params.set("revenueTab", tab);
    params.set("orders", count.toString());
    params.delete("itemLimits");
    setSearchParams(params);
  };

  // Order life cycle clickable start cards
  const handleOrderLifeCycleTabChange = (tab) => {
    const params = new URLSearchParams(searchParams);
    params.set("orderLifeCycleTab", tab);
    params.set("orders", count.toString());
    params.delete("itemLimits");
    setSearchParams(params);
  };

  const handleRevenueStatsViewChange = (view) => {
    const params = new URLSearchParams(searchParams);
    if (view === "list") {
      params.delete("revenueStatsView");
    } else {
      params.set("revenueStatsView", view);
    }
    setSearchParams(params);
  };

  const handleOrderLifeCycleViewChange = (view) => {
    const params = new URLSearchParams(searchParams);
    if (view === "list") {
      params.delete("orderLifeCycleView");
    } else {
      params.set("orderLifeCycleView", view);
    }
    setSearchParams(params);
  };

  // Directly push modifications into browser query history
  const handleSetOrdersLimit = (nextLimitValue) => {
    const params = new URLSearchParams(searchParams);
    // If nextLimit is a functional updater, evaluate it using the current parameter value
    const nextLimit =
      typeof nextLimitValue === "function"
        ? nextLimitValue(ordersParams)
        : nextLimitValue;
    params.set("orders", nextLimit.toString());
    setSearchParams(params);
  };

  const handleSetItemsLimits = (nextLimitsValue) => {
    const params = new URLSearchParams(searchParams);
    const nextLimits =
      typeof nextLimitsValue === "function"
        ? nextLimitsValue(itemsLimitsParams)
        : nextLimitsValue;

    const serializedStr = serializeItemLimits(nextLimits);
    if (serializedStr) {
      params.set("itemLimits", serializedStr);
    } else {
      params.delete("itemLimits");
    }
    setSearchParams(params);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full flex-col gap-2">
        <RevenueStats
          processOrderLifeCycleData={processOrderLifeCycleData}
          analyticsData={analyticsData}
          activeRevenueTab={activeRevenueTab}
          onRevenueTabClick={handleRevenueTabChange}
          onRevenueStatsViewChange={handleRevenueStatsViewChange}
          revenueStatsView={revenueStatsViewParams}
          ordersLimit={ordersParams}
          setOrdersLimit={handleSetOrdersLimit}
          itemsLimits={itemsLimitsParams}
          setItemsLimits={handleSetItemsLimits}
          defaultItemsCount={ITEMS_COUNT}
          count={count}
        />
        <OrderLifeCycleStats
          processOrderLifeCycleData={processOrderLifeCycleData}
          analyticsData={analyticsData}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
          onOrderLifeCycleTabClick={handleOrderLifeCycleTabChange}
          onOrderLifeCycleViewChange={handleOrderLifeCycleViewChange}
          orderLifeCycleView={orderLifeCycleViewParams}
          ordersLimit={ordersParams}
          setOrdersLimit={handleSetOrdersLimit}
          itemsLimits={itemsLimitsParams}
          setItemsLimits={handleSetItemsLimits}
          defaultItemsCount={ITEMS_COUNT}
          count={count}
        />
      </div>
    </div>
  );
};
