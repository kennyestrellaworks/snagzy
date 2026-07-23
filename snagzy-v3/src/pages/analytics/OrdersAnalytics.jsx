import { useMemo } from "react";
import { useOrdersAnalytics } from "../../context/OrdersAnalyticsContext";
import { useSearchParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { RevenueStats } from "../../components/Analytics/RevenueStats";
import { OrderLifeCycleStats } from "../../components/Analytics/OrderLifeCycleStats";

export const OrdersAnalytics = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { ordersAnalyticsValue } = useOrdersAnalytics();
  const { getAllOrders } = useData();

  const count = 6;
  const ITEMS_COUNT = 3;
  const DEFAULT_VIEW = "list"; // Centralized default view

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

  // ----- Top limits for Revenue Stats (URL persistence) -----
  const urlRevenueTopProducts = parseInt(
    searchParams.get("revenueTopProducts") || "5",
  );
  const urlRevenueTopBuyers = parseInt(
    searchParams.get("revenueTopBuyers") || "5",
  );
  const urlRevenueTopStores = parseInt(
    searchParams.get("revenueTopStores") || "5",
  );

  // ----- Top limits for Order Life Cycle Stats -----
  const urlOrderLifeCycleTopProducts = parseInt(
    searchParams.get("orderLifeCycleTopProducts") || "5",
  );
  const urlOrderLifeCycleTopBuyers = parseInt(
    searchParams.get("orderLifeCycleTopBuyers") || "5",
  );
  const urlOrderLifeCycleTopStores = parseInt(
    searchParams.get("orderLifeCycleTopStores") || "5",
  );

  // ----- DYNAMIC VIEW HANDLING -----
  const revenueStatsViewParams =
    searchParams.get("revenueStatsView") ?? DEFAULT_VIEW;
  const orderLifeCycleViewParams =
    searchParams.get("orderLifeCycleView") ?? DEFAULT_VIEW;

  // Derive value settings directly from URL
  const ordersParams = urlOrders || count;
  const itemsLimitsParams = useMemo(
    () => deserializeItemLimits(urlItemLimits),
    [urlItemLimits],
  );

  // Single Source of truth for tab selections
  const activeRevenueTab = useMemo(() => {
    return urlRevenueTab &&
      ["total-sales", "pending-sales", "cancellations"].includes(urlRevenueTab)
      ? urlRevenueTab
      : "total-sales";
  }, [urlRevenueTab]);

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

  const handleRevenueStatsViewChange = (view) => {
    const params = new URLSearchParams(searchParams);
    if (view === DEFAULT_VIEW) {
      params.delete("revenueStatsView");
    } else {
      params.set("revenueStatsView", view);
    }
    setSearchParams(params);
  };

  const handleOrderLifeCycleViewChange = (view) => {
    const params = new URLSearchParams(searchParams);
    if (view === DEFAULT_VIEW) {
      params.delete("orderLifeCycleView");
    } else {
      params.set("orderLifeCycleView", view);
    }
    setSearchParams(params);
  };

  // Tab change handlers
  const handleRevenueTabChange = (tab) => {
    const params = new URLSearchParams(searchParams);
    params.set("revenueTab", tab);
    params.set("orders", count.toString());
    params.delete("itemLimits");
    setSearchParams(params);
  };

  const handleSetOrdersLimit = (nextLimitValue) => {
    const params = new URLSearchParams(searchParams);
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

  // ----- Handlers for Revenue top limits -----
  const handleRevenueTopProductsChange = (newLimit) => {
    const params = new URLSearchParams(searchParams);
    params.set("revenueTopProducts", newLimit.toString());
    setSearchParams(params);
  };
  const handleRevenueTopBuyersChange = (newLimit) => {
    const params = new URLSearchParams(searchParams);
    params.set("revenueTopBuyers", newLimit.toString());
    setSearchParams(params);
  };
  const handleRevenueTopStoresChange = (newLimit) => {
    const params = new URLSearchParams(searchParams);
    params.set("revenueTopStores", newLimit.toString());
    setSearchParams(params);
  };

  // ----- Handlers for Order Life Cycle top limits -----
  const handleOrderLifeCycleTopProductsChange = (newLimit) => {
    const params = new URLSearchParams(searchParams);
    params.set("orderLifeCycleTopProducts", newLimit.toString());
    setSearchParams(params);
  };
  const handleOrderLifeCycleTopBuyersChange = (newLimit) => {
    const params = new URLSearchParams(searchParams);
    params.set("orderLifeCycleTopBuyers", newLimit.toString());
    setSearchParams(params);
  };
  const handleOrderLifeCycleTopStoresChange = (newLimit) => {
    const params = new URLSearchParams(searchParams);
    params.set("orderLifeCycleTopStores", newLimit.toString());
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
          // Top limits for Revenue
          revenueTopProducts={urlRevenueTopProducts}
          onRevenueTopProductsChange={handleRevenueTopProductsChange}
          revenueTopBuyers={urlRevenueTopBuyers}
          onRevenueTopBuyersChange={handleRevenueTopBuyersChange}
          revenueTopStores={urlRevenueTopStores}
          onRevenueTopStoresChange={handleRevenueTopStoresChange}
        />
        <OrderLifeCycleStats
          processOrderLifeCycleData={processOrderLifeCycleData}
          analyticsData={analyticsData}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
          onOrderLifeCycleViewChange={handleOrderLifeCycleViewChange}
          orderLifeCycleView={orderLifeCycleViewParams}
          ordersLimit={ordersParams}
          setOrdersLimit={handleSetOrdersLimit}
          itemsLimits={itemsLimitsParams}
          setItemsLimits={handleSetItemsLimits}
          defaultItemsCount={ITEMS_COUNT}
          count={count}
          // Top limits for Order Life Cycle
          orderLifeCycleTopProducts={urlOrderLifeCycleTopProducts}
          onOrderLifeCycleTopProductsChange={
            handleOrderLifeCycleTopProductsChange
          }
          orderLifeCycleTopBuyers={urlOrderLifeCycleTopBuyers}
          onOrderLifeCycleTopBuyersChange={handleOrderLifeCycleTopBuyersChange}
          orderLifeCycleTopStores={urlOrderLifeCycleTopStores}
          onOrderLifeCycleTopStoresChange={handleOrderLifeCycleTopStoresChange}
        />
      </div>
    </div>
  );
};
