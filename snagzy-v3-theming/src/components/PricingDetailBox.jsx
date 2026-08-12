import { AmountFormatSmall } from "./AmountFormat";
import { DiscountFormatSmall } from "./DiscountFormat";

export const PricingDetailBox = ({ variantItem }) => {
  return (
    <div className="flex flex-col">
      <div className="flex gap-2">
        <p className="text-[13px] text-gray-500 leading-tight">Base Price:</p>{" "}
        <AmountFormatSmall amount={variantItem.price} />
      </div>
      <div className="flex gap-2">
        <p className="text-[13px] text-gray-500 leading-tight">Discount :</p>{" "}
        <DiscountFormatSmall discount={variantItem.discount} />
      </div>
      <div className="flex mt-1 gap-2">
        <p className="text-[13px] text-gray-500 leading-tight">Price :</p>{" "}
        <AmountFormatSmall amount={variantItem.displayedPrice} />
      </div>
    </div>
  );
};
