export const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 text-sm">Loading data...</p>
      </div>
    </div>
  );
};
