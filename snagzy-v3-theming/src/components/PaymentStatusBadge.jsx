export const PaymentStatusBadge = ({ status }) => {
  const statusColorMap = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-300",
    },
    paid: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
    },
    refunded: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-300",
    },
    refundable: {
      bg: "bg-pink-100",
      text: "text-pink-800",
      border: "border-pink-300",
    },
  };

  const colors = statusColorMap[status.slug] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-300",
  };

  return (
    <div className="flex flex-col items-start">
      <span
        className={`inline px-2 rounded-sm text-xs border box-decoration-clone ${colors.bg} ${colors.text} ${colors.border}`}
      >
        {status.status}
      </span>
    </div>
  );
};
