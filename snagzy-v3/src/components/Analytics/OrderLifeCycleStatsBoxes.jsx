import { AnalyticsStatCardMiniV2 } from "./AnalyticsStatCards";

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
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 mt-4">
      <div onClick={() => onOrderLifeCycleTabChange("completed")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusCompleted,
            analyticsData,
          )}
          boxTitle={"Completed"}
          boxStyle={"bg-green-200 border-green-400"}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("delivered")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusDelivered,
            analyticsData,
          )}
          boxTitle={"Delivered"}
          boxStyle={"bg-lime-200 border-lime-400"}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("order_placed")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusOrderPlaced,
            analyticsData,
          )}
          boxTitle={"Order Placed"}
          boxStyle={"bg-amber-100 border-amber-200"}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("payment_pending")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusPaymentPending,
            analyticsData,
          )}
          boxTitle={"Payment Pending"}
          boxStyle={"bg-amber-100 border-amber-200"}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("payment_confirmed")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusPaymentConfirmed,
            analyticsData,
          )}
          boxTitle={"Payment Confirmed"}
          boxStyle={"bg-amber-100 border-amber-200"}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("processing")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusProcessing,
            analyticsData,
          )}
          boxTitle={"Processing"}
          boxStyle={"bg-amber-100 border-amber-200"}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("packed")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusPacked,
            analyticsData,
          )}
          boxTitle={"Packed"}
          boxStyle={"bg-amber-100 border-amber-200"}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("shipped")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusShipped,
            analyticsData,
          )}
          boxTitle={"Shipped"}
          boxStyle={"bg-amber-100 border-amber-200"}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("out_for_delivery")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusOutForDelivery,
            analyticsData,
          )}
          boxTitle={"Out For Delivery"}
          boxStyle={"bg-amber-100 border-amber-200"}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("delivery_failed")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusDeliveryFailed,
            analyticsData,
          )}
          boxTitle={"Delivery Failed"}
          boxStyle={"bg-amber-100 border-amber-200"}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("attempted_delivery")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusAttemptedDelivery,
            analyticsData,
          )}
          boxTitle={"Attempted Delivery"}
          boxStyle={"bg-amber-100 border-amber-200"}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("cancelled_by_buyer")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusCancelledByBuyer,
            analyticsData,
          )}
          boxTitle={"Cancelled by Buyer"}
          boxStyle={"bg-red-100 border-red-200"}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("cancelled_by_seller")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusCancelledBySeller,
            analyticsData,
          )}
          boxTitle={"Cancelled by Seller"}
          boxStyle={"bg-red-100 border-red-200"}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("return_request")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusReturnRequest,
            analyticsData,
          )}
          boxTitle={"Return Request"}
          boxStyle={"bg-red-100 border-red-200"}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("returned")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusOrderReturned,
            analyticsData,
          )}
          boxTitle={"Returned"}
          boxStyle={"bg-red-100 border-red-200"}
        />
      </div>
      <div onClick={() => onOrderLifeCycleTabChange("returned_success")}>
        <AnalyticsStatCardMiniV2
          miniAnalyticsData={processOrderLifeCycleData(
            statusRefundSuccess,
            analyticsData,
          )}
          boxTitle={"Returned Success"}
          boxStyle={"bg-red-100 border-red-200"}
        />
      </div>
    </div>
  );
};
