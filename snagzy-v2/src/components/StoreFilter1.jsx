import { IoIosArrowDown } from "./SVG";

export const StoreFilter1 = ({
  stores,
  storeDropdownRef,
  setStoreDropdownOpen,
  selectedStoreDisplay,
  isStoreSelected,
  selectedStore,
  getAllProductsOfStoreId,
  storeDropdownOpen,
  handleStoreChange,
  ariaLabel,
  //   displayedProducts,
  visibleCountParams,
}) => {
  //   console.log("displayedProducts ddd", displayedProducts);
  //   console.log("selectedStore ddd", selectedStore._id);
  //   const filteredProducts = (storeId) => {
  //     return displayedProducts.filter(
  //       (product) => product.storeOwnerInfo.storeId === storeId,
  //     );
  //   };

  return (
    <div className={`w-full flex flex-col items-start gap-1 z-50`}>
      <div className="relative w-full inline-block" ref={storeDropdownRef}>
        <button
          onClick={() => setStoreDropdownOpen((item) => !item)}
          className={`p-1 rounded-sm text-sm w-64 border border-gray-400 bg-white text-left flex justify-between items-center cursor-pointer`}
          aria-label={ariaLabel}
          type="button"
        >
          <div className="border border-gray-400 w-full px-2 py-1 mr-1 rounded-sm">
            <div className="flex gap-1 items-center justify-between">
              {selectedStoreDisplay}
              {isStoreSelected && selectedStore && (
                <div className="flex gap-1 items-center">
                  {getAllProductsOfStoreId(selectedStore._id).length >
                  visibleCountParams ? (
                    <span className=" ml-2 text-[12px] text-gray-400">
                      {visibleCountParams} of
                    </span>
                  ) : (
                    ""
                  )}
                  <span className="text-[12px] border border-gray-400 px-1 rounded-sm">
                    {getAllProductsOfStoreId(selectedStore._id).length}{" "}
                  </span>
                </div>
              )}
            </div>
          </div>
          <IoIosArrowDown
            height={10}
            width={10}
            className={`arrow-icon w-4 h-4 transition-transform duration-200 ${storeDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>
        {storeDropdownOpen && (
          <div className={`absolute mt-1 w-64 z-50 overflow-hidden`}>
            <div
              className={`flex flex-col p-1 bg-white border border-gray-400 rounded-sm`}
            >
              <div className={`p-2 text-sm rounded-sm cursor-pointer`}>
                <div
                  onMouseDown={() => {
                    handleStoreChange("");
                    setStoreDropdownOpen(false);
                  }}
                  className={`text-sm rounded-sm cursor-pointer text-gray-400/80`}
                >
                  All
                </div>
              </div>
              {stores.map((store, index) => {
                return (
                  <div
                    key={index}
                    onMouseDown={() => {
                      handleStoreChange(store._id);
                      setStoreDropdownOpen(false);
                    }}
                    className={`flex justify-between bg-white hover:bg-gray-100 p-2 text-sm rounded-sm cursor-pointer`}
                  >
                    {store.storeName}
                    <span className="text-[12px] border border-gray-400 ml-2 px-1 rounded-sm">
                      {getAllProductsOfStoreId(store._id).length}
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
