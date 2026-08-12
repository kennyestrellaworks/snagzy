import {
  IoArrowDownOutline,
  IoArrowUpOutline,
  TbArrowsSort,
} from "../../components/SVG";

export const SortButtonNDropdown = ({
  title,
  sortField,
  sortDirection,
  onSort,
  options = [],
  hasItems = true,
  dropdownRef,
  isDropdownOpen,
  setIsDropdownOpen,
  type = "dropdown", // 'dropdown' or 'simple'
  align = "left", // 'left' or 'right'
}) => {
  const handleSimpleSort = () => {
    if (!hasItems) return;

    const newDirection =
      sortField === title.toLowerCase()
        ? sortDirection === "asc"
          ? "desc"
          : "asc"
        : "asc";

    onSort({
      field: title.toLowerCase(),
      direction: newDirection,
      priceSortField: "",
      priceSortDirection: "asc",
    });
  };

  const handleOptionSelect = (option) => {
    if (!hasItems) return;

    const newDirection =
      sortField === option.slug
        ? sortDirection === "asc"
          ? "desc"
          : "asc"
        : "asc";

    onSort({
      field: option.slug,
      direction: newDirection,
      priceSortField:
        option.slug.startsWith("min-") || option.slug.startsWith("max-")
          ? option.slug
          : "",
      priceSortDirection: newDirection,
    });

    if (setIsDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  // For simple sort button (no dropdown)
  if (type === "simple") {
    return (
      <div className="flex items-center">
        <span>{title}</span>
        {hasItems && (
          <button
            onClick={handleSimpleSort}
            title={
              sortField === title.toLowerCase() && sortDirection === "asc"
                ? `Sort ${title.toLowerCase()} asc`
                : sortField === title.toLowerCase() && sortDirection === "desc"
                  ? `Sort ${title.toLowerCase()} desc`
                  : `Sort by ${title.toLowerCase()}`
            }
            className="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-300 ease-in-out"
          >
            <TbArrowsSort height={16} width={16} />
          </button>
        )}
      </div>
    );
  }

  // For dropdown sort button
  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div className="flex items-center">
        <span>{title}</span>
        {hasItems && (
          <button
            onClick={() =>
              setIsDropdownOpen && setIsDropdownOpen(!isDropdownOpen)
            }
            className="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-300 ease-in-out"
          >
            <TbArrowsSort height={16} width={16} />
          </button>
        )}
      </div>

      {isDropdownOpen && hasItems && (
        <div
          className={`absolute top-6 ${
            align === "right" ? "right-0" : "left-0"
          } w-max bg-white border border-gray-300 rounded shadow-md z-40`}
        >
          <div className="flex flex-col p-1">
            <div className="px-3 py-1 text-xs text-gray-500">Sort by:</div>
            {options.map((option, index) => (
              <div
                key={index}
                onMouseDown={() => handleOptionSelect(option)}
                className={`px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between gap-4 ${
                  sortField === option.slug ? "bg-gray-50" : ""
                }`}
              >
                <span>{option.name}</span>
                {sortField === option.slug && (
                  <span className="ml-2">
                    {sortDirection === "asc" ? (
                      <IoArrowUpOutline height={14} width={14} />
                    ) : (
                      <IoArrowDownOutline height={14} width={14} />
                    )}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
