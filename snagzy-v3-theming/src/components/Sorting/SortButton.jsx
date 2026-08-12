import { TbArrowsSort } from "../SVG";

export const SortButton = ({
  field, // Field slug to sort by
  currentField, // Current active sort field
  currentDirection, // Current sort direction
  onSort, // Sort handler
  showIcon = true,
  className = "",
}) => {
  const isActive = currentField === field;

  return (
    <button
      onClick={() => onSort(field)}
      className={`inline-flex items-center gap-1 text-sm hover:text-gray-700 cursor-pointer transition-colors ${className}`}
    >
      {showIcon && (
        <TbArrowsSort
          className={`w-4 h-4 ${isActive ? "text-blue-500" : "text-gray-400"}`}
        />
      )}
    </button>
  );
};
