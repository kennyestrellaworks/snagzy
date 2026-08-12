import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";

export const PaymentDetailBox = ({ variantItem }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <p className="text-[13px] text-gray-500 leading-tight">
          Payment Status:
        </p>
        <PaymentStatusBadge status={variantItem.paymentInfo} />
      </div>
      <div className="flex flex-col">
        <p className="text-[13px] text-gray-500 leading-tight">Order Status:</p>
        <OrderStatusBadge status={variantItem.currentStatus.slug} />
      </div>
    </div>
  );
};
