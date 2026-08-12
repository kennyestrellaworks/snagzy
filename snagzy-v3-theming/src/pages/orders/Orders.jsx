import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../components/PageHeader";
import { useData } from "../../context/DataContext";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { LengthIsZeroError } from "../../components/LengthIsZeroError";
import { NoSomethingSmall } from "../../components/NoSomething";
import {
  ItemStatusBadge,
  OrderIdBadge,
  OrderVariantAttributeBadege,
  PersonIdBadge,
  VariantBadge,
} from "../../components/Badges";
import { OrderPlacedUpdated } from "../../components/DateBoxed";
import { ImageDoubleExtraSmall } from "../../components/Image";
import { IconedEmail } from "../../components/IconedValue";
import { AmountFormat, AmountFormatSmall } from "../../components/AmountFormat";
import { TextNormal } from "../../components/Text";
import { PaymentStatusBadge } from "../../components/PaymentStatusBadge";
import { OrderStatusBadge } from "../../components/OrderStatusBadge";
import { FaEye } from "../../components/SVG";

import { LoadMoreProduct, LoadMoreVariant } from "../../components/Button";
import { dateFormatter } from "../../utils/helpers";

const INITIAL_ITEM_LIMIT = 3;
const ITEM_INCREMENT = 3;

export const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { getAllOrders, getAllAttributes, sumOrderQuantities } = useData();

  const orders = getAllOrders();
  const attributes = getAllAttributes();

  const count = 6;

  const initialOrderParams = parseInt(searchParams.get("orders") || 0);
  const [ordersParams, setOrdersParams] = useState(initialOrderParams);

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

  useEffect(() => {
    const urlOrders = parseInt(searchParams.get("orders")) || count;
    setOrdersParams(urlOrders);
  }, [searchParams]);

  const filteredOrders = useMemo(() => {
    let result = orders ? [...orders] : [];

    // Sort orders by the latest currentStatus.timestamp
    return result.sort((a, b) => {
      const dateA = new Date(a.currentStatus?.timestamp || 0);
      const dateB = new Date(b.currentStatus?.timestamp || 0);
      return dateB - dateA; // Descending order: Latest/newest date first
    });
  }, [orders]);

  const displayedOrders = useMemo(() => {
    return (filteredOrders || []).slice(0, ordersParams);
  }, [filteredOrders, ordersParams]);

  // Load more parent orders
  const loadMore = () => {
    const updateUrlParams = (newCount) => {
      const params = {};
      params.orders = newCount;
      // Preserve existing ordered_item_counts
      const currentCounts = searchParams.get("ordered_item_counts");
      if (currentCounts) params.ordered_item_counts = currentCounts;
      setSearchParams(params);
    };

    const totalItems =
      filteredOrders && filteredOrders.length > 0
        ? filteredOrders.length
        : orders.length;
    const newCount = Math.min(ordersParams + count, totalItems);

    if (newCount > ordersParams) {
      setOrdersParams(newCount);
      updateUrlParams(newCount);
    }
  };

  // Increase visible items count for a specific order row
  const loadMoreOrderedItems = (orderId, totalItems) => {
    const currentCount = orderedItemShowCounts[orderId] || INITIAL_ITEM_LIMIT;
    const newCount = Math.min(currentCount + ITEM_INCREMENT, totalItems);
    updateOrderedItemCount(orderId, newCount);
  };

  // Reset inner order item visibility back to default limits
  const resetOrderedItems = (orderId) => {
    updateOrderedItemCount(orderId, INITIAL_ITEM_LIMIT);
  };

  // Helper to sync sub-list pagination rules to URL tracking keys
  const updateOrderedItemCount = (orderId, newCount) => {
    const newCounts = { ...orderedItemShowCounts };
    if (newCount === INITIAL_ITEM_LIMIT) {
      delete newCounts[orderId];
    } else {
      newCounts[orderId] = newCount;
    }

    // Update URL
    const newParams = {};
    const ordersParamValue = searchParams.get("orders");
    if (ordersParamValue) newParams.orders = ordersParamValue;
    if (Object.keys(newCounts).length > 0) {
      newParams.ordered_item_counts = JSON.stringify(newCounts);
    }
    setSearchParams(newParams);

    // Update state
    setOrderedItemShowCounts(newCounts);
  };

  // Compute actual visible array count boundaries for a given key
  const getVisibleOrderedItemCount = (orderId, totalItems) => {
    const stored = orderedItemShowCounts[orderId];
    if (stored !== undefined) return Math.min(stored, totalItems);
    return Math.min(INITIAL_ITEM_LIMIT, totalItems);
  };

  return (
    <div className="flex flex-col w-full bg-white border border-gray-300 rounded-md overflow-hidden">
      {/* Header  */}
      <div className="sticky w-full top-0 z-50 bg-white">
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
          <div className="grid grid-cols-[3fr_6fr_5fr] w-full text-sm">
            <div className="flex border-r border-gray-300 p-1">
              Order Detail
            </div>
            <div className="grid grid-cols-[6.6fr_1.6fr_.6fr_1.8fr] w-full text-sm">
              <div className="flex border-r border-gray-300 p-1">
                Ordered Items
              </div>
              <div className="flex border-r border-gray-300 p-1">
                Listed Price
              </div>
              <div className="flex border-r border-gray-300 p-1">Qty</div>
              <div className="flex border-r border-gray-300 p-1">Sub Total</div>
            </div>
            <div className="grid grid-cols-[.4fr_1fr_1fr_1.4fr_1.8fr_.5fr] w-full text-sm">
              <div className="flex border-r border-gray-300 p-1">Less</div>
              <div className="flex border-r border-gray-300 p-1">Shipping</div>
              <div className="flex border-r border-gray-300 p-1">
                Overall Price
              </div>
              <div className="flex border-r border-gray-300 p-1">
                Payment Status
              </div>
              <div className="flex border-r border-gray-300 p-1">
                Order Status
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
          {displayedOrders.length === 0 ? (
            <div className="flex items-center w-full h-screen">
              <LengthIsZeroError
                title="No data found"
                message="Something went wrong while fetching the data!"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full">
              {displayedOrders.map((displayedOrder, displayedOrderIndex) => {
                const totalQuantity = sumOrderQuantities(
                  displayedOrder.orderedItems,
                );

                // Ordered Items sub-pagination configuration rules
                const totalItems = displayedOrder.orderedItems.length;
                const visibleCount = getVisibleOrderedItemCount(
                  displayedOrder._id,
                  totalItems,
                );
                const visibleItems = displayedOrder.orderedItems.slice(
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
                  <div
                    key={displayedOrderIndex}
                    className="grid grid-cols-[3fr_11fr] w-full text-sm border-b border-gray-300"
                  >
                    {/* Grid 1: Left column (Order Details) */}
                    <div className="flex items-start p-2 border-r border-gray-300 h-full">
                      <div className="flex flex-col items-start gap-2">
                        <div className="flex items-start">
                          <OrderIdBadge id={displayedOrder._id} />
                        </div>
                        <div className="flex gap-2">
                          <ImageDoubleExtraSmall
                            image={displayedOrder.buyerInfo.image}
                            alt={displayedOrder.buyerInfo.buyerName}
                            type="circle"
                          />
                          <div className="flex flex-col items-start gap-1">
                            <h1 className="font-semibold text-lg leading-tight">
                              {displayedOrder.buyerInfo.buyerName}
                            </h1>
                            <PersonIdBadge
                              id={displayedOrder.buyerInfo.buyerId}
                            />
                            <IconedEmail
                              data={displayedOrder.buyerInfo.email}
                            />
                            <OrderPlacedUpdated
                              createdAt={displayedOrder.createdAt}
                              updatedAt={displayedOrder.updatedAt}
                            />
                            <div className="flex text-sm leading-tight gap-2 mt-1">
                              <div className="bg-gray-100 px-2 py-1 border border-gray-200 rounded-md">
                                <span className="text-gray-500">Orders:</span>{" "}
                                <span className="font-semibold">
                                  {totalItems}
                                </span>
                              </div>
                              <div className="bg-gray-100 px-2 py-1 border border-gray-200 rounded-md">
                                <span className="text-gray-500">Items:</span>{" "}
                                <span className="font-semibold">
                                  {totalQuantity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Segment Block: Holds subgrid content and full-span actions wrapper */}
                    <div className="flex flex-col w-full h-full">
                      <div className="grid grid-cols-[6fr_5fr] w-full h-full">
                        {/* Grid 2: Ordered Items Content */}
                        <div className="flex flex-col h-full border-r border-gray-300">
                          {totalItems === 0 ? (
                            <div className="flex h-full items-center justify-center p-2">
                              <NoSomethingSmall text="No data found" />
                            </div>
                          ) : (
                            <div className="flex flex-col h-full">
                              {visibleItems.map(
                                (orderedItem, orderedItemIndex) => {
                                  const displayName = [
                                    orderedItem.productName,
                                    ...orderedItem.variant.attributeOptions.map(
                                      (option) => option.value,
                                    ),
                                  ].join(" | ");

                                  return (
                                    <div
                                      key={orderedItemIndex}
                                      className="grid grid-cols-[6.6fr_1.6fr_.6fr_1.8fr] w-full border-b border-gray-300 h-full last:border-b-0"
                                    >
                                      {/* Ordered Items box  */}
                                      <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                        <div className="flex-col">
                                          <div className="flex gap-2">
                                            <VariantBadge
                                              id={orderedItem.variant._id}
                                            />
                                            <ItemStatusBadge
                                              statusId={
                                                orderedItem.variant.status
                                              }
                                            />
                                          </div>
                                          <div className="flex gap-2 mt-2">
                                            <ImageDoubleExtraSmall
                                              image={
                                                orderedItem.variant.primaryImage
                                              }
                                              alt={
                                                orderedItem.variant.productName
                                              }
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
                                      {/* Listed price box  */}
                                      <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                        <AmountFormatSmall
                                          amount={orderedItem.variant.price}
                                        />
                                      </div>
                                      {/* Quantity box  */}
                                      <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                        <TextNormal
                                          text={orderedItem.variant.quantity}
                                        />
                                      </div>
                                      {/* Sub total box  */}
                                      <div className="flex items-start p-2 h-full">
                                        <AmountFormat
                                          amount={orderedItem.variant.subTotal}
                                        />
                                      </div>
                                    </div>
                                  );
                                },
                              )}
                            </div>
                          )}
                        </div>

                        {/* Grid 3: Pricing Summary Details columns */}
                        <div className="grid grid-cols-[.4fr_1fr_1fr_1.4fr_1.8fr_.5fr] w-full h-full">
                          {/* Discount box  */}
                          <div className="flex items-start p-2 border-r border-gray-300 h-full">
                            <TextNormal
                              text={displayedOrder.summary.discount}
                            />
                          </div>
                          {/* Shipping fee box  */}
                          <div className="flex items-start p-2 border-r border-gray-300 h-full">
                            <AmountFormatSmall
                              amount={displayedOrder.summary.shippingFee}
                            />
                          </div>
                          {/* Overall price box  */}
                          <div className="flex items-start p-2 border-r border-gray-300 h-full">
                            <AmountFormat
                              amount={displayedOrder.summary.orderTotalPrice}
                            />
                          </div>
                          {/* Payment status box  */}
                          <div className="flex items-start p-2 border-r border-gray-300 h-full">
                            <PaymentStatusBadge
                              status={displayedOrder.paymentInfo}
                            />
                          </div>
                          {/* Order status box  */}
                          <div className="flex items-start p-2 border-r border-gray-300 h-full">
                            <div className="flex flex-col gap-1">
                              <OrderStatusBadge
                                status={displayedOrder.currentStatus.slug}
                              />
                              <p className="text-[13px] leading-tight">
                                {dateFormatter(
                                  displayedOrder.currentStatus?.timestamp,
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start p-2 h-full">
                            <div className="flex items-start">
                              <Link
                                to={`/orders/${displayedOrder._id}`}
                                state={{
                                  backUrl:
                                    location.pathname +
                                    location.search +
                                    location.hash,
                                }}
                                className="cursor-pointer outline-0 text-gray-400 hover:text-gray-500 transition-all ease-in-out"
                              >
                                <FaEye height={16} width={16} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sub-item internal Load More / Less Pagination Actions Bar */}
                      {showLoadMoreButton && (
                        <div className="w-full flex items-center justify-center p-2 border-t border-gray-300 bg-gray-50 mt-auto">
                          <LoadMoreVariant
                            onClick={() => {
                              if (isShowingAll) {
                                resetOrderedItems(displayedOrder._id);
                              } else {
                                loadMoreOrderedItems(
                                  displayedOrder._id,
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
                );
              })}
            </div>
          )}

          {/* Load More Parent Orders list triggers */}
          {filteredOrders.length > 0 &&
            orders.length > 0 &&
            ordersParams < (filteredOrders.length || orders.length) && (
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
