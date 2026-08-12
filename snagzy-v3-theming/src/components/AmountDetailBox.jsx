import { AmountFormatSmall } from "./AmountFormat";
import { SalesBadgeSmall } from "./Badges";

export const AmountDetailBox = ({ variantItem }) => {
  return (
    <div className="flex flex-col">
      <div className="flex gap-2">
        <p className="text-[13px] text-gray-500 leading-tight">Base Price:</p>{" "}
        <AmountFormatSmall amount={variantItem.orderedItem.price} />
      </div>
      <div className="flex gap-2">
        <p className="text-[13px] text-gray-500 leading-tight">Quantity:</p>{" "}
        <span className="font-semibold leading-tight">
          {variantItem.orderedItem.quantity}
        </span>
      </div>
      <div className="flex mt-1 gap-2">
        <span className="text-gray-500 leading-tight">Sub Total:</span>{" "}
        {variantItem.currentStatus.label === "Delivered" ||
        variantItem.currentStatus.label === "Completed" ? (
          <SalesBadgeSmall amount={variantItem.orderedItem.subTotal} />
        ) : (
          <AmountFormatSmall amount={variantItem.orderedItem.subTotal} />
        )}
      </div>
    </div>
  );
};
