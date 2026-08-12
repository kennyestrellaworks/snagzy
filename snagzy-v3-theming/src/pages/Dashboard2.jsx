import { orders } from "../data/orders";
import {
  pendingOrderStatuses,
  successfulOrderStatuses,
  unsuccessfulOrderStatuses,
} from "../data/orderLifeCycle";

export const Dashboard2 = () => {
  // Configurable variable to set how many top records to display across widgets
  const TOP_LIMIT = 5;

  // Method to get top selling products based on a status array and limit
  const getTopSellingProductsByOrderLifeCycle = (statusArray, limit) => {
    const productMap = orders.reduce((acc, order) => {
      const currentStatus = order.currentStatus?.slug;

      if (statusArray.includes(currentStatus)) {
        order.orderedItems?.forEach((item) => {
          const productId = item.productId;
          const quantitySold = item.variant?.quantity || 0;
          const itemSubTotal = item.variant?.subTotal || 0;

          if (!productId) return;

          if (!acc[productId]) {
            acc[productId] = {
              productId: productId,
              productName: item.productName || "Unknown Product",
              primaryImage: item.variant?.primaryImage || "",
              totalQuantitySold: 0,
              totalRevenue: 0,
            };
          }
          acc[productId].totalQuantitySold += quantitySold;
          acc[productId].totalRevenue += itemSubTotal;
        });
      }
      return acc;
    }, {});

    return Object.values(productMap)
      .sort((a, b) => b.totalQuantitySold - a.totalQuantitySold)
      .slice(0, limit);
  };

  // Method to get top buyers based on a status array and limit
  const getTopBuyersByOrderLifeCycle = (statusArray, limit) => {
    const buyerMap = orders.reduce((acc, order) => {
      const currentStatus = order.currentStatus?.slug;

      if (statusArray.includes(currentStatus)) {
        const buyer = order.buyerInfo;
        const buyerId = buyer?.buyerId;
        const orderTotalPrice = order.summary?.orderTotalPrice || 0;
        const itemsCount =
          order.orderedItems?.reduce(
            (sum, item) => sum + (item.variant?.quantity || 0),
            0,
          ) || 0;

        if (!buyerId) return acc;

        if (!acc[buyerId]) {
          acc[buyerId] = {
            buyerId: buyerId,
            fullName:
              `${buyer.buyerFirstName || ""} ${buyer.buyerLastName || ""}`.trim() ||
              "Unknown Buyer",
            email: buyer.email || "No Email Provided",
            image: buyer.image || "",
            totalSpent: 0,
            totalItemsPurchased: 0,
          };
        }

        acc[buyerId].totalSpent += orderTotalPrice;
        acc[buyerId].totalItemsPurchased += itemsCount;
      }
      return acc;
    }, {});

    return Object.values(buyerMap)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, limit);
  };

  // Method to get top stores based on a status array and limit
  const getTopStoresByOrderLifeCycle = (statusArray, limit) => {
    const storeMap = orders.reduce((acc, order) => {
      const currentStatus = order.currentStatus?.slug;

      if (statusArray.includes(currentStatus)) {
        const store = order.storeInfo;
        const storeId = store?.storeId || order.storeId;
        const orderTotalPrice = order.summary?.orderTotalPrice || 0;
        const itemsCount =
          order.orderedItems?.reduce(
            (sum, item) => sum + (item.variant?.quantity || 0),
            0,
          ) || 0;

        if (!storeId) return acc;

        if (!acc[storeId]) {
          acc[storeId] = {
            storeId: storeId,
            storeName: store?.storeName || "Unknown Store",
            storeLogo: store?.storeLogo || store?.image || "",
            totalRevenue: 0,
            totalItemsSold: 0,
          };
        }

        acc[storeId].totalRevenue += orderTotalPrice;
        acc[storeId].totalItemsSold += itemsCount;
      }
      return acc;
    }, {});

    return Object.values(storeMap)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  };

  // Run data extractions using successful parameters
  const topProducts = getTopSellingProductsByOrderLifeCycle(
    successfulOrderStatuses,
    TOP_LIMIT,
  );
  const topBuyers = getTopBuyersByOrderLifeCycle(
    successfulOrderStatuses,
    TOP_LIMIT,
  );
  const topStores = getTopStoresByOrderLifeCycle(
    successfulOrderStatuses,
    TOP_LIMIT,
  );

  // Compute metrics summary in a single pass
  const metrics = orders.reduce(
    (acc, order) => {
      const status = order.currentStatus?.slug;
      const orderTotal = order.summary?.orderTotalPrice || 0;

      if (successfulOrderStatuses.includes(status)) {
        acc.totalSales.amount += orderTotal;
        acc.totalSales.count += 1;
      } else if (pendingOrderStatuses.includes(status)) {
        acc.pendingSales.amount += orderTotal;
        acc.pendingSales.count += 1;
      } else if (unsuccessfulOrderStatuses.includes(status)) {
        acc.cancellations.amount += orderTotal;
        acc.cancellations.count += 1;
      }

      return acc;
    },
    {
      totalSales: { amount: 0, count: 0 },
      pendingSales: { amount: 0, count: 0 },
      cancellations: { amount: 0, count: 0 },
    },
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <div className="w-full bg-slate-50 p-8 font-sans">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">
        Store Dashboard
      </h1>

      {/* Top Selling Products List Section */}
      <div className="mb-8 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h2 className="text-xl font-bold text-slate-800">
            Top Selling Products
          </h2>
          <p className="text-sm text-slate-500">
            Displaying the top {TOP_LIMIT} items by unit volume from successful
            sales
          </p>
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
            No product data found.
          </div>
        )}
      </div>

      {/* Top Buyers List Section */}
      <div className="mb-8 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h2 className="text-xl font-bold text-slate-800">Top Customers</h2>
          <p className="text-sm text-slate-500">
            Displaying the top {TOP_LIMIT} highest spending buyers from
            completed transactions
          </p>
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
            No customer records found.
          </div>
        )}
      </div>

      {/* Top Stores List Section */}
      <div className="mb-8 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 border-b border-slate-100 pb-3">
          <h2 className="text-xl font-bold text-slate-800">
            Top Performing Stores
          </h2>
          <p className="text-sm text-slate-500">
            Displaying the top {TOP_LIMIT} stores ranked by total generated
            sales revenue
          </p>
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
            No store data found.
          </div>
        )}
      </div>

      {/* Metric Cards Grid Breakdown */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col justify-center rounded-xl border-l-[6px] border-emerald-600 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Sales
          </h2>
          <p className="text-3xl font-bold text-slate-800">
            {formatCurrency(metrics.totalSales.amount)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {metrics.totalSales.count} Orders Completed
          </p>
        </div>

        <div className="flex flex-col justify-center rounded-xl border-l-[6px] border-amber-500 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pending Sales
          </h2>
          <p className="text-3xl font-bold text-slate-800">
            {formatCurrency(metrics.pendingSales.amount)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {metrics.pendingSales.count} Orders Processing
          </p>
        </div>

        <div className="flex flex-col justify-center rounded-xl border-l-[6px] border-rose-600 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Cancellations
          </h2>
          <p className="text-3xl font-bold text-slate-800">
            {formatCurrency(metrics.cancellations.amount)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {metrics.cancellations.count} Orders Cancelled/Returned
          </p>
        </div>
      </div>
    </div>
  );
};
