export const OrderStatusBadge = ({ status }) => {
  const statusColorMap = {
    order_placed: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-300",
    },
    payment_pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-300",
    },
    payment_confirmed: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
    },
    processing: {
      bg: "bg-cyan-100",
      text: "text-cyan-800",
      border: "border-cyan-300",
    },
    packed: {
      bg: "bg-indigo-100",
      text: "text-indigo-800",
      border: "border-indigo-300",
    },
    shipped: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-300",
    },
    out_for_delivery: {
      bg: "bg-pink-100",
      text: "text-pink-800",
      border: "border-pink-300",
    },
    delivered: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      border: "border-emerald-300",
    },
    completed: {
      bg: "bg-lime-100",
      text: "text-lime-800",
      border: "border-lime-300",
    },
    cancelled_by_buyer: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-300",
    },
    cancelled_by_seller: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-300",
    },
    delivery_failed: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      border: "border-orange-300",
    },
    attempted_delivery: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      border: "border-orange-300",
    },
    returned: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-300",
    },
    return_request: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-300",
    },
    refund_success: {
      bg: "bg-pink-100",
      text: "text-pink-800",
      border: "border-pink-300",
    },
    order_returned: {
      bg: "bg-pink-100",
      text: "text-pink-800",
      border: "border-pink-300",
    },
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-300",
    },
  };

  const colors = statusColorMap[status] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-300",
  };

  const label = (status || "")
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="flex flex-col items-start">
      <span
        className={`inline px-2 rounded-sm text-xs border box-decoration-clone ${colors.bg} ${colors.text} ${colors.border}`}
      >
        {label}
      </span>
    </div>
  );
};
