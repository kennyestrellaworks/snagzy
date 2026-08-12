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
  VariantBadge,
} from "../../components/Badges";
import { OrderPlacedUpdated } from "../../components/DateBoxed";
import { ImageDoubleExtraSmall } from "../../components/Image";

export const Reviews2 = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getReviewsByBuyerId } = useData();

  // Initialize grouped reviews
  const groupReviewsArray = getReviewsByBuyerId(true);
  // console.log("groupReviewsArray", groupReviewsArray);

  // Sorting params

  const count = 100;
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
            <div className="grid grid-cols-[2fr_5fr]">
              <div className="flex border-r border-gray-300 p-1">
                Order Details
              </div>
              <div className="grid grid-cols-[3fr_2fr_2fr] w-full text-sm">
                <div className="flex border-r border-gray-300 p-1">
                  Ordered Items
                </div>
                <div className="flex border-r border-gray-300 p-1">
                  Rating & Review
                </div>
                <div className="flex border-r border-gray-300 p-1">Media</div>
              </div>
            </div>
          </div>
          <div className="flex w-2 bg-blue-300"></div>
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
            displayedThisReviews.map((review, index) => {
              // console.log("review", review);
              return (
                <div key={index} className="flex flex-col w-full">
                  {/* Column 1 */}
                  <div className="grid grid-cols-[2fr_7fr]">
                    {/* Buyer details box */}
                    <div className="flex items-start p-2 border-b border-r border-gray-300 h-full text-sm">
                      <BuyerDetail object={review.user} />
                    </div>
                    {/* Column 2  */}
                    <div className="flex flex-col w-full">
                      {review.orders.length === 0 ? (
                        <div className="flex border-b border-gray-300 h-full items-center justify-center">
                          <NoSomethingSmall text="No data found" />
                        </div>
                      ) : (
                        review.orders.map((orderedItem, orderedItemIndex) => {
                          console.log("orderedItem", orderedItem);
                          return (
                            <div key={orderedItemIndex}>
                              <div
                                className={`grid grid-cols-[2fr_5fr] border-b border-gray-300 bg-white text-sm`}
                              >
                                {/* Order details box */}
                                <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                  <div className="flex flex-col items-start gap-2">
                                    <div className="flex items-start">
                                      <OrderIdBadge id={orderedItem.orderId} />
                                    </div>
                                    <OrderPlacedUpdated
                                      createdAt={orderedItem.placedAt.timestamp}
                                      updatedAt={
                                        orderedItem.lastUpdated.timestamp
                                      }
                                    />
                                  </div>
                                </div>
                                {/* Ordered items box */}
                                <div
                                  className={`grid grid-cols-[3fr_2fr_2fr] items-start border-r border-gray-300 h-full`}
                                >
                                  <div className="flex">
                                    <div className="flex flex-col">
                                      {orderedItem.orderedItems.length === 0 ? (
                                        <div
                                          className={`flex h-full items-center justify-center`}
                                        >
                                          <NoSomethingSmall text="No data found" />
                                        </div>
                                      ) : (
                                        orderedItem.orderedItems.map(
                                          (itemOrdered, orderedItemsIndex) => {
                                            const displayName = [
                                              itemOrdered.productName,
                                              ...itemOrdered.variant.attributeOptions.map(
                                                (option) => option.value,
                                              ),
                                            ].join(" | ");
                                            return (
                                              <div
                                                key={orderedItemsIndex}
                                                className={`flex items-start ${orderedItem.orderedItems.length > 1 ? "border-b last:border-b-0" : ""} border-gray-300 h-full p-2`}
                                              >
                                                <div className="flex flex-col">
                                                  <div className="flex gap-2">
                                                    <VariantBadge
                                                      id={
                                                        itemOrdered.variant._id
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
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          },
                                        )
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex">THIS</div>
                                  <div className="flex">THIS</div>
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
        </div>
      </div>
      {/* List area ends */}
    </div>
  );
};
