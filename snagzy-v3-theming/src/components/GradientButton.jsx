export const GradientButton = ({ onClick, buttonName }) => {
  return (
    <div className="flex w-max h-full">
      <button
        onClick={onClick}
        className={`h-full
        rounded-sm px-3 cursor-pointer bg-linear-to-r text-white from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-base font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2      
      `}
      >
        {buttonName}
      </button>
    </div>
  );
};
