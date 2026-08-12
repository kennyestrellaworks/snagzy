export const dateFormatter = (item) => {
  const dateFormatted = item
    ? (() => {
        const d = new Date(item);
        const month = d.toLocaleString("en", { month: "short" });
        const time = d
          .toLocaleTimeString("en", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
          .toLowerCase();
        return `${month} ${d.getDate()} ${d.getFullYear()} ${time}`;
      })()
    : null;
  return dateFormatted;
};

export const birthDateFormatter = (item) => {
  const dateFormatted = item
    ? (() => {
        const d = new Date(item);
        const month = d.toLocaleString("en", { month: "short" });
        // const time = d
        //   .toLocaleTimeString("en", {
        //     hour: "numeric",
        //     minute: "2-digit",
        //     hour12: true,
        //   })
        //   .toLowerCase();
        // return `${month} ${d.getDate()} ${d.getFullYear()} ${time}`;
        return `${month} ${d.getDate()} ${d.getFullYear()}`;
      })()
    : null;
  return dateFormatted;
};

export const getAge = (birthDate) => {
  return birthDate
    ? (() => {
        const bd = new Date(birthDate);
        if (Number.isNaN(bd.getTime())) return null;
        const today = new Date();
        let a = today.getFullYear() - bd.getFullYear();
        const m = today.getMonth() - bd.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) a--;
        return a;
      })()
    : null;
};

export const sumAllQuantityOfAnOrder = (order) => {
  return (order.orderedItems || []).reduce(
    (sum, it) => sum + (Number(it?.variant?.quanity) || 0),
    0,
  );
};

export const isoToRegularTimestamp = (isoString) => {
  const date = new Date(isoString);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12; // convert 0 -> 12

  return `${month} ${day} ${year} ${hours}:${minutes}${ampm}`;
};

export const amountToDecimal = (amount) => {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const amountToDecimalV2 = (amount) => {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
};

export const formatWithCommas = (number) => {
  // Convert to string, handle negatives separately
  const isNegative = number < 0;
  const absValue = Math.abs(number);

  // Convert to string and split into integer and decimal parts (if any)
  let [integerPart, decimalPart] = absValue.toString().split(".");

  // Add commas to integer part
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Reassemble with decimal part if present
  let result = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;

  // Add back negative sign if needed
  return isNegative ? `-${result}` : result;
};

export const getButtonClasses = (isActive, isDisabled) => {
  const base = "flex rounded text-[12px] px-3 py-1 transition-colors";
  const modeClass = isActive
    ? "bg-gray-700 text-white"
    : "bg-gray-100 text-gray-400";
  const interactiveClass = isDisabled
    ? "cursor-not-allowed"
    : "hover:bg-gray-200 cursor-pointer";
  return `${base} ${modeClass} ${interactiveClass}`;
};
