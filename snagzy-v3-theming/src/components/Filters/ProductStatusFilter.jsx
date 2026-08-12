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

export const ProductStatusFilter = ({
  productStatus,
  productStatusDropdownRef,
  setProductStatusDropdownOpen,
  selectedProductStatusDisplay,
  isProductStatusSelected,
  selectedProductStatus,
  getAllProductsByStatusId,
  productStatusDropdownOpen,
  handleProductStatusChange,
  ariaLabel,
  filterName,
  visibleCountParams,
  filteredProducts,
  isStoreSelected,
  selectedStore,
  isCategorySelected,
  selectedCategory,
}) => {
  const { getAllProducts } = useData();
  const allProducts = getAllProducts();

  const processOtherFilters = (productStatusId) => {
    return allProducts.filter((product) => {
      if ((product.status || "") !== productStatusId) return false;

      if (isStoreSelected && selectedStore) {
        if ((product.storeOwnerInfo?.storeId || "") !== selectedStore._id)
          return false;
      }

      if (isCategorySelected && selectedCategory) {
        if (
          !Array.isArray(product.categories) ||
          !product.categories.some((catId) => catId === selectedCategory._id)
        )
          return false;
      }

      return true;
    });
  };

  return (
    <div className={`${filterName} ${filterWrapper}`}>
      {/* <div className="relative  inline-block" ref={productStatusDropdownRef}> */}
      <div className={`${filterRef}`} ref={productStatusDropdownRef}>
        <button
          onClick={() => setProductStatusDropdownOpen((item) => !item)}
          className={`${filterButton} filter-button`}
          aria-label={ariaLabel}
          type="button"
        >
          <div
            className={`${isProductStatusSelected ? "filter-title-active" : ""} ${filterTitle}`}
          >
            <div className={`${filterSelectedWrapper}`}>
              {selectedProductStatusDisplay}
              {isProductStatusSelected && selectedProductStatus && (
                <div className={`${filterSelectedBox}`}>
                  {isStoreSelected || isCategorySelected ? (
                    filteredProducts.length > visibleCountParams ? (
                      <span className={`of-count ${filterSelectedOf}`}>
                        {visibleCountParams} of
                      </span>
                    ) : (
                      ""
                    )
                  ) : getAllProductsByStatusId(selectedProductStatus?._id)
                      .length > visibleCountParams ? (
                    <span className={`of-count ${filterSelectedOf}`}>
                      {visibleCountParams} of
                    </span>
                  ) : (
                    ""
                  )}
                  <span className={`count-badge ${countBadge}`}>
                    {isStoreSelected || isCategorySelected
                      ? filteredProducts.length
                      : getAllProductsByStatusId(selectedProductStatus._id)
                          .length}
                  </span>
                </div>
              )}
            </div>
          </div>
          <IoIosArrowDown
            height={10}
            width={10}
            className={`arrow-icon ${filterSvg} ${productStatusDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
        {productStatusDropdownOpen && (
          <div className={`${filterDropdownWrapper}`}>
            <div className={`${filterDropdownBox}`}>
              <div className={`${filterDropdownAll}`}>
                <div
                  onMouseDown={() => {
                    handleProductStatusChange("");
                    setProductStatusDropdownOpen(false);
                  }}
                  className={`${filterDropdownAllText}`}
                >
                  <h1 className="text-sm rounded-sm cursor-pointer text-gray-400/80 leading-tight">
                    All
                  </h1>
                </div>
              </div>
              {productStatus.map((item, index) => {
                return (
                  <div
                    key={index}
                    onMouseDown={() => {
                      handleProductStatusChange(item._id);
                      setProductStatusDropdownOpen(false);
                    }}
                    className={`filter-list ${filterDropdownList} ${selectedProductStatus && selectedProductStatus._id === item._id ? "filter-list-active" : ""}`}
                  >
                    {item.name}
                    <span
                      className={`count-badge-item ${filterDropdownListItem} ${selectedProductStatus && selectedProductStatus._id === item._id ? "count-badge-item-active" : ""}`}
                    >
                      {isStoreSelected || isCategorySelected
                        ? processOtherFilters(item._id)?.length
                        : getAllProductsByStatusId(item._id).length}
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
