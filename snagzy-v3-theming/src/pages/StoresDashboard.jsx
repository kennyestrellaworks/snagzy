import { useMemo } from "react";
import { orders } from "../data/orders";
import { stores } from "../data/stores";
import { reviews } from "../data/reviews";
import { PageHeader } from "../components/PageHeader";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";

// Helper: Format currency
const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
};

// Helper: Get store name by ID
const getStoreName = (storeId) => {
  const store = stores.find((s) => s._id === storeId);
  return store ? store.storeName : "Unknown Store";
};

// Helper: Get store object by ID
const getStore = (storeId) => stores.find((s) => s._id === storeId);

export const StoresDashboard = () => {
  // 1. Aggregate sales data per store (revenue, items sold, order count)
  const storeSalesData = useMemo(() => {
    const storeMap = new Map(); // storeId -> { revenue, itemsSold, orderCount, storeName }

    orders.forEach((order) => {
      // Group ordered items by store
      const storeItemsMap = new Map(); // storeId -> { revenue, itemsSold }

      order.orderedItems.forEach((item) => {
        const storeId = item.variant.storeInfo.storeId;
        const storeName = item.variant.storeInfo.storeName;
        const revenue = item.variant.subTotal;
        const quantity = item.variant.quantity;

        if (storeItemsMap.has(storeId)) {
          const existing = storeItemsMap.get(storeId);
          existing.revenue += revenue;
          existing.itemsSold += quantity;
        } else {
          storeItemsMap.set(storeId, {
            revenue,
            itemsSold: quantity,
            storeName,
          });
        }
      });

      // Update overall storeMap
      storeItemsMap.forEach((data, storeId) => {
        if (storeMap.has(storeId)) {
          const existing = storeMap.get(storeId);
          existing.revenue += data.revenue;
          existing.itemsSold += data.itemsSold;
          existing.orderCount += 1;
        } else {
          storeMap.set(storeId, {
            storeId,
            storeName: data.storeName,
            revenue: data.revenue,
            itemsSold: data.itemsSold,
            orderCount: 1,
          });
        }
      });
    });

    return Array.from(storeMap.values()).sort((a, b) => b.revenue - a.revenue);
  }, []);

  // 2. Average rating per store (from reviews)
  const storeRatings = useMemo(() => {
    const ratingMap = new Map(); // storeId -> { totalRating, count, storeName }

    reviews.forEach((review) => {
      const storeId = review.orderInfo?.storeInfoStoreId;
      const storeName = review.orderInfo?.storeInfoStoreName;
      if (!storeId) return;

      const rating = review.rating;
      if (ratingMap.has(storeId)) {
        const data = ratingMap.get(storeId);
        data.totalRating += rating;
        data.count += 1;
      } else {
        ratingMap.set(storeId, {
          storeId,
          storeName: storeName || getStoreName(storeId),
          totalRating: rating,
          count: 1,
        });
      }
    });

    const result = Array.from(ratingMap.values()).map((store) => ({
      ...store,
      averageRating: store.totalRating / store.count,
    }));
    result.sort((a, b) => b.averageRating - a.averageRating);
    return result;
  }, []);

  // 3. Order completion rate per store (based on order lifecycle)
  const storeOrderCompletion = useMemo(() => {
    const storeMap = new Map(); // storeId -> { totalOrders, completedOrders, storeName }

    orders.forEach((order) => {
      // Get unique stores in this order (each order can have multiple stores)
      const storesInOrder = new Set();
      order.orderedItems.forEach((item) => {
        const storeId = item.variant.storeInfo.storeId;
        storesInOrder.add(storeId);
      });

      const isCompleted = order.currentStatus.slug === "completed";

      storesInOrder.forEach((storeId) => {
        const storeName = getStoreName(storeId);
        if (storeMap.has(storeId)) {
          const data = storeMap.get(storeId);
          data.totalOrders += 1;
          if (isCompleted) data.completedOrders += 1;
        } else {
          storeMap.set(storeId, {
            storeId,
            storeName,
            totalOrders: 1,
            completedOrders: isCompleted ? 1 : 0,
          });
        }
      });
    });

    const result = Array.from(storeMap.values()).map((store) => ({
      ...store,
      completionRate:
        store.totalOrders > 0
          ? (store.completedOrders / store.totalOrders) * 100
          : 0,
    }));
    result.sort((a, b) => b.completionRate - a.completionRate);
    return result;
  }, []);

  // 4. Top products sold per store (top 3 per store for display)
  const topProductsPerStore = useMemo(() => {
    const storeProductsMap = new Map(); // storeId -> Map of productId -> { quantity, productName }

    orders.forEach((order) => {
      order.orderedItems.forEach((item) => {
        const storeId = item.variant.storeInfo.storeId;
        const productId = item.productId;
        const productName = item.productName;
        const quantity = item.variant.quantity;

        if (!storeProductsMap.has(storeId)) {
          storeProductsMap.set(storeId, new Map());
        }
        const productMap = storeProductsMap.get(storeId);
        if (productMap.has(productId)) {
          const existing = productMap.get(productId);
          existing.quantity += quantity;
        } else {
          productMap.set(productId, { quantity, productName });
        }
      });
    });

    const result = [];
    storeProductsMap.forEach((productMap, storeId) => {
      const topProducts = Array.from(productMap.entries())
        .map(([productId, data]) => ({ productId, ...data }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 3);
      result.push({
        storeId,
        storeName: getStoreName(storeId),
        topProducts,
      });
    });
    return result;
  }, []);

  // 5. Monthly sales trend per store (simplified: group by month)
  const monthlySalesTrend = useMemo(() => {
    const monthMap = new Map(); // month (YYYY-MM) -> Map of storeId -> revenue
    const allMonths = new Set();

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;
      allMonths.add(monthKey);

      order.orderedItems.forEach((item) => {
        const storeId = item.variant.storeInfo.storeId;
        const revenue = item.variant.subTotal;

        if (!monthMap.has(monthKey)) {
          monthMap.set(monthKey, new Map());
        }
        const storeRevenueMap = monthMap.get(monthKey);
        storeRevenueMap.set(
          storeId,
          (storeRevenueMap.get(storeId) || 0) + revenue,
        );
      });
    });

    const sortedMonths = Array.from(allMonths).sort();
    const result = sortedMonths.map((month) => {
      const storeRevenues = monthMap.get(month) || new Map();
      const entry = { month };
      storeRevenues.forEach((revenue, storeId) => {
        const storeName = getStoreName(storeId);
        entry[storeName] = revenue;
      });
      return entry;
    });
    return result;
  }, []);

  // 6. Store performance summary (radial chart data for completion rate)
  const storeCompletionRadial = useMemo(() => {
    return storeOrderCompletion.map((store) => ({
      name: store.storeName,
      value: store.completionRate,
      fill:
        store.completionRate > 80
          ? "#10B981"
          : store.completionRate > 60
            ? "#F59E0B"
            : "#EF4444",
    }));
  }, [storeOrderCompletion]);

  // Colors for charts
  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  // Summary metrics
  const totalStores = stores.length;
  const totalRevenueAllStores = storeSalesData.reduce(
    (sum, s) => sum + s.revenue,
    0,
  );
  const avgStoreRating =
    storeRatings.reduce((sum, s) => sum + s.averageRating, 0) /
    (storeRatings.length || 1);
  const avgCompletionRate =
    storeOrderCompletion.reduce((sum, s) => sum + s.completionRate, 0) /
    (storeOrderCompletion.length || 1);

  return (
    <div className="flex flex-col w-full bg-white border border-gray-300 rounded-md overflow-hidden">
      <div className="flex w-full z-50">
        <div className="w-full flex flex-1 flex-col p-2">
          <div className="flex gap-2 justify-between">
            <PageHeader defaultPage="Analytics" type="sidebar-level" />
          </div>
        </div>
      </div>

      <div>THIS</div>

      <div className="flex flex-col w-full overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="flex flex-col w-full p-2 gap-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-blue-500">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Active Stores
              </p>
              <p className="text-3xl font-bold text-gray-800">{totalStores}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-green-500">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {formatCurrency(totalRevenueAllStores)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-yellow-500">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Avg. Store Rating
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {avgStoreRating.toFixed(1)} ⭐
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border-l-8 border-purple-500">
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                Avg. Order Completion
              </p>
              <p className="text-3xl font-bold text-gray-800">
                {avgCompletionRate.toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Store Revenue (Bar Chart) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                💰 Revenue by Store
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={storeSalesData} margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="storeName"
                    tick={{ fontSize: 12 }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3B82F6" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Store Ratings (Bar Chart) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                ⭐ Average Rating by Store
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={storeRatings} margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="storeName"
                    tick={{ fontSize: 12 }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis domain={[0, 5]} tickCount={6} />
                  <Tooltip formatter={(value) => `${value.toFixed(1)} / 5`} />
                  <Legend />
                  <Bar
                    dataKey="averageRating"
                    fill="#F59E0B"
                    name="Avg Rating"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Order Completion Rate (Radial Bar Chart) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                ✅ Order Completion Rate by Store
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <RadialBarChart
                  cx="30%"
                  cy="50%"
                  innerRadius="10%"
                  outerRadius="80%"
                  barSize={20}
                  data={storeCompletionRadial}
                >
                  <RadialBar
                    minAngle={15}
                    label={{ position: "insideStart", fill: "#fff" }}
                    background
                    dataKey="value"
                  />
                  <Legend
                    iconSize={10}
                    width={200}
                    height={200}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    formatter={(value, entry) =>
                      `${value} - ${entry.payload.value.toFixed(0)}%`
                    }
                  />
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            {/* Items Sold by Store */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                📦 Items Sold by Store
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={storeSalesData} margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="storeName"
                    tick={{ fontSize: 12 }}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="itemsSold" fill="#10B981" name="Items Sold" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Sales Trend (Line Chart) */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              📈 Monthly Sales Trend by Store
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlySalesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  angle={-30}
                  textAnchor="end"
                  height={70}
                />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                {storeSalesData.slice(0, 4).map((store, index) => (
                  <Line
                    key={store.storeId}
                    type="monotone"
                    dataKey={store.storeName}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products per Store */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              🏆 Top 3 Products per Store
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topProductsPerStore.map((store) => (
                <div
                  key={store.storeId}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <h3 className="font-bold text-lg mb-2 text-gray-800">
                    {store.storeName}
                  </h3>
                  {store.topProducts.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No products sold yet.
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {store.topProducts.map((product, idx) => (
                        <li
                          key={product.productId}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-700">
                            {idx + 1}. {product.productName}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {product.quantity} sold
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Store Performance Table */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              📋 Store Performance Summary
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Store Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items Sold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completion Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {storeSalesData.map((store) => {
                    const ratingInfo = storeRatings.find(
                      (r) => r.storeId === store.storeId,
                    );
                    const completionInfo = storeOrderCompletion.find(
                      (c) => c.storeId === store.storeId,
                    );
                    return (
                      <tr key={store.storeId}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {store.storeName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatCurrency(store.revenue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {store.itemsSold}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {store.orderCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {ratingInfo
                            ? ratingInfo.averageRating.toFixed(1)
                            : "N/A"}{" "}
                          ⭐
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {completionInfo
                            ? `${completionInfo.completionRate.toFixed(1)}%`
                            : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
