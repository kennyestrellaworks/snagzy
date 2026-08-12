export const TextNormal = ({ text }) => {
  return <p className="text-[14px] text-gray-700 leading-tight">{text}</p>;
};

export const TextMedium = ({ text }) => {
  return <p className="text-[16px] text-gray-700 leading-tight">{text}</p>;
};

export const TextNANormal = () => {
  return <p className="text-[16px] text-gray-400 leading-tight">NA</p>;
};
