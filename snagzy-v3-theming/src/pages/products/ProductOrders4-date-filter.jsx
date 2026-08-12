import { useOutletContext, useSearchParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { LengthIsZeroError } from "../../components/LengthIsZeroError";
import {
  ItemStatusBadge,
  OrderIdBadge,
  ProductVariantAttributeBadge,
  SalesBadgeMediumPending,
  SalesBadgeMediumUnsuccessful,
  VariantBadge,
} from "../../components/Badges";
import { ProductNameNAttributes } from "../../components/ProductNameNAttributes";
import { ImageDoubleExtraSmall } from "../../components/Image";
import { NoSomethingSmall } from "../../components/NoSomething";
import { CreatedUpdated, OrderPlacedUpdated } from "../../components/DateBoxed";
import { BuyerDetail } from "../../components/BuyerDetail";
import { AmountDetailBox } from "../../components/AmountDetailBox";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  sortItem,
  sortItemsWithoutDropdown,
  sortItemWithDropdownButton,
  sortItemWithDropdownItem,
  sortItemWithDropdownLabel,
  sortItemWithDropdownLabelWrapper,
  sortItemWithDropdownList,
  sortItemWithDropdownListItem,
} from "./products-css";
import { useClickOutside } from "../../hooks/useClickOutside";
import {
  Filter,
  IoArrowDownOutline,
  IoArrowUpOutline,
  IoClose,
  TbArrowsSort,
} from "../../components/SVG";
import { PaymentStatusBadge } from "../../components/PaymentStatusBadge";
import { OrderStatusBadge } from "../../components/OrderStatusBadge";
import { Loader } from "../../components/Loader";
import { useOrdersAnalytics } from "../../context/OrdersAnalyticsContext";
import { TextNormal } from "../../components/Text";

// Helper: get order date (first timeline timestamp or createdAt)
const getOrderDate = (order) => {
  const firstTimeline = order.timeline?.[0]?.timestamp;
  if (firstTimeline) return new Date(firstTimeline);
  return new Date(order.createdAt);
};

export const ProductOrders4 = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { thisProduct, attributes } = useOutletContext();

  const [isLoading, setIsLoading] = useState(true);

  const {
    getAllOrdersByProductId,
    addingOrdersToProductVariants,
    getAllVariantStatus,
    getOrderDetailsSortingOptions,
    getBuyerDetailsSortingOptions,
    getAmountDetailSortingOptions,
  } = useData();

  // OrdersAnalyticsContext.jsx
  const ordersAnalytics = useOrdersAnalytics();
  const {
    getPendingOrdersOfAProduct,
    getUnsuccessfulOrdersOfAProduct,
    getOrderSubTotalOfAVariant,
    getOrderSubTotalCountOfAVariant,
  } = ordersAnalytics.ordersAnalyticsValue;

  // ========== DATE RANGE FILTER STATE ==========
  const [startYear, setStartYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [endMonth, setEndMonth] = useState("");

  // Ref to ensure initial filters are set exactly once
  const initialFiltersSet = useRef(false);
  const [initialFilters, setInitialFilters] = useState({
    startYear: "",
    startMonth: "",
    endYear: "",
    endMonth: "",
  });

  // ========== HELPER FUNCTIONS FOR FILTER ==========
  const getAvailableYearsFromOrders = (ordersList) => {
    const years = new Set();
    ordersList.forEach((order) => {
      const date = getOrderDate(order);
      years.add(date.getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  };

  const getMonthsForYear = (ordersList, year) => {
    if (!year) return [];
    const months = new Set();
    ordersList.forEach((order) => {
      const date = getOrderDate(order);
      if (date.getFullYear() === year) {
        months.add(date.getMonth() + 1);
      }
    });
    return Array.from(months).sort((a, b) => a - b);
  };

  // ========== FETCH ORDERS DATA ==========
  const pendingOrdersOfThisProduct = getPendingOrdersOfAProduct(
    thisProduct._id,
  );
  const pendingOrdersByThisProduct = useMemo(
    () => getAllOrdersByProductId(thisProduct._id, pendingOrdersOfThisProduct),
    [thisProduct._id, pendingOrdersOfThisProduct, getAllOrdersByProductId],
  );

  const unsuccessfulOrdersOfThisProduct = getUnsuccessfulOrdersOfAProduct(
    thisProduct._id,
  );
  const unsuccessfulOrdersByThisProduct = useMemo(
    () =>
      getAllOrdersByProductId(thisProduct._id, unsuccessfulOrdersOfThisProduct),
    [thisProduct._id, unsuccessfulOrdersOfThisProduct, getAllOrdersByProductId],
  );

  const pendingNUnsuccessfulOrders = useMemo(
    () => [...pendingOrdersByThisProduct, ...unsuccessfulOrdersByThisProduct],
    [pendingOrdersByThisProduct, unsuccessfulOrdersByThisProduct],
  );

  // console.log("pendingOrdersByThisProduct", pendingOrdersByThisProduct);

  // ========== APPLY DATE RANGE FILTER ==========
  const filteredOrdersByDate = useMemo(() => {
    if (!pendingNUnsuccessfulOrders.length) return [];

    let filtered = [...pendingNUnsuccessfulOrders];

    const isFilterActive =
      startYear !== "" ||
      startMonth !== "" ||
      endYear !== "" ||
      endMonth !== "";
    if (!isFilterActive) return filtered;

    return filtered.filter((order) => {
      const orderDate = getOrderDate(order);
      const orderYear = orderDate.getFullYear();
      const orderMonth = orderDate.getMonth() + 1;

      // Start range
      if (startYear !== "" && startMonth !== "") {
        const startVal = startYear * 100 + startMonth;
        const orderVal = orderYear * 100 + orderMonth;
        if (orderVal < startVal) return false;
      } else if (startYear !== "") {
        if (orderYear < startYear) return false;
        if (
          endYear === "" &&
          endMonth === "" &&
          orderYear === startYear &&
          startMonth !== "" &&
          orderMonth < startMonth
        ) {
          return false;
        }
      } else if (startMonth !== "" && endYear === "" && endMonth === "") {
        if (orderMonth < startMonth) return false;
      }

      // End range
      if (endYear !== "" && endMonth !== "") {
        const endVal = endYear * 100 + endMonth;
        const orderVal = orderYear * 100 + orderMonth;
        if (orderVal > endVal) return false;
      } else if (endYear !== "") {
        if (orderYear > endYear) return false;
      } else if (endMonth !== "" && startYear === "" && startMonth === "") {
        if (orderMonth > endMonth) return false;
      }

      return true;
    });
  }, [pendingNUnsuccessfulOrders, startYear, startMonth, endYear, endMonth]);

  // ========== BUILD VARIANTS WITH FILTERED ORDERS ==========
  const thisProductVariants = thisProduct?.variants || [];
  const thisProductVariantsWithOrders = useMemo(() => {
    return addingOrdersToProductVariants(
      thisProductVariants,
      filteredOrdersByDate || [],
    );
  }, [
    thisProductVariants,
    filteredOrdersByDate,
    addingOrdersToProductVariants,
  ]);

  // Available years and months for filter dropdowns
  const availableYears = useMemo(
    () => getAvailableYearsFromOrders(pendingNUnsuccessfulOrders),
    [pendingNUnsuccessfulOrders],
  );
  const startMonths = useMemo(
    () => getMonthsForYear(filteredOrdersByDate, startYear),
    [filteredOrdersByDate, startYear],
  );
  const endMonths = useMemo(
    () => getMonthsForYear(filteredOrdersByDate, endYear),
    [filteredOrdersByDate, endYear],
  );

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const isFilterActive =
    startYear !== "" || startMonth !== "" || endYear !== "" || endMonth !== "";

  const isFilterDirty =
    startYear !== initialFilters.startYear ||
    startMonth !== initialFilters.startMonth ||
    endYear !== initialFilters.endYear ||
    endMonth !== initialFilters.endMonth;

  // ========== INITIAL FILTER SETUP (runs once) ==========
  const maxYear =
    availableYears.length > 0 ? Math.max(...availableYears) : null;

  useEffect(() => {
    if (initialFiltersSet.current) return;

    const urlStartYear = searchParams.get("start_year");
    const urlStartMonth = searchParams.get("start_month");
    const urlEndYear = searchParams.get("end_year");
    const urlEndMonth = searchParams.get("end_month");

    let initStartYear = urlStartYear ? Number(urlStartYear) : "";
    let initStartMonth = urlStartMonth ? Number(urlStartMonth) : "";
    let initEndYear = urlEndYear ? Number(urlEndYear) : "";
    let initEndMonth = urlEndMonth ? Number(urlEndMonth) : "";

    // If no URL filters, use the latest year for both From and To
    if (!urlStartYear && !urlEndYear && maxYear) {
      initStartYear = maxYear;
      initEndYear = maxYear;
      initStartMonth = "";
      initEndMonth = "";
    }

    setStartYear(initStartYear);
    setStartMonth(initStartMonth);
    setEndYear(initEndYear);
    setEndMonth(initEndMonth);

    setInitialFilters({
      startYear: initStartYear,
      startMonth: initStartMonth,
      endYear: initEndYear,
      endMonth: initEndMonth,
    });

    initialFiltersSet.current = true;

    // Sync URL with these initial values (if they differ from current URL)
    const newParams = {};
    if (initStartYear) newParams.start_year = initStartYear;
    if (initStartMonth) newParams.start_month = initStartMonth;
    if (initEndYear) newParams.end_year = initEndYear;
    if (initEndMonth) newParams.end_month = initEndMonth;
    const currentSortField = searchParams.get("sort_field");
    const currentSortDirection = searchParams.get("sort_direction");
    const currentVariantItems = searchParams.get("variant_items");
    if (currentSortField) newParams.sort_field = currentSortField;
    if (currentSortDirection) newParams.sort_direction = currentSortDirection;
    if (currentVariantItems) newParams.variant_items = currentVariantItems;

    setSearchParams(newParams, { replace: true });
  }, [maxYear, searchParams]);

  // ========== URL SYNC FOR FILTER CHANGES ==========
  const getCurrentFilterParams = () => {
    const params = {};
    if (startYear) params.start_year = startYear;
    if (startMonth) params.start_month = startMonth;
    if (endYear) params.end_year = endYear;
    if (endMonth) params.end_month = endMonth;
    return params;
  };

  const updateFilterParams = () => {
    const filterParams = getCurrentFilterParams();
    const currentSortField = searchParams.get("sort_field");
    const currentSortDirection = searchParams.get("sort_direction");
    const currentVariantItems = searchParams.get("variant_items");

    const newParams = { ...filterParams };
    if (currentSortField) newParams.sort_field = currentSortField;
    if (currentSortDirection) newParams.sort_direction = currentSortDirection;
    if (currentVariantItems) newParams.variant_items = currentVariantItems;

    setSearchParams(newParams);
  };

  // ========== FILTER HANDLERS ==========
  const handleStartYearChange = (val) => {
    const newYear = val === "" ? "" : Number(val);
    setStartYear(newYear);
    setStartMonth(""); // always reset month when year changes
    setTimeout(() => updateFilterParams(), 0);
  };

  const handleEndYearChange = (val) => {
    const newYear = val === "" ? "" : Number(val);
    setEndYear(newYear);
    setEndMonth("");
    setTimeout(() => updateFilterParams(), 0);
  };

  const handleStartMonthChange = (val) => {
    const newMonth = val === "" ? "" : Number(val);
    setStartMonth(newMonth);
    setTimeout(() => updateFilterParams(), 0);
  };

  const handleEndMonthChange = (val) => {
    const newMonth = val === "" ? "" : Number(val);
    setEndMonth(newMonth);
    setTimeout(() => updateFilterParams(), 0);
  };

  const clearFilters = () => {
    setStartYear(initialFilters.startYear);
    setStartMonth(initialFilters.startMonth);
    setEndYear(initialFilters.endYear);
    setEndMonth(initialFilters.endMonth);

    const currentSortField = searchParams.get("sort_field");
    const currentSortDirection = searchParams.get("sort_direction");
    const currentVariantItems = searchParams.get("variant_items");

    const newParams = {};
    if (initialFilters.startYear)
      newParams.start_year = initialFilters.startYear;
    if (initialFilters.startMonth)
      newParams.start_month = initialFilters.startMonth;
    if (initialFilters.endYear) newParams.end_year = initialFilters.endYear;
    if (initialFilters.endMonth) newParams.end_month = initialFilters.endMonth;
    if (currentSortField) newParams.sort_field = currentSortField;
    if (currentSortDirection) newParams.sort_direction = currentSortDirection;
    if (currentVariantItems) newParams.variant_items = currentVariantItems;

    setSearchParams(newParams);
  };

  // Loading timeout
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Sorting options
  const orderDetailsSortingOption = getOrderDetailsSortingOptions();
  const buyerDetailsSortingOption = getBuyerDetailsSortingOptions();
  const amountDetailsSortingOption = getAmountDetailSortingOptions();

  const initialSortField = searchParams.get("sort_field") || "order-placed";
  const [sortField, setSortField] = useState(initialSortField);
  const initialSortDirection = searchParams.get("sort_direction") || "asc";
  const [sortDirection, setSortDirection] = useState(initialSortDirection);

  const [orderDetailsSortDropdownOpen, setOrderDetailsSortDropdownOpen] =
    useState(false);
  const [buyerDetailsSortDropdownOpen, setBuyerDetailsSortDropdownOpen] =
    useState(false);
  const [amountDetailsSortDropdownOpen, setAmountDetailsSortDropdownOpen] =
    useState(false);

  const orderDetailsSortDropdownRef = useRef(null);
  const buyerDetailsSortDropdownRef = useRef(null);
  const amountDetailsSortDropdownRef = useRef(null);

  const count = 6;
  const initialVariantItemsParams = parseInt(
    searchParams.get("variant_items") || "0",
  );
  const [variantItemsParams, setVariantItemsParams] = useState(
    initialVariantItemsParams,
  );

  useEffect(() => {
    const urlVariantItems =
      parseInt(searchParams.get("variant_items")) || count;
    setVariantItemsParams(urlVariantItems);
  }, [searchParams]);

  useClickOutside(orderDetailsSortDropdownRef, () =>
    setOrderDetailsSortDropdownOpen(false),
  );
  useClickOutside(buyerDetailsSortDropdownRef, () =>
    setBuyerDetailsSortDropdownOpen(false),
  );
  useClickOutside(amountDetailsSortDropdownRef, () =>
    setAmountDetailsSortDropdownOpen(false),
  );

  // Filtering and Sorting
  const filteredThisProductOrders = useMemo(() => {
    if (!thisProductVariantsWithOrders?.length) return [];

    const sortOrderDetails = (o1, o2) => {
      let v1 = 0,
        v2 = 0;
      if (sortField === "order-placed") {
        v1 = o1.createdAt ? new Date(o1.createdAt).getTime() : 0;
        v2 = o2.createdAt ? new Date(o2.createdAt).getTime() : 0;
      } else if (sortField === "last-update") {
        v1 = o1.updatedAt ? new Date(o1.updatedAt).getTime() : 0;
        v2 = o2.updatedAt ? new Date(o2.updatedAt).getTime() : 0;
      }
      if (sortDirection === "asc") return v1 - v2;
      return v2 - v1;
    };

    const sortBuyerDetails = (o1, o2) => {
      let v1 = "",
        v2 = "";
      if (sortField === "first-name") {
        v1 = o1.buyerInfo?.buyerFirstName?.toLowerCase() || "";
        v2 = o2.buyerInfo?.buyerFirstName?.toLowerCase() || "";
      } else if (sortField === "last-name") {
        v1 = o1.buyerInfo?.buyerLastName?.toLowerCase() || "";
        v2 = o2.buyerInfo?.buyerLastName?.toLowerCase() || "";
      } else if (sortField === "email") {
        v1 = o1.buyerInfo?.email?.toLowerCase() || "";
        v2 = o2.buyerInfo?.email?.toLowerCase() || "";
      }
      if (sortDirection === "asc") return v1.localeCompare(v2);
      return v2.localeCompare(v1);
    };

    const sortAmountDetails = (o1, o2) => {
      let v1 = 0,
        v2 = 0;
      if (sortField === "base-price") {
        v1 = o1.orderedItem?.price || 0;
        v2 = o2.orderedItem?.price || 0;
      } else if (sortField === "quantity") {
        v1 = o1.orderedItem?.quantity || 0;
        v2 = o2.orderedItem?.quantity || 0;
      } else if (sortField === "sub-total") {
        v1 = o1.orderedItem?.subTotal || 0;
        v2 = o2.orderedItem?.subTotal || 0;
      }
      if (sortDirection === "asc") return v1 - v2;
      return v2 - v1;
    };

    const sortPaymentStatus = (o1, o2) => {
      const v1 = o1.paymentInfo?.slug || "";
      const v2 = o2.paymentInfo?.slug || "";
      if (sortDirection === "asc") return v1.localeCompare(v2);
      return v2.localeCompare(v1);
    };

    const sortOrderStatus = (o1, o2) => {
      const v1 = o1.currentStatus?.slug || "";
      const v2 = o2.currentStatus?.slug || "";
      if (sortDirection === "asc") return v1.localeCompare(v2);
      return v2.localeCompare(v1);
    };

    const sortedVariants = [...thisProductVariantsWithOrders].sort((a, b) =>
      (a.name || a._id || "").localeCompare(b.name || b._id || ""),
    );

    const result = sortedVariants.map((variant) => {
      if (!Array.isArray(variant.orders) || variant.orders.length === 0)
        return variant;
      let sortedOrders = [...variant.orders];
      if (["order-placed", "last-update"].includes(sortField)) {
        sortedOrders.sort(sortOrderDetails);
      } else if (["first-name", "last-name", "email"].includes(sortField)) {
        sortedOrders.sort(sortBuyerDetails);
      } else if (["base-price", "quantity", "sub-total"].includes(sortField)) {
        sortedOrders.sort(sortAmountDetails);
      } else if (sortField === "payment-status") {
        sortedOrders.sort(sortPaymentStatus);
      } else if (sortField === "order-status") {
        sortedOrders.sort(sortOrderStatus);
      }
      return { ...variant, orders: sortedOrders };
    });
    return result;
  }, [thisProductVariantsWithOrders, sortField, sortDirection]);

  const displayedThisProductOrders = useMemo(
    () => (filteredThisProductOrders || []).slice(0, variantItemsParams),
    [filteredThisProductOrders, variantItemsParams],
  );

  const loadMore = () => {
    const updateUrlParams = (newCount) => {
      const params = { ...getCurrentFilterParams() };
      params.variant_items = newCount;
      if (sortField) params.sort_field = sortField;
      if (sortDirection) params.sort_direction = sortDirection;
      setSearchParams(params);
    };
    const totalItems =
      filteredThisProductOrders && filteredThisProductOrders.length > 0
        ? filteredThisProductOrders.length
        : thisProduct?.variants?.length || 0;
    const newCount = Math.min(variantItemsParams + count, totalItems);
    if (newCount > variantItemsParams) {
      setVariantItemsParams(newCount);
      updateUrlParams(newCount);
    }
  };

  const variantStatus = getAllVariantStatus();

  const updateSortParams = (field, direction) => {
    const params = { ...getCurrentFilterParams() };
    if (variantItemsParams) params.variant_items = variantItemsParams;
    params.sort_field = field;
    params.sort_direction = direction;
    setSearchParams(params);
  };

  if (isLoading) return <Loader />;

  const selectClass =
    "appearance-none bg-white border border-gray-200 rounded-sm px-2 py-1 text-sm text-gray-900 font-medium focus:outline-none transition-all duration-200 cursor-pointer hover:border-gray-300";
  const disabledSelectClass =
    "appearance-none bg-gray-100 border border-gray-200 rounded-sm px-2 py-1 text-sm text-gray-400 font-medium cursor-not-allowed";

  return (
    <div className="flex flex-col w-full bg-white overflow-hidden">
      {/* DATE RANGE FILTER SECTION */}
      <div className="bg-white border-b border-gray-200 pl-2 pr-2 pb-2">
        <div className="flex justify-between gap-4">
          <div className="flex gap-6">
            <div className="flex gap-2">
              {/* From */}
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  From
                </p>
                <div className="flex gap-2">
                  <select
                    value={startYear}
                    onChange={(e) => handleStartYearChange(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Year</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <select
                    value={startMonth}
                    onChange={(e) => handleStartMonthChange(e.target.value)}
                    disabled={!startYear}
                    className={startYear ? selectClass : disabledSelectClass}
                  >
                    <option value="">Month</option>
                    {startMonths.map((m) => (
                      <option key={m} value={m}>
                        {monthNames[m - 1]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* To */}
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  To
                </p>
                <div className="flex gap-2">
                  <select
                    value={endYear}
                    onChange={(e) => handleEndYearChange(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Year</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <select
                    value={endMonth}
                    onChange={(e) => handleEndMonthChange(e.target.value)}
                    disabled={!endYear}
                    className={endYear ? selectClass : disabledSelectClass}
                  >
                    <option value="">Month</option>
                    {endMonths.map((m) => (
                      <option key={m} value={m}>
                        {monthNames[m - 1]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {isFilterDirty && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs cursor-pointer font-medium text-red-600 bg-red-50 border border-red-200 hover:bg-red-100"
                >
                  <IoClose height={20} width={20} className="text-gray-700" />
                  Clear
                </button>
              )}
            </div>
            <div className="flex items-center">
              {isFilterActive && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Showing {filteredOrdersByDate.length} of{" "}
                    {pendingNUnsuccessfulOrders.length} orders
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex">Search</div>
        </div>
      </div>

      {/* Table header */}
      <div className="sticky w-full top-0 z-30 bg-blue-100 border-t border-b border-gray-300">
        <div className="flex w-full justify-between">
          <div className="grid grid-cols-[2fr_6fr] w-full text-sm">
            <div className="flex items-center border-r border-gray-300 p-1">
              Variant Details
            </div>
            <div className="grid grid-cols-[2.4fr_3.6fr_1.6fr_1.2fr_1.6fr_.5fr] w-full text-sm">
              <div className="flex items-center border-r border-gray-300 p-1">
                <div className={sortItem} ref={orderDetailsSortDropdownRef}>
                  <span>Order Details</span>
                  {displayedThisProductOrders.length === 0 ? (
                    ""
                  ) : (
                    <button
                      onClick={() =>
                        setOrderDetailsSortDropdownOpen((open) => !open)
                      }
                      className={sortItemWithDropdownButton}
                    >
                      <TbArrowsSort height={16} width={16} />
                    </button>
                  )}
                  {orderDetailsSortDropdownOpen && (
                    <div className={sortItemWithDropdownItem}>
                      <div className={sortItemWithDropdownLabelWrapper}>
                        <div className={sortItemWithDropdownLabel}>
                          Sort by:
                        </div>
                        <div className={sortItemWithDropdownList}>
                          {orderDetailsSortingOption.map((item, idx) => (
                            <div
                              key={idx}
                              onMouseDown={() => {
                                const newDirection =
                                  sortField === item.slug
                                    ? sortDirection === "asc"
                                      ? "desc"
                                      : "asc"
                                    : "asc";
                                setSortField(item.slug);
                                setSortDirection(newDirection);
                                updateSortParams(item.slug, newDirection);
                              }}
                              className={`${sortItemWithDropdownListItem} ${sortField === item.slug ? "bg-gray-100" : ""}`}
                            >
                              <div className="flex gap-2 items-center">
                                {item.name}
                                {sortField === item.slug &&
                                  (sortDirection === "asc" ? (
                                    <IoArrowUpOutline height={14} width={14} />
                                  ) : (
                                    <IoArrowDownOutline
                                      height={14}
                                      width={14}
                                    />
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex border-r border-gray-300 p-1">
                <div className={sortItem} ref={buyerDetailsSortDropdownRef}>
                  <span>Buyer Details</span>
                  {displayedThisProductOrders.length === 0 ? (
                    ""
                  ) : (
                    <button
                      onClick={() =>
                        setBuyerDetailsSortDropdownOpen((open) => !open)
                      }
                      className={sortItemWithDropdownButton}
                    >
                      <TbArrowsSort height={16} width={16} />
                    </button>
                  )}
                  {buyerDetailsSortDropdownOpen && (
                    <div className={sortItemWithDropdownItem}>
                      <div className={sortItemWithDropdownLabelWrapper}>
                        <div className={sortItemWithDropdownLabel}>
                          Sort by:
                        </div>
                        <div className={sortItemWithDropdownList}>
                          {buyerDetailsSortingOption.map((item, idx) => (
                            <div
                              key={idx}
                              onMouseDown={() => {
                                const newDirection =
                                  sortField === item.slug
                                    ? sortDirection === "asc"
                                      ? "desc"
                                      : "asc"
                                    : "asc";
                                setSortField(item.slug);
                                setSortDirection(newDirection);
                                updateSortParams(item.slug, newDirection);
                              }}
                              className={`${sortItemWithDropdownListItem} ${sortField === item.slug ? "bg-gray-100" : ""}`}
                            >
                              <div className="flex gap-2 items-center">
                                {item.name}
                                {sortField === item.slug &&
                                  (sortDirection === "asc" ? (
                                    <IoArrowUpOutline height={14} width={14} />
                                  ) : (
                                    <IoArrowDownOutline
                                      height={14}
                                      width={14}
                                    />
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex border-r border-gray-300 p-1">
                <div className={sortItem} ref={amountDetailsSortDropdownRef}>
                  <span>Amount Details</span>
                  {displayedThisProductOrders.length === 0 ? (
                    ""
                  ) : (
                    <button
                      onClick={() =>
                        setAmountDetailsSortDropdownOpen((open) => !open)
                      }
                      className={sortItemWithDropdownButton}
                    >
                      <TbArrowsSort height={16} width={16} />
                    </button>
                  )}
                  {amountDetailsSortDropdownOpen && (
                    <div className={sortItemWithDropdownItem}>
                      <div className={sortItemWithDropdownLabelWrapper}>
                        <div className={sortItemWithDropdownLabel}>
                          Sort by:
                        </div>
                        <div className={sortItemWithDropdownList}>
                          {amountDetailsSortingOption.map((item, idx) => (
                            <div
                              key={idx}
                              onMouseDown={() => {
                                const newDirection =
                                  sortField === item.slug
                                    ? sortDirection === "asc"
                                      ? "desc"
                                      : "asc"
                                    : "asc";
                                setSortField(item.slug);
                                setSortDirection(newDirection);
                                updateSortParams(item.slug, newDirection);
                              }}
                              className={`${sortItemWithDropdownListItem} ${sortField === item.slug ? "bg-gray-100" : ""}`}
                            >
                              <div className="flex gap-2 items-center">
                                {item.name}
                                {sortField === item.slug &&
                                  (sortDirection === "asc" ? (
                                    <IoArrowUpOutline height={14} width={14} />
                                  ) : (
                                    <IoArrowDownOutline
                                      height={14}
                                      width={14}
                                    />
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center border-r border-gray-300 p-1">
                <span>Payment Status</span>
                {displayedThisProductOrders.length === 0 ? (
                  ""
                ) : (
                  <button
                    onClick={() => {
                      const newDirection =
                        sortField === "payment-status"
                          ? sortDirection === "asc"
                            ? "desc"
                            : "asc"
                          : "asc";
                      setSortField("payment-status");
                      setSortDirection(newDirection);
                      updateSortParams("payment-status", newDirection);
                    }}
                    className={sortItemsWithoutDropdown}
                  >
                    <TbArrowsSort height={16} width={16} />
                  </button>
                )}
              </div>
              <div className="flex items-center border-r border-gray-300 p-1">
                <span>Order Status</span>
                {displayedThisProductOrders.length === 0 ? (
                  ""
                ) : (
                  <button
                    onClick={() => {
                      const newDirection =
                        sortField === "order-status"
                          ? sortDirection === "asc"
                            ? "desc"
                            : "asc"
                          : "asc";
                      setSortField("order-status");
                      setSortDirection(newDirection);
                      updateSortParams("order-status", newDirection);
                    }}
                    className={sortItemsWithoutDropdown}
                  >
                    <TbArrowsSort height={16} width={16} />
                  </button>
                )}
              </div>
              <div className="flex border-r border-gray-300 p-1"></div>
            </div>
          </div>
          <div className="flex w-2 bg-blue-100"></div>
        </div>
      </div>
      {/* Table header ends */}

      {/* List area */}
      <div className="flex w-full overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="flex flex-col w-full">
          {displayedThisProductOrders.length === 0 ? (
            <div className="mt-20">
              <LengthIsZeroError />
            </div>
          ) : (
            displayedThisProductOrders.map((variant, index) => {
              const statusItem = variantStatus.find(
                (item) => item?._id === variant?.status,
              );
              const totalPendingVariant = getOrderSubTotalOfAVariant(
                variant?._id,
                pendingOrdersOfThisProduct,
              );
              const totalPendingItemsVariant = getOrderSubTotalCountOfAVariant(
                variant?._id,
                pendingOrdersOfThisProduct,
              );
              const totalUnsuccessfulVariant = getOrderSubTotalOfAVariant(
                variant?._id,
                unsuccessfulOrdersOfThisProduct,
              );
              const totalUnsuccessfulItemsVariant =
                getOrderSubTotalCountOfAVariant(
                  variant?._id,
                  unsuccessfulOrdersOfThisProduct,
                );

              return (
                <div key={index} className="flex flex-col w-full">
                  <div
                    className={`grid grid-cols-[2fr_6fr] bg-white text-sm ${statusItem?.slug === "inactive" ? "opacity-50" : ""}`}
                  >
                    {/* Variant details box */}
                    <div className="flex items-start p-2 border-b border-r border-gray-300 h-full">
                      <div className="flex-col">
                        <div className="flex gap-2">
                          <VariantBadge id={variant._id} />
                          <ItemStatusBadge statusId={variant.status} />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <ImageDoubleExtraSmall
                            image={variant.primaryImage}
                            alt={variant.name}
                            type="square"
                          />
                          <div className="flex flex-col">
                            <h1 className="font-semibold text-md leading-tight">
                              <ProductNameNAttributes
                                productName={thisProduct.name}
                                variant={variant}
                                attributes={attributes}
                              />
                            </h1>
                            <p className="leading-tight">SKU: {variant.sku}</p>
                            <div className="flex gap-2 mt-2">
                              <ProductVariantAttributeBadge
                                variant={variant}
                                attributes={attributes}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex mt-2">
                          <CreatedUpdated
                            createdAt={variant.createdAt}
                            updatedAt={variant.updatedAt}
                          />
                        </div>
                        <div className="flex flex-col mt-2 gap-2">
                          <div className="flex items-center gap-2">
                            <p>Stock: </p>
                            {variant.stock === 0 ? (
                              <TextNormal text="Out of stock" />
                            ) : variant.stock === 1 ? (
                              <TextNormal text={`${variant.stock} Item`} />
                            ) : (
                              <TextNormal text={`${variant.stock} Items`} />
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            {totalPendingVariant > 0 && (
                              <div className="flex items-center gap-2">
                                <SalesBadgeMediumPending
                                  amount={totalPendingVariant}
                                />
                                <p className="leading-tight text-[14px]">
                                  {totalPendingItemsVariant} Pending
                                </p>
                              </div>
                            )}
                            {totalUnsuccessfulVariant > 0 && (
                              <div className="flex items-center gap-2">
                                <SalesBadgeMediumUnsuccessful
                                  amount={totalUnsuccessfulVariant}
                                />
                                <p className="leading-tight text-[14px]">
                                  {totalUnsuccessfulItemsVariant} Unsuccessful
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Orders details box */}
                    <div
                      className={`flex flex-col w-full border-b border-gray-300`}
                    >
                      {variant.orders.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                          <NoSomethingSmall text="No data found" />
                        </div>
                      ) : (
                        variant.orders.map((variantItem, variantIndex) => {
                          return (
                            <div
                              key={variantIndex}
                              className={`flex h-full ${variant.orders.length > 1 ? "border-b border-gray-300" : ""} last:border-b-0`}
                            >
                              <div
                                className={`grid grid-cols-[2.4fr_3.6fr_1.6fr_1.2fr_1.6fr_.5fr] bg-white text-sm`}
                              >
                                <div className="flex items-start p-2 border-r border-gray-300">
                                  <div className="flex flex-col items-start gap-2">
                                    <OrderIdBadge id={variantItem._id} />
                                    <OrderPlacedUpdated
                                      createdAt={variantItem.createdAt}
                                      updatedAt={variantItem.updatedAt}
                                    />
                                  </div>
                                </div>
                                <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                  <BuyerDetail object={variantItem} />
                                </div>
                                <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                  <AmountDetailBox variantItem={variantItem} />
                                </div>
                                <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                  <PaymentStatusBadge
                                    status={variantItem.paymentInfo}
                                  />
                                </div>
                                <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                  <OrderStatusBadge
                                    status={variantItem.currentStatus.slug}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {filteredThisProductOrders.length > 0 &&
            thisProduct?.variants?.length > 0 &&
            variantItemsParams <
              (filteredThisProductOrders.length ||
                thisProduct.variants.length) && (
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
      {/* List area ends */}
    </div>
  );
};
