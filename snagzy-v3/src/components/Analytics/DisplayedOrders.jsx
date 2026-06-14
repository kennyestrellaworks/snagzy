import { Link } from "react-router-dom";
import { FaEye } from "../../components/SVG";
import { LengthIsZeroError } from "../../components/LengthIsZeroError";
import {
  OrderIdBadge,
  PersonIdBadge,
  VariantBadge,
  ItemStatusBadge,
  OrderVariantAttributeBadege,
} from "../../components/Badges";
import { ImageDoubleExtraSmall } from "../../components/Image";
import { IconedEmail } from "../../components/IconedValue";
import { OrderPlacedUpdated } from "../../components/DateBoxed";
import { AmountFormat, AmountFormatSmall } from "../../components/AmountFormat";
import { TextNormal } from "../../components/Text";
import { PaymentStatusBadge } from "../../components/PaymentStatusBadge";
import { OrderStatusBadge } from "../../components/OrderStatusBadge";
import { dateFormatter } from "../../utils/helpers";
import { NoSomethingSmall } from "../../components/NoSomething";
import { LoadMoreProduct, LoadMoreVariant } from "../../components/Button";

export const DisplayedOrders = ({
  displayedOrders,
  tableHeaderBg,
  itemsLimits,
  onLoadMoreItems,
  onResetItems,
  ordersLimit,
  totalOrdersCount,
  onLoadMoreOrders,
  defaultItemsCount = 3,
  attributes,
  location,
  sumOrderQuantities,
}) => {
  return (
    <div className="flex w-full mt-4 overflow-hidden">
      <div className="flex flex-col w-full">
        {/* Table header */}
        <div
          className="w-full top-0 z-30 bg-blue-100 border rounded-t-md"
          style={{ borderColor: `${tableHeaderBg}` }}
        >
          <div className="flex flex-col w-full overflow-hidden">
            <div className="flex w-full justify-between bg-white">
              <div
                className="grid grid-cols-[3fr_6fr_5fr] w-full text-sm"
                style={{ backgroundColor: `${tableHeaderBg}50` }}
              >
                <div
                  className="flex border-r p-1"
                  style={{ borderColor: tableHeaderBg }}
                >
                  Order Detail
                </div>
                <div className="grid grid-cols-[6.6fr_1.6fr_.6fr_1.8fr] w-full text-sm">
                  <div
                    className="flex border-r p-1"
                    style={{ borderColor: tableHeaderBg }}
                  >
                    Ordered Items
                  </div>
                  <div
                    className="flex border-r p-1"
                    style={{ borderColor: tableHeaderBg }}
                  >
                    Listed Price
                  </div>
                  <div
                    className="flex border-r p-1"
                    style={{ borderColor: tableHeaderBg }}
                  >
                    Qty
                  </div>
                  <div
                    className="flex border-r p-1"
                    style={{ borderColor: tableHeaderBg }}
                  >
                    Sub Total
                  </div>
                </div>
                <div className="grid grid-cols-[.4fr_1fr_1fr_1.4fr_1.8fr_.5fr] w-full text-sm">
                  <div
                    className="flex border-r p-1"
                    style={{ borderColor: tableHeaderBg }}
                  >
                    Less
                  </div>
                  <div
                    className="flex border-r p-1"
                    style={{ borderColor: tableHeaderBg }}
                  >
                    Shipping
                  </div>
                  <div
                    className="flex border-r p-1"
                    style={{ borderColor: tableHeaderBg }}
                  >
                    Overall Price
                  </div>
                  <div
                    className="flex border-r p-1"
                    style={{ borderColor: `${tableHeaderBg}80` }}
                  >
                    Payment Status
                  </div>
                  <div
                    className="flex border-r p-1"
                    style={{ borderColor: `${tableHeaderBg}80` }}
                  >
                    Order Status
                  </div>
                  <div
                    className="flex p-1"
                    style={{ borderColor: `${tableHeaderBg}80` }}
                  ></div>
                </div>
              </div>
              <div
                className="flex w-2 bg-blue-100"
                style={{ backgroundColor: `${tableHeaderBg}50` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="flex h-180 w-full overflow-y-auto border-l border-r border-b rounded-b-md border-[#C2C2C2] bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          <div className="flex flex-col w-full">
            {displayedOrders.length === 0 ? (
              <div className="flex items-center w-full h-100">
                <LengthIsZeroError
                  title="No data found"
                  message="No orders found for this category"
                />
              </div>
            ) : (
              <div className="flex flex-col w-full">
                {displayedOrders.map((order, orderIndex) => {
                  const totalQuantity = sumOrderQuantities(order.orderedItems);
                  const itemsTotalCount = order.orderedItems?.length || 0;
                  const orderItemsLimit =
                    itemsLimits[order._id] || defaultItemsCount;
                  const displayedOrderedItems = (
                    order.orderedItems || []
                  ).slice(0, orderItemsLimit);
                  const isShowingAllItems = orderItemsLimit >= itemsTotalCount;
                  const showNestedLoadMore =
                    itemsTotalCount > defaultItemsCount;
                  const remainingItems = itemsTotalCount - orderItemsLimit;
                  const itemsButtonLabel = isShowingAllItems
                    ? "Less"
                    : `More +${remainingItems}`;

                  return (
                    <div
                      key={order._id || orderIndex}
                      className="grid grid-cols-[3fr_11fr] w-full text-sm hover:bg-gray-50 transition-colors border-b border-gray-300 last:border-b-0"
                    >
                      {/* Left column: Order Detail */}
                      <div className="flex items-start p-2 border-r border-gray-300 h-full">
                        <div className="flex flex-col items-start gap-2">
                          <div className="flex items-start">
                            <OrderIdBadge id={order._id} />
                          </div>
                          <div className="flex gap-2">
                            <ImageDoubleExtraSmall
                              image={order.buyerInfo?.image}
                              alt={
                                order.buyerInfo?.buyerFirstName +
                                  " " +
                                  order.buyerInfo?.buyerLastName || "—"
                              }
                              type="circle"
                            />
                            <div className="flex flex-col items-start gap-1">
                              <h1 className="font-semibold text-lg leading-tight">
                                {order.buyerInfo?.buyerFirstName +
                                  " " +
                                  order.buyerInfo?.buyerLastName || "—"}
                              </h1>
                              <PersonIdBadge id={order.buyerInfo?.buyerId} />
                              <IconedEmail data={order.buyerInfo?.email} />
                              <OrderPlacedUpdated
                                createdAt={order.createdAt}
                                updatedAt={order.updatedAt}
                              />
                              <div className="flex text-sm leading-tight gap-2 mt-1">
                                <div className="bg-gray-100 px-2 py-1 border border-gray-200 rounded-md">
                                  <span className="text-gray-500">Items:</span>{" "}
                                  <span className="font-semibold">
                                    {itemsTotalCount}
                                  </span>
                                </div>
                                <div className="bg-gray-100 px-2 py-1 border border-gray-200 rounded-md">
                                  <span className="text-gray-500">
                                    Quantity:
                                  </span>{" "}
                                  <span className="font-semibold">
                                    {totalQuantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right side: items + summary */}
                      <div className="flex flex-col w-full h-full">
                        <div className="grid grid-cols-[6fr_5fr] w-full h-full">
                          {/* Ordered Items column */}
                          <div className="flex flex-col h-full border-r border-gray-300">
                            {itemsTotalCount === 0 ? (
                              <div className="flex h-full items-center justify-center p-2">
                                <NoSomethingSmall text="No data found" />
                              </div>
                            ) : (
                              <div className="flex flex-col h-full">
                                <div className="grow flex flex-col">
                                  {displayedOrderedItems.map(
                                    (orderedItem, itemIndex) => {
                                      const displayName = [
                                        orderedItem.productName,
                                        ...(
                                          orderedItem.variant
                                            ?.attributeOptions || []
                                        ).map((option) => option.value),
                                      ].join(" | ");

                                      return (
                                        <div
                                          key={itemIndex}
                                          className="grid grid-cols-[6.6fr_1.6fr_.6fr_1.8fr] w-full border-b border-gray-200 last:border-b-0 grow items-start"
                                        >
                                          <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                            <div className="flex-col">
                                              <div className="flex gap-2">
                                                <VariantBadge
                                                  id={orderedItem.variant?._id}
                                                />
                                                <ItemStatusBadge
                                                  statusId={
                                                    orderedItem.variant?.status
                                                  }
                                                />
                                              </div>
                                              <div className="flex gap-2 mt-2">
                                                <ImageDoubleExtraSmall
                                                  image={
                                                    orderedItem.variant
                                                      ?.primaryImage
                                                  }
                                                  alt={orderedItem.productName}
                                                  type="square"
                                                />
                                                <div className="flex flex-col">
                                                  <h1 className="font-semibold text-md leading-tight">
                                                    {displayName}
                                                  </h1>
                                                  <p className="leading-tight">
                                                    SKU:{" "}
                                                    {orderedItem.variant?.sku}
                                                  </p>
                                                  <div className="flex gap-2 mt-2">
                                                    <div className="flex gap-2 text-xs text-gray-600">
                                                      {orderedItem.variant?.attributeOptions?.map(
                                                        (option, idx) => (
                                                          <OrderVariantAttributeBadege
                                                            key={idx}
                                                            option={option}
                                                            index={idx}
                                                            attributes={
                                                              attributes
                                                            }
                                                          />
                                                        ),
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                            <AmountFormatSmall
                                              amount={
                                                orderedItem.variant?.price
                                              }
                                            />
                                          </div>
                                          <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                            <TextNormal
                                              text={
                                                orderedItem.variant?.quantity
                                              }
                                            />
                                          </div>
                                          <div className="flex items-start p-2 h-full">
                                            <AmountFormat
                                              amount={
                                                orderedItem.variant?.subTotal
                                              }
                                            />
                                          </div>
                                        </div>
                                      );
                                    },
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Summary & Actions column */}
                          <div className="grid grid-cols-[.4fr_1fr_1fr_1.4fr_1.8fr_.5fr] w-full h-full">
                            <div className="flex items-start p-2 border-r border-gray-300 h-full">
                              <TextNormal text={order.summary?.discount || 0} />
                            </div>
                            <div className="flex items-start p-2 border-r border-gray-300 h-full">
                              <AmountFormatSmall
                                amount={order.summary?.shippingFee || 0}
                              />
                            </div>
                            <div className="flex items-start p-2 border-r border-gray-300 h-full">
                              <AmountFormat
                                amount={order.summary?.orderTotalPrice || 0}
                              />
                            </div>
                            <div className="flex items-start p-2 border-r border-gray-300 h-full">
                              <PaymentStatusBadge status={order.paymentInfo} />
                            </div>
                            <div className="flex items-start p-2 border-r border-gray-300 h-full">
                              <div className="flex flex-col gap-1">
                                <OrderStatusBadge
                                  status={order.currentStatus?.slug}
                                />
                                <p className="text-[13px] leading-tight">
                                  {dateFormatter(
                                    order.currentStatus?.timestamp,
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start p-2 h-full">
                              <div className="flex items-start">
                                <Link
                                  to={`/orders/${order._id}`}
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

                        {/* "More/Less" button for items within an order */}
                        {showNestedLoadMore && (
                          <div className="w-full flex items-center justify-center p-2 border-t border-gray-300 bg-gray-50 mt-auto">
                            <LoadMoreVariant
                              onClick={() => {
                                if (isShowingAllItems) {
                                  onResetItems(order._id);
                                } else {
                                  onLoadMoreItems(order._id, itemsTotalCount);
                                }
                              }}
                            >
                              {itemsButtonLabel}
                            </LoadMoreVariant>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load more orders button at the bottom */}
            {totalOrdersCount > 0 && ordersLimit < totalOrdersCount && (
              <div className="flex items-center justify-center border-t border-gray-200 bg-white">
                <div className="flex p-2">
                  <LoadMoreProduct onClick={onLoadMoreOrders}>
                    Load more
                  </LoadMoreProduct>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
