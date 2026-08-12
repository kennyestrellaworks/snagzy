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
import "./filter.css";
import { LengthIsZeroErrorSmall } from "../LengthIsZeroError";
import { FilterInput } from "./FilterInput";
import { FilterSortButton } from "./FilterSortButton";
import { FilterLoadMoreButton } from "./FilterLoadMoreButton";

export const StoreFilter = ({
  stores,
  selectedStoreDisplay,
  isStoreSelected,
  selectedStore,
  getAllProductsOfStoreId,
  handleStoreChange,
  ariaLabel,
  filterName,
  visibleCountParams,
  filteredProducts,
  isCategorySelected,
  selectedCategory,
  isProductStatusSelected,
  selectedProductStatus,
}) => {
  const { getAllProducts } = useData();
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [displayCount, setDisplayCount] = useState(8);
  const [sortOrder, setSortOrder] = useState("none"); // 'none', 'asc', 'desc'

  const allProducts = getAllProducts();

  const storeDropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  const processOtherFilters = (storeId) => {
    return allProducts.filter((product) => {
      if ((product.storeOwnerInfo?.storeId || "") !== storeId) return false;

      if (isCategorySelected && selectedCategory) {
        if (
          !Array.isArray(product.categories) ||
          !product.categories.some((catId) => catId === selectedCategory._id)
        )
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
      setStoreDropdownOpen(false);
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

  const handleSort = (e) => {
    e.preventDefault();
    setSortOrder((prev) => {
      if (prev === "none") return "asc";
      if (prev === "asc") return "desc";
      if (prev === "desc") return "asc";
    });
  };

  const filteredStores = useMemo(() => {
    let result = stores || [];

    const term = searchInput.trim().toLowerCase();

    if (term) {
      result = result.filter((store) => {
        if ((store.storeName || "").toLowerCase().includes(term)) return true;
        if ((store.slug || "").toLowerCase().includes(term)) return true;
        if ((store.ownerName || "").toLowerCase().includes(term)) return true;

        return false;
      });
    }

    return result;
  }, [stores, searchInput]);

  const displayedStores = useMemo(() => {
    let result = (filteredStores || []).slice(0, displayCount);

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
  }, [filteredStores, displayCount, sortOrder]);

  return (
    <div
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`${filterName} ${filterWrapper}`}
    >
      <div className={`${filterRef}`} ref={storeDropdownRef}>
        <button
          onClick={() => setStoreDropdownOpen((item) => !item)}
          aria-label={ariaLabel}
          type="button"
          className={`${filterButton} filter-button`}
        >
          <div
            className={`${isStoreSelected ? "filter-title-active" : ""} ${filterTitle}`}
          >
            <div className={`${filterSelectedWrapper}`}>
              {selectedStoreDisplay}
              {isStoreSelected && selectedStore && (
                <div className={`${filterSelectedBox}`}>
                  {isCategorySelected || isProductStatusSelected ? (
                    filteredProducts.length > visibleCountParams ? (
                      <span className={`of-count ${filterSelectedOf}`}>
                        {visibleCountParams} of
                      </span>
                    ) : (
                      ""
                    )
                  ) : getAllProductsOfStoreId(selectedStore?._id).length >
                    visibleCountParams ? (
                    <span className={`of-count ${filterSelectedOf}`}>
                      {visibleCountParams} of
                    </span>
                  ) : (
                    ""
                  )}
                  {isCategorySelected || isProductStatusSelected ? (
                    filteredProducts.length === 0 ? null : (
                      <span className={`count-badge ${countBadge}`}>
                        {filteredProducts.length}
                      </span>
                    )
                  ) : getAllProductsOfStoreId(selectedStore._id).length ===
                    0 ? null : (
                    <span className={`count-badge ${countBadge}`}>
                      {getAllProductsOfStoreId(selectedStore._id).length}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <IoIosArrowDown
            height={10}
            width={10}
            className={`arrow-icon ${filterSvg} ${storeDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
        {storeDropdownOpen && (
          <div className={`${filterDropdownWrapper}`}>
            <div className={`${filterDropdownBox}`}>
              <div className={`${filterDropdownAll}`}>
                <div
                  onMouseDown={() => {
                    handleStoreChange("");
                    setStoreDropdownOpen(false);
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
                  searchResult={displayedStores.length}
                  handleSort={handleSort}
                  sortOrder={sortOrder}
                />
              </div>
              <div
                className={`flex flex-col mt-2 
                              ${
                                displayedStores?.length === 0
                                  ? "h-60"
                                  : displayedStores?.length >= 6
                                    ? "h-70 overflow-y-scroll"
                                    : ""
                              } scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400`}
              >
                {displayedStores.length === 0 ? (
                  <LengthIsZeroErrorSmall />
                ) : (
                  <>
                    {displayedStores.map((store, index) => {
                      return (
                        <div
                          key={index}
                          onMouseDown={() => {
                            handleStoreChange(store._id);
                            setStoreDropdownOpen(false);
                          }}
                          className={`filter-list ${filterDropdownList} ${selectedStore && selectedStore._id === store._id ? "filter-list-active" : ""}`}
                        >
                          {store.storeName}
                          {isCategorySelected || isProductStatusSelected ? (
                            processOtherFilters(store._id)?.length ===
                            0 ? null : (
                              <span
                                className={`count-badge-item ${filterDropdownListItem} ${selectedStore && selectedStore._id === store._id ? "count-badge-item-active" : ""}`}
                              >
                                {processOtherFilters(store._id)?.length}
                              </span>
                            )
                          ) : getAllProductsOfStoreId(store._id)?.length ===
                            0 ? null : (
                            <span
                              className={`count-badge-item ${filterDropdownListItem} ${selectedStore && selectedStore._id === store._id ? "count-badge-item-active" : ""}`}
                            >
                              {getAllProductsOfStoreId(store._id)?.length}
                            </span>
                          )}
                        </div>
                      );
                    })}

                    {filteredStores.length > displayedStores.length && (
                      <div className="p-2">
                        <FilterLoadMoreButton handleLoadMore={handleLoadMore} />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
