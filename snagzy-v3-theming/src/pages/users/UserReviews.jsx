import { useOutletContext, useSearchParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useEffect, useMemo, useState } from "react";
import { LengthIsZeroError } from "../../components/LengthIsZeroError";
import {
  ItemStatusBadge,
  OrderIdBadge,
  OrderVariantAttributeBadege,
  ReviewsBadge,
  StoreDetailBadge,
  VariantBadge,
} from "../../components/Badges";
import { NoSomethingSmall } from "../../components/NoSomething";
import { ImageDoubleExtraSmall } from "../../components/Image";
import { useReviewsAnalytics } from "../../context/ReviewsAnalyticsContext";
import { Rating } from "../../components/Rating";
import { isoToRegularTimestamp } from "../../utils/helpers";

export const UserReviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { reviewsByThisPerson, attributes } = useOutletContext();
  // console.log("reviewsByThisPerson", reviewsByThisPerson);

  const { groupReviewsByOrder, getStoreById, getUserById } = useData();

  // Review analytics
  // const reviewsAnalytics = useReviewsAnalytics();
  // const { getAllReviewsByProductId, getAverageRating } =
  //   reviewsAnalytics.reviewsAnalyticsValue;

  const reviews = groupReviewsByOrder(reviewsByThisPerson);
  // console.log("reviews", reviews);

  const count = 6;
  // Reviews count params
  const initialReviewsParams = parseInt(searchParams.get("reviews") || 0);
  const [reviewsParams, setReviewsParams] = useState(initialReviewsParams);

  // useEffect mount values.
  useEffect(() => {
    const urlReviews = parseInt(searchParams.get("reviews")) || count;

    setReviewsParams(urlReviews);
  }, [searchParams]);

  const filteredReviews = useMemo(() => {
    let result = reviews || [];

    return result;
  }, [reviews]);
  // console.log("filteredReviews", filteredReviews);

  const displayedReviews = useMemo(() => {
    return (filteredReviews || []).slice(0, reviewsParams);
  }, [filteredReviews, reviewsParams]);

  // Load more button
  const loadMore = () => {
    const updateUrlParams = (newCount) => {
      const params = {};

      params.orders = newCount;

      setSearchParams(params);
    };

    const totalItems =
      filteredReviews && filteredReviews.length > 0
        ? filteredReviews.length
        : reviews.length;
    const newCount = Math.min(reviewsParams + count, totalItems);

    if (newCount > reviewsParams) {
      setReviewsParams(newCount); // Fixed: changed from setordersParams to setOrdersParams
      updateUrlParams(newCount);
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Table header  */}
      <div
        className={`w-full top-0 z-30 bg-blue-100 border-t border-b border-gray-300`}
      >
        <div className="flex w-full justify-between">
          <div className="grid grid-cols-[1.8fr_7fr] w-full text-sm">
            <div className="flex border-r border-gray-300 p-1">
              Order Detail
            </div>
            <div className="grid grid-cols-[7fr_4fr_6fr_4fr_1fr] w-full text-sm">
              <div className="flex border-r border-gray-300 p-1">
                Ordered Items
              </div>
              <div className="flex border-r border-gray-300 p-1">
                Store Detail
              </div>
              <div className="flex border-r border-gray-300 p-1">
                Rating & Review
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
      <div className="flex w-full overflow-y-auto bg-white custom-scrollbar">
        <div className="flex flex-col w-full">
          {displayedReviews.length === 0 ? (
            <div className="flex items-center w-full h-screen">
              <LengthIsZeroError
                title="No data found"
                message="Something went wrong while fetching the data!"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full">
              {displayedReviews.map((displayedReview, index) => {
                return (
                  <div
                    key={index}
                    className="grid grid-cols-[1.8fr_7fr] w-full text-sm"
                  >
                    {/* Grid 1  */}
                    <div className="flex items-start p-2 border-b border-r border-gray-300 h-full">
                      <div className="flex flex-col items-start gap-2">
                        <div className="flex items-start">
                          <OrderIdBadge id={displayedReview.orderId} />
                        </div>
                      </div>
                    </div>
                    {/* Grid 2  */}
                    <div
                      className={`flex flex-col ${displayedReview.orderedItems.length < 2 ? "border-b border-gray-300" : ""}`}
                    >
                      {displayedReview.orderedItems.length === 0 ? (
                        <div
                          className={`flex h-full items-center justify-center`}
                        >
                          <NoSomethingSmall text="No data found" />
                        </div>
                      ) : (
                        displayedReview.orderedItems.map(
                          (orderedItem, orderedItemIndex) => {
                            // Product name + attribute
                            const displayName = [
                              orderedItem.productName,
                              ...orderedItem.variant.attributeOptions.map(
                                (option) => option.value,
                              ),
                            ].join(" | ");

                            // Store
                            const store = getStoreById(
                              orderedItem.storeOwnerInfo.storeId,
                            );

                            // Store owner
                            const storeOwner =
                              getUserById(orderedItem.storeOwnerInfo.ownerId)
                                ?.firstName +
                              " " +
                              getUserById(orderedItem.storeOwnerInfo.ownerId)
                                ?.lastName;

                            return (
                              <div
                                key={orderedItemIndex}
                                className="grid grid-cols-[7fr_4fr_6fr_4fr_1fr] w-full h-full"
                              >
                                {/* Ordered Items box  */}
                                <div
                                  className={`flex items-start p-2 ${displayedReview.orderedItems.length > 1 ? "border-b" : ""} border-r border-gray-300 h-full`}
                                >
                                  <div className="flex-col">
                                    <div className="flex gap-2">
                                      <VariantBadge
                                        id={orderedItem.variant._id}
                                      />
                                      <ItemStatusBadge
                                        statusId={orderedItem.variant.status}
                                      />
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                      <ImageDoubleExtraSmall
                                        image={orderedItem.variant.primaryImage}
                                        alt={orderedItem.variant.productName}
                                        type="square"
                                      />
                                      <div className="flex flex-col">
                                        <h1 className="font-semibold text-md leading-tight">
                                          {displayName}
                                        </h1>
                                        <p className="leading-tight">
                                          SKU: {orderedItem.variant.sku}
                                        </p>
                                        <div className="flex gap-2 mt-2">
                                          <div className="flex gap-2 text-xs text-gray-600">
                                            {orderedItem.variant.attributeOptions.map(
                                              (option, index) => {
                                                return (
                                                  <OrderVariantAttributeBadege
                                                    key={index}
                                                    option={option}
                                                    index={index}
                                                    attributes={attributes}
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
                                {/* Store detail box  */}
                                <div
                                  className={`flex items-start p-2 ${displayedReview.orderedItems.length > 1 ? "border-b" : ""} border-r border-gray-300 h-full`}
                                >
                                  <div className="flex flex-col items-start gap-1 text-xs">
                                    <StoreDetailBadge
                                      type="store-name"
                                      content={store.storeName}
                                    />
                                    <StoreDetailBadge
                                      type="store-owner"
                                      content={storeOwner}
                                    />
                                  </div>
                                </div>
                                {/* Rating & review box  */}
                                <div
                                  className={`flex items-start p-2 ${displayedReview.orderedItems.length > 1 ? "border-b" : ""} border-r border-gray-300 h-full`}
                                >
                                  {orderedItem.reviews.map((review, index) => {
                                    return (
                                      <div key={index} className="flex gap-2">
                                        <div className="flex flex-col">
                                          <div className="flex items-center gap-1">
                                            <Rating value={review.rating} />
                                          </div>

                                          <ReviewsBadge id={review._id} />

                                          {review.feedback && (
                                            <div className="flex mt-2">
                                              <p className="text-sm italic">
                                                "{review.feedback}"
                                              </p>
                                            </div>
                                          )}

                                          <div className="flex mt-2">
                                            <p className="text-gray-500 text-xs">
                                              {isoToRegularTimestamp(
                                                review.createdAt,
                                              )}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                                {/* Media box  */}
                                <div
                                  className={`flex items-start p-2 ${displayedReview.orderedItems.length > 1 ? "border-b" : ""} border-r border-gray-300 h-full`}
                                >
                                  THIS
                                </div>
                                <div
                                  className={`flex items-start p-2 ${displayedReview.orderedItems.length > 1 ? "border-b" : ""} border-r border-gray-300 h-full`}
                                ></div>
                              </div>
                            );
                          },
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {filteredReviews.length > 0 &&
            reviews.length > 0 &&
            reviewsParams < (filteredReviews.length || reviews.length) && (
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
