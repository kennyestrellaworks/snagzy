import { useState } from "react";
import { IoArrowUpOutline, IoArrowDownOutline, TbArrowsSort } from "../SVG";

export const SortDropdown = ({
  options, // Sort options with _id, slug, name
  currentField, // Current sort field slug
  currentDirection, // Current sort direction ('asc' or 'desc')
  onSort, // Sort handler function
  dropdownRef,
  buttonClassName = "",
  dropdownClassName = "",
  position = "left-0",
  width = "w-48",
  showSortIcon = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSort = (slug) => {
    onSort(slug);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div className="flex items-center gap-1">
        {showSortIcon && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`inline-flex items-center gap-1 text-sm hover:text-gray-700 cursor-pointer transition-colors ${buttonClassName}`}
          >
            <TbArrowsSort className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className={`absolute ${position} mt-1 ${width} bg-white border border-gray-200 rounded-md shadow-lg z-50 ${dropdownClassName}`}
        >
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
              Sort by:
            </div>
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option._id}
                  onClick={() => handleSort(option.slug)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                    currentField === option.slug
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  <span>{option.name}</span>
                  {currentField === option.slug &&
                    (currentDirection === "asc" ? (
                      <IoArrowUpOutline className="w-3.5 h-3.5" />
                    ) : (
                      <IoArrowDownOutline className="w-3.5 h-3.5" />
                    ))}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
