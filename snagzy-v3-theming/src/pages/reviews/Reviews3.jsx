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
import { Rating } from "../../components/Rating";
import { isoToRegularTimestamp } from "../../utils/helpers";
import { useReviewsAnalytics } from "../../context/ReviewsAnalyticsContext";

export const Reviews3 = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getReviewsByBuyerId, getAllAttributes } = useData();

  // ReviewAnalyticsContext.jsx
  const reviewAnalytics = useReviewsAnalytics();
  const { getAverageReview, getReviewsBreakdown } =
    reviewAnalytics.reviewsAnalyticsValue;

  const attributes = getAllAttributes();

  // Initialize grouped reviews
  const groupReviewsArray = getReviewsByBuyerId();
  // console.log("groupReviewsArray", groupReviewsArray);

  const count = 6;
  // Review items count params
  const initialReviewItemsParams = parseInt(searchParams.get("reviews") || 0);
  const [reviewItemsParams, setReviewItemsParams] = useState(
    initialReviewItemsParams,
  );

  // useEffect mount values
  useEffect(() => {
    const urlReviewItems = parseInt(searchParams.get("reviews")) || count;

    setReviewItemsParams(urlReviewItems);
  }, [searchParams]);

  // Filtering and sorting
  const filteredThisGroupReviews = useMemo(() => {
    let result = groupReviewsArray || [];
    return result;
  }, [groupReviewsArray]);
  // console.log("filteredThisGroupReviews", filteredThisGroupReviews);

  const displayedThisReviews = useMemo(() => {
    return (filteredThisGroupReviews || []).slice(0, reviewItemsParams);
  }, [filteredThisGroupReviews, reviewItemsParams]);
  // console.log("displayedThisReviews", displayedThisReviews);

  // Load more button
  const loadMore = () => {
    const updateUrlParams = (newCount) => {
      const params = {};
      params.reviews = newCount;

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
      <div className="sticky w-full top-0 z-30 bg-blue-100 border-t border-b border-gray-300">
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
            <>
              {displayedThisReviews.map((review, index) => {
                console.log("review", review);

                return (
                  <div key={index} className="flex flex-col w-full">
                    <div className="grid grid-cols-[2fr_7fr]">
                      {/* Grid 1 */}
                      <div className="flex items-start p-2 border-b border-r border-gray-300 h-full text-sm">
                        {/* Buyer details box */}
                        <div className="flex flex-col">
                          <BuyerDetail object={review.user} />
                          <div className="flex flex-col border border-gray-200 p-2 mt-4">
                            <h1 className="font-semibold text-md leading-tight">
                              Review Breakdown
                            </h1>
                          </div>
                        </div>
                      </div>
                      {/* Grid 2  */}
                      <div className="flex flex-col w-full">
                        {review.orderedItems.length === 0 ? (
                          <div className="flex border-b border-gray-300 h-full items-center justify-center">
                            <NoSomethingSmall text="No data found" />
                          </div>
                        ) : (
                          review.orderedItems.map(
                            (orderedItem, orderedItemIndex) => {
                              // console.log("orderedItem", orderedItem);
                              return (
                                <div key={orderedItemIndex} className="h-full">
                                  <div
                                    className={`grid grid-cols-[2fr_7fr] bg-white border-b border-gray-300 h-full text-sm`}
                                  >
                                    {/* Grid 2 grid 1 */}
                                    {/* Order details box */}
                                    <div
                                      className={`flex items-start p-2 border-r border-gray-300`}
                                    >
                                      <div className="flex flex-col items-start gap-2">
                                        <div className="flex items-start">
                                          <OrderIdBadge id={review.orderId} />
                                        </div>
                                        {/* <OrderPlacedUpdated
                                          createdAt={
                                            orderedItem.placedAt.timestamp
                                          }
                                          updatedAt={
                                            orderedItem.lastUpdated.timestamp
                                          }
                                        /> */}
                                      </div>
                                    </div>
                                    {/* Grid 2 grid 2 */}
                                    <div className="flex flex-col">
                                      {review.orderedItems.length === 0 ? (
                                        <div
                                          className={`flex h-full items-center justify-center`}
                                        >
                                          <NoSomethingSmall text="No data found" />
                                        </div>
                                      ) : (
                                        review.orderedItems.map(
                                          (itemOrdered, itemOrderedIndex) => {
                                            const displayName = [
                                              itemOrdered.productName,
                                              ...itemOrdered.variant.attributeOptions.map(
                                                (option) => option.value,
                                              ),
                                            ].join(" | ");
                                            // console.log(
                                            //   "itemOrdered",
                                            //   itemOrdered,
                                            // );
                                            const averageReview =
                                              getAverageReview(
                                                itemOrdered.reviews,
                                              );
                                            const reviewBreakdown =
                                              getReviewsBreakdown(
                                                itemOrdered.reviews,
                                              );
                                            // console.log(
                                            //   "averageReview",
                                            //   averageReview,
                                            // );
                                            // console.log(
                                            //   "reviewBreakdown",
                                            //   reviewBreakdown,
                                            // );

                                            return (
                                              <div
                                                key={itemOrderedIndex}
                                                className={`grid grid-cols-[4fr_3fr_2fr] items-start border-b border-gray-300 last:border-b-0 h-full`}
                                              >
                                                {/* Ordered items box */}
                                                <div
                                                  className={`flex items-start p-2 border-r border-gray-300 h-full`}
                                                >
                                                  <div className="flex flex-col">
                                                    <div className="flex gap-2">
                                                      <VariantBadge
                                                        id={
                                                          itemOrdered.variant
                                                            ._id
                                                        }
                                                      />
                                                    </div>
                                                    <div className="flex gap-2 mt-2">
                                                      <ImageDoubleExtraSmall
                                                        image={
                                                          itemOrdered.variant
                                                            .primaryImage
                                                        }
                                                        alt={
                                                          itemOrdered.variant
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
                                                            itemOrdered.variant
                                                              .sku
                                                          }
                                                        </p>
                                                        <div className="flex gap-2 mt-2">
                                                          <div className="flex gap-2 text-xs text-gray-600">
                                                            {itemOrdered.variant.attributeOptions.map(
                                                              (
                                                                option,
                                                                index,
                                                              ) => {
                                                                return (
                                                                  <OrderVariantAttributeBadege
                                                                    key={index}
                                                                    option={
                                                                      option
                                                                    }
                                                                    index={
                                                                      index
                                                                    }
                                                                    attributes={
                                                                      attributes
                                                                    }
                                                                  />
                                                                );
                                                              },
                                                            )}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                                {/* Rating & review box */}
                                                <div
                                                  className={`flex items-start p-2 border-r border-gray-300 h-full`}
                                                >
                                                  <div className="flex gap-2">
                                                    {itemOrdered.reviews.map(
                                                      (
                                                        itemIsOrdered,
                                                        itemOrderedIndex,
                                                      ) => {
                                                        // console.log(
                                                        //   "itemIsOrdered",
                                                        //   itemIsOrdered,
                                                        // );
                                                        return (
                                                          <div
                                                            key={
                                                              itemOrderedIndex
                                                            }
                                                            className="flex flex-col"
                                                          >
                                                            <div className="flex items-center gap-1">
                                                              <Rating
                                                                value={
                                                                  itemIsOrdered.rating
                                                                }
                                                              />
                                                            </div>
                                                            <ReviewsBadge
                                                              id={
                                                                itemIsOrdered._id
                                                              }
                                                            />
                                                            <div className="flex mt-2">
                                                              <p className="text-sm italic">
                                                                "
                                                                {
                                                                  itemIsOrdered.feedback
                                                                }
                                                                "
                                                              </p>
                                                            </div>
                                                            <p className="text-gray-500 text-xs">
                                                              {isoToRegularTimestamp(
                                                                itemIsOrdered.createdAt,
                                                              )}
                                                            </p>
                                                          </div>
                                                        );
                                                      },
                                                    )}
                                                  </div>
                                                </div>
                                                {/* Rating & review box */}
                                                <div
                                                  className={`flex items-start p-2 border-r border-gray-300 h-full`}
                                                ></div>
                                              </div>
                                            );
                                          },
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            },
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Load More Button */}
              {filteredThisGroupReviews.length > 0 &&
                reviewItemsParams < filteredThisGroupReviews.length && (
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
            </>
          )}
        </div>
      </div>
      {/* List area ends */}
    </div>
  );
};
