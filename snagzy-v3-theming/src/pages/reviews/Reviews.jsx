import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../components/PageHeader";
import { useData } from "../../context/DataContext";
import { useSearchParams } from "react-router-dom";
import { LengthIsZeroError } from "../../components/LengthIsZeroError";
import { NoSomethingSmall } from "../../components/NoSomething";
import { BuyerDetail } from "../../components/BuyerDetail";
import {
  ItemStatusBadge,
  OrderIdBadge,
  OrderVariantAttributeBadege,
  ReviewsBadge,
  VariantBadge,
} from "../../components/Badges";
import { OrderPlacedUpdated } from "../../components/DateBoxed";
import { ImageDoubleExtraSmall } from "../../components/Image";
import { Rating, RatingV2 } from "../../components/Rating";
import { isoToRegularTimestamp } from "../../utils/helpers";
import { useReviewsAnalytics } from "../../context/ReviewsAnalyticsContext";

// Import uniform buttons matching structural layout guidelines
import { LoadMoreProduct, LoadMoreVariant } from "../../components/Button";

const INITIAL_ITEM_LIMIT = 3;
const ITEM_INCREMENT = 3;

export const Reviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getReviewsByBuyerId, getAllAttributes } = useData();

  // ReviewAnalyticsContext.jsx
  const reviewAnalytics = useReviewsAnalytics();
  const { getAverageReview, getReviewsBreakdown } =
    reviewAnalytics.reviewsAnalyticsValue;

  const attributes = getAllAttributes();

  // Initialize grouped reviews
  const groupReviewsArray = getReviewsByBuyerId();
  console.log("groupReviewsArray", groupReviewsArray);

  const count = 6;
  // Review items count params
  const initialReviewItemsParams = parseInt(searchParams.get("reviews") || 0);
  const [reviewItemsParams, setReviewItemsParams] = useState(
    initialReviewItemsParams,
  );

  // Get inner ordered item visible counts from URL (JSON string)
  const getOrderedItemCountsFromURL = () => {
    const countsParam = searchParams.get("ordered_item_counts");
    if (!countsParam) return {};
    try {
      return JSON.parse(countsParam);
    } catch (e) {
      console.error("Failed to parse ordered_item_counts", e);
      return {};
    }
  };

  const [orderedItemShowCounts, setOrderedItemShowCounts] = useState(
    getOrderedItemCountsFromURL,
  );

  // Sync state when URL changes (e.g., back/forward navigation)
  useEffect(() => {
    setOrderedItemShowCounts(getOrderedItemCountsFromURL());
  }, [searchParams]);

  // useEffect mount values
  useEffect(() => {
    const urlReviewItems = parseInt(searchParams.get("reviews")) || count;
    setReviewItemsParams(urlReviewItems);
  }, [searchParams]);

  // Filtering and sorting by the latest review item's createdAt timestamp
  const filteredThisGroupReviews = useMemo(() => {
    // 1. Shallow copy the array to protect against React state mutation side effects
    let result = groupReviewsArray ? [...groupReviewsArray] : [];

    // 2. Helper function to find the maximum (latest) review timestamp for a user row
    const getLatestReviewTimestamp = (itemGroup) => {
      let latestTime = 0;

      // Look through the user row's orderedItems array
      if (itemGroup.orderedItems && Array.isArray(itemGroup.orderedItems)) {
        itemGroup.orderedItems.forEach((orderedItem) => {
          // Check if this ordered item has an array of reviews
          if (orderedItem.reviews && Array.isArray(orderedItem.reviews)) {
            orderedItem.reviews.forEach((review) => {
              // Convert the ISO string timestamp (e.g. "2026-06-27T05:05:50.452Z") into milliseconds
              const reviewTime = review.createdAt
                ? new Date(review.createdAt).getTime()
                : 0;
              if (reviewTime > latestTime) {
                latestTime = reviewTime;
              }
            });
          }
        });
      }
      return latestTime;
    };

    // 3. Sort the array so that the group containing the newest review timestamp comes first
    return result.sort((a, b) => {
      return getLatestReviewTimestamp(b) - getLatestReviewTimestamp(a); // Descending Order (Newest first)
    });
  }, [groupReviewsArray]);

  const displayedThisReviews = useMemo(() => {
    return (filteredThisGroupReviews || []).slice(0, reviewItemsParams);
  }, [filteredThisGroupReviews, reviewItemsParams]);

  // Load more parent review rows
  const loadMore = () => {
    const updateUrlParams = (newCount) => {
      const params = {};
      params.reviews = newCount;
      // Preserve existing ordered_item_counts values
      const currentCounts = searchParams.get("ordered_item_counts");
      if (currentCounts) params.ordered_item_counts = currentCounts;
      setSearchParams(params);
    };

    const totalItems =
      filteredThisGroupReviews && filteredThisGroupReviews.length > 0
        ? filteredThisGroupReviews.length
        : 0;
    const newCount = Math.min(reviewItemsParams + count, totalItems);

    if (newCount > reviewItemsParams) {
      setReviewItemsParams(newCount);
      updateUrlParams(newCount);
    }
  };

  // Increase visible inner ordered items limit for a specific customer log row
  const loadMoreOrderedItems = (orderId, totalItems) => {
    const currentCount = orderedItemShowCounts[orderId] || INITIAL_ITEM_LIMIT;
    const newCount = Math.min(currentCount + ITEM_INCREMENT, totalItems);
    updateOrderedItemCount(orderId, newCount);
  };

  // Reset inner order items limits back to default visibility values
  const resetOrderedItems = (orderId) => {
    updateOrderedItemCount(orderId, INITIAL_ITEM_LIMIT);
  };

  // Helper to sync subgrid visibility properties directly into search parameters tracking object
  const updateOrderedItemCount = (orderId, newCount) => {
    const newCounts = { ...orderedItemShowCounts };
    if (newCount === INITIAL_ITEM_LIMIT) {
      delete newCounts[orderId];
    } else {
      newCounts[orderId] = newCount;
    }

    const newParams = {};
    const reviewsParamValue = searchParams.get("reviews");
    if (reviewsParamValue) newParams.reviews = reviewsParamValue;
    if (Object.keys(newCounts).length > 0) {
      newParams.ordered_item_counts = JSON.stringify(newCounts);
    }
    setSearchParams(newParams);
    setOrderedItemShowCounts(newCounts);
  };

  // Compute maximum allowed upper bounds range indices for selected keys
  const getVisibleOrderedItemCount = (orderId, totalItems) => {
    const stored = orderedItemShowCounts[orderId];
    if (stored !== undefined) return Math.min(stored, totalItems);
    return Math.min(INITIAL_ITEM_LIMIT, totalItems);
  };

  return (
    <div className="flex flex-col w-full bg-white border border-gray-300 rounded-md overflow-hidden">
      {/* Header  */}
      <div className="w-full top-0 z-50">
        <div className="w-full flex flex-1 flex-col p-2">
          <div className="flex gap-2">
            <PageHeader defaultPage="Analytics" type="sidebar-level" />
          </div>
        </div>
      </div>
      {/* Header ends */}
      {/* Table header  */}
      <div className="w-full top-0 z-30 bg-blue-100 border-t border-b border-gray-300">
        <div className="flex w-full justify-between">
          <div className="grid grid-cols-[2fr_7fr] w-full text-sm">
            <div className="flex border-r border-gray-300 p-1">
              Buyer Details
            </div>
            <div className="grid grid-cols-[2fr_7fr]">
              <div className="flex border-r border-gray-300 p-1">
                Order Details
              </div>
              <div className="grid grid-cols-[4fr_3fr_2fr] w-full text-sm">
                <div className="flex border-r border-gray-300 p-1">
                  Ordered Items
                </div>
                <div className="flex border-r border-gray-300 p-1">
                  Rating & Review
                </div>
                <div className="flex border-gray-300 p-1">Media</div>
              </div>
            </div>
          </div>
          <div className="flex w-2 bg-blue-100"></div>
        </div>
      </div>
      {/* Table header ends */}
      {/* List area */}
      <div className="flex w-full overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="flex flex-col w-full">
          {displayedThisReviews.length === 0 ? (
            <div className="mt-20">
              <LengthIsZeroError />
            </div>
          ) : (
            displayedThisReviews.map((reviewByUser, reviewByUserIndex) => {
              // Calculate average rating and breakdown for this user's reviews
              const calculateReviewStats = (orderedItems) => {
                const allRatings = [];

                orderedItems.forEach((item) => {
                  if (item.reviews && item.reviews.length > 0) {
                    item.reviews.forEach((review) => {
                      allRatings.push(review.rating);
                    });
                  }
                });

                if (allRatings.length === 0) {
                  return {
                    averageRating: 0,
                    totalReviews: 0,
                    breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                  };
                }

                const sum = allRatings.reduce((acc, rating) => acc + rating, 0);
                const averageRating = sum / allRatings.length;

                const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

                allRatings.forEach((rating) => {
                  const roundedRating = Math.round(rating);
                  const starKey = Math.min(5, Math.max(1, roundedRating));
                  breakdown[starKey] = (breakdown[starKey] || 0) + 1;
                });

                return {
                  averageRating: averageRating.toFixed(1),
                  totalReviews: allRatings.length,
                  breakdown,
                };
              };

              const reviewStats = calculateReviewStats(
                reviewByUser.orderedItems,
              );
              const averageReview = reviewStats.averageRating;
              const reviewBreakdown = reviewStats.breakdown;

              // Ordered Items sub-pagination configuration rules logic
              const totalItems = reviewByUser.orderedItems.length;
              const visibleCount = getVisibleOrderedItemCount(
                reviewByUser.orderId,
                totalItems,
              );
              const visibleItems = reviewByUser.orderedItems.slice(
                0,
                visibleCount,
              );
              const isShowingAll = visibleCount === totalItems;
              const showLoadMoreButton = totalItems > INITIAL_ITEM_LIMIT;
              const remainingItems = totalItems - visibleCount;
              const buttonLabel = isShowingAll
                ? "Less"
                : `More +${remainingItems}`;

              return (
                <div key={reviewByUserIndex} className="flex flex-col w-full">
                  <div className="grid grid-cols-[2fr_7fr] border-b border-gray-300">
                    {/* Grid 1: Buyer Information Column */}
                    <div className="flex items-start p-2 border-r border-gray-300 h-full text-sm">
                      <div className="flex flex-col w-full">
                        <BuyerDetail object={reviewByUser.user} />
                        <div className="flex flex-col border border-gray-200 p-2 mt-4">
                          <h1 className="font-semibold text-md leading-tight">
                            User Review Breakdown
                          </h1>
                          <div className="grid grid-cols-[1fr_4fr] mt-4 gap-4">
                            <div className="flex flex-col items-center justify-center">
                              <RatingV2 value={averageReview} />
                              <p className="text-gray-400">
                                {reviewStats.totalReviews}{" "}
                                {reviewStats.totalReviews < 2
                                  ? "review"
                                  : "reviews"}
                              </p>
                            </div>
                            <div className="flex">
                              <div className="flex-1 space-y-1">
                                {[5, 4, 3, 2, 1].map((star) => {
                                  const count = reviewBreakdown[star] || 0;
                                  const pct =
                                    reviewStats.totalReviews > 0
                                      ? (count / reviewStats.totalReviews) * 100
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
                      </div>
                    </div>

                    {/* Grid 2: Combined Right Hand Data Segment Blocks */}
                    <div className="flex flex-col w-full h-full">
                      <div className="grid grid-cols-[2fr_7fr] bg-white h-full text-sm">
                        {/* Order ID tracking block */}
                        <div className="flex items-start p-2 border-r border-gray-300">
                          <div className="flex flex-col items-start gap-2">
                            <div className="flex items-start">
                              <OrderIdBadge id={reviewByUser.orderId} />
                            </div>
                          </div>
                        </div>

                        {/* Ordered Items, Ratings, and Media layout container segment */}
                        <div className="flex flex-col w-full h-full">
                          {totalItems === 0 ? (
                            <div className="flex h-full items-center justify-center p-2">
                              <NoSomethingSmall text="No data found" />
                            </div>
                          ) : (
                            <div className="flex flex-col h-full">
                              {visibleItems.map(
                                (
                                  reviewByUserOrderedItem,
                                  orderedItemsIndex,
                                ) => {
                                  const displayName = [
                                    reviewByUserOrderedItem.productName,
                                    ...reviewByUserOrderedItem.variant.attributeOptions.map(
                                      (option) => option.value,
                                    ),
                                  ].join(" | ");

                                  return (
                                    <div
                                      key={orderedItemsIndex}
                                      className="grid grid-cols-[4fr_3fr_2fr] items-start border-b border-gray-300 last:border-b-0 h-full"
                                    >
                                      {/* Ordered items description details */}
                                      <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                        <div className="flex flex-col">
                                          <div className="flex gap-2">
                                            <VariantBadge
                                              id={
                                                reviewByUserOrderedItem.variant
                                                  ._id
                                              }
                                            />
                                          </div>
                                          <div className="flex gap-2 mt-2">
                                            <ImageDoubleExtraSmall
                                              image={
                                                reviewByUserOrderedItem.variant
                                                  .primaryImage
                                              }
                                              alt={
                                                reviewByUserOrderedItem.variant
                                                  .productName
                                              }
                                              type="square"
                                            />
                                            <div className="flex flex-col">
                                              <h1 className="font-semibold text-md leading-tight">
                                                {displayName}
                                              </h1>
                                              <p className="leading-tight">
                                                SKU:{" "}
                                                {
                                                  reviewByUserOrderedItem
                                                    .variant.sku
                                                }
                                              </p>
                                              <div className="flex gap-2 mt-2">
                                                <div className="flex gap-2 text-xs text-gray-600">
                                                  {reviewByUserOrderedItem.variant.attributeOptions.map(
                                                    (option, index) => (
                                                      <OrderVariantAttributeBadege
                                                        key={index}
                                                        option={option}
                                                        index={index}
                                                        attributes={attributes}
                                                      />
                                                    ),
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Rating & feedback notes column */}
                                      <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                        <div className="flex gap-2 w-full">
                                          {reviewByUserOrderedItem.reviews.map(
                                            (reviewItem, reviewItemIndex) => (
                                              <div
                                                key={reviewItemIndex}
                                                className="flex flex-col w-full"
                                              >
                                                <div className="flex items-center gap-1">
                                                  <Rating
                                                    value={reviewItem.rating}
                                                  />
                                                </div>
                                                <ReviewsBadge
                                                  id={reviewItem._id}
                                                />
                                                <div className="flex mt-2">
                                                  <p className="text-sm italic">
                                                    "{reviewItem.feedback}"
                                                  </p>
                                                </div>
                                                <p className="text-gray-500 text-xs">
                                                  {isoToRegularTimestamp(
                                                    reviewItem.createdAt,
                                                  )}
                                                </p>
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      </div>

                                      {/* Attachments and media items box */}
                                      <div className="flex items-start p-2 h-full">
                                        THIS
                                      </div>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Extended Full-Width Subgrid Actions Bar */}
                      {showLoadMoreButton && (
                        <div className="w-full flex items-center justify-center p-2 border-t border-gray-300 bg-gray-50 mt-auto">
                          <LoadMoreVariant
                            onClick={() => {
                              if (isShowingAll) {
                                resetOrderedItems(reviewByUser.orderId);
                              } else {
                                loadMoreOrderedItems(
                                  reviewByUser.orderId,
                                  totalItems,
                                );
                              }
                            }}
                          >
                            {buttonLabel}
                          </LoadMoreVariant>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Core List Load More Navigation Bar Trigger */}
          {filteredThisGroupReviews.length > 0 &&
            reviewItemsParams < filteredThisGroupReviews.length && (
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
      {/* List area ends */}
    </div>
  );
};
