import { AnalyticsStatCardMiniV2 } from "./AnalyticsStatCards";
import {
  successfulOrderStatuses,
  pendingOrderStatuses,
  unsuccessfulOrderStatuses,
} from "../../data/orderLifeCycle";

// Helper: returns border class based on status group
const getBorderClassForStatus = (status) => {
  if (successfulOrderStatuses.includes(status))
    return "border-2 border-green-500";
  if (pendingOrderStatuses.includes(status)) return "border-2 border-amber-400";
  if (unsuccessfulOrderStatuses.includes(status))
    return "border-2 border-red-400";
  return "border-gray-300"; // fallback
};

export const OrderLifeCycleStatsBoxes = ({
  onOrderLifeCycleTabChange,
  processOrderLifeCycleData,
  analyticsData,
  statusCompleted,
  statusDelivered,
  statusOrderPlaced,
  statusPaymentPending,
  statusPaymentConfirmed,
  statusProcessing,
  statusPacked,
  statusShipped,
  statusOutForDelivery,
  statusDeliveryFailed,
  statusAttemptedDelivery,
  statusCancelledByBuyer,
  statusCancelledBySeller,
  statusReturnRequest,
  statusOrderReturned,
  statusRefundSuccess,
  activeOrderLifeCycleTab,
}) => {
  // Helper to compute the final boxStyle for a given card
  const getBoxStyle = (cardStatus, defaultBoxStyle) => {
    if (cardStatus !== activeOrderLifeCycleTab) return defaultBoxStyle;
    const activeBorder = getBorderClassForStatus(cardStatus);
    // Append the active border class so it overrides the default border
    return `${defaultBoxStyle} ${activeBorder}`;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 mt-4">
      <div onClick={() => onOrderLifeCycleTabChange("completed")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusCompleted,
            analyticsData,
          )}
          boxTitle={"Completed"}
          boxStyle={getBoxStyle("completed", "bg-green-200 border-green-400")}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("delivered")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusDelivered,
            analyticsData,
          )}
          boxTitle={"Delivered"}
          boxStyle={getBoxStyle("delivered", "bg-lime-200 border-lime-400")}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("order_placed")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusOrderPlaced,
            analyticsData,
          )}
          boxTitle={"Order Placed"}
          boxStyle={getBoxStyle(
            "order_placed",
            "bg-amber-100 border-amber-200",
          )}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("payment_pending")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusPaymentPending,
            analyticsData,
          )}
          boxTitle={"Payment Pending"}
          boxStyle={getBoxStyle(
            "payment_pending",
            "bg-amber-100 border-amber-200",
          )}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("payment_confirmed")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusPaymentConfirmed,
            analyticsData,
          )}
          boxTitle={"Payment Confirmed"}
          boxStyle={getBoxStyle(
            "payment_confirmed",
            "bg-amber-100 border-amber-200",
          )}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("processing")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusProcessing,
            analyticsData,
          )}
          boxTitle={"Processing"}
          boxStyle={getBoxStyle("processing", "bg-amber-100 border-amber-200")}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("packed")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusPacked,
            analyticsData,
          )}
          boxTitle={"Packed"}
          boxStyle={getBoxStyle("packed", "bg-amber-100 border-amber-200")}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("shipped")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusShipped,
            analyticsData,
          )}
          boxTitle={"Shipped"}
          boxStyle={getBoxStyle("shipped", "bg-amber-100 border-amber-200")}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("out_for_delivery")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusOutForDelivery,
            analyticsData,
          )}
          boxTitle={"Out For Delivery"}
          boxStyle={getBoxStyle(
            "out_for_delivery",
            "bg-amber-100 border-amber-200",
          )}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("delivery_failed")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusDeliveryFailed,
            analyticsData,
          )}
          boxTitle={"Delivery Failed"}
          boxStyle={getBoxStyle(
            "delivery_failed",
            "bg-amber-100 border-amber-200",
          )}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("attempted_delivery")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusAttemptedDelivery,
            analyticsData,
          )}
          boxTitle={"Attempted Delivery"}
          boxStyle={getBoxStyle(
            "attempted_delivery",
            "bg-amber-100 border-amber-200",
          )}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("cancelled_by_buyer")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusCancelledByBuyer,
            analyticsData,
          )}
          boxTitle={"Cancelled by Buyer"}
          boxStyle={getBoxStyle(
            "cancelled_by_buyer",
            "bg-red-100 border-red-200",
          )}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("cancelled_by_seller")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusCancelledBySeller,
            analyticsData,
          )}
          boxTitle={"Cancelled by Seller"}
          boxStyle={getBoxStyle(
            "cancelled_by_seller",
            "bg-red-100 border-red-200",
          )}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("return_request")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusReturnRequest,
            analyticsData,
          )}
          boxTitle={"Return Request"}
          boxStyle={getBoxStyle("return_request", "bg-red-100 border-red-200")}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("order_returned")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusOrderReturned,
            analyticsData,
          )}
          boxTitle={"Order Returned"}
          boxStyle={getBoxStyle("order_returned", "bg-red-100 border-red-200")}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("refund_success")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusRefundSuccess,
            analyticsData,
          )}
          boxTitle={"Refund Success"}
          boxStyle={getBoxStyle("refund_success", "bg-red-100 border-red-200")}
          activeOrderLifeCycleTab={activeOrderLifeCycleTab}
        />
      </div>
    </div>
  );
};
