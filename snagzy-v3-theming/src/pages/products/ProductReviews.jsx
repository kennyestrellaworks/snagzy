import { useOutletContext, useSearchParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { LengthIsZeroError } from "../../components/LengthIsZeroError";
import { NoSomethingSmall } from "../../components/NoSomething";
import {
  ItemStatusBadge,
  OrderIdBadge,
  ProductVariantAttributeBadge,
  ReviewsBadge,
  VariantBadge,
} from "../../components/Badges";
import { ImageDoubleExtraSmall } from "../../components/Image";
import { ProductNameNAttributes } from "../../components/ProductNameNAttributes";
import { CreatedUpdated, OrderPlacedUpdated } from "../../components/DateBoxed";
import { BuyerDetail } from "../../components/BuyerDetail";
import { isoToRegularTimestamp } from "../../utils/helpers";
import { Rating, RatingV2 } from "../../components/Rating";
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
import {
  IoArrowDownOutline,
  IoArrowUpOutline,
  TbArrowsSort,
} from "../../components/SVG";
import { useClickOutside } from "../../hooks/useClickOutside";
import { Loader } from "../../components/Loader";
import { useReviewsAnalytics } from "../../context/ReviewsAnalyticsContext";
import { TextNormal } from "../../components/Text";
import { LoadMoreProduct, LoadMoreVariant } from "../../components/Button";

const INITIAL_REVIEWS_LIMIT = 3;
const REVIEWS_INCREMENT = 3;

export const ProductReviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);

  const {
    getAllVariantStatus,
    getOrderDetailsSortingOptions,
    getBuyerDetailsSortingOptions,
  } = useData();

  // ReviewAnalyticsContext.jsx
  const reviewAnalytics = useReviewsAnalytics();
  const { getAverageReview, getReviewsBreakdown } =
    reviewAnalytics.reviewsAnalyticsValue;

  const { thisProduct, attributes, thisProductVariantsWithReviews } =
    useOutletContext();

  // Sort dropdown data
  const orderDetailsSortingOption = getOrderDetailsSortingOptions();
  const buyerDetailsSortingOption = getBuyerDetailsSortingOptions();

  // Effect to handle loading state with timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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

  // Dropdown refs
  const orderDetailsSortDropdownRef = useRef(null);
  const buyerDetailsSortDropdownRef = useRef(null);

  const count = 6;
  // Variant items count params (main pagination)
  const initialVariantItemsParams = parseInt(
    searchParams.get("variant_items") || 0,
  );
  const [variantItemsParams, setVariantItemsParams] = useState(
    initialVariantItemsParams,
  );

  // Get reviews show counts from URL (per variant)
  const getReviewsCountsFromURL = () => {
    const countsParam = searchParams.get("variant_reviews_counts");
    if (!countsParam) return {};
    try {
      return JSON.parse(countsParam);
    } catch (e) {
      console.error("Failed to parse variant_reviews_counts", e);
      return {};
    }
  };

  const [reviewsShowCounts, setReviewsShowCounts] = useState(
    getReviewsCountsFromURL,
  );

  // Sync reviews counts when URL changes
  useEffect(() => {
    setReviewsShowCounts(getReviewsCountsFromURL());
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

  // Filtering and Sorting
  const filteredThisProductVariants = useMemo(() => {
    let result = thisProductVariantsWithReviews || [];

    if (!result.length) return result;

    // Sorting order details
    const sortOrderDetails = (r1, r2) => {
      let v1 = 0,
        v2 = 0;
      if (sortField === "order-placed") {
        v1 = r1.orderInfo?.createdAt
          ? new Date(r1.orderInfo.createdAt).getTime()
          : 0;
        v2 = r2.orderInfo?.createdAt
          ? new Date(r2.orderInfo.createdAt).getTime()
          : 0;
      } else if (sortField === "last-update") {
        v1 = r1.orderInfo?.updatedAt
          ? new Date(r1.orderInfo.updatedAt).getTime()
          : 0;
        v2 = r2.orderInfo?.updatedAt
          ? new Date(r2.orderInfo.updatedAt).getTime()
          : 0;
      }
      if (sortDirection === "asc") return v1 - v2;
      return v2 - v1;
    };

    // Sorting buyer details
    const sortBuyerDetails = (r1, r2) => {
      let v1 = "",
        v2 = "";
      if (sortField === "first-name") {
        v1 = r1.buyerInfo?.buyerFirstName
          ? r1.buyerInfo.buyerFirstName.toLowerCase()
          : "";
        v2 = r2.buyerInfo?.buyerFirstName
          ? r2.buyerInfo.buyerFirstName.toLowerCase()
          : "";
      } else if (sortField === "last-name") {
        v1 = r1.buyerInfo?.buyerLastName
          ? r1.buyerInfo.buyerLastName.toLowerCase()
          : "";
        v2 = r2.buyerInfo?.buyerLastName
          ? r2.buyerInfo.buyerLastName.toLowerCase()
          : "";
      } else if (sortField === "email") {
        v1 = r1.buyerInfo?.email ? r1.buyerInfo.email.toLowerCase() : "";
        v2 = r2.buyerInfo?.email ? r2.buyerInfo.email.toLowerCase() : "";
      }
      if (sortDirection === "asc") return v1.localeCompare(v2);
      return v2.localeCompare(v1);
    };

    const sortByRating = (r1, r2) => {
      const v1 = r1.rating || 0;
      const v2 = r2.rating || 0;
      if (sortDirection === "asc") return v1 - v2;
      return v2 - v1;
    };

    const sortByDate = (r1, r2) => {
      const v1 = r1.createdAt ? new Date(r1.createdAt).getTime() : 0;
      const v2 = r2.createdAt ? new Date(r2.createdAt).getTime() : 0;
      if (sortDirection === "asc") return v1 - v2;
      return v2 - v1;
    };

    // First, sort the variants themselves
    result = [...result].sort((a, b) => {
      return (a.name || a._id || "").localeCompare(b.name || b._id || "");
    });

    // Then sort reviews inside each variant
    result = result.map((variant) => {
      if (!Array.isArray(variant.reviews) || variant.reviews.length === 0) {
        return variant;
      }

      let sortedReviews = [...variant.reviews];

      if (["order-placed", "last-update"].includes(sortField)) {
        sortedReviews.sort(sortOrderDetails);
      } else if (["first-name", "last-name", "email"].includes(sortField)) {
        sortedReviews.sort(sortBuyerDetails);
      } else if (sortField === "rating") {
        sortedReviews.sort(sortByRating);
      } else if (sortField === "review-date") {
        sortedReviews.sort(sortByDate);
      }

      return {
        ...variant,
        reviews: sortedReviews,
      };
    });

    return result;
  }, [thisProductVariantsWithReviews, sortField, sortDirection]);

  // Helper to get visible reviews for a variant
  const getVisibleReviews = (variantId, allReviews) => {
    const storedCount = reviewsShowCounts[variantId];
    const visibleCount =
      storedCount !== undefined
        ? Math.min(storedCount, allReviews.length)
        : Math.min(INITIAL_REVIEWS_LIMIT, allReviews.length);
    return allReviews.slice(0, visibleCount);
  };

  // Helper to update reviews count for a variant (URL + state)
  const updateReviewsCount = (variantId, newCount) => {
    const newCounts = { ...reviewsShowCounts };
    if (newCount === INITIAL_REVIEWS_LIMIT) {
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
      newParams.variant_reviews_counts = JSON.stringify(newCounts);
    }
    setSearchParams(newParams);

    setReviewsShowCounts(newCounts);
  };

  const loadMoreReviews = (variantId, totalReviews) => {
    const currentCount = reviewsShowCounts[variantId] || INITIAL_REVIEWS_LIMIT;
    const newCount = Math.min(currentCount + REVIEWS_INCREMENT, totalReviews);
    updateReviewsCount(variantId, newCount);
  };

  const resetReviews = (variantId) => {
    updateReviewsCount(variantId, INITIAL_REVIEWS_LIMIT);
  };

  const displayedThisProductVariants = useMemo(() => {
    return (filteredThisProductVariants || []).slice(0, variantItemsParams);
  }, [filteredThisProductVariants, variantItemsParams]);

  // Load more variants (main pagination)
  const loadMore = () => {
    const updateUrlParams = (newCount) => {
      const params = {};
      params.variant_items = newCount;
      if (sortField) params.sort_field = sortField;
      if (sortDirection) params.sort_direction = sortDirection;
      const reviewsCounts = searchParams.get("variant_reviews_counts");
      if (reviewsCounts) params.variant_reviews_counts = reviewsCounts;
      setSearchParams(params);
    };

    const totalItems =
      filteredThisProductVariants && filteredThisProductVariants.length > 0
        ? filteredThisProductVariants.length
        : thisProduct.variants.length;
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
    const reviewsCounts = searchParams.get("variant_reviews_counts");
    if (reviewsCounts) params.variant_reviews_counts = reviewsCounts;
    setSearchParams(params);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col w-full bg-white overflow-hidden">
      {/* Table header */}
      <div className="sticky w-full top-0 z-30 bg-blue-100 border-t border-b border-gray-300">
        <div className="flex w-full justify-between">
          <div className="grid grid-cols-[2fr_6fr] w-full text-sm">
            <div className="flex border-r border-gray-300 p-1">
              Variant Details
            </div>
            <div className="grid grid-cols-[2.4fr_3.6fr_3fr_1.8fr_.5fr] w-full text-sm">
              {/* Order details sorting header */}
              <div className="flex border-r border-gray-300 p-1">
                <div className={sortItem} ref={orderDetailsSortDropdownRef}>
                  <span>Order Details</span>
                  {displayedThisProductVariants.length === 0 ? (
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
                  {displayedThisProductVariants.length === 0 ? (
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
              {/* Rating & review sorting header */}
              <div className="flex border-r border-gray-300 p-1">
                <span>Rating & Review</span>
                {displayedThisProductVariants.length === 0 ? (
                  ""
                ) : (
                  <button
                    onClick={() => {
                      const newDirection =
                        sortField === "rating"
                          ? sortDirection === "asc"
                            ? "desc"
                            : "asc"
                          : "asc";
                      setSortField("rating");
                      setSortDirection(newDirection);
                      updateSortParams("rating", newDirection);
                    }}
                    className={sortItemsWithoutDropdown}
                  >
                    <TbArrowsSort height={16} width={16} />
                  </button>
                )}
              </div>
              <div className="flex border-r border-gray-300 p-1">Media</div>
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
          {displayedThisProductVariants.length === 0 ? (
            <div className="mt-20">
              <LengthIsZeroError />
            </div>
          ) : (
            displayedThisProductVariants.map((variant, index) => {
              const statusItem = variantStatus.find(
                (item) => item._id === variant.status,
              );

              const averageReview = getAverageReview(variant.reviews);
              const reviewBreakdown = getReviewsBreakdown(variant.reviews);

              const totalReviews = variant.reviews.length;
              const visibleReviews = getVisibleReviews(
                variant._id,
                variant.reviews,
              );
              const hasMoreReviews = visibleReviews.length < totalReviews;
              const isShowingAllReviews =
                visibleReviews.length === totalReviews;
              const showReviewsButton = totalReviews > INITIAL_REVIEWS_LIMIT;
              const remainingReviews = totalReviews - visibleReviews.length;
              const reviewsButtonLabel = isShowingAllReviews
                ? "Less"
                : `More +${remainingReviews}`;

              return (
                <div key={index} className="flex flex-col w-full">
                  <div
                    className={`grid grid-cols-[2fr_6fr] border-gray-300 bg-white text-sm ${
                      statusItem?.slug === "inactive" ? "opacity-50" : ""
                    }`}
                  >
                    {/* Column 1 */}
                    <div className="flex items-start p-2 border-b border-r border-gray-300 h-full">
                      <div className="flex-col w-full">
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
                          {variant.reviews.length > 0 && (
                            <div className="flex flex-col border border-gray-200 p-2">
                              <h1 className="font-semibold text-md leading-tight">
                                Variant Review Breakdown
                              </h1>
                              <div className="grid grid-cols-[1fr_4fr] mt-4 gap-4">
                                <div className="flex flex-col items-center justify-center">
                                  <RatingV2 value={averageReview} />
                                  <p className="text-gray-400">
                                    {variant.reviews.length}{" "}
                                    {variant.reviews.length < 2
                                      ? "review"
                                      : "reviews"}
                                  </p>
                                </div>
                                <div className="flex">
                                  <div className="flex-1 space-y-1">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                      const count = reviewBreakdown[star] || 0;
                                      const pct =
                                        variant.reviews.length > 0
                                          ? (count / variant.reviews.length) *
                                            100
                                          : 0;
                                      return (
                                        <div
                                          key={star}
                                          className="flex items-center gap-3"
                                        >
                                          <span className="text-xs text-gray-500 w-3 text-right">
                                            {star}
                                          </span>
                                          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                            <div
                                              className="h-full rounded-full transition-all duration-700"
                                              style={{
                                                width: `${pct}%`,
                                                background:
                                                  star >= 4
                                                    ? "#22c55e"
                                                    : star === 3
                                                      ? "#f59e0b"
                                                      : "#ef4444",
                                              }}
                                            />
                                          </div>
                                          <span className="text-xs text-gray-400 w-6 text-right">
                                            {count}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Column 2 */}
                    <div className="flex flex-col w-full border-b border-gray-300">
                      {variant.reviews.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                          <NoSomethingSmall text="No data found" />
                        </div>
                      ) : (
                        <>
                          {visibleReviews.map((variantItem, variantIndex) => (
                            <div
                              key={variantIndex}
                              className={`flex flex-col h-full ${visibleReviews.length > 1 ? "border-b border-gray-300" : ""} last:border-b-0`}
                            >
                              <div
                                className={`grid grid-cols-[2.4fr_3.6fr_3fr_1.8fr_.5fr] text-sm h-full`}
                              >
                                {/* Order details box */}
                                <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                  <div className="flex flex-col items-start gap-2">
                                    <OrderIdBadge
                                      id={variantItem.orderInfo?.orderId}
                                    />
                                    <OrderPlacedUpdated
                                      createdAt={
                                        variantItem.orderInfo?.createdAt
                                      }
                                      updatedAt={
                                        variantItem.orderInfo?.updatedAt
                                      }
                                    />
                                  </div>
                                </div>
                                {/* Buyer details box */}
                                <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                  <BuyerDetail object={variantItem} />
                                </div>
                                {/* Rating & review box */}
                                <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                  <div className="flex gap-2">
                                    <div className="flex flex-col">
                                      <div className="flex items-center gap-1">
                                        <Rating value={variantItem.rating} />
                                      </div>
                                      <ReviewsBadge id={variantItem.reviewId} />
                                      {variantItem.feedback && (
                                        <div className="flex mt-2">
                                          <p className="text-sm italic">
                                            "{variantItem.feedback}"
                                          </p>
                                        </div>
                                      )}
                                      <div className="flex mt-2">
                                        <p className="text-gray-500 text-xs">
                                          {isoToRegularTimestamp(
                                            variantItem.createdAt,
                                          )}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* Media box */}
                                <div className="flex items-start p-2 border-r border-gray-300 h-full"></div>
                                <div className="flex items-start p-2 border-r border-gray-300 h-full"></div>
                              </div>
                            </div>
                          ))}
                          {/* Load more / Show fewer reviews button */}
                          {showReviewsButton && (
                            <div
                              className={`flex items-center justify-center p-2 bg-gray-50 ${visibleReviews.length > 1 ? "" : "border-t border-gray-200"}`}
                            >
                              <LoadMoreVariant
                                onClick={() => {
                                  if (isShowingAllReviews) {
                                    resetReviews(variant._id);
                                  } else {
                                    loadMoreReviews(variant._id, totalReviews);
                                  }
                                }}
                              >
                                {reviewsButtonLabel}
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
          {filteredThisProductVariants.length > 0 &&
            thisProduct.variants.length > 0 &&
            variantItemsParams <
              (filteredThisProductVariants.length ||
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
