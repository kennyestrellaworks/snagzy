import { useEffect, useMemo, useRef, useState } from "react";
import { useData } from "../../context/DataContext";
import { IoIosArrowDown } from "../SVG";
import {
  countBadge,
  filterButton,
  filterDropdownAll,
  filterDropdownAllText,
  filterDropdownBox,
  filterDropdownList,
  filterDropdownListItem,
  filterDropdownWrapper,
  filterRef,
  filterSelectedBox,
  filterSelectedOf,
  filterSelectedWrapper,
  filterSvg,
  filterTitle,
  filterWrapper,
} from "./filter-css";
import { LengthIsZeroErrorSmall } from "../LengthIsZeroError";
import { FilterInput } from "./FilterInput";
import { FilterSortButton } from "./FilterSortButton";
import { FilterLoadMoreButton } from "./FilterLoadMoreButton";

export const CategoryFilter = ({
  categories,
  selectedCategoryDisplay,
  isCategorySelected,
  selectedCategory,
  getAllProductsOfCategoryId,
  handleCategoryChange,
  ariaLabel,
  filterName,
  visibleCountParams,
  filteredProducts,
  isStoreSelected,
  selectedStore,
  isProductStatusSelected,
  selectedProductStatus,
}) => {
  const { getAllProducts } = useData();
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [displayCount, setDisplayCount] = useState(8);
  const [sortOrder, setSortOrder] = useState("none"); // 'none', 'asc', 'desc'

  const allProducts = getAllProducts();

  const categoryDropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  const processOtherFilters = (categoryId) => {
    return allProducts.filter((product) => {
      const matchesCategory =
        Array.isArray(product.categories) &&
        product.categories.some((catId) => catId === categoryId);
      if (!matchesCategory) return false;

      if (isStoreSelected && selectedStore) {
        if ((product.storeOwnerInfo?.storeId || "") !== selectedStore._id)
          return false;
      }

      if (isProductStatusSelected && selectedProductStatus) {
        if ((product.status || "") !== selectedProductStatus._id) return false;
      }

      return true;
    });
  };

  const onSearchChange = (e) => {
    e.preventDefault();
    const val = e.target.value;

    setSearchInput(val);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setCategoryDropdownOpen(false);
    }, 300);
  };

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 8);
  };

  const handleSort = () => {
    setSortOrder((prev) => {
      if (prev === "none") return "asc";
      if (prev === "asc") return "desc";
      if (prev === "desc") return "asc";
    });
  };

  const filteredCategories = useMemo(() => {
    let result = categories || [];

    const term = searchInput.trim().toLowerCase();

    if (term) {
      result = result.filter((category) => {
        if ((category.name || "").toLowerCase().includes(term)) return true;
        if ((category.slug || "").toLowerCase().includes(term)) return true;

        return false;
      });
    }

    return result;
  }, [categories, searchInput]);

  const displayedCategories = useMemo(() => {
    let result = (filteredCategories || []).slice(0, displayCount);

    if (sortOrder === "asc") {
      result = result.sort((a, b) =>
        (a.slug || "").localeCompare(b.slug || ""),
      );
    } else if (sortOrder === "desc") {
      result = result.sort((a, b) =>
        (b.slug || "").localeCompare(a.slug || ""),
      );
    }

    return result;
  }, [filteredCategories, displayCount, sortOrder]);

  return (
    <div
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`${filterName} ${filterWrapper}`}
    >
      <div className={`${filterRef}`} ref={categoryDropdownRef}>
        <button
          onClick={() => {
            setCategoryDropdownOpen((item) => !item);
          }}
          aria-label={ariaLabel}
          type="button"
          className={`${filterButton} filter-button`}
        >
          <div
            className={`${isCategorySelected ? "filter-title-active" : ""} ${filterTitle}`}
          >
            <div className={`${filterSelectedWrapper}`}>
              {selectedCategoryDisplay}
              {isCategorySelected && selectedCategory && (
                <div className={`${filterSelectedBox}`}>
                  {isStoreSelected || isProductStatusSelected ? (
                    filteredProducts.length > visibleCountParams ? (
                      <span className={`of-count ${filterSelectedOf}`}>
                        {visibleCountParams} of
                      </span>
                    ) : (
                      ""
                    )
                  ) : getAllProductsOfCategoryId(selectedCategory?._id).length >
                    visibleCountParams ? (
                    <span className={`of-count ${filterSelectedOf}`}>
                      {visibleCountParams} of
                    </span>
                  ) : (
                    ""
                  )}
                  {isStoreSelected || isProductStatusSelected ? (
                    filteredProducts.length === 0 ? null : (
                      <span className={`count-badge ${countBadge}`}>
                        {filteredProducts.length}
                      </span>
                    )
                  ) : getAllProductsOfCategoryId(selectedCategory._id)
                      .length === 0 ? null : (
                    <span className={`count-badge ${countBadge}`}>
                      {getAllProductsOfCategoryId(selectedCategory._id).length}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <IoIosArrowDown
            height={10}
            width={10}
            className={`arrow-icon ${filterSvg} ${categoryDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
        {categoryDropdownOpen && (
          <div className={`${filterDropdownWrapper}`}>
            <div className={`${filterDropdownBox}`}>
              <div className={`${filterDropdownAll}`}>
                <div
                  onMouseDown={() => {
                    handleCategoryChange("");
                    setCategoryDropdownOpen(false);
                  }}
                  className={`${filterDropdownAllText}`}
                >
                  <h1 className="text-sm py-1 rounded-sm cursor-pointer text-gray-400/80 leading-tight">
                    All
                  </h1>
                </div>
              </div>
              <div className="flex gap-2">
                {/* Filter list search  */}
                <FilterInput
                  searchInput={searchInput}
                  setSearchInput={setSearchInput}
                  onSearchChange={onSearchChange}
                />
                <FilterSortButton
                  searchResult={displayedCategories.length}
                  handleSort={handleSort}
                  sortOrder={sortOrder}
                />
              </div>
              <div
                className={`flex flex-col mt-2
                  ${
                    displayedCategories?.length === 0
                      ? "h-60"
                      : displayedCategories?.length >= 6
                        ? "h-70 overflow-y-scroll"
                        : ""
                  } scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400`}
              >
                {displayedCategories.length === 0 ? (
                  <LengthIsZeroErrorSmall />
                ) : (
                  <div className="flex flex-col">
                    {displayedCategories.map((category, index) => {
                      return (
                        <div
                          key={index}
                          onMouseDown={() => {
                            handleCategoryChange(category._id);
                            setCategoryDropdownOpen(false);
                          }}
                          className={`filter-list ${filterDropdownList} ${selectedCategory && selectedCategory._id === category._id ? "filter-list-active" : ""}`}
                        >
                          {category.name}
                          {isStoreSelected || isProductStatusSelected ? (
                            processOtherFilters(category._id)?.length ===
                            0 ? null : (
                              <span
                                className={`count-badge-item ${filterDropdownListItem} ${selectedCategory && selectedCategory._id === category._id ? "count-badge-item-active" : ""}`}
                              >
                                {processOtherFilters(category._id)?.length}
                              </span>
                            )
                          ) : getAllProductsOfCategoryId(category._id)
                              ?.length === 0 ? null : (
                            <span
                              className={`count-badge-item ${filterDropdownListItem} ${selectedCategory && selectedCategory._id === category._id ? "count-badge-item-active" : ""}`}
                            >
                              {getAllProductsOfCategoryId(category._id)?.length}
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {filteredCategories.length > displayedCategories.length && (
                      <div className="p-2">
                        <FilterLoadMoreButton handleLoadMore={handleLoadMore} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
