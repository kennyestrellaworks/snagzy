import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import { OrderStatusBadge } from "../../components/OrderStatusBadge";
import { useEffect, useMemo, useState } from "react";
import { useData } from "../../context/DataContext";
import { LengthIsZeroError } from "../../components/LengthIsZeroError";
import {
  ItemStatusBadge,
  OrderIdBadge,
  OrderVariantAttributeBadege,
  VariantBadge,
} from "../../components/Badges";
import { ImageDoubleExtraSmall } from "../../components/Image";
import { OrderPlacedUpdated } from "../../components/DateBoxed";
import { NoSomethingSmall } from "../../components/NoSomething";
import { AmountFormat, AmountFormatSmall } from "../../components/AmountFormat";
import { TextNormal } from "../../components/Text";
import { PaymentStatusBadge } from "../../components/PaymentStatusBadge";
import { FaEye } from "../../components/SVG";

export const UserOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getAllAttributes, sumOrderQuantities } = useData();

  const { ordersByThisPerson } = useOutletContext();
  // console.log("orders", orders);

  const orders = ordersByThisPerson;
  const attributes = getAllAttributes();

  const count = 6;
  // Orders count params
  const initialOrderParams = parseInt(searchParams.get("orders") || 0);
  const [ordersParams, setOrdersParams] = useState(initialOrderParams);

  // useEffect mount values.
  useEffect(() => {
    const urlOrders = parseInt(searchParams.get("orders")) || count;

    setOrdersParams(urlOrders);
  }, [searchParams]);

  const filteredOrders = useMemo(() => {
    let result = orders || [];

    return result;
  }, [orders]);
  // console.log("filteredOrders", filteredOrders);

  const displayedOrders = useMemo(() => {
    return (filteredOrders || []).slice(0, ordersParams);
  }, [filteredOrders, ordersParams]);

  // Load more button
  const loadMore = () => {
    const updateUrlParams = (newCount) => {
      const params = {};

      params.orders = newCount;

      setSearchParams(params);
    };

    const totalItems =
      filteredOrders && filteredOrders.length > 0
        ? filteredOrders.length
        : orders.length;
    const newCount = Math.min(ordersParams + count, totalItems);

    if (newCount > ordersParams) {
      setOrdersParams(newCount); // Fixed: changed from setordersParams to setOrdersParams
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
      {/* Table header ends  */}

      {/* List area */}
      <div className="flex w-full overflow-y-auto bg-white custom-scrollbar">
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
                const totalQuanity = sumOrderQuantities(
                  displayedOrder.orderedItems,
                );

                return (
                  <div
                    key={displayedOrderIndex}
                    className="grid grid-cols-[3fr_6fr_5fr] w-full text-sm"
                  >
                    {/* Grid 1  */}
                    <div className="flex items-start p-2 border-b border-r border-gray-300 h-full">
                      <div className="flex flex-col items-start gap-2">
                        <div className="flex items-start">
                          <OrderIdBadge id={displayedOrder._id} />
                        </div>

                        <div className="flex gap-2">
                          <div className="flex flex-col items-start gap-1">
                            <OrderPlacedUpdated
                              createdAt={displayedOrder.createdAt}
                              updatedAt={displayedOrder.updatedAt}
                            />
                            <div className="flex text-sm leading-tight gap-2 mt-1">
                              <div className="bg-gray-100 px-2 py-1 border border-gray-200 rounded-md">
                                <span className="text-gray-500">Orders:</span>{" "}
                                <span className="font-semibold">
                                  {displayedOrder.orderedItems.length}
                                </span>
                              </div>
                              <div className="bg-gray-100 px-2 py-1 border border-gray-200 rounded-md">
                                <span className="text-gray-500">Items:</span>{" "}
                                <span className="font-semibold">
                                  {totalQuanity}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Grid 2  */}
                    <div
                      className={`flex flex-col ${displayedOrder.orderedItems.length < 2 ? "border-b border-gray-300" : ""}`}
                    >
                      {displayedOrder.orderedItems.length === 0 ? (
                        <div
                          className={`flex h-full items-center justify-center`}
                        >
                          <NoSomethingSmall text="No data found" />
                        </div>
                      ) : (
                        displayedOrder.orderedItems.map(
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
                                className="grid grid-cols-[6.6fr_1.6fr_.6fr_1.8fr] w-full h-full"
                              >
                                {/* Ordered Items box  */}
                                <div
                                  className={`flex items-start p-2 ${displayedOrder.orderedItems.length > 1 ? "border-b" : ""} border-r border-gray-300 h-full`}
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
                                {/* Listed price box  */}
                                <div
                                  className={`flex items-start p-2 ${displayedOrder.orderedItems.length > 1 ? "border-b" : ""} border-r border-gray-300 h-full`}
                                >
                                  <AmountFormatSmall
                                    amount={orderedItem.variant.price}
                                  />
                                </div>
                                {/* Quantity box  */}
                                <div
                                  className={`flex items-start p-2 ${displayedOrder.orderedItems.length > 1 ? "border-b" : ""} border-r border-gray-300 h-full`}
                                >
                                  <TextNormal
                                    text={orderedItem.variant.quantity}
                                  />
                                </div>
                                {/* Sub total box  */}
                                <div
                                  className={`flex items-start p-2 ${displayedOrder.orderedItems.length > 1 ? "border-b" : ""} border-r border-gray-300 h-full`}
                                >
                                  <AmountFormat
                                    amount={orderedItem.variant.subTotal}
                                  />
                                </div>
                              </div>
                            );
                          },
                        )
                      )}
                    </div>
                    {/* Grid 3  */}
                    <div className="grid grid-cols-[.4fr_1fr_1fr_1.4fr_1.8fr_.5fr] w-full">
                      {/* Discount box  */}
                      <div className="flex items-start p-2 border-b border-r border-gray-300 h-full">
                        <TextNormal text={displayedOrder.summary.discount} />
                      </div>
                      {/* Shipping fee box  */}
                      <div className="flex items-start p-2 border-b border-r border-gray-300 h-full">
                        <AmountFormatSmall
                          amount={displayedOrder.summary.shippingFee}
                        />
                      </div>
                      {/* Overall price box  */}
                      <div className="flex items-start p-2 border-b border-r border-gray-300 h-full">
                        <AmountFormat
                          amount={displayedOrder.summary.orderTotalPrice}
                        />
                      </div>
                      {/* Payment status box  */}
                      <div className="flex items-start p-2 border-b border-r border-gray-300 h-full">
                        <PaymentStatusBadge
                          status={displayedOrder.paymentInfo}
                        />
                      </div>
                      {/* Order status box  */}
                      <div className="flex items-start p-2 border-b border-r border-gray-300 h-full">
                        <OrderStatusBadge
                          status={displayedOrder.currentStatus.slug}
                        />
                      </div>
                      <div className="flex items-start p-2 border-b border-gray-300 h-full">
                        <div className="flex items-start">
                          <Link
                            to={`/orders/${displayedOrder._id}`}
                            state={{
                              backUrl:
                                location.pathname +
                                location.search +
                                location.hash,
                            }}
                            // onClick={() => setSelectedUserId(user._id)}
                            className="cursor-pointer outline-0 text-gray-400 hover:text-gray-500 transition-all ease-in-out"
                          >
                            <FaEye height={16} width={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {filteredOrders.length > 0 &&
            orders.length > 0 &&
            ordersParams < (filteredOrders.length || orders.length) && (
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
