import { createContext, useContext, useMemo } from "react";
import { orders } from "../data/orders.js";
import { successfulOrderStatuses } from "../data/orderLifeCycle.js";

const OrdersAnalyticsContext = createContext();

export const OrdersAnalyticsProvider = ({ children }) => {
  const ordersAnalyticsValue = useMemo(() => {
    const getAllOrders = () => {
      return orders;
    };
    const allOrders = getAllOrders();

    const STATUS_COMPLETED = ["completed"];
    const STATUS_DELIVERED = ["delivered"];
    const STATUS_ORDER_PLACED = ["order_placed"];
    const ORDER_SUCCESSFUL_STATUSES = ["completed", "delivered"];
    const ORDER_PENDING_STATUSES = [
      "order_placed",
      "payment_pending",
      "payment_confirmed",
      "processing",
      "packed",
      "shipped",
      "out_for_delivery",
      "delivery_failed",
      "attempted_delivery",
    ];
    const ORDER_NOT_SUCCESS_STATUSES = [
      "cancelled_by_buyer",
      "cancelled_by_buyer",
      "cancelled_by_seller",
      "return_request",
      "order_returned",
      "refund_success",
    ];

    // Get orders by currentStatus.slug and orderData.
    const getOrdersByStatusSlug = (slug, orderData) => {
      const orderObject = orderData ? orderData : allOrders;

      return orderObject.filter((order) => {
        if (!order.currentStatus) return false;
        return slug.includes(order.currentStatus.slug);
      });
    };

    // Get all delivered orders only.
    const getCompletedOrders = (orderData) => {
      const orderObject = orderData ? orderData : allOrders;

      return orderObject.filter((order) => {
        if (!order.currentStatus) return false;
        return STATUS_DELIVERED.includes(order.currentStatus.slug);
      });
    };

    // Get all completed orders only.
    const getDeliveredOrders = (orderData) => {
      const orderObject = orderData ? orderData : allOrders;

      return orderObject.filter((order) => {
        if (!order.currentStatus) return false;
        return STATUS_COMPLETED.includes(order.currentStatus.slug);
      });
    };

    // Get all orders with status order_placed only.
    const getOrdersWithOrderPlaced = (orderData) => {
      const orderObject = orderData ? orderData : allOrders;

      return orderObject.filter((order) => {
        if (!order.currentStatus) return false;
        return STATUS_ORDER_PLACED.includes(order.currentStatus.slug);
      });
    };

    // Get all successful orders, based from ORDER_SUCCESSFUL_STATUSES.
    const getSuccessfullOrders = (orderData) => {
      const orderObject = orderData ? orderData : allOrders;

      return orderObject.filter((order) => {
        if (!order.currentStatus) return false;
        return ORDER_SUCCESSFUL_STATUSES.includes(order.currentStatus.slug);
      });
    };

    // Get all pending orders, based from ORDER_PENDING_STATUSES.
    const getPendingOrders = (orderData) => {
      const orderObject = orderData ? orderData : allOrders;

      return orderObject.filter((order) => {
        if (!order.currentStatus) return false;
        return ORDER_PENDING_STATUSES.includes(order.currentStatus.slug);
      });
    };

    // Get unsuccessful orders, based from ORDER_PENDING_STATUSES.
    const getUnSuccessfullOrders = (orderData) => {
      const orderObject = orderData ? orderData : allOrders;

      return orderObject.filter((order) => {
        if (!order.currentStatus) return false;
        return ORDER_NOT_SUCCESS_STATUSES.includes(order.currentStatus.slug);
      });
    };

    // Get all successfull orders by a product.
    const getSuccessfullOrdersOfAProduct = (productId) => {
      const successfullOrders = getSuccessfullOrders();
      return successfullOrders.filter(
        (order) =>
          order.orderedItems &&
          order.orderedItems.some((item) => item.productId === productId),
      );
    };

    // Sum the orderedItems.variant.quantity of all ordered items within an order.
    const getSumOrderedItemsQuantity = (orderData) => {
      return orderData.reduce((total, order) => {
        const orderTotal = order.orderedItems.reduce((sum, item) => {
          return sum + item.variant.quantity;
        }, 0);
        return total + orderTotal;
      }, 0);
    };

    // Get all pending orders by a product.
    const getPendingOrdersOfAProduct = (productId) => {
      const pendingOrders = getPendingOrders();
      return pendingOrders.filter(
        (order) =>
          order.orderedItems &&
          order.orderedItems.some((item) => item.productId === productId),
      );
    };

    // Get all unsuccessful orders by a product.
    const getUnsuccessfulOrdersOfAProduct = (productId) => {
      const unsuccessfulOrders = getUnSuccessfullOrders();
      return unsuccessfulOrders.filter(
        (order) =>
          order.orderedItems &&
          order.orderedItems.some((item) => item.productId === productId),
      );
    };

    // Get total sold items for the product from completed or delivered orders
    const getTotalSoldItemsOfAProduct = (productId, orderObject) => {
      // If orderObject is not provided, get successful orders
      const ordersToUse = orderObject || getSuccessfullOrders();

      const productOrders = ordersToUse.filter(
        (order) =>
          order.orderedItems &&
          order.orderedItems.some((item) => item.productId === productId),
      );

      return productOrders.reduce((total, order) => {
        return (
          total +
          order.orderedItems
            .filter((item) => item.productId === productId)
            .reduce((sum, item) => sum + (item.variant?.quantity || 0), 0)
        );
      }, 0);
    };

    // Get total sales for the product from completed or delivered orders
    const getTotalSalesOfAProduct = (productId, orderObject) => {
      // If orderObject is not provided, get successful orders
      const ordersToUse = orderObject || getSuccessfullOrders();

      const productOrders = ordersToUse.filter(
        (order) =>
          order.orderedItems &&
          order.orderedItems.some((item) => item.productId === productId),
      );

      return productOrders.reduce((total, order) => {
        return (
          total +
          order.orderedItems
            .filter((item) => item.productId === productId)
            .reduce((sum, item) => sum + (item.variant?.subTotal || 0), 0)
        );
      }, 0);
    };

    // Get total sold items for the variant from completed or delivered orders
    const getOrderSubTotalCountOfAVariant = (variantId, orderObject) => {
      // If orderObject is not provided, get successful orders
      const ordersToUse = orderObject || getSuccessfullOrders();

      const variantOrders = ordersToUse.filter(
        (order) =>
          order.orderedItems &&
          order.orderedItems.some((item) => item.variant?._id === variantId),
      );

      return variantOrders.reduce((total, order) => {
        const item = order.orderedItems.find(
          (item1) => item1.variant?._id === variantId,
        );
        return total + (item?.variant?.quantity || 0);
      }, 0);
    };

    // Get total subTotal for the variant.
    const getOrderSubTotalOfAVariant = (variantId, orderObject) => {
      // If orderObject is not provided, get successful orders
      const ordersToUse = orderObject || getSuccessfullOrders();

      const variantOrders = ordersToUse.filter(
        (order) =>
          order.orderedItems &&
          order.orderedItems.some((item) => item.variant?._id === variantId),
      );

      return variantOrders.reduce((total, order) => {
        const item = order.orderedItems.find(
          (item1) => item1.variant?._id === variantId,
        );
        return total + (item?.variant?.subTotal || 0);
      }, 0);
    };

    // Sum of all .orderTotalPrice property or received data as orderData.
    const getTotalAmount = (orderData) => {
      return orderData.reduce((sum, order) => {
        const raw = order?.summary?.orderTotalPrice;
        const price = Number(raw || 0);
        return sum + (isNaN(price) ? 0 : price);
      }, 0);
    };

    // Get orderTotalPrice by passing orderData and currentStatsus.slug
    const getOrderTotalPriceByOrdersOFAUser = (
      currentStatusSlug,
      ordersByThisPerson,
    ) => {
      const orderList = getOrdersByStatusSlug(
        currentStatusSlug,
        ordersByThisPerson,
      );
      const totalAmount = getTotalAmount(orderList);
      return totalAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    // Get total pending purchase by a user.
    const getPendingPurchaseTotal = (ordersByThisPerson) => {
      // Successfull purchase
      const successfullPurchase =
        getSuccessfullPurchaseTotal(ordersByThisPerson);

      // All time purchase
      const allPurchase = getTotalAmount(ordersByThisPerson);

      // Pending purchase
      const pendingPurchaseTotal = successfullPurchase - allPurchase;

      return pendingPurchaseTotal < 0
        ? pendingPurchaseTotal * -1
        : pendingPurchaseTotal;
    };

    // Get total successfull purchase by a user.
    const getSuccessfullPurchaseTotal = (ordersByThisPerson) => {
      // const successfullOrdersByThisPerson =
      //   getSuccessfullOrders(ordersByThisPerson);

      const successfullOrdersByThisPerson = getOrdersByStatusSlug(
        successfulOrderStatuses,
        ordersByThisPerson,
      );
      const successfullPurchaseAmount = getTotalAmount(
        successfullOrdersByThisPerson,
      );
      return successfullPurchaseAmount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    };

    return {
      getAllOrders,
      getCompletedOrders,
      getDeliveredOrders,
      getOrdersByStatusSlug,
      getOrdersWithOrderPlaced,
      getSuccessfullOrders,
      getPendingOrders,
      getUnSuccessfullOrders,
      getSuccessfullOrdersOfAProduct,
      getSumOrderedItemsQuantity,
      getPendingOrdersOfAProduct,
      getUnsuccessfulOrdersOfAProduct,
      getTotalSoldItemsOfAProduct,
      getTotalSalesOfAProduct,
      getOrderSubTotalCountOfAVariant,
      getOrderSubTotalOfAVariant,
      getTotalAmount,
      getOrderTotalPriceByOrdersOFAUser,
      getPendingPurchaseTotal,
      getSuccessfullPurchaseTotal,
    };
  }, []);

  return (
    <OrdersAnalyticsContext.Provider value={{ ordersAnalyticsValue }}>
      {children}
    </OrdersAnalyticsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOrdersAnalytics = () => useContext(OrdersAnalyticsContext);
