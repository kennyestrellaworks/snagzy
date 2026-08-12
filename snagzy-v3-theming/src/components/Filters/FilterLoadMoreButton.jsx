export const FilterLoadMoreButton = ({ handleLoadMore }) => {
  return (
    <button
      onMouseDown={handleLoadMore}
      type="button"
      className="w-full py-2 px-3 text-sm bg-gray-100 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-600  transition cursor-pointer"
    >
      Load More
    </button>
  );
};
