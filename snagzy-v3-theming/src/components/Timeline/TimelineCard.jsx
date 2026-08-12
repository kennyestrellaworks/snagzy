import { dateFormatter } from "../../utils/helpers";

export const TimelineCard = ({ item }) => {
  return (
    <div className="flex z-60">
      <div
        className={`flex flex-col ${
          item.slug === "cancelled_by_seller" ||
          item.slug === "cancelled_by_buyer" ||
          item.slug === "delivery_failed" ||
          item.slug === "order_returned" ||
          item.slug === "refund_success" ||
          item.slug === "return_request"
            ? "bg-red-100 border-2 border-red-500"
            : "bg-green-100 border-2 border-green-500"
        } ${
          item.slug === "attempted_delivery"
            ? "bg-violet-100 border-violet-500 text-violet-700"
            : ""
        } w-full rounded-md p-4`}
      >
        <h1
          className={`${
            item.slug === "cancelled_by_seller" ||
            item.slug === "cancelled_by_buyer" ||
            item.slug === "delivery_failed" ||
            item.slug === "order_returned" ||
            item.slug === "refund_success" ||
            item.slug === "return_request"
              ? "text-red-900"
              : "text-green-900"
          } ${
            item.slug === "attempted_delivery"
              ? "bg-violet-100 border-violet-500 text-violet-700"
              : ""
          } font-semibold text-lg leading-tight`}
        >
          {item.label}
        </h1>
        <p
          className={`text-[16px] mt-1 leading-tight ${
            item.slug === "cancelled_by_seller" ||
            item.slug === "cancelled_by_buyer" ||
            item.slug === "delivery_failed" ||
            item.slug === "order_returned" ||
            item.slug === "refund_success" ||
            item.slug === "return_request"
              ? "text-red-700"
              : "text-green-700"
          } ${
            item.slug === "attempted_delivery"
              ? "bg-violet-100 border-violet-500 text-violet-700"
              : ""
          }`}
        >
          {item.description}
        </p>
        <p
          className={`text-[12px] leading-tight ${
            item.slug === "cancelled_by_seller" ||
            item.slug === "cancelled_by_buyer" ||
            item.slug === "delivery_failed" ||
            item.slug === "order_returned" ||
            item.slug === "refund_success" ||
            item.slug === "return_request"
              ? "text-red-400"
              : "text-green-600"
          } ${
            item.slug === "attempted_delivery"
              ? "bg-violet-100 border-violet-500 text-violet-700"
              : ""
          } mt-4`}
        >
          {dateFormatter(item.timestamp)}
        </p>
      </div>
    </div>
  );
};
