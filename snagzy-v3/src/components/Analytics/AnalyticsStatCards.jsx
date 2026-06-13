import { amountToDecimal, formatWithCommas } from "../../utils/helpers";
import { AmountFormat } from "../AmountFormat";
import { DollarSign } from "../SVG";

export const AnalyticsStatCardMini = ({
  miniAnalyticsData,
  boxTitle,
  boxStyle,
}) => {
  const { ordersToProcess, sumOfTotalPrices, sumOfAllQuantities } =
    miniAnalyticsData;

  return (
    <div className="flex">
      <div className={`flex flex-col border ${boxStyle} w-full p-1 rounded-sm`}>
        <h1 className="leading-tight text-[12px]">{boxTitle}</h1>
        <AmountFormat amount={sumOfTotalPrices} />
        {ordersToProcess.length < 1 ? (
          <div className="flex flex-col mt-1">
            <p className="text-[11px] leading-tight text-gray-500">No data</p>
            <p className="text-[11px] leading-tight text-gray-500">No data</p>
          </div>
        ) : (
          <div className="flex flex-col mt-1">
            <p className="text-[11px] leading-tight">
              {formatWithCommas(ordersToProcess.length)}{" "}
              {ordersToProcess.length === 1
                ? "Order"
                : ordersToProcess.length > 1
                  ? "Orders"
                  : "-"}
            </p>
            <p className="text-[11px] leading-tight">
              {formatWithCommas(sumOfAllQuantities)}{" "}
              {sumOfAllQuantities === 1
                ? "Item"
                : sumOfAllQuantities > 1
                  ? "Items"
                  : "-"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const AnalyticsStatCardMiniV2 = ({
  miniAnalyticsData,
  boxTitle,
  boxStyle,
}) => {
  const { ordersToProcess, sumOfTotalPrices, sumOfAllQuantities } =
    miniAnalyticsData;

  return (
    <div className="flex cursor-pointer">
      <div className={`flex flex-col border ${boxStyle} w-full p-1 rounded-md`}>
        <h1 className="leading-tight text-[12px]">{boxTitle}</h1>
        <div className="flex items-center justify-between">
          {/* <AmountFormat amount={sumOfTotalPrices} /> */}
          <div className="flex gap-1">
            <span>$</span>
            <h1 className="font-bold text-lg">
              {amountToDecimal(sumOfTotalPrices)}
            </h1>
          </div>
          {ordersToProcess.length < 1 ? (
            <div className="flex flex-col mt-1">
              <p className="text-[11px] leading-tight text-gray-500">No data</p>
              <p className="text-[11px] leading-tight text-gray-500">No data</p>
            </div>
          ) : (
            <div className="flex flex-col mt-1">
              <p className="text-[11px] leading-tight">
                {formatWithCommas(ordersToProcess.length)}{" "}
                {ordersToProcess.length === 1
                  ? "Order"
                  : ordersToProcess.length > 1
                    ? "Orders"
                    : "-"}
              </p>
              <p className="text-[11px] leading-tight">
                {formatWithCommas(sumOfAllQuantities)}{" "}
                {sumOfAllQuantities === 1
                  ? "Item"
                  : sumOfAllQuantities > 1
                    ? "Items"
                    : "-"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const AnalyticsStatCardMedium = ({
  miniAnalyticsData,
  boxTitle,
  boxStyle,
  icon: Icon,
  iconStyle,
  amountStyle,
}) => {
  const { ordersToProcess, sumOfTotalPrices, sumOfAllQuantities } =
    miniAnalyticsData;
  // [{ ordersToProcess: [], sumOfTotalPrices: 1.25 sumOfAllQuantities: 1 }];

  return (
    <div className="flex">
      <div
        className={`flex justify-between relative w-full border-3 ${boxStyle} p-4 rounded-xl`}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            {/* <div className={`flex ${iconStyle} p-2 rounded-full text-white"`}>
            {Icon && <Icon height={16} width={16} />}
          </div> */}
            <h1 className="leading-tight text-[16px] font-bold text-gray-500 uppercase">
              {boxTitle}
            </h1>
          </div>
          {/* <AmountFormat amount={sumOfTotalPrices} /> */}
          <div className="flex mt-2 gap-1">
            <span className={`text-xl mt-1 leading-tight ${amountStyle}`}>
              $
            </span>
            <h1 className={`text-3xl font-black ${amountStyle}`}>
              {amountToDecimal(sumOfTotalPrices)}
            </h1>
          </div>

          {ordersToProcess.length < 1 ? (
            <div className="flex flex-col mt-1">
              <p className="text-[14px] leading-tight text-gray-500">No data</p>
              <p className="text-[14px] leading-tight text-gray-500">No data</p>
            </div>
          ) : (
            <div className="flex flex-col mt-1">
              <p className="text-[14px] leading-tight text-gray-500">
                {formatWithCommas(ordersToProcess.length)}{" "}
                {ordersToProcess.length === 1
                  ? "Order"
                  : ordersToProcess.length > 1
                    ? "Orders"
                    : "-"}
              </p>
              <p className="text-[14px] leading-tight text-gray-500">
                {formatWithCommas(sumOfAllQuantities)}{" "}
                {sumOfAllQuantities === 1
                  ? "Item"
                  : sumOfAllQuantities > 1
                    ? "Items"
                    : "-"}
              </p>
            </div>
          )}
        </div>
        <div
          className={`flex shrink-0 self-start ${iconStyle} p-2 rounded-full `}
        >
          {Icon && <Icon height={28} width={28} />}
        </div>
      </div>
    </div>
  );
};
