import { IoIosArrowDown } from "./SVG";

export const CategoryFilter = ({
  categories,
  categoryDropdownRef,
  setCategoryDropdownOpen,
  selectedCategoryDisplay,
  isCategorySelected,
  selectedCategory,
  getAllProductsOfCategoryId,
  categoryDropdownOpen,
  handleCategoryChange,
  ariaLabel,
  visibleCountParams,
  filteredProducts,
  isStoreSelected,
  isProductStatusSelected,
}) => {
  return (
    <div className={` flex flex-col items-start gap-1 z-50`}>
      <div className="relative  inline-block" ref={categoryDropdownRef}>
        <button
          onClick={() => setCategoryDropdownOpen((item) => !item)}
          className={`p-1 rounded-sm text-sm w-64 border border-gray-400 bg-white text-left flex justify-between items-center cursor-pointer`}
          aria-label={ariaLabel}
          type="button"
        >
          <div className="border border-gray-400 w-full px-2 py-1 rounded-sm">
            <div className="flex gap-1 items-center justify-between">
              {selectedCategoryDisplay}
              {isCategorySelected && selectedCategory && (
                <div className="flex gap-1 items-center">
                  {isStoreSelected || isProductStatusSelected ? (
                    filteredProducts.length > visibleCountParams ? (
                      <span className=" ml-2 text-[12px] text-gray-400">
                        {visibleCountParams} of
                      </span>
                    ) : (
                      ""
                    )
                  ) : getAllProductsOfCategoryId(selectedCategory?._id).length >
                    visibleCountParams ? (
                    <span className=" ml-2 text-[12px] text-gray-400">
                      {visibleCountParams} of
                    </span>
                  ) : (
                    ""
                  )}
                  <span className="text-[12px] border border-gray-400 px-1 rounded-sm">
                    {isStoreSelected || isProductStatusSelected
                      ? filteredProducts.length
                      : getAllProductsOfCategoryId(selectedCategory._id).length}
                  </span>
                </div>
              )}
            </div>
          </div>

          <IoIosArrowDown
            height={10}
            width={10}
            className={`arrow-icon w-4 h-4 transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
        {categoryDropdownOpen && (
          <div className={`absolute mt-1 w-64 z-50 overflow-hidden`}>
            <div
              className={`flex flex-col p-1 bg-white border border-gray-400 rounded-sm`}
            >
              <div className={`p-2 text-sm rounded-sm cursor-pointer`}>
                <div
                  onMouseDown={() => {
                    handleCategoryChange("");
                    setCategoryDropdownOpen(false);
                  }}
                  className={`text-sm rounded-sm cursor-pointer text-gray-400/80`}
                >
                  All
                </div>
              </div>
              {categories.map((category, index) => {
                return (
                  <div
                    key={index}
                    onMouseDown={() => {
                      handleCategoryChange(category._id);
                      setCategoryDropdownOpen(false);
                    }}
                    className={`flex justify-between bg-white hover:bg-gray-100 p-2 text-sm rounded-sm cursor-pointer`}
                  >
                    {category.name}
                    <span className="text-[12px] border border-gray-400 ml-2 px-1 rounded-sm">
                      {getAllProductsOfCategoryId(category._id).length}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
