import { successfulOrderStatuses } from "../../data/orderLifeCycle";
import { pendingOrderStatuses } from "../../data/orderLifeCycle";
import { unsuccessfulOrderStatuses } from "../../data/orderLifeCycle";
import { useTopAnalytics } from "../../context/TopAnalyticsContext";
import { LimitSelector } from "./LimitSelector";
import { useMemo } from "react";

export const TopByNumberStats = ({
  analyticsData,
  topLimitProducts = 5,
  setTopLimitProducts,
  topLimitBuyers = 5,
  setTopLimitBuyers,
  topLimitStores = 5,
  setTopLimitStores,
  activeOrderLifeCycleTab,
}) => {
  const { topAnalyticsValue } = useTopAnalytics();

  // Map the active tab to the corresponding status array – FIXED fallback
  const orderCurrentStats = useMemo(() => {
    switch (activeOrderLifeCycleTab) {
      case "total-sales":
        return successfulOrderStatuses;
      case "pending-sales":
        return pendingOrderStatuses;
      case "cancellations":
        return unsuccessfulOrderStatuses;
      default:
        // Fallback to successful orders (array) instead of the string
        return activeOrderLifeCycleTab;
    }
  }, [activeOrderLifeCycleTab]);

  const topProducts = useMemo(() => {
    return topAnalyticsValue.getTopSellingProductsByOrderLifeCycle(
      analyticsData,
      orderCurrentStats,
      topLimitProducts,
    );
  }, [analyticsData, topLimitProducts, topAnalyticsValue, orderCurrentStats]);

  const topBuyers = useMemo(() => {
    return topAnalyticsValue.getTopBuyersByOrderLifeCycle(
      analyticsData,
      orderCurrentStats,
      topLimitBuyers,
    );
  }, [analyticsData, topLimitBuyers, topAnalyticsValue, orderCurrentStats]);

  const topStores = useMemo(() => {
    return topAnalyticsValue.getTopStoresByOrderLifeCycle(
      analyticsData,
      orderCurrentStats,
      topLimitStores,
    );
  }, [analyticsData, topLimitStores, topAnalyticsValue, orderCurrentStats]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Debug logs to verify limit changes (remove after testing)
  // console.log(
  //   "TopProducts limit:",
  //   topLimitProducts,
  //   "count:",
  //   topProducts.length,
  // );
  // console.log("TopBuyers limit:", topLimitBuyers, "count:", topBuyers.length);
  // console.log("TopStores limit:", topLimitStores, "count:", topStores.length);

  return (
    <div className="flex w-full mt-4 overflow-hidden">
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-2">
        {/* Grid 1 - Top Products */}
        <div className="w-full p-3 bg-white border border-gray-200 rounded-md transition-all duration-300 ease-in-out overflow-hidden">
          <div className="flex justify-between gap-10 mb-4 border-b border-slate-100 pb-3">
            <div className="flex flex-col">
              <h2 className="text-md font-bold text-slate-800">
                Top Products in Sales
              </h2>
              <p className="text-sm text-slate-500">
                Displaying the top items by revenue from{" "}
                {activeOrderLifeCycleTab === "total-sales"
                  ? "successful"
                  : activeOrderLifeCycleTab === "pending-sales"
                    ? "pending"
                    : "cancelled"}{" "}
                orders
              </p>
            </div>
            <div className="flex items-start">
              <LimitSelector
                id="product-limit"
                value={topLimitProducts}
                onChangeValue={setTopLimitProducts}
              />
            </div>
          </div>

          {topProducts.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {topProducts.map((product, idx) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center space-x-4">
                    <span className="w-5 text-center text-sm font-bold text-slate-400">
                      {idx + 1}
                    </span>
                    {product.primaryImage ? (
                      <img
                        src={product.primaryImage}
                        alt={product.productName}
                        className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs font-medium text-slate-400">
                        No Image
                      </div>
                    )}
                    <div>
                      <h3 className="line-clamp-1 text-sm font-semibold text-slate-800">
                        {product.productName}
                      </h3>
                      <p className="text-xs text-slate-400">
                        ID: {product.productId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">
                      {formatCurrency(product.totalRevenue)}
                    </p>
                    <p className="text-xs font-medium text-emerald-600">
                      {product.totalQuantitySold} sold
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-sm text-slate-400">
              No product data found.
            </div>
          )}
        </div>

        {/* Grid 2 - Top Customers */}
        <div className="w-full p-3 bg-white border border-gray-200 rounded-md transition-all duration-300 ease-in-out overflow-hidden">
          <div className="flex justify-between gap-10 mb-4 border-b border-slate-100 pb-3">
            <div className="flex flex-col">
              <h2 className="text-md font-bold text-slate-800">
                Top Customers in Spending
              </h2>
              <p className="text-sm text-slate-500">
                Displaying the highest spending buyers from{" "}
                {activeOrderLifeCycleTab === "total-sales"
                  ? "successful"
                  : activeOrderLifeCycleTab === "pending-sales"
                    ? "pending"
                    : "cancelled"}{" "}
                orders
              </p>
            </div>
            <div className="flex items-start">
              <LimitSelector
                id="buyer-limit"
                value={topLimitBuyers}
                onChangeValue={setTopLimitBuyers}
              />
            </div>
          </div>

          {topBuyers.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {topBuyers.map((buyer, idx) => (
                <div
                  key={buyer.buyerId}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center space-x-4">
                    <span className="w-5 text-center text-sm font-bold text-slate-400">
                      {idx + 1}
                    </span>
                    {buyer.image ? (
                      <img
                        src={buyer.image}
                        alt={buyer.fullName}
                        className="h-12 w-12 rounded-full bg-slate-100 border border-slate-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-400 border border-slate-100">
                        User
                      </div>
                    )}
                    <div>
                      <h3 className="line-clamp-1 text-sm font-semibold text-slate-800">
                        {buyer.fullName}
                      </h3>
                      <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                        {buyer.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">
                      {formatCurrency(buyer.totalSpent)}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {buyer.totalItemsPurchased} items bought
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-sm text-slate-400">
              No customer spending records found.
            </div>
          )}
        </div>

        {/* Grid 3 - Top Stores */}
        <div className="w-full p-3 bg-white border border-gray-200 rounded-md transition-all duration-300 ease-in-out overflow-hidden">
          <div className="flex justify-between gap-10 mb-4 border-b border-slate-100 pb-3">
            <div className="flex flex-col">
              <h2 className="text-md font-bold text-slate-800">
                Top Stores in Sales
              </h2>
              <p className="text-sm text-slate-500">
                Displaying the stores ranked by total revenue from{" "}
                {activeOrderLifeCycleTab === "total-sales"
                  ? "successful"
                  : activeOrderLifeCycleTab === "pending-sales"
                    ? "pending"
                    : "cancelled"}{" "}
                orders
              </p>
            </div>
            <div className="flex items-start">
              <LimitSelector
                id="store-limit"
                value={topLimitStores}
                onChangeValue={setTopLimitStores}
              />
            </div>
          </div>

          {topStores.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {topStores.map((store, idx) => (
                <div
                  key={store.storeId}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center space-x-4">
                    <span className="w-5 text-center text-sm font-bold text-slate-400">
                      {idx + 1}
                    </span>
                    {store.storeLogo ? (
                      <img
                        src={store.storeLogo}
                        alt={store.storeName}
                        className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-100 object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 border border-slate-100 text-xs font-semibold text-slate-500">
                        Store
                      </div>
                    )}
                    <div>
                      <h3 className="line-clamp-1 text-sm font-semibold text-slate-800">
                        {store.storeName}
                      </h3>
                      <p className="text-xs text-slate-400">
                        ID: {store.storeId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800">
                      {formatCurrency(store.totalRevenue)}
                    </p>
                    <p className="text-xs font-medium text-slate-500">
                      {store.totalItemsSold} items sold
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-sm text-slate-400">
              No store data found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
