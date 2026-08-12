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
  IoArrowDownOutline,
  IoArrowUpOutline,
  TbArrowsSort,
} from "../../components/SVG";
import { PaymentStatusBadge } from "../../components/PaymentStatusBadge";
import { OrderStatusBadge } from "../../components/OrderStatusBadge";
import { Loader } from "../../components/Loader";
import { useOrdersAnalytics } from "../../context/OrdersAnalyticsContext";
import { TextNormal } from "../../components/Text";
import { AmountFormatSmall } from "../../components/AmountFormat";
import { LoadMoreProduct, LoadMoreVariant } from "../../components/Button";
import { dateFormatter } from "../../utils/helpers";

const INITIAL_ORDERS_LIMIT = 3;
const ORDERS_INCREMENT = 3;

export const ProductOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { thisProduct, attributes, ordersByThisProduct } = useOutletContext();

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

  // Pending orders
  const pendingOrdersOfThisProduct = getPendingOrdersOfAProduct(
    thisProduct._id,
  );

  const pendingOrdersByThisProduct = getAllOrdersByProductId(
    thisProduct._id,
    pendingOrdersOfThisProduct,
  );

  // Unsuccessful orders
  const unsuccessfulOrdersOfThisProduct = getUnsuccessfulOrdersOfAProduct(
    thisProduct._id,
  );

  const unsuccessfulOrdersByThisProduct = getAllOrdersByProductId(
    thisProduct._id,
    unsuccessfulOrdersOfThisProduct,
  );

  const pendingNUnsuccessfulOrders = [
    ...pendingOrdersByThisProduct,
    ...unsuccessfulOrdersByThisProduct,
  ];

  const thisProductVariants = thisProduct?.variants || [];

  const thisProductVariantsWithOrders = addingOrdersToProductVariants(
    thisProductVariants,
    pendingNUnsuccessfulOrders || [],
  );

  // Effect to handle loading state with timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Sort dropdown data
  const orderDetailsSortingOption = getOrderDetailsSortingOptions();
  const buyerDetailsSortingOption = getBuyerDetailsSortingOptions();
  const amountDetailsSortingOption = getAmountDetailSortingOptions();

  // Sorting params
  const initialSortField = searchParams.get("sort_field") || "order-placed";
  const [sortField, setSortField] = useState(initialSortField);
  const initialSortDirection = searchParams.get("sort_direction") || "asc";
  const [sortDirection, setSortDirection] = useState(initialSortDirection);

  // Dropdown state
  const [orderDetailsSortDropdownOpen, setOrderDetailsSortDropdownOpen] =
    useState(false);
  const [buyerDetailsSortDropdownOpen, setBuyerDetailsSortDropdownOpen] =
    useState(false);
  const [amountDetailsSortDropdownOpen, setAmountDetailsSortDropdownOpen] =
    useState(false);

  // Dropdown refs
  const orderDetailsSortDropdownRef = useRef(null);
  const buyerDetailsSortDropdownRef = useRef(null);
  const amountDetailsSortDropdownRef = useRef(null);

  // Variant items count params (main pagination)
  const count = 6;
  const initialVariantItemsParams = parseInt(
    searchParams.get("variant_items") || "0",
  );
  const [variantItemsParams, setVariantItemsParams] = useState(
    initialVariantItemsParams,
  );

  // Get orders show counts from URL (per variant)
  const getOrdersCountsFromURL = () => {
    const countsParam = searchParams.get("variant_orders_counts");
    if (!countsParam) return {};
    try {
      return JSON.parse(countsParam);
    } catch (e) {
      console.error("Failed to parse variant_orders_counts", e);
      return {};
    }
  };

  const [ordersShowCounts, setOrdersShowCounts] = useState(
    getOrdersCountsFromURL,
  );

  // Sync orders counts when URL changes
  useEffect(() => {
    setOrdersShowCounts(getOrdersCountsFromURL());
  }, [searchParams]);

  // useEffect mount values for main pagination
  useEffect(() => {
    const urlVariantItems =
      parseInt(searchParams.get("variant_items")) || count;
    setVariantItemsParams(urlVariantItems);
  }, [searchParams]);

  // Click outside hooks
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
    if (!thisProductVariantsWithOrders?.length) {
      return [];
    }

    // Sorting order details (now includes "current-status")
    const sortOrderDetails = (o1, o2) => {
      let v1 = 0,
        v2 = 0;
      if (sortField === "order-placed") {
        v1 = o1.createdAt ? new Date(o1.createdAt).getTime() : 0;
        v2 = o2.createdAt ? new Date(o2.createdAt).getTime() : 0;
      } else if (sortField === "last-update") {
        v1 = o1.updatedAt ? new Date(o1.updatedAt).getTime() : 0;
        v2 = o2.updatedAt ? new Date(o2.updatedAt).getTime() : 0;
      } else if (sortField === "current-status") {
        v1 = o1.currentStatus?.timestamp
          ? new Date(o1.currentStatus.timestamp).getTime()
          : 0;
        v2 = o2.currentStatus?.timestamp
          ? new Date(o2.currentStatus.timestamp).getTime()
          : 0;
      }
      if (sortDirection === "asc") return v1 - v2;
      return v2 - v1;
    };

    // Sorting buyer details
    const sortBuyerDetails = (o1, o2) => {
      let v1 = "",
        v2 = "";
      if (sortField === "first-name") {
        v1 = o1.buyerInfo?.buyerFirstName
          ? o1.buyerInfo.buyerFirstName.toLowerCase()
          : "";
        v2 = o2.buyerInfo?.buyerFirstName
          ? o2.buyerInfo.buyerFirstName.toLowerCase()
          : "";
      } else if (sortField === "last-name") {
        v1 = o1.buyerInfo?.buyerLastName
          ? o1.buyerInfo.buyerLastName.toLowerCase()
          : "";
        v2 = o2.buyerInfo?.buyerLastName
          ? o2.buyerInfo.buyerLastName.toLowerCase()
          : "";
      } else if (sortField === "email") {
        v1 = o1.buyerInfo?.email ? o1.buyerInfo.email.toLowerCase() : "";
        v2 = o2.buyerInfo?.email ? o2.buyerInfo.email.toLowerCase() : "";
      }
      if (sortDirection === "asc") return v1.localeCompare(v2);
      return v2.localeCompare(v1);
    };

    // Sorting amount details
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

    // Sorting payment status
    const sortPaymentStatus = (o1, o2) => {
      const v1 = o1.paymentInfo?.slug || "";
      const v2 = o2.paymentInfo?.slug || "";
      if (sortDirection === "asc") return v1.localeCompare(v2);
      return v2.localeCompare(v1);
    };

    // Sorting order status
    const sortOrderStatus = (o1, o2) => {
      const v1 = o1.currentStatus?.slug || "";
      const v2 = o2.currentStatus?.slug || "";
      if (sortDirection === "asc") return v1.localeCompare(v2);
      return v2.localeCompare(v1);
    };

    // First, sort the variants themselves
    const sortedVariants = [...thisProductVariantsWithOrders].sort((a, b) => {
      return (a.name || a._id || "").localeCompare(b.name || b._id || "");
    });

    // Then sort orders inside each variant
    const result = sortedVariants.map((order) => {
      if (!Array.isArray(order.orders) || order.orders.length === 0) {
        return order;
      }

      let sortedOrders = [...order.orders];

      // Include "current-status" in the condition
      if (
        ["order-placed", "last-update", "current-status"].includes(sortField)
      ) {
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

      return {
        ...order,
        orders: sortedOrders,
      };
    });

    return result;
  }, [thisProductVariantsWithOrders, sortField, sortDirection]);

  // Helper to get visible orders for a variant
  const getVisibleOrders = (variantId, allOrders) => {
    const storedCount = ordersShowCounts[variantId];
    const visibleCount =
      storedCount !== undefined
        ? Math.min(storedCount, allOrders.length)
        : Math.min(INITIAL_ORDERS_LIMIT, allOrders.length);
    return allOrders.slice(0, visibleCount);
  };

  // Helper to update orders count for a variant (URL + state)
  const updateOrdersCount = (variantId, newCount) => {
    const newCounts = { ...ordersShowCounts };
    if (newCount === INITIAL_ORDERS_LIMIT) {
      delete newCounts[variantId];
    } else {
      newCounts[variantId] = newCount;
    }

    // Update URL
    const newParams = {};
    const variantItems = searchParams.get("variant_items");
    if (variantItems) newParams.variant_items = variantItems;
    const sortFieldParam = searchParams.get("sort_field");
    if (sortFieldParam) newParams.sort_field = sortFieldParam;
    const sortDirectionParam = searchParams.get("sort_direction");
    if (sortDirectionParam) newParams.sort_direction = sortDirectionParam;
    if (Object.keys(newCounts).length > 0) {
      newParams.variant_orders_counts = JSON.stringify(newCounts);
    }
    setSearchParams(newParams);

    setOrdersShowCounts(newCounts);
  };

  const loadMoreOrders = (variantId, totalOrders) => {
    const currentCount = ordersShowCounts[variantId] || INITIAL_ORDERS_LIMIT;
    const newCount = Math.min(currentCount + ORDERS_INCREMENT, totalOrders);
    updateOrdersCount(variantId, newCount);
  };

  const resetOrders = (variantId) => {
    updateOrdersCount(variantId, INITIAL_ORDERS_LIMIT);
  };

  const displayedThisProductOrders = useMemo(() => {
    return (filteredThisProductOrders || []).slice(0, variantItemsParams);
  }, [filteredThisProductOrders, variantItemsParams]);

  // Load more variants (main pagination)
  const loadMore = () => {
    const updateUrlParams = (newCount) => {
      const params = {};
      params.variant_items = newCount;
      if (sortField) params.sort_field = sortField;
      if (sortDirection) params.sort_direction = sortDirection;
      const ordersCounts = searchParams.get("variant_orders_counts");
      if (ordersCounts) params.variant_orders_counts = ordersCounts;
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
    const params = {};
    if (variantItemsParams) params.variant_items = variantItemsParams;
    params.sort_field = field;
    params.sort_direction = direction;
    const ordersCounts = searchParams.get("variant_orders_counts");
    if (ordersCounts) params.variant_orders_counts = ordersCounts;
    setSearchParams(params);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col w-full bg-white overflow-hidden">
      {/* Table header  */}
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
                          {orderDetailsSortingOption.map((item, index) => {
                            return (
                              <div
                                key={index}
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
                                  {sortField === item.slug ? (
                                    sortDirection === "asc" ? (
                                      <IoArrowUpOutline
                                        height={14}
                                        width={14}
                                      />
                                    ) : (
                                      <IoArrowDownOutline
                                        height={14}
                                        width={14}
                                      />
                                    )
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Buyer details sorting header */}
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
                          {buyerDetailsSortingOption.map((item, index) => {
                            return (
                              <div
                                key={index}
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
                                  {sortField === item.slug ? (
                                    sortDirection === "asc" ? (
                                      <IoArrowUpOutline
                                        height={14}
                                        width={14}
                                      />
                                    ) : (
                                      <IoArrowDownOutline
                                        height={14}
                                        width={14}
                                      />
                                    )
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
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
                          {amountDetailsSortingOption.map((item, index) => {
                            return (
                              <div
                                key={index}
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
                                  {sortField === item.slug ? (
                                    sortDirection === "asc" ? (
                                      <IoArrowUpOutline
                                        height={14}
                                        width={14}
                                      />
                                    ) : (
                                      <IoArrowDownOutline
                                        height={14}
                                        width={14}
                                      />
                                    )
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Payment Status header */}
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
              {/* Order Status header */}
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
      {/* List area  */}
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

              // Variant pending/unsuccessful totals (for badges)
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

              const totalOrders = variant.orders.length;
              const visibleOrders = getVisibleOrders(
                variant._id,
                variant.orders,
              );
              const hasMoreOrders = visibleOrders.length < totalOrders;
              const isShowingAllOrders = visibleOrders.length === totalOrders;
              const showOrdersButton = totalOrders > INITIAL_ORDERS_LIMIT;
              const remainingOrders = totalOrders - visibleOrders.length;
              const ordersButtonLabel = isShowingAllOrders
                ? "Less"
                : `More +${remainingOrders}`;

              return (
                <div key={index} className="flex flex-col w-full">
                  <div
                    className={`grid grid-cols-[2fr_6fr] bg-white text-sm ${statusItem?.slug === "inactive" ? "opacity-50" : statusItem?.slug === "active" ? "" : ""}`}
                  >
                    {/* Grid 1 */}
                    <div className="flex items-start p-2 border-b border-r border-gray-300 h-full">
                      {/* Variant details box  */}
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
                    {/* Grid 2 */}
                    <div className="flex flex-col w-full border-b border-gray-300">
                      {variant.orders.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                          <NoSomethingSmall text="No data found" />
                        </div>
                      ) : (
                        <>
                          {visibleOrders.map((variantItem, variantIndex) => (
                            <div
                              key={variantIndex}
                              className={`flex flex-col h-full ${visibleOrders.length > 1 ? "border-b border-gray-300" : ""} last:border-b-0`}
                            >
                              <div className="grid grid-cols-[2.4fr_3.6fr_1.6fr_1.2fr_1.6fr_.5fr] bg-white text-sm h-full">
                                {/* Order details box */}
                                <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                  <div className="flex flex-col items-start gap-2">
                                    <OrderIdBadge id={variantItem._id} />
                                    <OrderPlacedUpdated
                                      createdAt={variantItem.createdAt}
                                      updatedAt={variantItem.updatedAt}
                                    />
                                  </div>
                                </div>
                                {/* Buyer details box */}
                                <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                  <BuyerDetail object={variantItem} />
                                </div>
                                {/* Amount details box */}
                                <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                  <AmountDetailBox variantItem={variantItem} />
                                </div>
                                {/* Payment status */}
                                <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                  <PaymentStatusBadge
                                    status={variantItem.paymentInfo}
                                  />
                                </div>
                                {/* Order status */}
                                <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                  <div className="flex flex-col gap-1">
                                    <OrderStatusBadge
                                      status={variantItem.currentStatus.slug}
                                    />
                                    <p className="text-[13px] leading-tight">
                                      {dateFormatter(
                                        variantItem.currentStatus.timestamp,
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {/* Load more / Show fewer orders button */}
                          {showOrdersButton && (
                            <div
                              className={`flex items-center justify-center p-2 bg-gray-50 ${visibleOrders.length > 1 ? "" : "border-t border-gray-200"}`}
                            >
                              <LoadMoreVariant
                                onClick={() => {
                                  if (isShowingAllOrders) {
                                    resetOrders(variant._id);
                                  } else {
                                    loadMoreOrders(variant._id, totalOrders);
                                  }
                                }}
                              >
                                {ordersButtonLabel}
                              </LoadMoreVariant>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {/* Main "Load more variants" button */}
          {filteredThisProductOrders.length > 0 &&
            thisProduct?.variants?.length > 0 &&
            variantItemsParams <
              (filteredThisProductOrders.length ||
                thisProduct.variants.length) && (
              <div className="flex items-center justify-center">
                <div className="flex p-2">
                  <LoadMoreProduct onClick={loadMore}>
                    Load more
                  </LoadMoreProduct>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
