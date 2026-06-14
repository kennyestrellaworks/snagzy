import { useState } from "react";
import { successfulOrderStatuses } from "../../data/orderLifeCycle";
import { IoIosArrowDown } from "../SVG";
import { useTopAnalytics } from "../../context/TopAnalyticsContext";
import { LimitSelector } from "./LimitSelector";

export const TopByNumberStats1 = ({ analyticsData }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleOpen = () => setIsOpen(!isOpen);

  const { topAnalyticsValue } = useTopAnalytics();

  // 1. Converted static values into individual React state variables
  const [topLimitProducts, setTopLimitProducts] = useState(5);
  const [topLimitBuyers, setTopLimitBuyers] = useState(5);
  const [topLimitStores, setTopLimitStores] = useState(5);

  console.log("successfulOrderStatuses", successfulOrderStatuses);

  // 2. Updated variables to dynamically track state values
  const topProducts = topAnalyticsValue.getTopSellingProductsByOrderLifeCycle(
    analyticsData,
    successfulOrderStatuses,
    topLimitProducts,
  );

  const topBuyers = topAnalyticsValue.getTopBuyersByOrderLifeCycle(
    analyticsData,
    successfulOrderStatuses,
    topLimitBuyers,
  );

  const topStores = topAnalyticsValue.getTopStoresByOrderLifeCycle(
    analyticsData,
    successfulOrderStatuses,
    topLimitStores,
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
      {/* Collapsible Section Header */}
      <div
        onClick={toggleOpen}
        className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-200"
      >
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-slate-800">
            Rankings Breakdown
          </h2>
          <p className="text-xs text-slate-500">
            Overview of top products, customers, and active marketplace
            storefronts
          </p>
        </div>
        <div
          className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        >
          <IoIosArrowDown className="w-5 h-5 text-slate-500" />
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ${isOpen ? "block" : "hidden"}`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 p-4 gap-4">
          {/* Grid 1: Top Selling Products */}
          <div className="mb-8 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3 gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Top Selling Products
                </h2>
                <p className="text-sm text-slate-500">
                  Displaying the top items by unit volume from successful sales
                </p>
              </div>
              {/* Select dropdown added cleanly without breaking header containers */}
              <LimitSelector
                id="product-limit"
                value={topLimitProducts}
                onChangeValue={setTopLimitProducts}
              />
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
                        {product.totalQuantitySold} sold
                      </p>
                      <p className="text-xs font-medium text-emerald-600">
                        {formatCurrency(product.totalRevenue)} gross
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-slate-400">
                No product data found matching successful criteria.
              </div>
            )}
          </div>
          {/* Grid 1 ends */}

          {/* Grid 2: Top Customers */}
          <div className="mb-8 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3 gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Top Customers
                </h2>
                <p className="text-sm text-slate-500">
                  Displaying the highest spending buyers from completed
                  transactions
                </p>
              </div>
              {/* Select dropdown for customers limit control */}
              <LimitSelector
                id="buyer-limit"
                value={topLimitBuyers}
                onChangeValue={setTopLimitBuyers}
              />
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
                        {formatCurrency(buyer.totalSpent)} spent
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        {buyer.totalItemsPurchased} units bought
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-slate-400">
                No customer spending records found matching successful criteria.
              </div>
            )}
          </div>
          {/* Grid 2 ends */}

          {/* Grid 3: Top Performing Stores */}
          <div className="mb-8 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3 gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Top Performing Stores
                </h2>
                <p className="text-sm text-slate-500">
                  Displaying the stores ranked by total generated sales revenue
                </p>
              </div>
              {/* Select dropdown for store metrics control */}
              <LimitSelector
                id="store-limit"
                value={topLimitStores}
                onChangeValue={setTopLimitStores}
              />
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
                        {formatCurrency(store.totalRevenue)} sales
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        {store.totalItemsSold} units sold
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-slate-400">
                No store data found matching successful criteria.
              </div>
            )}
          </div>
          {/* Grid 3 ends  */}
        </div>
      </div>
    </div>
  );
};
