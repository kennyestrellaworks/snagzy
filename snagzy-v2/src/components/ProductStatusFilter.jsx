import { useData } from "../context/DataContext";
import { IoIosArrowDown } from "./SVG";

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
    <div className={` flex flex-col items-start gap-1 z-50`}>
      <div className="relative  inline-block" ref={productStatusDropdownRef}>
        <button
          onClick={() => setProductStatusDropdownOpen((item) => !item)}
          className={`p-1 rounded-sm text-sm w-40 border border-gray-400 bg-white text-left flex justify-between items-center cursor-pointer`}
          aria-label={ariaLabel}
          type="button"
        >
          <div className="border border-gray-400 w-full px-2 py-1 mr-1 rounded-sm">
            <div className="flex gap-1 items-center justify-between">
              {selectedProductStatusDisplay}
              {isProductStatusSelected && selectedProductStatus && (
                <div className="flex gap-1 items-center">
                  {isStoreSelected || isCategorySelected ? (
                    filteredProducts.length > visibleCountParams ? (
                      <span className=" ml-2 text-[12px] text-gray-400">
                        {visibleCountParams} of
                      </span>
                    ) : (
                      ""
                    )
                  ) : getAllProductsByStatusId(selectedProductStatus?._id)
                      .length > visibleCountParams ? (
                    <span className=" ml-2 text-[12px] text-gray-400">
                      {visibleCountParams} of
                    </span>
                  ) : (
                    ""
                  )}
                  <span className="text-[12px] border border-gray-400 px-1 rounded-sm">
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
            className={`arrow-icon w-4 h-4 transition-transform duration-200 ${productStatusDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
        {productStatusDropdownOpen && (
          <div className={`absolute mt-1 w-40 z-50 overflow-hidden`}>
            <div
              className={`flex flex-col p-1 bg-white border border-gray-400 rounded-sm`}
            >
              <div className={`p-2 text-sm rounded-sm cursor-pointer`}>
                <div
                  onMouseDown={() => {
                    handleProductStatusChange("");
                    setProductStatusDropdownOpen(false);
                  }}
                  className={`text-sm rounded-sm cursor-pointer text-gray-400/80`}
                >
                  All
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
                    className={`flex justify-between bg-white hover:bg-gray-100 p-2 text-sm rounded-sm cursor-pointer`}
                  >
                    {item.name}
                    <span className="text-[12px] border border-gray-400 ml-2 px-1 rounded-sm">
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
