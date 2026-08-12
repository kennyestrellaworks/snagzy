import { createContext, useContext, useMemo } from "react";
import {
  pendingOrderStatuses,
  successfulOrderStatuses,
  unsuccessfulOrderStatuses,
} from "../data/orderLifeCycle";

const TopAnalyticsContext = createContext();

export const TopAnalyticsProvider = ({ children }) => {
  const topAnalyticsValue = useMemo(() => {
    // Method to get top selling products based on a status array and limit
    const getTopSellingProductsByOrderLifeCycle = (
      orders,
      orderCurrentStatus,
      limit,
    ) => {
      // console.log("orderCurrentStatus", typeof orderCurrentStatus);

      const productMap = orders.reduce((acc, order) => {
        const currentStatus = order.currentStatus?.slug;

        if (orderCurrentStatus.includes(currentStatus)) {
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
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, limit);
    };

    // Method to get top buyers based on a status array and limit
    const getTopBuyersByOrderLifeCycle = (
      orders,
      orderCurrentStatus,
      limit,
    ) => {
      const buyerMap = orders.reduce((acc, order) => {
        const currentStatus = order.currentStatus?.slug;

        if (orderCurrentStatus.includes(currentStatus)) {
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

    // Method to get data by stepping down into item variant environments
    const getTopStoresByOrderLifeCycle = (
      orders,
      orderCurrentStatus,
      limit,
    ) => {
      const storeMap = orders.reduce((acc, order) => {
        const currentStatus = order.currentStatus?.slug;

        if (orderCurrentStatus.includes(currentStatus)) {
          order.orderedItems?.forEach((item) => {
            const store = item.variant?.storeInfo;
            const storeId = store?.storeId;
            const itemSubTotal = item.variant?.subTotal || 0;
            const itemQuantity = item.variant?.quantity || 0;

            if (!storeId) return;

            if (!acc[storeId]) {
              acc[storeId] = {
                storeId: storeId,
                storeName: store?.storeName || "Unknown Store",
                storeLogo: store?.storeLogo || store?.storeImage || "",
                totalRevenue: 0,
                totalItemsSold: 0,
              };
            }

            acc[storeId].totalRevenue += itemSubTotal;
            acc[storeId].totalItemsSold += itemQuantity;
          });
        }
        return acc;
      }, {});

      return Object.values(storeMap)
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, limit);
    };

    // Method to get paymentInfo
    const getPaymentMethodList = (orders) => {
      const map = {};
      orders.forEach((o) => {
        const m = o.paymentInfo.method;
        if (!map[m]) map[m] = { name: m, value: 0, revenue: 0 };
        map[m].value += 1;
        map[m].revenue += o.summary.orderTotalPrice;
      });
      return Object.values(map).sort((a, b) => b.value - a.value);
    };

    // Method to get shippingInfo.method matched with shippingMethods array
    const getShippingMethodDist = (orders, shippingMethods) => {
      const map = {};

      // Ensure we have a valid array to query against
      const methodsRef = Array.isArray(shippingMethods) ? shippingMethods : [];

      orders.forEach((o) => {
        // Optional chaining to prevent runtime crashes if structural data is missing
        const methodId = o.buyerInfo?.shippingInfo?.method;
        if (!methodId) return;

        // Look up the matching shipping method record by its ID
        const matchedMethod = methodsRef.find((m) => m._id === methodId);

        // Grab the friendly display name if found; otherwise, fall back gracefully
        const label = matchedMethod ? matchedMethod.name : "Unknown Method";

        // Group identical items using the unique slug or ID
        const groupKey = matchedMethod ? matchedMethod.slug : methodId;

        if (!map[groupKey]) {
          map[groupKey] = { name: label, value: 0 };
        }
        map[groupKey].value += 1;
      });

      // Convert the hash map into a clean list and sort descending by order volume
      return Object.values(map).sort((a, b) => b.value - a.value);
    };

    // Method to get shippingInfo.carrier
    const getCarrierDist = (orders) => {
      const map = {};
      orders.forEach((o) => {
        const c = o.buyerInfo.shippingInfo.carrier;
        if (!map[c]) map[c] = { name: c, value: 0 };
        map[c].value += 1;
      });
      return Object.values(map).sort((a, b) => b.value - a.value);
    };

    // Method to get metrics for Successful, Pending, and Cancellations
    const getOrderStatusDistribution = (allowedStatuses, orders) => {
      let count = 0;
      let totalRevenue = 0;
      let statusName = "";

      orders.forEach((o) => {
        // FIX: Match the order schema used elsewhere in this context file
        const currentStatus = o.currentStatus?.slug;

        if (allowedStatuses.includes(currentStatus)) {
          count += 1;
          totalRevenue += o.summary?.orderTotalPrice || 0;
        }
      });

      if (allowedStatuses === successfulOrderStatuses) {
        statusName = "Successful";
      } else if (allowedStatuses === pendingOrderStatuses) {
        statusName = "Pending";
      } else if (allowedStatuses === unsuccessfulOrderStatuses) {
        statusName = "Cancelled";
      }

      // Returning a default name parameter helps Recharts handle tooltips safely
      return { name: statusName, value: count, revenue: totalRevenue };
    };

    return {
      getTopSellingProductsByOrderLifeCycle,
      getTopBuyersByOrderLifeCycle,
      getTopStoresByOrderLifeCycle,
      getPaymentMethodList,
      getShippingMethodDist,
      getCarrierDist,
      getOrderStatusDistribution,
    };
  }, []);

  return (
    <TopAnalyticsContext.Provider value={{ topAnalyticsValue }}>
      {children}
    </TopAnalyticsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTopAnalytics = () => useContext(TopAnalyticsContext);
