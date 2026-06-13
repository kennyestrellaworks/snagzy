export const GradientButton = ({ buttonName, className }) => {
  return (
    <button
      className={`${className} rounded-sm px-3 bg-linear-to-r text-white from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 cursor-pointer`}
    >
      {buttonName}
    </button>
  );
};
