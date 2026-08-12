import { useState, useMemo, useEffect, useRef } from "react";
import { useData } from "../../context/DataContext";
import { IoIosArrowDown } from "../../components/SVG";
import {
  DollarSign,
  FaEye,
  TbCalendarDollar,
  TbCurrencyDollarOff,
} from "../../components/SVG";
import { MediumAnalyticsStatCard } from "../../components/Analytics/AnalyticsStatCards";
import {
  successfulOrderStatuses,
  pendingOrderStatuses,
  unsuccessfulOrderStatuses,
} from "../../data/orderLifeCycle";
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
import { Link, useLocation } from "react-router-dom";
import { NoSomethingSmall } from "../../components/NoSomething";

// Import uniform action buttons matching project structural components
import { LoadMoreProduct, LoadMoreVariant } from "../../components/Button";

const ITEM_INCREMENT = 2;

export const RevenueStats6Redesigned = ({
  processOrderLifeCycleData,
  analyticsData,
  activeTab,
  onTabChange,
  ordersLimit,
  setOrdersLimit,
  itemsLimits,
  setItemsLimits,
  defaultItemsCount = 3,
  count = 6,
}) => {
  const [revenueStatsOpen, setRevenueStatsOpen] = useState(true);
  const { sumOrderQuantities, getAllAttributes } = useData();

  const attributes = getAllAttributes();
  const location = useLocation();

  // Track previous analyticsData to detect filter changes
  const prevAnalyticsDataRef = useRef(analyticsData);

  const toggleRevenueStats = () => setRevenueStatsOpen(!revenueStatsOpen);

  // Reset pagination when filters change (analyticsData reference changes)
  useEffect(() => {
    if (prevAnalyticsDataRef.current !== analyticsData) {
      setOrdersLimit(count);
      setItemsLimits({});
      prevAnalyticsDataRef.current = analyticsData;
    }
  }, [analyticsData, count, setOrdersLimit, setItemsLimits]);

  // Pre-process data for each card
  const totalSalesData = processOrderLifeCycleData(
    successfulOrderStatuses,
    analyticsData,
  );

  const pendingSalesData = processOrderLifeCycleData(
    pendingOrderStatuses,
    analyticsData,
  );

  const cancellationsData = processOrderLifeCycleData(
    unsuccessfulOrderStatuses,
    analyticsData,
  );

  // Get the order data based on active tab
  const getOrderData = () => {
    switch (activeTab) {
      case "total-sales":
        return totalSalesData.ordersToProcess;
      case "pending-sales":
        return pendingSalesData.ordersToProcess;
      case "cancellations":
        return cancellationsData.ordersToProcess;
      default:
        return totalSalesData.ordersToProcess;
    }
  };

  const orderData = getOrderData();

  const tableHeaderBg = useMemo(() => {
    switch (activeTab) {
      case "total-sales":
        return "bg-emerald-50 text-emerald-900 border-emerald-100";
      case "pending-sales":
        return "bg-amber-50 text-amber-900 border-amber-100";
      case "cancellations":
        return "bg-rose-50 text-rose-900 border-rose-100";
      default:
        return "bg-slate-50 text-slate-800 border-slate-100";
    }
  }, [activeTab]);

  // Paginate the orders
  const displayedOrders = useMemo(() => {
    return orderData.slice(0, ordersLimit);
  }, [orderData, ordersLimit]);

  // Core level pagination incremental calculation handler
  const handleLoadMoreOrders = () => {
    const totalOrdersCount = orderData.length;
    const nextLimit = Math.min(ordersLimit + count, totalOrdersCount);
    setOrdersLimit(nextLimit);
  };

  // Sub-level nested array pagination configurations
  const handleLoadMoreItems = (orderId, totalItems) => {
    const currentLimit = itemsLimits[orderId] || defaultItemsCount;
    const nextLimit = Math.min(currentLimit + ITEM_INCREMENT, totalItems);
    setItemsLimits((prev) => ({ ...prev, [orderId]: nextLimit }));
  };

  const handleResetItems = (orderId) => {
    setItemsLimits((prev) => {
      const updated = { ...prev };
      delete updated[orderId];
      return updated;
    });
  };

  return (
    <div className="w-full px-4 py-3">
      <div
        className={`w-full p-5 bg-white border border-slate-200/80 rounded-xl shadow-sm transition-all duration-300 ease-in-out ${
          revenueStatsOpen ? "h-full" : "h-16 overflow-hidden"
        }`}
      >
        {/* Header section */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h1 className="font-semibold text-lg text-slate-800 tracking-tight">
            Revenue Stats
          </h1>
          <button
            onClick={toggleRevenueStats}
            className={`p-1.5 rounded-lg transition-colors duration-200 cursor-pointer ${
              revenueStatsOpen
                ? "bg-slate-100 text-slate-600"
                : "bg-slate-50 text-slate-400 hover:bg-slate-100"
            }`}
          >
            <IoIosArrowDown
              height={18}
              width={18}
              className={`transform transition-transform duration-300 ${revenueStatsOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Tab buttons as stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div
            onClick={() => onTabChange("total-sales")}
            className="cursor-pointer"
          >
            <MediumAnalyticsStatCard
              miniAnalyticsData={totalSalesData}
              boxTitle={"Total Sales"}
              boxStyle={`bg-white border-2 rounded-xl p-1 transition-all duration-200 ${
                activeTab === "total-sales"
                  ? "border-emerald-500 shadow-md shadow-emerald-50"
                  : "border-slate-100 hover:border-slate-200 shadow-sm"
              }`}
              icon={DollarSign}
              iconStyle={"bg-emerald-50 text-emerald-600 p-2 rounded-lg"}
            />
          </div>

          <div
            onClick={() => onTabChange("pending-sales")}
            className="cursor-pointer"
          >
            <MediumAnalyticsStatCard
              miniAnalyticsData={pendingSalesData}
              boxTitle={"Pending Sales"}
              boxStyle={`bg-white border-2 rounded-xl p-1 transition-all duration-200 ${
                activeTab === "pending-sales"
                  ? "border-amber-500 shadow-md shadow-amber-50"
                  : "border-slate-100 hover:border-slate-200 shadow-sm"
              }`}
              icon={TbCalendarDollar}
              iconStyle={"bg-amber-50 text-amber-600 p-2 rounded-lg"}
            />
          </div>

          <div
            onClick={() => onTabChange("cancellations")}
            className="cursor-pointer"
          >
            <MediumAnalyticsStatCard
              miniAnalyticsData={cancellationsData}
              boxTitle={"Cancellations"}
              boxStyle={`bg-white border-2 rounded-xl p-1 transition-all duration-200 ${
                activeTab === "cancellations"
                  ? "border-rose-500 shadow-md shadow-rose-50"
                  : "border-slate-100 hover:border-slate-200 shadow-sm"
              }`}
              icon={TbCurrencyDollarOff}
              iconStyle={"bg-rose-50 text-rose-600 p-2 rounded-lg"}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full mt-6 border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
          <div className="flex flex-col w-full">
            {/* Table header */}
            <div
              className={`w-full border-b font-medium text-xs tracking-wider uppercase ${tableHeaderBg}`}
            >
              <div className="grid grid-cols-[3fr_11fr] w-full">
                <div className="p-3 font-semibold">Order Details</div>
                <div className="grid grid-cols-[6fr_5fr] w-full">
                  <div className="grid grid-cols-[6.6fr_1.6fr_.6fr_1.8fr] w-full">
                    <div className="p-3 font-semibold">Ordered Items</div>
                    <div className="p-3 font-semibold text-right">
                      Listed Price
                    </div>
                    <div className="p-3 font-semibold text-center">Qty</div>
                    <div className="p-3 font-semibold text-right">
                      Sub Total
                    </div>
                  </div>
                  <div className="grid grid-cols-[.4fr_1fr_1fr_1.4fr_1.8fr_.5fr] w-full text-center">
                    <div className="p-3 font-semibold">Less</div>
                    <div className="p-3 font-semibold">Ship</div>
                    <div className="p-3 font-semibold">Total</div>
                    <div className="p-3 font-semibold">Payment</div>
                    <div className="p-3 font-semibold">Status</div>
                    <div className="p-3"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="flex h-180 w-full overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <div className="flex flex-col w-full divide-y divide-slate-100">
                {displayedOrders.length === 0 ? (
                  <div className="flex items-center justify-center w-full h-100 bg-slate-50/50">
                    <LengthIsZeroError
                      title="No data found"
                      message="No orders found for this category"
                    />
                  </div>
                ) : (
                  displayedOrders.map((order, orderIndex) => {
                    const totalQuantity = sumOrderQuantities(
                      order.orderedItems,
                    );
                    const itemsTotalCount = order.orderedItems?.length || 0;
                    const orderItemsLimit =
                      itemsLimits[order._id] || defaultItemsCount;
                    const displayedOrderedItems = (
                      order.orderedItems || []
                    ).slice(0, orderItemsLimit);

                    const isShowingAllItems =
                      orderItemsLimit >= itemsTotalCount;
                    const showNestedLoadMore =
                      itemsTotalCount > defaultItemsCount;
                    const remainingItems = itemsTotalCount - orderItemsLimit;
                    const itemsButtonLabel = isShowingAllItems
                      ? "Show Less"
                      : `View More (+${remainingItems})`;

                    return (
                      <div
                        key={order._id || orderIndex}
                        className="grid grid-cols-[3fr_11fr] w-full text-sm hover:bg-slate-50/60 transition-colors duration-150"
                      >
                        {/* Column 1: Order Detail */}
                        <div className="p-4 border-r border-slate-100 bg-slate-50/30">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <OrderIdBadge id={order._id} />
                            </div>

                            <div className="flex gap-3">
                              <div className="relative group">
                                <ImageDoubleExtraSmall
                                  image={order.buyerInfo?.image}
                                  alt={`${order.buyerInfo?.buyerFirstName || ""} ${order.buyerInfo?.buyerLastName || ""}`}
                                  type="circle"
                                />
                              </div>
                              <div className="flex flex-col gap-1 min-w-0">
                                <h1 className="font-semibold text-slate-800 text-base truncate leading-tight">
                                  {order.buyerInfo?.buyerFirstName ||
                                  order.buyerInfo?.buyerLastName
                                    ? `${order.buyerInfo?.buyerFirstName || ""} ${order.buyerInfo?.buyerLastName || ""}`
                                    : "—"}
                                </h1>
                                <PersonIdBadge id={order.buyerInfo?.buyerId} />
                                <IconedEmail data={order.buyerInfo?.email} />
                                <div className="mt-1">
                                  <OrderPlacedUpdated
                                    createdAt={order.createdAt}
                                    updatedAt={order.updatedAt}
                                  />
                                </div>

                                <div className="flex gap-1.5 mt-2 text-xs">
                                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                    Items:{" "}
                                    <span className="font-bold text-slate-800">
                                      {itemsTotalCount}
                                    </span>
                                  </span>
                                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                    Qty:{" "}
                                    <span className="font-bold text-slate-800">
                                      {totalQuantity}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Combined Right Area (Items subgrid + Summary Metrics) */}
                        <div className="flex flex-col w-full">
                          <div className="grid grid-cols-[6fr_5fr] w-full grow">
                            {/* Inner Ordered Items Items Stack */}
                            <div className="flex flex-col border-r border-slate-100 divide-y divide-slate-100">
                              {itemsTotalCount === 0 ? (
                                <div className="flex h-full items-center justify-center p-4">
                                  <NoSomethingSmall text="No items found" />
                                </div>
                              ) : (
                                displayedOrderedItems.map(
                                  (orderedItem, itemIndex) => {
                                    const displayName = [
                                      orderedItem.productName,
                                      ...(
                                        orderedItem.variant?.attributeOptions ||
                                        []
                                      ).map((o) => o.value),
                                    ].join(" | ");

                                    return (
                                      <div
                                        key={itemIndex}
                                        className="grid grid-cols-[6.6fr_1.6fr_.6fr_1.8fr] w-full items-center py-3 hover:bg-slate-50/40 transition-colors"
                                      >
                                        {/* Item Description Info */}
                                        <div className="px-3 flex flex-col gap-1.5">
                                          <div className="flex flex-wrap items-center gap-1.5">
                                            <VariantBadge
                                              id={orderedItem.variant?._id}
                                            />
                                            <ItemStatusBadge
                                              statusId={
                                                orderedItem.variant?.status
                                              }
                                            />
                                          </div>
                                          <div className="flex gap-2.5 items-start mt-1">
                                            <ImageDoubleExtraSmall
                                              image={
                                                orderedItem.variant
                                                  ?.primaryImage
                                              }
                                              alt={orderedItem.productName}
                                              type="square"
                                              className="rounded-lg shadow-sm border border-slate-100"
                                            />
                                            <div className="min-w-0">
                                              <h2 className="font-medium text-slate-800 text-sm leading-tight line-clamp-2">
                                                {displayName}
                                              </h2>
                                              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                                                SKU:{" "}
                                                {orderedItem.variant?.sku ||
                                                  "—"}
                                              </p>

                                              {orderedItem.variant
                                                ?.attributeOptions && (
                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                  {orderedItem.variant.attributeOptions.map(
                                                    (option, idx) => (
                                                      <OrderVariantAttributeBadege
                                                        key={idx}
                                                        option={option}
                                                        index={idx}
                                                        attributes={attributes}
                                                      />
                                                    ),
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>

                                        {/* Listed Price Column */}
                                        <div className="px-3 text-right font-medium text-slate-600">
                                          <AmountFormatSmall
                                            amount={orderedItem.variant?.price}
                                          />
                                        </div>

                                        {/* Qty Column */}
                                        <div className="px-3 text-center text-slate-600 font-medium">
                                          <TextNormal
                                            text={orderedItem.variant?.quantity}
                                          />
                                        </div>

                                        {/* Subtotal Column */}
                                        <div className="px-3 text-right font-semibold text-slate-800">
                                          <AmountFormat
                                            amount={
                                              orderedItem.variant?.subTotal
                                            }
                                          />
                                        </div>
                                      </div>
                                    );
                                  },
                                )
                              )}
                            </div>

                            {/* Summary Financial Metrics Area */}
                            <div className="grid grid-cols-[.4fr_1fr_1fr_1.4fr_1.8fr_.5fr] w-full items-center text-center divide-x divide-slate-50 bg-slate-50/10">
                              <div className="p-2 text-slate-600">
                                <TextNormal
                                  text={order.summary?.discount || 0}
                                />
                              </div>
                              <div className="p-2 text-slate-600 font-medium">
                                <AmountFormatSmall
                                  amount={order.summary?.shippingFee || 0}
                                />
                              </div>
                              <div className="p-2 font-bold text-slate-900">
                                <AmountFormat
                                  amount={order.summary?.orderTotalPrice || 0}
                                />
                              </div>
                              <div className="p-2 flex justify-center">
                                <PaymentStatusBadge
                                  status={order.paymentInfo}
                                />
                              </div>
                              <div className="p-2 flex flex-col items-center gap-1.5">
                                <OrderStatusBadge
                                  status={order.currentStatus?.slug}
                                />
                                <span className="text-[11px] font-medium text-slate-400 block mt-0.5 whitespace-nowrap">
                                  {dateFormatter(
                                    order.currentStatus?.timestamp,
                                  )}
                                </span>
                              </div>

                              {/* View details eye button */}
                              <div className="p-2 flex justify-center">
                                <Link
                                  to={`/orders/${order._id}`}
                                  state={{
                                    backUrl:
                                      location.pathname +
                                      location.search +
                                      location.hash,
                                  }}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
                                >
                                  <FaEye height={16} width={16} />
                                </Link>
                              </div>
                            </div>
                          </div>

                          {/* Nested Items Pagination Extension Bar */}
                          {showNestedLoadMore && (
                            <div className="w-full flex items-center justify-center py-2 px-4 border-t border-slate-100 bg-slate-50/40 mt-auto">
                              <LoadMoreVariant
                                onClick={() => {
                                  if (isShowingAllItems) {
                                    handleResetItems(order._id);
                                  } else {
                                    handleLoadMoreItems(
                                      order._id,
                                      itemsTotalCount,
                                    );
                                  }
                                }}
                                className="text-xs text-slate-500 hover:text-slate-700 transition-colors font-medium"
                              >
                                {itemsButtonLabel}
                              </LoadMoreVariant>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Pagination Load More footer container */}
            {orderData.length > 0 && ordersLimit < orderData.length && (
              <div className="flex items-center justify-center p-4 border-t border-slate-100 bg-slate-50/40">
                <LoadMoreProduct
                  onClick={handleLoadMoreOrders}
                  className="shadow-sm border border-slate-200 hover:shadow transition-all"
                >
                  Load More Orders
                </LoadMoreProduct>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
