export const DiscountFormatSmall = ({ discount }) => {
  return (
    <div className="flex gap-1">
      <span className="font-semibold text-sm leading-tight">
        {discount * 100}
      </span>
      <span className="text-[11px]">%</span>
    </div>
  );
};

export const DiscountFormatNormal = ({ discount }) => {
  return (
    <div className="flex gap-1">
      <span className="font-semibold text-sm leading-tight">
        {discount * 100}
      </span>
      <span className="text-[14px]">%</span>
    </div>
  );
};
