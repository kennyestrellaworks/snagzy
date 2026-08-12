import { TbArrowsSort } from "../SVG";

export const FilterSortButton = ({ searchResult, handleSort, sortOrder }) => {
  if (searchResult <= 1) return null;

  return (
    <button
      onClick={handleSort}
      type="button"
      className="px-2 rounded cursor-pointer text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 transition"
      title={
        sortOrder === "none"
          ? "Sort ascending"
          : sortOrder === "asc"
            ? "Sort descending"
            : "nSort ascendinge"
      }
    >
      <TbArrowsSort height={16} width={16} />
    </button>
  );
};
