import { useEffect, useMemo, useRef, useState } from "react";
import {
  AttributeOptionsBadge,
  CategoryItemBadge,
  ItemStatusBadge,
  ProductIdBadge,
  SalesBadge,
  StoreDetailBadge,
} from "../../components/Badges";
import { FaEye, IoClose, IoSearch } from "../../components/SVG";
import { useData } from "../../context/DataContext";
import { useOrdersAnalytics } from "../../context/OrdersAnalyticsContext";
import { useReviewsAnalytics } from "../../context/ReviewsAnalyticsContext";
import { Link, useSearchParams } from "react-router-dom";
import { useClickOutside } from "../../hooks/useClickOutside";
import { StoreFilter } from "../../components/Filters/StoreFilter";
import { CategoryFilter } from "../../components/Filters/CategoryFilter";
import { ProductStatusFilter } from "../../components/Filters/ProductStatusFilter";
import { GradientButton } from "../../components/GradientButton";
import { LengthIsZeroError } from "../../components/LengthIsZeroError";
import { TitleNormal } from "../../components/Title";
import { TextNormal } from "../../components/Text";
import { NoSomethingSmall } from "../../components/NoSomething";
import { AmountFormatSmall } from "../../components/AmountFormat";
import { ImageExtraLarge } from "../../components/Image";
import { Rating } from "../../components/Rating";
import { SortButton } from "../../components/Sorting/SortButton";
import { SortDropdown } from "../../components/Sorting/SortDropdown";
import {
  priceRangeSortOptions,
  reviewsSortingOptions,
  salesSortOptions,
  productSortOptions,
} from "../../data/sortOptions";
import "../../css/scrollbar.css";
import { PageHeader } from "../../components/PageHeader";

export const Products8 = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    getAllProducts,
    getStoreById,
    getUserById,
    getProductPriceRange,
    getProductStock,
    getAllStores,
    getAllProductsOfStoreId,
    getAllParentCategories,
    getCategoryById,
    getAllProductsOfCategoryId,
    getAllProductStatus,
    getAllProductsByStatusId,
    getProductStatusById,
    setSelectedProductId,
  } = useData();

  const products = getAllProducts();
  const stores = getAllStores();
  const categories = getAllParentCategories();
  const productStatus = getAllProductStatus();

  // Order analaytics context.
  const ordersAnalytics = useOrdersAnalytics();
  const { getTotalSoldItemsOfAProduct, getTotalSalesOfAProduct } =
    ordersAnalytics.ordersAnalyticsValue;

  // Review analytics
  const reviewsAnalytics = useReviewsAnalytics();
  const { getAllReviewsByProductId, getAverageRating } =
    reviewsAnalytics.reviewsAnalyticsValue;

  // Filter searchParams //////////////////

  // Search params
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch);

  // Store params
  const initialStoreParams = searchParams.get("store") || "";
  const [storeParams, setStoreParams] = useState(initialStoreParams);

  // Category params
  const initialCategoryParams = searchParams.get("category") || "";
  const [categoryParams, setCategoryParams] = useState(initialCategoryParams);

  // Product status params
  const initialProductStatusParams = searchParams.get("product_status") || "";
  const [productStatusParams, setProductStatusParams] = useState(
    initialProductStatusParams,
  );

  const count = 6;
  // Product items count params
  const initialProductItemsParams = parseInt(
    searchParams.get("product_items") || count,
  );
  const [productItemsParams, setProductItemsParams] = useState(
    initialProductItemsParams,
  );

  // Filter open state //////////////////
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false);
  const [productStatusDropdownOpen, setProductStatusDropdownOpen] =
    useState(false);
  const [productSortDropdownOpen, setProductSortDropdownOpen] = useState(false);
  const [priceRangeSortDropdownOpen, setPriceRangeSortDropdownOpen] =
    useState(false);
  const [salesSortDropdownOpen, setSalesSortDropdownOpen] = useState(false);
  const [reviewsSortDropdownOpen, setReviewsSortDropdownOpen] = useState(false);

  // useEffect mount values.
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlStore = searchParams.get("store") || "";
    const urlCategory = searchParams.get("category") || "";
    const urlProductStatus = searchParams.get("product_status") || "";
    const urlProductItems =
      parseInt(searchParams.get("product_items")) || count;

    if (urlSearch !== search) setSearch(urlSearch);
    if (urlSearch !== searchInput) setSearchInput(urlSearch);

    if (urlStore !== storeParams) setStoreParams(urlStore);
    if (urlCategory !== categoryParams) setCategoryParams(urlCategory);
    if (urlProductStatus !== productStatusParams)
      setProductStatusParams(urlProductStatus);

    setProductItemsParams(urlProductItems);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Close all dropdowns if click is outside any dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('[aria-label="store-filter"]') &&
        !event.target.closest('[aria-label="product-status-filter"]') &&
        !event.target.closest('[aria-label="product-sort"]') &&
        !event.target.closest('[aria-label="price-sort"]') &&
        !event.target.closest('[aria-label="sales-sort"]') &&
        !event.target.closest('[aria-label="reviews-sort"]')
      ) {
        setStoreDropdownOpen(false);
        setProductStatusDropdownOpen(false);
        setProductSortDropdownOpen(false);
        setPriceRangeSortDropdownOpen(false);
        setSalesSortDropdownOpen(false);
        setReviewsSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Product name sorting
  const initialSortField = searchParams.get("sort_field") || "product-name";
  const [sortField, setSortField] = useState(initialSortField);
  const initialSortDirection = searchParams.get("sort_direction") || "asc";
  const [sortDirection, setSortDirection] = useState(initialSortDirection);

  // Price range sorting
  const initialPriceSortField = searchParams.get("price_sort_field") || "";
  const initialPriceSortDirection =
    searchParams.get("price_sort_direction") || "asc";
  const [priceSortField, setPriceSortField] = useState(initialPriceSortField);
  const [priceSortDirection, setPriceSortDirection] = useState(
    initialPriceSortDirection,
  );

  // Filter dropdown refs
  const storeDropdownRef = useRef(null);
  const productStatusDropdownRef = useRef(null);
  const productSortDropdownRef = useRef(null);
  const priceRangeSortDropdownRef = useRef(null);
  const salesSortDropdownRef = useRef(null);
  const reviewSortDropdownRef = useRef(null);

  // Filter click outside using hook.
  useClickOutside(storeDropdownRef, () => setStoreDropdownOpen(false));
  useClickOutside(productStatusDropdownRef, () =>
    setProductStatusDropdownOpen(false),
  );
  useClickOutside(productSortDropdownRef, () =>
    setProductSortDropdownOpen(false),
  );
  useClickOutside(priceRangeSortDropdownRef, () =>
    setPriceRangeSortDropdownOpen(false),
  );
  useClickOutside(salesSortDropdownRef, () => setSalesSortDropdownOpen(false));
  useClickOutside(reviewSortDropdownRef, () =>
    setReviewsSortDropdownOpen(false),
  );

  // Filter selected item /////////////////

  // Selected store
  const selectedStore = (stores || []).find(
    (item) => item?.slug === storeParams,
  );
  const selectedStoreDisplay = selectedStore?.storeName || "Store";
  const isStoreSelected = !!storeParams;

  // Selected category
  const selectedCategory = (categories || []).find(
    (item) => item?.name === categoryParams,
  );
  const selectedCategoryDisplay = selectedCategory?.name || "Categories";
  const isCategorySelected = !!categoryParams;

  // Selected product status
  const selectedProductStatus = productStatus.find(
    (item) => item?.slug === productStatusParams,
  );
  const selectedProductStatusDisplay =
    selectedProductStatus?.name || "Product Status";
  const isProductStatusSelected = !!productStatusParams;

  // Helper function to build URL params
  const buildUrlParams = (additionalParams = {}) => {
    const params = {};

    if (search?.trim()) params.search = search;
    if (storeParams) params.store = storeParams;
    if (categoryParams) params.category = categoryParams;
    if (productStatusParams) params.product_status = productStatusParams;
    if (productItemsParams) params.product_items = productItemsParams;

    return { ...params, ...additionalParams };
  };

  // Sort handlers
  const handleProductSort = (slug) => {
    const newDirection =
      sortField === slug ? (sortDirection === "asc" ? "desc" : "asc") : "asc";

    setSortField(slug);
    setSortDirection(newDirection);
    setPriceSortField("");
    setPriceSortDirection("asc");

    const params = buildUrlParams({
      sort_field: slug,
      sort_direction: newDirection,
    });

    setSearchParams(params);
    setProductSortDropdownOpen(false);
  };

  const handlePriceSort = (slug) => {
    const newDirection =
      priceSortField === slug
        ? priceSortDirection === "asc"
          ? "desc"
          : "asc"
        : "asc";

    setPriceSortField(slug);
    setPriceSortDirection(newDirection);
    setSortField("");
    setSortDirection("asc");

    const params = buildUrlParams({
      price_sort_field: slug,
      price_sort_direction: newDirection,
    });

    setSearchParams(params);
    setPriceRangeSortDropdownOpen(false);
  };

  const handleSimpleSort = (slug) => {
    const newDirection =
      sortField === slug ? (sortDirection === "asc" ? "desc" : "asc") : "asc";

    setSortField(slug);
    setSortDirection(newDirection);
    setPriceSortField("");
    setPriceSortDirection("asc");

    const params = buildUrlParams({
      sort_field: slug,
      sort_direction: newDirection,
    });

    setSearchParams(params);
  };

  // Filter search input ///////////////////////
  const onSearchChange = (e) => {
    e.preventDefault();
    const val = e.target.value;

    setSearchInput(val);
    setSearch(val);

    const params = buildUrlParams();
    if (val?.trim()) {
      params.search = val;
    } else {
      delete params.search;
    }

    setSearchParams(params);
  };

  // Filter store change //////////////////
  const handleStoreChange = (storeId) => {
    const storeItem = getStoreById(storeId);
    const val = storeItem?.slug || "";
    setStoreParams(val);

    const params = buildUrlParams();
    if (val) {
      params.store = val;
    } else {
      delete params.store;
    }

    setSearchParams(params);
  };

  // Filter category change //////////////////
  const handleCategoryChange = (categoryId) => {
    const categoryItem = getCategoryById(categoryId);
    const val = categoryItem?.name || "";
    setCategoryParams(val);

    const params = buildUrlParams();
    if (val) {
      params.category = val;
    } else {
      delete params.category;
    }

    setSearchParams(params);
  };

  // Filter product status change //////////////////
  const handleProductStatusChange = (statusId) => {
    const productStatusItem = getProductStatusById(statusId);
    const val = productStatusItem?.slug || "";
    setProductStatusParams(val);

    const params = buildUrlParams();
    if (val) {
      params.product_status = val;
    } else {
      delete params.product_status;
    }

    setSearchParams(params);
  };

  // Chaging products objects based from filters and sorting.
  const filteredProducts = useMemo(() => {
    let result = products || [];

    // Search input
    const term = (search || "").trim().toLowerCase();

    if (term) {
      result = result.filter((product) => {
        if ((product.name || "").toLowerCase().includes(term)) return true;
        if ((product.description || "").toLowerCase().includes(term))
          return true;
        if ((product._id || "").toLowerCase().includes(term)) return true;

        // Check store name and owner details
        const storeInfo = getStoreById(product.storeOwnerInfo?.storeId);
        const ownerUser = getUserById(product.storeOwnerInfo?.ownerId);
        const ownerFullName =
          (ownerUser?.firstName || "") + " " + (ownerUser?.lastName || "");

        if ((storeInfo?.storeName || "").toLowerCase().includes(term))
          return true;
        // store record may include ownerName, and user record has first/last name
        if ((storeInfo?.ownerName || "").toLowerCase().includes(term))
          return true;
        if ((ownerFullName || "").toLowerCase().includes(term)) return true;
        if (
          (product.storeOwnerInfo?.storeId || "").toLowerCase().includes(term)
        )
          return true;
        if (
          (product.storeOwnerInfo?.ownerId || "").toLowerCase().includes(term)
        )
          return true;

        // Check store name and owner
        if (Array.isArray(product.variants)) {
          for (const variant of product.variants) {
            if ((variant.price || "").toString().toLowerCase().includes(term))
              return true;
            const attributeValues = Object.values(variant.attributes || {})
              .join(" ")
              .toLowerCase();
            if (attributeValues.includes(term)) return true;
          }
        }

        return false;
      });
    }

    // Filter by selected store
    if (selectedStore) {
      result = result.filter(
        (item) => (item.storeOwnerInfo?.storeId || "") === selectedStore._id,
      );
    }

    // Filter by selected category
    if (selectedCategory) {
      result = result.filter(
        (product) =>
          Array.isArray(product.categories) &&
          product.categories.some((catId) => catId === selectedCategory._id),
      );
    }

    // Filter by product status
    if (selectedProductStatus) {
      result = result.filter(
        (item) => (item.status || "") === selectedProductStatus._id,
      );
    }

    // Sort by selected field on a copy to avoid mutating original
    result = result.slice().sort((a, b) => {
      // Sort by price range if enabled
      if (priceSortField) {
        const aPriceRange = getProductPriceRange(a.variants);
        const bPriceRange = getProductPriceRange(b.variants);

        if (priceSortField === "min-price") {
          const aPriceVal = aPriceRange?.min || 0;
          const bPriceVal = bPriceRange?.min || 0;
          if (priceSortDirection === "asc") return aPriceVal - bPriceVal;
          return bPriceVal - aPriceVal;
        } else if (priceSortField === "max-price") {
          const aPriceVal = aPriceRange?.max || 0;
          const bPriceVal = bPriceRange?.max || 0;
          if (priceSortDirection === "asc") return aPriceVal - bPriceVal;
          return bPriceVal - aPriceVal;
        }
      }

      // Sort by store name
      if (sortField === "store-name") {
        const storeA = getStoreById(a.storeOwnerInfo?.storeId);
        const storeB = getStoreById(b.storeOwnerInfo?.storeId);
        const aStore = (storeA?.storeName || "").toLowerCase();
        const bStore = (storeB?.storeName || "").toLowerCase();
        if (sortDirection === "asc") {
          if (aStore > bStore) return 1;
          if (aStore < bStore) return -1;
          return 0;
        }
        if (aStore < bStore) return 1;
        if (aStore > bStore) return -1;
        return 0;
      }

      // Sort by store owner
      if (sortField === "store-owner") {
        const userA = getUserById(a.storeOwnerInfo?.ownerId);
        const userB = getUserById(b.storeOwnerInfo?.ownerId);
        const aStoreOwner = (
          (userA?.firstName || "") +
          " " +
          (userA?.lastName || "")
        )
          .trim()
          .toLowerCase();
        const bStoreOwner = (
          (userB?.firstName || "") +
          " " +
          (userB?.lastName || "")
        )
          .trim()
          .toLowerCase();
        if (sortDirection === "asc") {
          if (aStoreOwner > bStoreOwner) return 1;
          if (aStoreOwner < bStoreOwner) return -1;
          return 0;
        }
        if (aStoreOwner < bStoreOwner) return 1;
        if (aStoreOwner > bStoreOwner) return -1;
        return 0;
      }

      // Sort by stock
      if (sortField === "stock") {
        const aStock = getProductStock(a.variants) || 0;
        const bStock = getProductStock(b.variants) || 0;
        if (sortDirection === "asc") return aStock - bStock;
        return bStock - aStock;
      }

      // Sort by sold items (number of units sold)
      if (sortField === "sold-items") {
        const aSold = getTotalSoldItemsOfAProduct(a._id) || 0;
        const bSold = getTotalSoldItemsOfAProduct(b._id) || 0;
        if (sortDirection === "asc") return aSold - bSold;
        return bSold - aSold;
      }

      // Sort by sales amount (total sales value)
      if (sortField === "sales-amount") {
        const aSales = getTotalSalesOfAProduct(a._id) || 0;
        const bSales = getTotalSalesOfAProduct(b._id) || 0;
        if (sortDirection === "asc") return aSales - bSales;
        return bSales - aSales;
      }

      // Sort by review - number of review
      if (sortField === "review") {
        const aReviews = getAllReviewsByProductId(a._id) || [];
        const bReviews = getAllReviewsByProductId(b._id) || [];
        const aCount = aReviews.length;
        const bCount = bReviews.length;
        if (sortDirection === "asc") return aCount - bCount;
        return bCount - aCount;
      }

      // Sort by reviews - average rating
      if (sortField === "rating") {
        const aAvg = getAverageRating(getAllReviewsByProductId(a._id)) || 0;
        const bAvg = getAverageRating(getAllReviewsByProductId(b._id)) || 0;
        if (sortDirection === "asc") return aAvg - bAvg;
        return bAvg - aAvg;
      }

      // Sort by variants
      if (sortField === "variants") {
        const aLen = (a.variants || []).length;
        const bLen = (b.variants || []).length;
        if (sortDirection === "asc") return aLen - bLen;
        return bLen - aLen;
      }

      // Default: sort by product name (case-insensitive)
      const aName = (a.name || "").toLowerCase();
      const bName = (b.name || "").toLowerCase();
      if (sortDirection === "asc") {
        if (aName > bName) return 1;
        if (aName < bName) return -1;
        return 0;
      }
      if (aName < bName) return 1;
      if (aName > bName) return -1;
      return 0;
    });

    return result;
  }, [
    products,
    selectedStore,
    selectedCategory,
    selectedProductStatus,
    search,
    getStoreById,
    getUserById,
    getProductPriceRange,
    getProductStock,
    getTotalSoldItemsOfAProduct,
    getTotalSalesOfAProduct,
    getAllReviewsByProductId,
    getAverageRating,
    sortDirection,
    sortField,
    priceSortField,
    priceSortDirection,
  ]);

  const displayedProducts = useMemo(() => {
    return (filteredProducts || []).slice(0, productItemsParams);
  }, [filteredProducts, productItemsParams]);

  // Load more button
  const loadMore = () => {
    const totalItems =
      filteredProducts && filteredProducts.length > 0
        ? filteredProducts.length
        : products.length;
    const newCount = Math.min(productItemsParams + count, totalItems);

    if (newCount > productItemsParams) {
      setProductItemsParams(newCount);

      const params = buildUrlParams({
        product_items: newCount,
      });

      setSearchParams(params);
    }
  };

  const clearFilters = () => {
    // Reset search inputs
    setSearch("");
    setSearchInput("");

    // Reset all filter params/state
    setStoreParams("");
    setCategoryParams("");
    setProductStatusParams("");

    // Reset sort to defaults
    setSortField("product-name");
    setSortDirection("asc");

    // Reset price sort
    setPriceSortField("");
    setPriceSortDirection("asc");

    // Reset visible count to initial value
    setProductItemsParams(count);

    // Clear URL search params (including sort)
    setSearchParams({});

    // Close any open dropdowns
    setStoreDropdownOpen(false);
    setProductStatusDropdownOpen(false);
    setProductSortDropdownOpen(false);
    setPriceRangeSortDropdownOpen(false);
    setSalesSortDropdownOpen(false);
    setReviewsSortDropdownOpen(false);
  };

  return (
    <div className="flex flex-col w-full bg-white border border-gray-300 rounded-md overflow-hidden">
      {/* Header  */}
      <div className="sticky w-full top-0 z-50">
        <div className="w-full flex flex-1 flex-col p-2">
          <div className="flex gap-2">
            <PageHeader defaultPage="Analytics" type="sidebar-level" />
          </div>
          <div className="flex gap-2 mt-2">
            {/* Search input  */}
            <div className="flex w-full relative">
              <input
                value={searchInput}
                onChange={onSearchChange}
                placeholder="Search products, product ID, store or store owner ..."
                className="flex-1 p-2 border border-gray-400 rounded text-sm leading-tight"
                aria-label="product-search"
                type="text"
              />
              {searchInput ? (
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSearchInput("");
                    setSearch("");

                    const params = buildUrlParams();
                    delete params.search;
                    setSearchParams(params);
                  }}
                  type="button"
                  className="absolute top-2 right-2"
                >
                  <IoClose
                    height={20}
                    width={20}
                    className={
                      "text-gray-400 cursor-pointer hover:text-gray-500 transition-all duration-300 ease-in-out"
                    }
                  />
                </button>
              ) : (
                <IoSearch
                  height={20}
                  width={20}
                  className={
                    "absolute top-2 right-2 text-gray-400 cursor-pointer hover:text-gray-500 transition-all duration-300 ease-in-out"
                  }
                />
              )}
            </div>
            <div className="flex items-end w-full gap-2">
              {/* Store filter  */}
              <StoreFilter
                stores={stores}
                storeDropdownRef={storeDropdownRef}
                setStoreDropdownOpen={setStoreDropdownOpen}
                selectedStoreDisplay={selectedStoreDisplay}
                isStoreSelected={isStoreSelected}
                selectedStore={selectedStore}
                getAllProductsOfStoreId={getAllProductsOfStoreId}
                storeDropdownOpen={storeDropdownOpen}
                handleStoreChange={handleStoreChange}
                ariaLabel="store-filter"
                filterName="store-filter"
                filteredProducts={filteredProducts}
                productItemsParams={productItemsParams}
                isCategorySelected={isCategorySelected}
                selectedCategory={selectedCategory}
                isProductStatusSelected={isProductStatusSelected}
                selectedProductStatus={selectedProductStatus}
              />
              {/* Store filter ends  */}
              <CategoryFilter
                categories={categories}
                selectedCategoryDisplay={selectedCategoryDisplay}
                isCategorySelected={isCategorySelected}
                selectedCategory={selectedCategory}
                getAllProductsOfCategoryId={getAllProductsOfCategoryId}
                handleCategoryChange={handleCategoryChange}
                ariaLabel="category-filter"
                filterName="category-filter"
                filteredProducts={filteredProducts}
                productItemsParams={productItemsParams}
                isStoreSelected={isStoreSelected}
                selectedStore={selectedStore}
                isProductStatusSelected={isProductStatusSelected}
                selectedProductStatus={selectedProductStatus}
              />
              {/* Product status filter  */}
              <ProductStatusFilter
                productStatus={productStatus}
                productStatusDropdownRef={productStatusDropdownRef}
                setProductStatusDropdownOpen={setProductStatusDropdownOpen}
                selectedProductStatusDisplay={selectedProductStatusDisplay}
                isProductStatusSelected={isProductStatusSelected}
                selectedProductStatus={selectedProductStatus}
                getAllProductsByStatusId={getAllProductsByStatusId}
                productStatusDropdownOpen={productStatusDropdownOpen}
                handleProductStatusChange={handleProductStatusChange}
                ariaLabel="product-status-filter"
                filterName="product-status-filter"
                filteredProducts={filteredProducts}
                productItemsParams={productItemsParams}
                isStoreSelected={isStoreSelected}
                selectedStore={selectedStore}
                isCategorySelected={isCategorySelected}
                selectedCategory={selectedCategory}
              />
              {/* Product status filter ends  */}
              <GradientButton
                onClick={clearFilters}
                buttonName={"Clear Filters"}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Header ends */}
      {/* Table header  */}
      <div className="sticky w-full top-0 z-30 bg-blue-100 border-t border-b border-gray-300">
        <div className="flex w-full justify-between">
          <div className="grid grid-cols-[2.4fr_1.3fr_1.4fr_.6fr_.7fr_.6fr_1.3fr_1fr_.3fr] w-full text-sm">
            {/* Product sorting header  */}
            <div className="flex border-r border-gray-300 p-1">
              <span>Products</span>
              {displayedProducts.length > 0 ? (
                <SortDropdown
                  options={productSortOptions}
                  currentField={sortField}
                  currentDirection={sortDirection}
                  onSort={handleProductSort}
                  dropdownRef={productSortDropdownRef}
                  isOpen={productSortDropdownOpen}
                  setIsOpen={setProductSortDropdownOpen}
                  position="left-0"
                  width="w-56"
                  ariaLabel="product-sort"
                />
              ) : null}
            </div>

            <div className="flex border-r border-gray-300 p-1 items-center">
              Categories
            </div>
            <div className="flex border-r border-gray-300 p-1 items-center">
              Attributes
            </div>

            {/* Variants sorting header  */}
            <div className="flex border-r border-gray-300 p-1">
              <span>Variants</span>
              {displayedProducts.length > 0 ? (
                <SortButton
                  field="variants"
                  currentField={sortField}
                  currentDirection={sortDirection}
                  onSort={handleSimpleSort}
                />
              ) : null}
            </div>

            {/* Price range sorting header  */}
            <div className="flex border-r border-gray-300 p-1">
              <span>Price Range</span>
              {displayedProducts.length > 0 ? (
                <SortDropdown
                  options={priceRangeSortOptions}
                  currentField={priceSortField}
                  currentDirection={priceSortDirection}
                  onSort={handlePriceSort}
                  dropdownRef={priceRangeSortDropdownRef}
                  isOpen={priceRangeSortDropdownOpen}
                  setIsOpen={setPriceRangeSortDropdownOpen}
                  position="left-0"
                  width="w-48"
                  ariaLabel="price-sort"
                />
              ) : null}
            </div>

            {/* Stock sorting header  */}
            <div className="flex border-r border-gray-300 p-1">
              <span>Stock</span>
              {displayedProducts.length > 0 ? (
                <SortButton
                  field="stock"
                  currentField={sortField}
                  currentDirection={sortDirection}
                  onSort={handleSimpleSort}
                />
              ) : null}
            </div>

            {/* Sales sorting header  */}
            <div className="flex border-r border-gray-300 p-1">
              <span>Sales</span>
              {displayedProducts.length > 0 ? (
                <SortDropdown
                  options={salesSortOptions}
                  currentField={sortField}
                  currentDirection={sortDirection}
                  onSort={handleSimpleSort}
                  dropdownRef={salesSortDropdownRef}
                  isOpen={salesSortDropdownOpen}
                  setIsOpen={setSalesSortDropdownOpen}
                  position="left-0"
                  width="w-48"
                  ariaLabel="sales-sort"
                />
              ) : null}
            </div>

            {/* Review & Rating sorting header  */}
            <div className="flex border-r border-gray-300 p-1">
              <span>Review & Rating</span>
              {displayedProducts.length > 0 ? (
                <SortDropdown
                  options={reviewsSortingOptions}
                  currentField={sortField}
                  currentDirection={sortDirection}
                  onSort={handleSimpleSort}
                  dropdownRef={reviewSortDropdownRef}
                  isOpen={reviewsSortDropdownOpen}
                  setIsOpen={setReviewsSortDropdownOpen}
                  position="left-0"
                  width="w-56"
                  ariaLabel="reviews-sort"
                />
              ) : null}
            </div>

            <div className="flex p-1"></div>
          </div>
          <div className="flex w-2 bg-blue-100"></div>
        </div>
      </div>
      {/* Table header ends */}
      {/* List area */}
      <div className="flex w-full overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="flex flex-col w-full">
          {displayedProducts.length === 0 ? (
            <div className="flex items-center w-full h-screen">
              <LengthIsZeroError
                title="No data found"
                message="Something went wrong while fetching the data!"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full">
              {displayedProducts.map((product, index) => {
                // Product image
                const primaryImage = product.variants.find(
                  (item) => item._id === product.defaultVariant,
                )?.primaryImage;

                // Store
                const store = getStoreById(product.storeOwnerInfo.storeId);

                // Store owner
                const storeOwner =
                  getUserById(product.storeOwnerInfo.ownerId)?.firstName +
                  " " +
                  getUserById(product.storeOwnerInfo.ownerId)?.lastName;

                // Product stock
                const productStock = getProductStock(product.variants);

                // Price range of product
                const priceRange = getProductPriceRange(product.variants);

                // Sales of a product
                const totalSoldItems = getTotalSoldItemsOfAProduct(product._id);
                const totalSales = getTotalSalesOfAProduct(product._id);

                // Reviews
                const reviews = getAllReviewsByProductId(product._id);

                // Product status
                const statusItem = productStatus.find(
                  (item) => item._id === product.status,
                );

                // Average rating
                const averageRating = getAverageRating(reviews);

                return (
                  <div
                    key={index}
                    className={`grid grid-cols-[2.4fr_1.3fr_1.4fr_.6fr_.7fr_.6fr_1.3fr_1fr_.3fr] border-b border-gray-300 bg-white text-sm ${statusItem?.slug === "inactive" ? "opacity-50" : ""} hover:bg-blue-50/30 transition-all duration-300 ease-in-out`}
                  >
                    {/* Product detail box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <div className="flex items-start flex-col gap-2">
                        <div className="flex gap-2">
                          <ProductIdBadge id={product._id} />
                          <ItemStatusBadge statusId={product.status} />
                        </div>
                        <div className="flex items-start gap-1 text-xs">
                          <StoreDetailBadge
                            type="store-name"
                            content={store?.storeName}
                          />
                          <StoreDetailBadge
                            type="store-owner"
                            content={storeOwner}
                          />
                        </div>
                        <div className="flex gap-2">
                          <ImageExtraLarge
                            image={primaryImage}
                            alt={product.name}
                            type="square"
                          />
                          <div className="flex flex-col items-start">
                            <TitleNormal title={product.name} />
                            <TextNormal text={product.description} />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Categories box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <div className="flex items-start">
                        <div className="flex flex-wrap gap-1">
                          {product.categories.map((category, index) => {
                            const categoryName =
                              getCategoryById(category)?.name;
                            return (
                              <div key={index} className="flex">
                                <CategoryItemBadge category={categoryName} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    {/* Attributes box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      {product.attributes?.length === 0 ? (
                        <p className="text-gray-400">NA</p>
                      ) : (
                        <AttributeOptionsBadge product={product} />
                      )}
                    </div>
                    {/* Variants box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <div className="text-xs">
                        {(product.variants || []).length === 0 ? (
                          <span className="text-gray-400">NA</span>
                        ) : (
                          <TextNormal text={(product.variants || []).length} />
                        )}
                      </div>
                    </div>
                    {/* Price range  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      {product.variants && product.variants.length > 0 ? (
                        <div className="flex flex-col">
                          <div>
                            <span className="text-gray-600 text-[12px]">
                              Min:{" "}
                            </span>
                            <AmountFormatSmall amount={priceRange?.min} />
                          </div>
                          <div>
                            <span className="text-gray-600 text-[12px]">
                              Max:{" "}
                            </span>
                            <AmountFormatSmall amount={priceRange?.max} />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">NA</span>
                      )}
                    </div>
                    {/* Stock box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      {productStock === 0 ? (
                        <TextNormal text="Out of stock" />
                      ) : productStock === 1 ? (
                        <TextNormal text={`${productStock} Item`} />
                      ) : (
                        <TextNormal text={`${productStock} Items`} />
                      )}
                    </div>
                    {/* Sales box */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <div className="flex flex-col items-start">
                        {totalSales < 1 ? (
                          <div className="flex items-center gap-2">
                            <h1 className="leading-tight text-gray-400">
                              No data yet
                            </h1>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <div className="flex items-start">
                                <SalesBadge amount={totalSales} />
                              </div>
                              <p className="leading-tight text-[14px]">
                                {totalSoldItems} Sold
                              </p>
                            </div>
                            <div className="flex flex-col mt-2">
                              <div className="flex items-start gap-2 text-sm">
                                <p className="text-[12px] text-gray-500 leading-tight">
                                  Jan 2026
                                </p>{" "}
                                <div className="flex gap-2 items-center">
                                  <AmountFormatSmall amount={200.25} />
                                  <p className="text-[12px] text-gray-500 leading-tight">
                                    23 Sold
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2 text-sm">
                                <p className="text-[12px] text-gray-500 leading-tight">
                                  Jan 2026
                                </p>{" "}
                                <div className="flex gap-2 items-center">
                                  <AmountFormatSmall amount={200.25} />
                                  <p className="text-[12px] text-gray-500 leading-tight">
                                    23 Sold
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Reviews box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      {reviews.length !== 0 ? (
                        <div>
                          <div className="flex flex-col">
                            <h1 className="font-semibold leading-tight">
                              {reviews.length}{" "}
                              {reviews.length <= 1 ? "Review" : "Reviews"}
                            </h1>
                          </div>
                          <div className="flex flex-col">
                            <h1 className="font-semibold leading-tight">
                              <Rating value={averageRating} />
                            </h1>
                          </div>
                        </div>
                      ) : (
                        <NoSomethingSmall text="No ratings yet" />
                      )}
                    </div>
                    <div className="flex p-2">
                      <div className="flex items-start">
                        <Link
                          to={`/products/${product.slug}/${product._id}`}
                          state={{
                            backUrl:
                              location.pathname +
                              location.search +
                              location.hash,
                          }}
                          onClick={() => setSelectedProductId(product._id)}
                          className="cursor-pointer outline-0 text-gray-400 hover:text-gray-500 transition-all ease-in-out"
                        >
                          <FaEye height={16} width={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {filteredProducts.length > 0 &&
            products.length > 0 &&
            productItemsParams <
              (filteredProducts.length || products.length) && (
              <div className="flex items-center justify-center">
                <div className="flex p-2">
                  <button
                    onClick={loadMore}
                    className="px-3 py-1 border border-gray-400 bg-gray-100 text-sm text-gray-500 rounded cursor-pointer hover:border-gray-600 hover:bg-gray-300 hover:text-gray-900 transition-transform duration-200 ease-out"
                  >
                    Load more
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
      {/* List area ends  */}
    </div>
  );
};
