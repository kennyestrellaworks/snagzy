import { amountToDecimal } from "../utils/helpers";

export const AmountFormat = ({ amount }) => {
  return (
    <div className="flex gap-1">
      <span className="text-[13px]">$</span>
      <span className="font-semibold text-[17px] leading-tight">
        {amountToDecimal(amount)}
      </span>
    </div>
  );
};

export const AmountFormatSmall = ({ amount }) => {
  return (
    <div className="flex gap-1">
      <span className="text-[11px]">$</span>
      <span className="font-semibold text-sm leading-tight">
        {amountToDecimal(amount)}
      </span>
    </div>
  );
};

export const AmountFormatSmallThin = ({ amount }) => {
  return (
    <div className="flex gap-1">
      <span className="text-[11px]">$</span>
      <span className="text-sm leading-tight">{amountToDecimal(amount)}</span>
    </div>
  );
};
