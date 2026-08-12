import { CheckCircle, XCircle } from "../SVG";

export const TimelineCircle = ({ item, hasVerticalLine }) => {
  return (
    <div className="flex items-start relative">
      <div className="absolute top-0 left-6 z-30">
        {hasVerticalLine ? (
          <div
            className={`flex h-40 w-0.5 ${
              item.slug === "cancelled_by_seller" ||
              item.slug === "cancelled_by_buyer" ||
              item.slug === "delivery_failed" ||
              item.slug === "refund_success" ||
              item.slug === "order_returned" ||
              item.slug === "return_request"
                ? "bg-red-300"
                : "bg-green-300"
            }`}
          >
            &nbsp;
          </div>
        ) : null}
      </div>

      <div className="absolute top-6 left-6 z-30">
        <div
          className={`flex h-0.5 w-30 ${
            item.slug === "cancelled_by_seller" ||
            item.slug === "cancelled_by_buyer" ||
            item.slug === "delivery_failed" ||
            item.slug === "refund_success" ||
            item.slug === "order_returned" ||
            item.slug === "return_request"
              ? "bg-red-300"
              : "bg-green-300"
          } ${item.slug === "attempted_delivery" ? "bg-violet-300" : ""}`}
        >
          &nbsp;
        </div>
      </div>

      <div
        className={`${
          item.slug === "cancelled_by_seller" ||
          item.slug === "cancelled_by_buyer" ||
          item.slug === "delivery_failed" ||
          item.slug === "refund_success" ||
          item.slug === "order_returned" ||
          item.slug === "return_request"
            ? "bg-red-100 border-red-500 text-red-700"
            : "bg-green-100 border-green-500 text-green-700"
        } ${
          item.slug === "attempted_delivery"
            ? "bg-violet-100 border-violet-500 text-violet-700"
            : ""
        } z-40 rounded-full p-2 border-2`}
      >
        {item.slug === "cancelled_by_seller" ||
        item.slug === "cancelled_by_buyer" ||
        item.slug === "delivery_failed" ||
        item.slug === "refund_success" ||
        item.slug === "order_returned" ||
        item.slug === "return_request" ? (
          <XCircle height={30} width={30} />
        ) : (
          <CheckCircle height={30} width={30} />
        )}
      </div>
    </div>
  );
};
