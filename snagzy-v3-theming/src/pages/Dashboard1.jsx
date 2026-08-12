import React, { useMemo } from "react";
import { orders } from "../data/orders";
import {
  orderLifeCycle,
  pendingOrderStatuses,
  successfulOrderStatuses,
  unsuccessfulOrderStatuses,
} from "../data/orderLifeCycle";
import { products } from "../data/products";
import { users } from "../data/users";
import { stores } from "../data/stores"; // Imported new stores layout map

const TOP_COUNT = 10;

export const Dashboard1 = () => {
  const stats = useMemo(() => {
    let totalSalesValue = 0;
    let pendingSalesValue = 0;
    let cancelledSalesValue = 0;

    let totalSalesCount = 0;
    let pendingSalesCount = 0;
    let cancelledSalesCount = 0;

    const productMap = {}; // productId -> { name, salesValue, unitsSold, image }
    const buyerMap = {}; // buyerId -> { name, totalSpent, totalOrders, email, image }
    const storeMap = {}; // storeId -> { name, salesValue, totalOrders, logoUrl }

    // Pre-map product, user, and store entries for rapid cross-referencing lookups
    const publicProducts = Array.isArray(products) ? products : [];
    const publicUsers = Array.isArray(users) ? users : [];
    const publicStores = Array.isArray(stores) ? stores : [];

    orders.forEach((order) => {
      const currentSlug = order.currentStatus?.slug || "";

      // Calculate order subtotal/total
      let orderTotalValue = 0;
      if (Array.isArray(order.orderedItems)) {
        order.orderedItems.forEach((item) => {
          const itemPrice = item.variant?.price || item.price || 0;
          const itemQty = item.variant?.quantity || item.quantity || 1;
          const itemSubtotal =
            item.variant?.subTotal || item.subTotal || itemPrice * itemQty;
          orderTotalValue += itemSubtotal;
        });
      }

      // 1. Group based on order life cycle groupings
      if (successfulOrderStatuses.includes(currentSlug)) {
        totalSalesValue += orderTotalValue;
        totalSalesCount++;
      } else if (pendingOrderStatuses.includes(currentSlug)) {
        pendingSalesValue += orderTotalValue;
        pendingSalesCount++;
      } else if (unsuccessfulOrderStatuses.includes(currentSlug)) {
        cancelledSalesValue += orderTotalValue;
        cancelledSalesCount++;
      }

      // Aggregations (Only build metrics if items exist)
      if (Array.isArray(order.orderedItems)) {
        order.orderedItems.forEach((item) => {
          const itemPrice = item.variant?.price || item.price || 0;
          const itemQty = item.variant?.quantity || item.quantity || 1;
          const itemSubtotal =
            item.variant?.subTotal || item.subTotal || itemPrice * itemQty;

          // Find product data to identify its store association
          const matchedProd = publicProducts.find(
            (p) => p._id === item.productId,
          );
          const storeId =
            matchedProd?.storeOwnerInfo?.storeId || "Unknown Store";

          // Cross-reference store details from stores data collection
          const matchedStore = publicStores.find((s) => s._id === storeId);

          // Top Selling Products Tracking
          if (!productMap[item.productId]) {
            productMap[item.productId] = {
              name: item.productName || matchedProd?.name || "Unknown Product",
              salesValue: 0,
              unitsSold: 0,
              image:
                item.variant?.primaryImage ||
                matchedProd?.variants?.[0]?.primaryImage ||
                "",
            };
          }
          productMap[item.productId].salesValue += itemSubtotal;
          productMap[item.productId].unitsSold += itemQty;

          // Top Stores Tracking (Now linking official name and logoUrl)
          if (!storeMap[storeId]) {
            storeMap[storeId] = {
              name:
                matchedStore?.storeName ||
                (storeId.startsWith("store")
                  ? `Store #${storeId.replace("store", "")}`
                  : storeId),
              logoUrl: matchedStore?.logoUrl || "",
              salesValue: 0,
              totalOrders: new Set(),
            };
          }
          storeMap[storeId].salesValue += itemSubtotal;
          storeMap[storeId].totalOrders.add(order._id);
        });
      }

      // Top Buyers Tracking
      const buyer = order.buyerInfo;
      if (buyer && buyer.buyerId) {
        const matchedUser = publicUsers.find((u) => u._id === buyer.buyerId);
        if (!buyerMap[buyer.buyerId]) {
          buyerMap[buyer.buyerId] = {
            name:
              `${buyer.buyerFirstName || ""} ${buyer.buyerLastName || ""}`.trim() ||
              matchedUser?.firstName ||
              "Unknown Buyer",
            email: buyer.email || matchedUser?.contact?.email || "",
            image:
              buyer.image ||
              matchedUser?.image ||
              "https://via.placeholder.com/150",
            totalSpent: 0,
            totalOrders: 0,
          };
        }
        buyerMap[buyer.buyerId].totalSpent += orderTotalValue;
        buyerMap[buyer.buyerId].totalOrders += 1;
      }
    });

    // Format maps to sorted arrays
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.salesValue - a.salesValue)
      .slice(0, TOP_COUNT);

    const topBuyers = Object.values(buyerMap)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, TOP_COUNT);

    const topStores = Object.values(storeMap)
      .map((store) => ({ ...store, totalOrders: store.totalOrders.size }))
      .sort((a, b) => b.salesValue - a.salesValue)
      .slice(0, TOP_COUNT);

    return {
      financials: {
        totalSales: { value: totalSalesValue, count: totalSalesCount },
        pendingSales: { value: pendingSalesValue, count: pendingSalesCount },
        cancellations: {
          value: cancelledSalesValue,
          count: cancelledSalesCount,
        },
      },
      topProducts,
      topBuyers,
      topStores,
    };
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  console.log("stats.topProducts", stats.topProducts);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6 text-gray-800 font-sans">
      <div className="w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              E-Commerce Insights
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Live updates summarized from system operational records.
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-white shadow-sm border border-gray-200 rounded-lg px-4 py-2 text-xs font-semibold text-gray-600">
            Data Stream Status:{" "}
            <span className="text-green-500 font-bold">● Active</span>
          </div>
        </div>

        {/* KPI Financial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: Total Sales */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Total Sales
              </span>
              <h2 className="text-3xl font-black text-emerald-600">
                {formatCurrency(stats.financials.totalSales.value)}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {stats.financials.totalSales.count} settled transactions
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Card: Pending Sales */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Pending Orders
              </span>
              <h2 className="text-3xl font-black text-amber-500">
                {formatCurrency(stats.financials.pendingSales.value)}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {stats.financials.pendingSales.count} orders in operational
                pipeline
              </p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-500 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Card: Cancellations */}
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Cancellations
              </span>
              <h2 className="text-3xl font-black text-rose-500">
                {formatCurrency(stats.financials.cancellations.value)}
              </h2>
              <p className="text-xs text-gray-500 font-medium">
                {stats.financials.cancellations.count} rejected or aborted
                actions
              </p>
            </div>
            <div className="p-3 bg-rose-50 text-rose-500 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Ranking Aggregations Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Box 1: Top Selling Products */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-gray-50/70">
              <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase">
                Top Selling Products
              </h3>
            </div>
            <div className="p-5 flex-1 divide-y divide-gray-100">
              {stats.topProducts.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  No product data extracted.
                </p>
              ) : (
                stats.topProducts.map((prod, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-md overflow-hidden shrink-0">
                      {prod.image ? (
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-bold bg-gray-200">
                          {index + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {prod.name}
                      </p>
                      <p className="text-xs text-gray-400 font-medium">
                        {prod.unitsSold} units total capacity
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-900">
                        {formatCurrency(prod.salesValue)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Box 2: Premium Buying Accounts */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-gray-50/70">
              <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase">
                Top Buyers
              </h3>
            </div>
            <div className="p-5 flex-1 divide-y divide-gray-100">
              {stats.topBuyers.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  No buyer records matched.
                </p>
              ) : (
                stats.topBuyers.map((buyer, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 py-3 first:pt-0 last:pb-0"
                  >
                    <img
                      className="w-10 h-10 rounded-full border border-gray-200 object-cover shrink-0"
                      src={buyer.image}
                      alt={buyer.name}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {buyer.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {buyer.email || "No email saved"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-emerald-600">
                        {formatCurrency(buyer.totalSpent)}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        {buyer.totalOrders} Orders
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Box 3: Top Distributed Store Entities */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 bg-gray-50/70">
              <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase">
                Top Stores
              </h3>
            </div>
            <div className="p-5 flex-1 divide-y divide-gray-100">
              {stats.topStores.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  No marketplace data compiled.
                </p>
              ) : (
                stats.topStores.map((store, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      {/* Brand Logo Avatar Integration */}
                      <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shrink-0">
                        {store.logoUrl ? (
                          <img
                            src={store.logoUrl}
                            alt={store.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-purple-50 text-purple-600 font-bold text-sm">
                            {store.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {store.name}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">
                          Distributed over {store.totalOrders} unique invoices
                        </p>
                      </div>
                    </div>
                    <div className="text-right pl-3 shrink-0">
                      <p className="text-sm font-black text-gray-900">
                        {formatCurrency(store.salesValue)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
