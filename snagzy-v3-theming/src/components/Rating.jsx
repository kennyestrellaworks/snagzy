import { amountToDecimalV2 } from "../utils/helpers";

export const Rating = ({ value = 0, max = 5, size = "text-xl" }) => {
  const safeValue = Math.min(max, Math.max(0, value));

  return (
    <div className="flex items-center gap-2">
      <p className="flex items-center justify-center bg-yellow-400 rounded-md px-1 py-0.5 text-[12px]">
        {amountToDecimalV2(value)}
      </p>
      <div className="flex items-center gap-1">
        {Array.from({ length: max }).map((_, i) => {
          const fillPercent = Math.min(Math.max(safeValue - i, 0), 1) * 100;

          return (
            <div key={i} className={`relative ${size}`}>
              {/* Empty star */}
              <span className="text-gray-300">★</span>

              {/* Filled star (clipped) */}
              <span
                className="absolute left-0 top-0 overflow-hidden text-yellow-400"
                style={{ width: `${fillPercent}%` }}
              >
                ★
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const RatingV2 = ({ value = 0, max = 5, size = "text-xl" }) => {
  const safeValue = Math.min(max, Math.max(0, value));

  return (
    <div className="flex flex-col items-center">
      <h1 className="flex items-center justify-center text-3xl font-bold leading-8">
        {amountToDecimalV2(value)}
      </h1>
      <div className="flex items-center">
        {Array.from({ length: max }).map((_, i) => {
          const fillPercent = Math.min(Math.max(safeValue - i, 0), 1) * 100;

          return (
            <div key={i} className={`relative text-[16px] ${size}`}>
              {/* Empty star */}
              <span className="text-gray-300">★</span>

              {/* Filled star (clipped) */}
              <span
                className="absolute left-0 top-0 overflow-hidden text-yellow-400"
                style={{ width: `${fillPercent}%` }}
              >
                ★
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
